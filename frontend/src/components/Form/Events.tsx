import React from 'react'

export type FieldEventListener = (event: FieldEvent) => void

export interface FieldEventConfig {}

const defaultEventConfig: FieldEventConfig = {}

export class FieldEvent {
  type: string
  data: any
  config: FieldEventConfig

  constructor(type: string, data: any = {}, config: FieldEvent['config'] = {}) {
    this.type = type
    this.data = data
    this.config = { ...defaultEventConfig, ...config }
  }
}

export interface FieldEventTargetConfig {
  singleListener?: boolean
}

const defaultEventTargetConfig: FieldEventTargetConfig = {
  singleListener: false,
}

export class FieldEventTarget {
  events: { [type: string]: FieldEvent[] }
  listeners: { [type: string]: FieldEventListener[] }
  config: FieldEventTargetConfig
  // inProgress: Map<FieldEventListener, boolean>

  constructor(config: Partial<FieldEventTargetConfig> = {}) {
    this.events = {}
    this.listeners = {}
    this.config = { ...defaultEventTargetConfig, ...config }
    // this.inProgress = new Map()
  }

  on(type: string, listener: FieldEventListener) {
    // Reset listeners whenever adding a new listener
    if (this.config.singleListener && this.listeners[type]) {
      delete this.listeners[type]
    }

    // Add listener
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(listener)

    // If listener missed the most recent event, dispatch it to listener
    const previousEvent = this.events[type]?.[this.events[type].length - 1]
    if (previousEvent) {
      listener(previousEvent)
    }
  }

  dispatch(event: FieldEvent) {
    if (!this.events[event.type]) {
      this.events[event.type] = []
    }
    if (!this.listeners[event.type]) {
      this.listeners[event.type] = []
    }

    // Setup backup events
    // Only one backup event for now
    this.events[event.type].shift()
    this.events[event.type].push(event)

    // Call all listeners while skipping ones already in progress
    for (const listener of this.listeners[event.type]) {
      listener(event)
    }
  }
}

// So react hooks can use updated values of target
export const useFieldEventTarget = (
  config: Partial<FieldEventTargetConfig> = {}
) => {
  const ref = React.useRef(new FieldEventTarget(config))
  return ref.current
}
