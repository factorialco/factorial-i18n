// @flow
import _ from 'lodash'
import numeral from 'numeral'
import plural from 'plurals-cldr'
import numeralLanguages from './numeralLanguages'

type Translations = { [key: string]: any }
type Locales = Array<string>

const DEFAULT_LOCALE = 'en'

export default class I18n {
  translations: Translations
  supportedLocales: Locales
  locale: string

  constructor (translations: Translations, supportedLocales: Locales) {
    this.translations = translations
    this.supportedLocales = supportedLocales
    this.locale = 'en'
  }

  setLocale (locale: string): void {
    this.locale = locale

    if (numeralLanguages[locale]) {
      numeral.locales[locale] = numeralLanguages[locale]
      numeral.locale(locale)
    }
  }

  /**
   * Leverages `numeral` for number formatting
   */
  formatNumber (format: string, number: number): string {
    return numeral(number).format(format)
  }

  /**
   * Retrieves a key from the translations object.
   */
  getKey (path: string): mixed | string {
    const result = _.at(this.translations[this.locale], path)[0] ||
      _.at(this.translations[DEFAULT_LOCALE], path)[0]

    if (process.env.NODE_ENV === 'development') {
      // We check that the translation exists in all current supportedLocales!
      this.supportedLocales.forEach(locale => {
        if (_.at(this.translations[locale], path)[0]) return

        console.warn(`Key not found "${path}" with the locale "${locale}"`)
      })
    }

    return result
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
  t (path: string, opts?: { [key: string]: mixed }): string {
    const value = this.getKey(path)
    if (typeof value !== 'string') {
      throw new Error(`Key "${path}"is not a leaf`)
    }
    const MATCH = /%\{([^}]+)\}/g

    return value.replace(MATCH, (match, subst) => {
      if (!opts) {
        throw new Error(
          `Translation "${path}" has a missing interpolation value "${subst}"`
        )
      }
      return _.escape(String(opts[subst]))
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
  tp (path: string, opts: { [key: string]: mixed }): string {
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
  tx (path: string, variable: string, opts?: { [key: string]: mixed }): string {
    const newPath = `${path}.${variable}`
    return this.t(newPath, opts)
  }
}
