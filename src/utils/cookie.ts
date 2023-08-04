import jsCookie from 'js-cookie'
export const SESSION_TOKEN = 'nw-sessionToken'
export const USER_NAME = 'nw-user-name'
export class Cookies {
  static setKey(key: string, value: string, expires?: number): void {
    jsCookie.set(key, value, { expires })
  }

  static getKey(key: string): string {
    const value = jsCookie.get(key)
    return value != null ? value : ''
  }

  static deleteKey(key: string): void {
    jsCookie.remove(key)
  }
}
