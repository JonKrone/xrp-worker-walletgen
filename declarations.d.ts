declare module 'ripple-keypairs'

// @types/node does not yet include types for this experimental module
declare module 'worker_threads' {
  import { EventEmitter } from 'events'
  // import { Worker } from 'cluster'

  export const Worker: any
  export const isMainThread: boolean
  export const workerData: any
  export const parentPort: null | Port

  interface Port extends EventEmitter {
    postMessage: (message: any) => void
  }
}
