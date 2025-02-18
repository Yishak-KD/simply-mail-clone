/** Set `value` for the given key in local storage */
export const setLocalStorageItem = (key: string, value: string) => {
    localStorage.setItem(key, value)
}

/**
 * If `key` is present in local storage return the associated value, otherwise
 * returns null.
 */
export const readLocalStorageItem = (key: string): string | null => {
    return localStorage.getItem(key)
}

/**
 * If `key` is present in local storage, deletes the key and it's data
 */
export const clearLocalStorageItem = (key: string) => {
    localStorage.removeItem(key)
}

/**
 * If `key` is present in local storage return the associated value, otherwise
 * set the key to `defaultValue` and return that.
 */
export const readOrSetLocalStorageItem = (
    key: string,
    defaultValue: string,
): string => {
    const value = localStorage.getItem(key)
    if (value === null) {
        localStorage.setItem(key, defaultValue)
        return defaultValue
    }
    return value
}

export const readStoredObject = <T>(key: string) => {
    if (typeof window === 'undefined' || !localStorage) {
        return
    }

    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : undefined
}

export const writeStoredObject = (key: string, value: unknown) => {
    if (typeof window === 'undefined' || !localStorage) {
        return
    }

    localStorage.setItem(key, JSON.stringify(value))
}
