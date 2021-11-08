/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare global {
  interface Window {
    firebase?: any
    fbq?: any
    gtag?: any
  }
}

declare var firebase: any

// Make typescript realize this is module
export {}
