# Factorial i18n

Minimal library for dealing i18n.
Supports pluralization and interpolation.

[![Build Status](https://travis-ci.org/factorial/factorial-i18n.svg?branch=master)](https://travis-ci.org/factorial/factorial-i18n)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

```
npm install factorial-i18n --save
yarn add factorial-i18n
```

## Example

```js
const translations = {
  en: {
    common: { hello: 'hello %{name}', },
    beers: { one: '%{count} beer', other: '%{count} beers' }
  },
  es: {
    common: { hello: 'hola %{name}', },
    beers: { one: '%{count} cerveza', other: '%{count} cervezas' }
  }
}

const i18n = new I18n()

i18n.setTranslations(translations)
i18n.setLocale('es')
i18n.t('common.hello') // => Hola
i18n.tp('common.beers', { count: 0 }) // => 0 cervezas
i18n.tp('common.beers', { count: 1 }) // => 1 cerveza
```

## Where is it used?

Developed and battle tested in production in [Factorial](https://factorialhr.com)
