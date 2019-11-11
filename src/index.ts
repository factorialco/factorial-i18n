const at = require('lodash.at')
import plural from 'plurals-cldr'

type TranslationValue = string | TranslationObject;
interface TranslationObject {
  [x: string]: TranslationValue;
}

export default class I18n {
  translations: TranslationObject
  locale: string

  constructor () {
    this.translations = {}
  }

  setTranslations (translations: TranslationObject): void {
    this.translations = translations
  }

  setLocale (locale: string): void {
    this.locale = locale
  }

  /**
   * Leverages Intl.NumberFormat for currency formatting
   */
  formatNumber (num: number, style?: string, currency?: string): string {
    return new global.Intl.NumberFormat(
      this.locale,
      { style, currency }
    ).format(num)
  }

  /**
   * Retrieves a key from the translations object.
   */
  getKey (path: string): TranslationObject | string {
    return at(this.translations[this.locale], path)[0]
  }

  /**
   * Translate a key
   * Interpolate values with %{name}
   *
   * Examples:
   *
   * t('foo.bar') => 'Bar'
   * t('zemba.fleiba', {num: 3 }) => 'Zemba 3 Fleiba!'
   */
  t (path: string, opts?: { [key: string]: any }): string {
    const value = this.getKey(path)
    if (typeof value !== 'string') {
      throw new Error(`Key "${path}"is not a leaf`)
    }
    const MATCH = /%\{([^}]+)\}/g

    return value.replace(MATCH, (match, subst) => {
      if (!opts) return ''
      return String(opts[subst])
    })
  }

  /**
   * Translate singular o plural copies
   * Options must contain `count`
   *
   * Examples:
   *
   * tp('beer', { count: 3 }) => '3 beers'
   */
  tp (path: string, opts: { [key: string]: any }): string {
    const num = opts.count

    if (typeof num !== 'number') {
      throw new Error('You must have a `count` property')
    }

    const form = plural(this.locale, num)
    const pluralPath = `${path}.${form}`

    return this.t(pluralPath, opts)
  }

  /**
   * Conditional copies, made easy.
   * Provide a path and then options, like classNames
   *
   * Example:
   *
   *   tx('fleiba.zemba', user.get('role'))
   */
  tx (path: string, variable: string, opts?: { [key: string]: any }): string {
    const newPath = `${path}.${variable}`
    return this.t(newPath, opts)
  }
}
