/// <reference types="next" />
/// <reference types="next/types/global" />

// this should work but doesn't
declare global {
  interface Window {
    firebase?: any
  }
}

declare var firebase: any
