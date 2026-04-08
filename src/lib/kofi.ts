export interface KoFiTransaction {
  verification_token: string
  message: string
  amount: string
  currency: string
  timestamp: string
  type: string
  from_name: string
  email: string
  kofi_transaction_id: string
}

export interface KoFiWebhookPayload {
  verification_token: string
  message: string
  amount: string
  currency: string
  timestamp: string
  type: string
  from_name: string
  email: string
  url: string
  kofi_transaction_id: string
  is_subscription: boolean
  is_first_payment: boolean
}

export class KoFiService {
  private static instance: KoFiService
  private webhookSecret: string

  constructor() {
    this.webhookSecret = process.env.KOFI_WEBHOOK_SECRET || ''
  }

  static getInstance(): KoFiService {
    if (!KoFiService.instance) {
      KoFiService.instance = new KoFiService()
    }
    return KoFiService.instance
  }

  verifyWebhook(payload: KoFiWebhookPayload, signature: string): boolean {
    // Verify the verification token matches our webhook secret
    return payload.verification_token === this.webhookSecret
  }

  generatePremiumExpiry(): Date {
    const expiry = new Date()
    expiry.setMonth(expiry.getMonth() + 1) // 1 month premium
    return expiry
  }

  formatAmount(amount: string): number {
    return parseFloat(amount) || 0
  }

  isPremiumTier(amount: number): boolean {
    // Premium tier for donations of $5 or more
    return amount >= 5.0
  }

  async processPremiumActivation(email: string, amount: number): Promise<boolean> {
    try {
      // This would typically update your database
      // For now, we'll just return success
      console.log(`Premium activated for ${email} with amount $${amount}`)
      return true
    } catch (error) {
      console.error('Error processing premium activation:', error)
      return false
    }
  }
}
