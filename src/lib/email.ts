import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
  fromName?: string
}

export class EmailService {
  private static instance: EmailService
  private defaultFrom: string
  private defaultFromName: string

  constructor() {
    this.defaultFrom = process.env.FROM_EMAIL || 'noreply@mistani.lol'
    this.defaultFromName = process.env.FROM_NAME || 'mistani.lol'
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: `${this.defaultFromName} <${options.from || this.defaultFrom}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      })

      if (error) {
        console.error('Email service error:', error)
        return false
      }

      console.log('Email sent successfully:', data)
      return true
    } catch (error) {
      console.error('Email service error:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, userName?: string): Promise<boolean> {
    const subject = 'Welcome to mistani.lol! '
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 2.5rem; margin: 0;">mistani.lol</h1>
          <p style="color: #9ca3af; margin: 5px 0 0;">Your Gateway to Anime Discovery</p>
        </div>
        
        <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #f59e0b; margin-top: 0;">Welcome${userName ? `, ${userName}` : ''}! </h2>
          <p style="line-height: 1.6;">Thank you for joining mistani.lol! Your account has been successfully created and you're ready to explore thousands of anime titles.</p>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #f59e0b;">What You Can Do Now:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;">&#x1f50d; Search and browse anime from our extensive catalog</li>
              <li style="margin: 10px 0;">&#x1f3ac; Watch anime with progress tracking</li>
              <li style="margin: 10px 0;">&#x23f0; Resume from where you left off</li>
              <li style="margin: 10px 0;">&#x2b50; Get personalized recommendations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://mistani.lol'}" 
               style="background-color: #f59e0b; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Start Watching Now
            </a>
          </div>
        </div>
        
        <div style="background-color: #374151; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #f59e0b; margin-top: 0;">Upgrade to Premium</h3>
          <p style="margin: 0 0 15px;">Get instant streaming speeds, HD video quality, and support our development!</p>
          <a href="https://ko-fi.com/mistlol" 
             style="background: linear-gradient(45deg, #f59e0b, #eab308); color: #111827; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Upgrade Now
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">
            You're receiving this email because you created an account on mistani.lol
          </p>
          <p style="color: #9ca3af; margin: 5px 0 0; font-size: 0.9rem;">
            If you didn't create this account, please contact us at support@mistani.lol
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject,
      html
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    const subject = 'Reset Your mistani.lol Password'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 2.5rem; margin: 0;">mistani.lol</h1>
          <p style="color: #9ca3af; margin: 5px 0 0;">Password Reset Request</p>
        </div>
        
        <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #f59e0b; margin-top: 0;">Reset Your Password</h2>
          <p style="line-height: 1.6;">We received a request to reset your password for your mistani.lol account. Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #f59e0b; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 0.9rem;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>
        
        <div style="background-color: #dc2626; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: white; margin-top: 0;">Security Notice</h3>
          <p style="margin: 0; color: #fecaca;">
            If you didn't request this password reset, please ignore this email or contact our support team immediately.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">
            Need help? Contact us at support@mistani.lol
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject,
      html
    })
  }

  async sendPremiumActivatedEmail(email: string, months: number, amount: number): Promise<boolean> {
    const subject = 'Premium Activated on mistani.lol! '
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 2.5rem; margin: 0;">mistani.lol</h1>
          <p style="color: #9ca3af; margin: 5px 0 0;">Premium Status Activated! </p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; margin-bottom: 20px; color: #111827;">
          <h2 style="margin-top: 0; font-size: 2rem;">Thank You for Your Support! </h2>
          <p style="font-size: 1.2rem; font-weight: bold;">Your premium status has been activated!</p>
          
          <div style="background-color: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Premium Duration:</strong> ${months} month${months > 1 ? 's' : ''}</p>
            <p style="margin: 5px 0;"><strong>Donation Amount:</strong> $${amount}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Active Now</p>
          </div>
        </div>
        
        <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #f59e0b; margin-top: 0;">Your Premium Benefits:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">&#x26a1; Instant streaming speeds (no delays)</li>
            <li style="margin: 10px 0;">&#x1f4fa; HD video quality (720p/1080p)</li>
            <li style="margin: 10px 0;">&#x1f6ab; No advertisements</li>
            <li style="margin: 10px 0;">&#x2728; Priority customer support</li>
            <li style="margin: 10px 0;">&#x1f516; Multiple concurrent streams</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}" 
             style="background-color: #f59e0b; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Start Watching with Premium
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">
            Your support helps us keep mistani.lol running and improving!
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject,
      html
    })
  }

  async sendPremiumExpiringEmail(email: string, daysRemaining: number): Promise<boolean> {
    const subject = `Your mistani.lol Premium Expires in ${daysRemaining} Days`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 2.5rem; margin: 0;">mistani.lol</h1>
          <p style="color: #9ca3af; margin: 5px 0 0;">Premium Status</p>
        </div>
        
        <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #f59e0b; margin-top: 0;">Premium Expiring Soon</h2>
          <p style="line-height: 1.6;">Your premium status will expire in <strong>${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>. Don't lose access to your premium benefits!</p>
          
          <div style="background-color: #374151; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f59e0b; margin-top: 0;">What You'll Lose:</h3>
            <ul style="list-style: none; padding: 0; margin: 10px 0;">
              <li style="margin: 5px 0;">&#x23f0; 2-second delays on all content</li>
              <li style="margin: 5px 0;">&#x1f4fa; Limited to 480p video quality</li>
              <li style="margin: 5px 0;">&#x1f6ab; Advertisements will appear</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://ko-fi.com/mistlol" 
             style="background: linear-gradient(45deg, #f59e0b, #eab308); color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Renew Premium Now
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">
            Questions? Contact us at support@mistani.lol
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject,
      html
    })
  }
}
