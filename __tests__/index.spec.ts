import I18n from '../src'

const mockedTranslations = {
  en: {
    hello: "hello %{name}",
    not_translated: "translate me!",
    beers: {
      one: "%{count} beer",
      other: "%{count} beers",
    },
    colas: {
      one: "%{count} cola",
      other: "%{count} colas",
    },
    role: {
      admin: "admin",
      basic: "basic",
    },
    current: {
      another: "other",
      current: "current",
    },
    common: {
      loading: "loading",
    },
  },
  es: {
    hello: "hola %{name}",
    beers: {
      one: "%{count} cerveza",
      other: "%{count} cervezas",
    },
    role: {
      admin: "administrador",
      basic: "básico",
    },
    current: {
      another: "eres tu?",
      current: "soy yo?",
    },
    common: {
      loading: "cargando",
    },
  },
  fr: {
    beers: {
      one: "%{count} bière",
      other: "%{count} bières",
    },
  },
  ru: {
    colas: {},
    books: {
      one: "%{count} книга",
      few: "%{count} книги",
      many: "%{count} книг",
    },
    beers: {
      one: "%{count} пива",
      other: "%{count} пива",
    },
  },
};

describe('i18n', () => {
  let i18n

  beforeEach(() => {
    i18n = new I18n()
    i18n.setTranslations(mockedTranslations)
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

    describe('with spanish locale', () => {
      beforeEach(() => {
        i18n.setLocale('es')
      })

      it('uses spanish', () => {
        expect(i18n.t('common.loading')).toBe('cargando')
      })

      describe('when it has a interpolation', () => {
        it('does not thhrow if the variable is not found', () => {
          expect(i18n.t('hello')).toBe('hola ')
        })

        it('interpolates and do not escapes', () => {
          expect(i18n.t('hello', { name: '<b>coca-cola</b>' })).toBe(
            'hola <b>coca-cola</b>'
          )
        })
      })
    })
  })

  describe('with russian locale', () => {
    beforeEach(() => {
      i18n.setLocale('ru')
      i18n.setLocaleFallback('en')
    })

    describe('when we want to express complex forms of pluralization', () => {
      it('falls back to other if many or few is not found', () => {
        expect(i18n.tp('beers', { count: 0 })).toBe('0 пива')
      })

      it('falls back to english if the path is not found', () => {
        expect(i18n.tp('colas', { count: 0 })).toBe('0 colas')
      })

      it('gets the correct plural form', () => {
        expect(i18n.tp('books', { count: 0 })).toBe('0 книг')
        expect(i18n.tp('books', { count: 1 })).toBe('1 книга')
        expect(i18n.tp('books', { count: 2 })).toBe('2 книги')
        expect(i18n.tp('books', { count: 5 })).toBe('5 книг')
      })
    })
  })

  describe('formatNumber', () => {
    beforeEach(() => {
      i18n.setLocale("es");
    });
    const spacer = String.fromCharCode(160)

    it('formats percentages', () => {
      expect(i18n.formatNumber(0.2, 'percent')).toBe('20' + spacer + '%')
    })
    it('formats the correct currency without locale code', () => {
      expect(i18n.formatNumber(1500, 'currency', 'GBP')).toBe('1500,00' + spacer + 'GBP')
    })
    it('formats number with just a number', () => {
      expect(i18n.formatNumber(1500)).toBe('1500')
    })
    it('formats currency with setLocale of language and country', () => {
      i18n.setLocale('de-DE')
      expect(i18n.formatNumber(123456.789, 'currency', 'EUR')).toBe('123.456,79' + spacer + '€')
    })
    it('formats currency with setLocale of just country', () => {
      i18n.setLocale("UK");
      expect(i18n.formatNumber(1500, "currency", "GBP")).toBe(
        "1" + spacer + "500,00" + spacer + "GBP"
      );
    })
    it('formats currency with setLocale of just language', () => {
      i18n.setLocale('en')
      expect(i18n.formatNumber(1500, 'currency', 'GBP')).toBe('£1,500.00')
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
