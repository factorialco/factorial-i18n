import I18n from '../src'

const mockedTranslations = {
  en: {
    hello: 'hello %{name}',
    not_translated: 'translate me!',
    beers: {
      one: '%{count} beer',
      other: '%{count} beers'
    },
    role: {
      admin: 'admin',
      basic: 'basic'
    },
    current: {
      another: 'other',
      current: 'current'
    },
    common: {
      loading: 'loading'
    }
  },
  es: {
    hello: 'hola %{name}',
    beers: {
      one: '%{count} cerveza',
      other: '%{count} cervezas'
    },
    role: {
      admin: 'administrador',
      basic: 'básico'
    },
    current: {
      another: 'eres tu?',
      current: 'soy yo?'
    },
    common: {
      loading: 'cargando'
    }
  },
  fr: {
    beers: {
      one: '%{count} bière',
      other: '%{count} bières'
    }
  }
}

describe('i18n', () => {
  let i18n

  beforeEach(() => {
    i18n = new I18n(mockedTranslations, ['en', 'es'])
    process.env.NODE_ENV = 'development'
  })

  describe('t', () => {
    it('throws if the path is not found', () => {
      expect(() => {
        i18n.t('ola.k.ase')
      }).toThrowError()
    })

    it('throws if the path is not a string', () => {
      expect(() => {
        i18n.t('common')
      }).toThrowError()
    })

    describe('with default locale', () => {
      it('uses english', () => {
        expect(i18n.t('common.loading')).toBe('loading')
      })
    })

    describe('with spanish locale', () => {
      beforeEach(() => {
        i18n.setLocale('es')
      })

      it('uses spanish', () => {
        expect(i18n.t('common.loading')).toBe('cargando')
      })

      describe('when it has a interpolation', () => {
        it('throws if the variable is not found', () => {
          expect(() => {
            i18n.t('hello')
          }).toThrowError()
        })

        it('interpolates and escapes', () => {
          expect(i18n.t('hello', { name: '<b>coca-cola</b>' })).toBe(
            'hola &lt;b&gt;coca-cola&lt;/b&gt;'
          )
        })
      })
    })
  })

  describe('formatNumber', () => {
    it('formats the number leveraging numeral', () => {
      expect(i18n.formatNumber('0%', 0.2)).toBe('20%')
      expect(i18n.formatNumber('$0.0', 0.2)).toBe('$0,2')
    })
  })

  describe('tp', () => {
    beforeEach(() => {
      i18n.setLocale('fr')
    })

    it('throws if `count` is not provided', () => {
      expect(() => {
        i18n.tp('beers')
      }).toThrowError()
    })

    it('throws if `count` is not a number', () => {
      expect(() => {
        i18n.tp('beers', { count: null })
      }).toThrowError()
    })

    describe('fr', () => {
      beforeEach(() => {
        i18n.setLocale('fr')
      })

      it('uses pluralizations correctly otherwise', () => {
        expect(i18n.tp('beers', { count: 0 })).toBe('0 bière')
        expect(i18n.tp('beers', { count: 1 })).toBe('1 bière')
        expect(i18n.tp('beers', { count: 2 })).toBe('2 bières')
      })
    })

    describe('es', () => {
      beforeEach(() => {
        i18n.setLocale('es')
      })

      it('uses pluralizations correctly otherwise', () => {
        expect(i18n.tp('beers', { count: 0 })).toBe('0 cervezas')
        expect(i18n.tp('beers', { count: 1 })).toBe('1 cerveza')
        expect(i18n.tp('beers', { count: 2 })).toBe('2 cervezas')
      })
    })
  })

  describe('tx', () => {
    beforeEach(() => {
      i18n.setLocale('es')
    })

    it('uses a variable correctly', () => {
      expect(i18n.tx('role', 'admin')).toBe('administrador')
      expect(i18n.tx('role', 'basic')).toBe('básico')
    })
  })
})
