# Premium System Documentation for mistani.lol

This document outlines the premium tier system implemented for mistani.lol using Ko-fi integration.

## Overview

The premium system provides users with enhanced features and faster speeds in exchange for donations through Ko-fi. The system is designed to:

- Encourage donations to support platform development
- Provide tangible benefits to premium users
- Implement speed throttling for free users
- Automate premium activation through Ko-fi webhooks

## Features

### Premium Benefits
- **Instant Streaming**: No delays for API calls and video loading
- **HD Video Quality**: Access to 720p/1080p video streams
- **No Advertisements**: Ad-free experience
- **Priority Support**: Faster customer support response
- **Multiple Concurrent Streams**: Up to 3 simultaneous streams
- **Extended Cache**: Longer data caching for better performance

### Free User Limitations
- **2-Second Delays**: API calls and search results delayed by 2 seconds
- **480p Video Quality**: Limited to standard definition
- **Advertisements**: Display ads throughout the platform
- **Single Stream**: Limited to 1 concurrent stream
- **Shorter Cache**: 30-minute cache duration

## Technical Implementation

### Database Schema

#### User Model Updates
```sql
-- Added to existing User model
is_premium            Boolean   @default(false)
premium_expires       DateTime?
kofi_transaction_id   String?
premium_amount        Float?
```

#### PremiumTransaction Model
```sql
model PremiumTransaction {
  id                   String   @id @default(cuid())
  user_id              String
  kofi_transaction_id  String   @unique
  amount               Float
  currency             String
  from_name            String
  email                String
  message              String?
  timestamp            DateTime
  is_subscription      Boolean  @default(false)
  is_first_payment     Boolean  @default(false)
  premium_months       Int      @default(1)
  created_at           DateTime @default(now())
}
```

### API Endpoints

#### Premium Status
- **GET** `/api/premium/status`
- Returns current premium status, expiry date, and days remaining
- Automatically expires premium if expired

#### Ko-fi Webhook
- **POST** `/api/webhooks/kofi`
- Handles Ko-fi donation notifications
- Automatically activates premium based on donation amount
- Records transaction details in database

### Speed Control System

#### SpeedControlService Class
```typescript
class SpeedControlService {
  // Apply delays for free users
  async applyDelay(isPremium: boolean): Promise<void>
  
  // Get API rate limits
  getApiRateLimit(isPremium: boolean): number
  
  // Get video quality settings
  getVideoQuality(isPremium: boolean): string
  
  // Search delays
  getSearchDelay(isPremium: boolean): number
  
  // Video load delays
  getVideoLoadDelay(isPremium: boolean): number
}
```

#### Configuration
```typescript
const config = {
  freeUserDelay: 2000,        // 2 seconds
  premiumUserDelay: 0,         // No delay
  apiRateLimit: {
    free: 60,                  // 60 requests/minute
    premium: 300               // 300 requests/minute
  },
  videoQuality: {
    free: '480p',
    premium: '1080p'
  }
}
```

## Ko-fi Integration

### Setup Process

1. **Create Ko-fi Account**
   - Sign up at https://ko-fi.com/mistlol
   - Set up donation page
   - Configure webhook URL

2. **Webhook Configuration**
   - Set webhook URL to: `https://your-domain.com/api/webhooks/kofi`
   - Generate webhook secret
   - Add to environment variables

3. **Environment Variables**
   ```env
   KOFI_WEBHOOK_SECRET="your-webhook-secret"
   KOFI_USERNAME="your-ko-fi-username"
   ```

### Donation Tiers

| Amount | Premium Duration | Benefits |
|--------|------------------|----------|
| $5     | 1 month         | All premium features |
| $10    | 2 months        | All premium features |
| $25    | 5 months        | All premium features |
| $50+   | 10+ months      | All premium features |

### Webhook Processing

1. **Receive Donation**: Ko-fi sends webhook with donation details
2. **Verify Signature**: Validate webhook authenticity
3. **Find User**: Match donation email to user account
4. **Calculate Premium**: Determine premium duration based on amount
5. **Update Database**: Set premium status and expiry
6. **Record Transaction**: Store donation details

## Frontend Components

### PremiumBadge Component
- Displays premium status in navigation
- Shows remaining days for active premium
- Hidden for free users

### PremiumBanner Component
- Upgrade prompt for free users
- Prominent placement on dashboard
- Links to Ko-fi donation page

### Premium Page
- Comprehensive premium information
- Current status display for premium users
- Upgrade interface for free users
- Donation tier explanations

## Speed Implementation

### API Delays
```typescript
// Applied to all API calls for free users
await speedControl.applyDelay(isPremium)
```

### Search Throttling
```typescript
// Free users get 500ms delay on search
const delay = speedControl.getSearchDelay(isPremium)
if (delay > 0) {
  await new Promise(resolve => setTimeout(resolve, delay))
}
```

### Video Loading
```typescript
// Free users get 1 second delay before video starts
const videoDelay = speedControl.getVideoLoadDelay(isPremium)
if (videoDelay > 0) {
  await new Promise(resolve => setTimeout(resolve, videoDelay))
}
```

## Security Considerations

### Webhook Security
- Signature verification for all webhooks
- Rate limiting on webhook endpoints
- Transaction ID uniqueness checks
- User email verification

### Premium Abuse Prevention
- Maximum premium duration limits
- Transaction monitoring for suspicious activity
- Automatic premium expiry system
- Audit trail for all premium changes

## User Experience

### Free User Journey
1. **Sign Up**: Create free account with basic features
2. **Experience Delays**: Notice 2-second delays and 480p quality
3. **See Premium Banner**: Upgrade prompts throughout platform
4. **Consider Upgrade**: View premium benefits page
5. **Donate**: Click through to Ko-fi for premium activation

### Premium User Journey
1. **Donate**: Make donation through Ko-fi
2. **Instant Activation**: Premium activates automatically
3. **Experience Benefits**: Instant speeds and HD quality
4. **Status Display**: Premium badge shows remaining time
5. **Renewal**: Prompted to renew before expiry

## Monitoring and Analytics

### Key Metrics
- Premium conversion rate
- Average donation amount
- Premium retention rate
- Feature usage by tier
- Revenue per user

### Tracking Implementation
```typescript
// Track premium activations
analytics.track('premium_activated', {
  amount: donationAmount,
  months: premiumMonths,
  source: 'kofi'
})

// Track feature usage
analytics.track('feature_used', {
  feature: 'hd_streaming',
  userTier: isPremium ? 'premium' : 'free'
})
```

## Deployment Configuration

### Vercel Environment Variables
```json
{
  "KOFI_WEBHOOK_SECRET": "@kofi_webhook_secret",
  "KOFI_USERNAME": "@kofi_username"
}
```

### Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push
```

## Testing

### Premium Flow Testing
1. **Test Webhook**: Simulate Ko-fi webhook payload
2. **Verify Activation**: Check premium status updates
3. **Test Speed Control**: Verify delays apply correctly
4. **Test Expiry**: Confirm automatic premium expiry
5. **Test UI Components**: Verify badges and banners display

### Test Cases
```typescript
// Test premium activation
expect(user.is_premium).toBe(true)
expect(user.premium_expires).toBeGreaterThan(new Date())

// Test speed control
const freeDelay = speedControl.getSearchDelay(false)
const premiumDelay = speedControl.getSearchDelay(true)
expect(freeDelay).toBe(500)
expect(premiumDelay).toBe(0)
```

## Troubleshooting

### Common Issues

#### Premium Not Activating
- Check webhook URL configuration in Ko-fi
- Verify webhook secret matches environment variable
- Check user email matches donation email
- Review webhook logs for errors

#### Speed Control Not Working
- Verify premium status API is returning correct values
- Check speed control hook implementation
- Review browser network tab for delay timing
- Test with different user accounts

#### Webhook Failures
- Verify Vercel environment variables
- Check webhook signature verification
- Review Ko-fi webhook documentation
- Test webhook with Ko-fi test mode

### Debug Tools
```typescript
// Enable debug logging
console.log('Premium status:', premiumStatus)
console.log('Speed control config:', speedControl.config)

// Test webhook locally
curl -X POST http://localhost:3000/api/webhooks/kofi \
  -H "Content-Type: application/json" \
  -d '{"verification_token":"test","amount":"5.00","email":"test@example.com"}'
```

## Future Enhancements

### Planned Features
- **Subscription Management**: Recurring monthly donations
- **Gift Premium**: Ability to gift premium to other users
- **Premium Analytics**: Detailed usage statistics for premium users
- **Tiered Benefits**: Multiple premium levels with different benefits
- **Custom Themes**: Premium-only UI themes and customization

### Scaling Considerations
- **Premium Queue**: Priority processing for premium users
- **CDN Integration**: Faster content delivery for premium
- **Advanced Analytics**: Premium user behavior analysis
- **A/B Testing**: Test different premium features and pricing

## Legal and Compliance

### Terms of Service Updates
- Premium benefits clearly outlined
- No guarantee of service levels
- Premium is non-refundable
- Terms subject to change

### Privacy Considerations
- Premium status stored securely
- Donation information kept private
- Compliance with payment processing regulations
- Data retention policies for premium data

## Conclusion

The premium system provides a sustainable revenue model for mistani.lol while offering tangible benefits to supporters. The implementation balances user experience with business needs, encouraging upgrades through feature limitations rather than content restrictions.

The system is designed to be:
- **Automated**: Minimal manual intervention required
- **Secure**: Proper webhook verification and user protection
- **Scalable**: Can handle growth in premium users
- **User-Friendly**: Clear benefits and easy upgrade process
- **Maintainable**: Well-documented and modular code structure

Regular monitoring and optimization will ensure the premium system continues to provide value to both users and the platform.
