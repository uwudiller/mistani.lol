export interface SpeedConfig {
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
  bufferDelay: number
  chunkDelay: number
  initialLoadDelay: number
}

export class SpeedControlService {
  private static instance: SpeedControlService
  private config: SpeedConfig

  constructor() {
    this.config = {
      freeUserDelay: 2000,
      premiumUserDelay: 0,
      apiRateLimit: {
        free: 30,
        premium: 300
      },
      videoQuality: {
        free: '480p',
        premium: '1080p'
      },
      bufferDelay: 3000,
      chunkDelay: 1500,
      initialLoadDelay: 2500
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
    return isPremium ? 0 : 300
  }

  getVideoLoadDelay(isPremium: boolean): number {
    if (isPremium) return 0
    return this.config.initialLoadDelay
  }

  getBufferDelay(isPremium: boolean): number {
    if (isPremium) return 0
    return this.config.bufferDelay
  }

  getChunkDelay(isPremium: boolean): number {
    if (isPremium) return 0
    return this.config.chunkDelay
  }

  shouldShowAds(isPremium: boolean): boolean {
    return !isPremium
  }

  getMaxConcurrentStreams(isPremium: boolean): number {
    return isPremium ? 3 : 1
  }

  getCacheDuration(isPremium: boolean): number {
    return isPremium ? 3600000 : 900000
  }

  async delayForVideo(isPremium: boolean): Promise<void> {
    if (isPremium) return
    
    await new Promise(resolve => setTimeout(resolve, this.config.initialLoadDelay))
  }

  async delayForBuffer(isPremium: boolean): Promise<void> {
    if (isPremium) return
    
    await new Promise(resolve => setTimeout(resolve, this.config.bufferDelay))
  }
}

export function useSpeedControl(isPremium: boolean) {
  const speedControl = SpeedControlService.getInstance()

  return {
    applyDelay: () => speedControl.applyDelay(isPremium),
    getApiRateLimit: () => speedControl.getApiRateLimit(isPremium),
    getVideoQuality: () => speedControl.getVideoQuality(isPremium),
    getSearchDelay: () => speedControl.getSearchDelay(isPremium),
    getVideoLoadDelay: () => speedControl.getVideoLoadDelay(isPremium),
    getBufferDelay: () => speedControl.getBufferDelay(isPremium),
    getChunkDelay: () => speedControl.getChunkDelay(isPremium),
    shouldShowAds: () => speedControl.shouldShowAds(isPremium),
    getMaxConcurrentStreams: () => speedControl.getMaxConcurrentStreams(isPremium),
    getCacheDuration: () => speedControl.getCacheDuration(isPremium),
    delayForVideo: () => speedControl.delayForVideo(isPremium),
    delayForBuffer: () => speedControl.delayForBuffer(isPremium)
  }
}

export function getSpeedControlConfig() {
  return SpeedControlService.getInstance()
}
