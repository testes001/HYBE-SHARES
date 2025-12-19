const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { runMigrations } = require('./migrations/migrate');

const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL connection pool for sessions and data
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize session store
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'session',
});

// Determine if running on HTTPS (production)
const isProduction = process.env.NODE_ENV === 'production';
const isHTTPS = process.env.HTTPS === 'true' || isProduction;

// CORS configuration - allow credentials
app.use(cors({
  origin: process.env.CLIENT_URL || (isProduction ? undefined : 'http://localhost:3000'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || 'your-session-secret'));

// Session middleware with secure settings
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: isHTTPS, // Only send over HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Create tables if they don't exist
const initializeTables = async () => {
  const client = await pool.connect();
  try {
    // Session table (created by connect-pg-simple if it doesn't exist)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        PRIMARY KEY ("sid")
      );

      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

    // User sessions table for app-specific data
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (session_id) REFERENCES "session"(sid) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS "IDX_user_sessions_user_id" ON user_sessions (user_id);
      CREATE INDEX IF NOT EXISTS "IDX_user_sessions_session_id" ON user_sessions (session_id);
    `);

    // MOTD table
    await client.query(`
      CREATE TABLE IF NOT EXISTS motd (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL
      );
    `);

    // Insert default MOTD if empty
    await client.query(`
      INSERT INTO motd (message)
      SELECT 'This is the default message of the day.'
      WHERE NOT EXISTS (SELECT 1 FROM motd);
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing tables:', err);
  } finally {
    client.release();
  }
};

const initializeApp = async () => {
  try {
    await initializeTables();
    await runMigrations(pool);
    console.log('✓ Application database initialization complete');
  } catch (err) {
    console.error('Application initialization failed:', err);
    process.exit(1);
  }
};

initializeApp();

// ============================================================================
// AUTHENTICATION & SESSION ENDPOINTS
// ============================================================================

/**
 * Login endpoint - creates a session
 * Body: { user_id: string, [additional user data] }
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Store user info in session
    req.session.userId = user_id;
    req.session.loginTime = new Date().toISOString();

    // Also store in database for audit trail
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (session_id) DO UPDATE SET user_id = $2, last_activity = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          req.sessionID,
          user_id,
          req.ip,
          req.get('user-agent'),
        ]
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        sessionId: req.sessionID,
        userId: user_id,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Logout endpoint - destroys the session
 */
app.post('/api/auth/logout', async (req, res) => {
  const sessionId = req.sessionID;
  const userId = req.session.userId;

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    // Also remove from user_sessions table
    (async () => {
      const client = await pool.connect();
      try {
        await client.query(
          'DELETE FROM user_sessions WHERE session_id = $1',
          [sessionId]
        );
      } catch (dbErr) {
        console.error('Error removing session from database:', dbErr);
      } finally {
        client.release();
      }
    })();

    res.clearCookie('sessionId');
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
});

/**
 * Verify session endpoint - check if user is authenticated
 */
app.get('/api/auth/verify', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        authenticated: false,
        message: 'No active session',
      });
    }

    // Update last activity
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_id = $1',
        [req.sessionID]
      );
    } finally {
      client.release();
    }

    res.status(200).json({
      authenticated: true,
      userId: req.session.userId,
      loginTime: req.session.loginTime,
      sessionId: req.sessionID,
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * Get current session data
 */
app.get('/api/auth/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }

    res.status(200).json({
      userId: req.session.userId,
      sessionId: req.sessionID,
      loginTime: req.session.loginTime,
    });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

/**
 * Refresh session endpoint - extends session timeout
 */
app.post('/api/auth/refresh', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'No active session',
      });
    }

    // Touch the session to extend timeout
    req.session.touch();

    res.status(200).json({
      success: true,
      message: 'Session refreshed',
      userId: req.session.userId,
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Failed to refresh session' });
  }
});

// ============================================================================
// MOTD ENDPOINTS
// ============================================================================

app.get('/api/motd', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT message FROM motd ORDER BY id DESC LIMIT 1');
    res.status(200).json(result.rows[0]);
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve message of the day' });
  }
});

app.post('/api/motd', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO motd (message) VALUES ($1)', [message]);
    res.status(201).json({ success: true });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to set message of the day' });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    res.status(200).json({ status: 'Connected to database' });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Pool ended');
    process.exit(0);
  });
});
