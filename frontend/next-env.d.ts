/// <reference types="next" />
/// <reference types="next/types/global" />

// this should work but doesn't
declare global {
  interface Window {
    firebase?: any
    fbq?: any
  }
}

declare var firebase: any

declare module '*.png'

// make typescript realize this is module
export {}
