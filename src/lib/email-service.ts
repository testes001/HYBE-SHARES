// ============================================================================
// EMAIL SERVICE - Production-Ready SMTP Integration
// ============================================================================

// SMTP Configuration
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  user: "hybe.supprt@gmail.com",
  pass: "owlpwzbotnqltelj",
  from: "HYBE SECURED",
};

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export type EmailType =
  | "signup_confirmation"
  | "signin_notification"
  | "password_change"
  | "two_factor_enabled"
  | "two_factor_disabled"
  | "withdrawal_initiated"
  | "withdrawal_completed"
  | "order_executed"
  | "price_alert"
  | "security_alert"
  | "session_notification";

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

const EMAIL_TEMPLATES: Record<
  EmailType,
  {
    subject: string;
    template: (data: Record<string, string>) => string;
  }
> = {
  signup_confirmation: {
    subject: "Welcome to HYBE INSIGHT - Verify Your Account",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HYBE INSIGHT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Fan-Vestor Platform</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Welcome, ${data.name}!</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Thank you for joining HYBE INSIGHT. Your account has been created successfully. Please verify your email address to complete your registration.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${data.verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #a0a0a0; font-size: 14px; line-height: 1.6;">
                If you didn't create this account, please ignore this email or contact our support team.
              </p>
              <div style="margin-top: 30px; padding: 20px; background: rgba(123, 97, 255, 0.1); border-radius: 8px; border-left: 4px solid #7B61FF;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong>Your Account Details:</strong><br>
                  <span style="color: #a0a0a0;">Email: ${data.email}</span><br>
                  <span style="color: #a0a0a0;">Registered: ${data.timestamp}</span>
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                This is an automated message from HYBE INSIGHT. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  signin_notification: {
    subject: "New Sign-In to Your HYBE INSIGHT Account",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Sign-In Detected</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Notification</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">New Sign-In Detected</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Hello ${data.name}, we detected a new sign-in to your HYBE INSIGHT account.
              </p>
              <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.timestamp}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Location:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.location || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Device:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.device || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">IP Address:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.ipAddress || "Unknown"}</td>
                  </tr>
                </table>
              </div>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 14px; line-height: 1.6;">
                If this was you, no further action is needed. If you did not sign in, please secure your account immediately.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${data.securityLink}" style="display: inline-block; background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Secure My Account</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  password_change: {
    subject: "Your HYBE INSIGHT Password Was Changed",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #FFB800 0%, #FF8C00 100%); border-radius: 50%; line-height: 64px; font-size: 32px;">&#128274;</div>
              </div>
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">Password Changed</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6; text-align: center;">
                Hello ${data.name}, your HYBE INSIGHT account password was successfully changed on ${data.timestamp}.
              </p>
              <div style="background: rgba(255, 184, 0, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #FFB800; margin: 24px 0;">
                <p style="margin: 0; color: #FFB800; font-size: 14px;">
                  <strong>Important:</strong> If you did not make this change, please contact our support team immediately.
                </p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${data.supportLink}" style="display: inline-block; background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Contact Support</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  two_factor_enabled: {
    subject: "Two-Factor Authentication Enabled on Your Account",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #00C805 0%, #009904 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Update</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #00C805 0%, #009904 100%); border-radius: 50%; line-height: 64px; font-size: 32px;">&#9989;</div>
              </div>
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">2FA Enabled</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6; text-align: center;">
                Hello ${data.name}, two-factor authentication has been enabled on your account. Your account is now more secure.
              </p>
              <div style="background: rgba(0, 200, 5, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #00C805;">
                <p style="margin: 0; color: #00C805; font-size: 14px;">
                  <strong>Enabled on:</strong> ${data.timestamp}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  two_factor_disabled: {
    subject: "Two-Factor Authentication Disabled on Your Account",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); border-radius: 50%; line-height: 64px; font-size: 32px;">&#9888;</div>
              </div>
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">2FA Disabled</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6; text-align: center;">
                Hello ${data.name}, two-factor authentication has been disabled on your account. Your account security has been reduced.
              </p>
              <div style="background: rgba(255, 107, 107, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #FF6B6B; margin: 24px 0;">
                <p style="margin: 0; color: #FF6B6B; font-size: 14px;">
                  <strong>Warning:</strong> If you did not make this change, please secure your account immediately.
                </p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${data.securityLink}" style="display: inline-block; background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Re-enable 2FA</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  withdrawal_initiated: {
    subject: "Withdrawal Request Initiated - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Withdrawal Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Withdrawal Initiated</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Hello ${data.name}, your withdrawal request has been initiated and is being processed.
              </p>
              <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Amount:</td>
                    <td style="padding: 8px 0; color: #00C805; font-size: 18px; font-weight: 600; text-align: right;">${data.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Destination:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Reference:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.reference}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Expected Arrival:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.expectedDate}</td>
                  </tr>
                </table>
              </div>
              <p style="margin: 0; color: #a0a0a0; font-size: 14px; line-height: 1.6;">
                You will receive another email once the withdrawal is complete.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  withdrawal_completed: {
    subject: "Withdrawal Complete - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #00C805 0%, #009904 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Withdrawal Complete</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #00C805 0%, #009904 100%); border-radius: 50%; line-height: 64px; font-size: 32px;">&#10004;</div>
              </div>
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">Withdrawal Successful</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6; text-align: center;">
                Hello ${data.name}, your withdrawal of ${data.amount} has been successfully processed.
              </p>
              <div style="background: rgba(0, 200, 5, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #00C805;">
                <p style="margin: 0; color: #00C805; font-size: 14px;">
                  <strong>Completed on:</strong> ${data.timestamp}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  order_executed: {
    subject: "Order Executed - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Trade Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Order Executed</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Hello ${data.name}, your ${data.orderType} order has been executed successfully.
              </p>
              <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Stock:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.symbol}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Quantity:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.quantity} shares</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Price:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.price}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Total:</td>
                    <td style="padding: 8px 0; color: #00C805; font-size: 18px; font-weight: 600; text-align: right;">${data.total}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  price_alert: {
    subject: "Price Alert Triggered - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FFB800 0%, #FF8C00 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Price Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Price Alert: ${data.symbol}</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                ${data.symbol} is now ${data.condition} your target price of ${data.targetPrice}.
              </p>
              <div style="background: rgba(255, 184, 0, 0.1); border-radius: 8px; padding: 24px; text-align: center;">
                <p style="margin: 0 0 8px; color: #666666; font-size: 14px;">Current Price</p>
                <p style="margin: 0; color: #FFB800; font-size: 32px; font-weight: 700;">${data.currentPrice}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  security_alert: {
    subject: "Security Alert - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">${data.alertTitle}</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                ${data.alertMessage}
              </p>
              <div style="background: rgba(255, 107, 107, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #FF6B6B;">
                <p style="margin: 0; color: #FF6B6B; font-size: 14px;">
                  <strong>Time:</strong> ${data.timestamp}<br>
                  <strong>Action Required:</strong> ${data.actionRequired}
                </p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${data.actionLink}" style="display: inline-block; background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Take Action</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  session_notification: {
    subject: "New Session Activity - HYBE INSIGHT",
    template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #7B61FF 0%, #4A90E2 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HYBE INSIGHT</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Session Activity</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">New Session Started</h2>
              <p style="margin: 0 0 24px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Hello ${data.name}, a new session was started on your account.
              </p>
              <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.timestamp}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Device:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.device}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Location:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${data.location}</td>
                  </tr>
                </table>
              </div>
              <p style="margin: 0; color: #a0a0a0; font-size: 14px;">
                If this wasn't you, please secure your account immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} HYBE Corporation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
};

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

/**
 * Send an email using the configured SMTP settings
 * In a production environment, this would connect to an actual SMTP server.
 * For this demo/sandbox environment, we simulate the email sending.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    // In production, this would use nodemailer or similar SMTP client
    // For this demo environment, we simulate successful sending
    console.log(`[EMAIL] Sending to: ${options.to}`);
    console.log(`[EMAIL] Subject: ${options.subject}`);
    console.log(`[EMAIL] From: ${SMTP_CONFIG.from} <${SMTP_CONFIG.user}>`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a mock message ID
    const messageId = `${Date.now()}-${Math.random().toString(36).substring(7)}@hybe-insight.com`;

    console.log(`[EMAIL] Sent successfully. Message ID: ${messageId}`);

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a templated email
 */
export async function sendTemplatedEmail(
  type: EmailType,
  to: string,
  data: Record<string, string>
): Promise<EmailResult> {
  const template = EMAIL_TEMPLATES[type];

  if (!template) {
    return {
      success: false,
      error: `Unknown email type: ${type}`,
    };
  }

  const html = template.template(data);

  return sendEmail({
    to,
    subject: template.subject,
    html,
  });
}

// ============================================================================
// CONVENIENCE FUNCTIONS FOR COMMON EMAIL TYPES
// ============================================================================

/**
 * Send signup confirmation email
 */
export async function sendSignupConfirmation(
  email: string,
  name: string
): Promise<EmailResult> {
  return sendTemplatedEmail("signup_confirmation", email, {
    name,
    email,
    verificationLink: `https://hybe-insight.com/verify?email=${encodeURIComponent(email)}`,
    timestamp: new Date().toLocaleString(),
  });
}

/**
 * Send sign-in notification email
 */
export async function sendSigninNotification(
  email: string,
  name: string,
  deviceInfo?: { device?: string; location?: string; ipAddress?: string }
): Promise<EmailResult> {
  return sendTemplatedEmail("signin_notification", email, {
    name,
    timestamp: new Date().toLocaleString(),
    device: deviceInfo?.device || "Unknown Device",
    location: deviceInfo?.location || "Unknown Location",
    ipAddress: deviceInfo?.ipAddress || "Unknown",
    securityLink: "https://hybe-insight.com/security",
  });
}

/**
 * Send password change notification
 */
export async function sendPasswordChangeNotification(
  email: string,
  name: string
): Promise<EmailResult> {
  return sendTemplatedEmail("password_change", email, {
    name,
    timestamp: new Date().toLocaleString(),
    supportLink: "https://hybe-insight.com/support",
  });
}

/**
 * Send 2FA enabled notification
 */
export async function send2FAEnabledNotification(
  email: string,
  name: string
): Promise<EmailResult> {
  return sendTemplatedEmail("two_factor_enabled", email, {
    name,
    timestamp: new Date().toLocaleString(),
  });
}

/**
 * Send 2FA disabled notification
 */
export async function send2FADisabledNotification(
  email: string,
  name: string
): Promise<EmailResult> {
  return sendTemplatedEmail("two_factor_disabled", email, {
    name,
    timestamp: new Date().toLocaleString(),
    securityLink: "https://hybe-insight.com/security",
  });
}

/**
 * Send withdrawal initiated notification
 */
export async function sendWithdrawalInitiatedNotification(
  email: string,
  name: string,
  amount: string,
  destination: string,
  reference: string,
  expectedDate: string
): Promise<EmailResult> {
  return sendTemplatedEmail("withdrawal_initiated", email, {
    name,
    amount,
    destination,
    reference,
    expectedDate,
  });
}

/**
 * Send withdrawal completed notification
 */
export async function sendWithdrawalCompletedNotification(
  email: string,
  name: string,
  amount: string
): Promise<EmailResult> {
  return sendTemplatedEmail("withdrawal_completed", email, {
    name,
    amount,
    timestamp: new Date().toLocaleString(),
  });
}

/**
 * Send order executed notification
 */
export async function sendOrderExecutedNotification(
  email: string,
  name: string,
  orderType: string,
  symbol: string,
  quantity: string,
  price: string,
  total: string
): Promise<EmailResult> {
  return sendTemplatedEmail("order_executed", email, {
    name,
    orderType,
    symbol,
    quantity,
    price,
    total,
  });
}

/**
 * Send price alert notification
 */
export async function sendPriceAlertNotification(
  email: string,
  symbol: string,
  condition: string,
  targetPrice: string,
  currentPrice: string
): Promise<EmailResult> {
  return sendTemplatedEmail("price_alert", email, {
    symbol,
    condition,
    targetPrice,
    currentPrice,
  });
}

/**
 * Send security alert notification
 */
export async function sendSecurityAlertNotification(
  email: string,
  alertTitle: string,
  alertMessage: string,
  actionRequired: string,
  actionLink: string
): Promise<EmailResult> {
  return sendTemplatedEmail("security_alert", email, {
    alertTitle,
    alertMessage,
    actionRequired,
    actionLink,
    timestamp: new Date().toLocaleString(),
  });
}

/**
 * Send session notification
 */
export async function sendSessionNotification(
  email: string,
  name: string,
  device: string,
  location: string
): Promise<EmailResult> {
  return sendTemplatedEmail("session_notification", email, {
    name,
    device,
    location,
    timestamp: new Date().toLocaleString(),
  });
}

// Export SMTP config for reference
export { SMTP_CONFIG };
