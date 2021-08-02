type WindowStorage = 'localStorage' | 'sessionStorage'
export const getStorage = (storage: WindowStorage) => (key: string) => {
  return JSON.parse(window[storage].getItem(key))
}
export const setStorage =
  (storage: WindowStorage) => (key: string, value: any) =>
    window[storage].setItem(key, JSON.stringify(value))

export const local = {
  get: getStorage('localStorage'),
  set: setStorage('localStorage'),
}

export const session = {
  get: getStorage('sessionStorage'),
  set: setStorage('sessionStorage'),
}

export const get = local.get
export const set = local.set
