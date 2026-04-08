interface SpeedConfig {
  freeUserDelay: number
  premiumUserDelay: number
  apiRateLimit: {
    free: number
    premium: number
  }
  videoQuality: {
    free: '480p' | '720p'
    premium: '720p' | '1080p' | '4k'
  }
}

export class SpeedControlService {
  private static instance: SpeedControlService
  private config: SpeedConfig

  constructor() {
    this.config = {
      freeUserDelay: 2000, // 2 second delay for free users
      premiumUserDelay: 0, // No delay for premium users
      apiRateLimit: {
        free: 60, // 60 requests per minute for free users
        premium: 300 // 300 requests per minute for premium users
      },
      videoQuality: {
        free: '480p',
        premium: '1080p'
      }
    }
  }

  static getInstance(): SpeedControlService {
    if (!SpeedControlService.instance) {
      SpeedControlService.instance = new SpeedControlService()
    }
    return SpeedControlService.instance
  }

  async applyDelay(isPremium: boolean): Promise<void> {
    const delay = isPremium ? this.config.premiumUserDelay : this.config.freeUserDelay
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  getApiRateLimit(isPremium: boolean): number {
    return isPremium ? this.config.apiRateLimit.premium : this.config.apiRateLimit.free
  }

  getVideoQuality(isPremium: boolean): string {
    return isPremium ? this.config.videoQuality.premium : this.config.videoQuality.free
  }

  getSearchDelay(isPremium: boolean): number {
    // Free users get 500ms delay on search, premium users get instant results
    return isPremium ? 0 : 500
  }

  getVideoLoadDelay(isPremium: boolean): number {
    // Free users get 1 second delay before video starts
    return isPremium ? 0 : 1000
  }

  shouldShowAds(isPremium: boolean): boolean {
    // Premium users don't see ads
    return !isPremium
  }

  getMaxConcurrentStreams(isPremium: boolean): number {
    // Free users limited to 1 stream, premium users can have 3
    return isPremium ? 3 : 1
  }

  getCacheDuration(isPremium: boolean): number {
    // Premium users get longer cache duration (better performance)
    return isPremium ? 3600000 : 1800000 // 1 hour vs 30 minutes
  }
}

// React hook for speed control
export function useSpeedControl(isPremium: boolean) {
  const speedControl = SpeedControlService.getInstance()

  return {
    applyDelay: () => speedControl.applyDelay(isPremium),
    getApiRateLimit: () => speedControl.getApiRateLimit(isPremium),
    getVideoQuality: () => speedControl.getVideoQuality(isPremium),
    getSearchDelay: () => speedControl.getSearchDelay(isPremium),
    getVideoLoadDelay: () => speedControl.getVideoLoadDelay(isPremium),
    shouldShowAds: () => speedControl.shouldShowAds(isPremium),
    getMaxConcurrentStreams: () => speedControl.getMaxConcurrentStreams(isPremium),
    getCacheDuration: () => speedControl.getCacheDuration(isPremium)
  }
}
