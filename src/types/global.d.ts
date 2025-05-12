import type { UserInfo } from '@/api/user'

declare global {
  interface Window {
    userInfo?: UserInfo
  }
}

export {}
