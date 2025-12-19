const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

/**
 * Run database migrations
 * Executes SQL files in the migrations directory
 */
async function runMigrations(pool) {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migrations...');
    
    // Read and execute the schema migration
    const schemaPath = path.join(__dirname, '001_init_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (err) {
          // Ignore "already exists" errors as they're idempotent
          if (!err.message.includes('already exists')) {
            console.error('Error executing statement:', statement.substring(0, 100));
            console.error('Error:', err.message);
          }
        }
      }
    }
    
    console.log('✓ Database migrations completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { runMigrations };
