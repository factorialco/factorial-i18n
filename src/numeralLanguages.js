// @flow
// Hardcoded from the repo until properly modularized
// https://github.com/adamwdraper/Numeral-js/blob/master/languages.js

export default {
  es: {
    delimiters: {
      thousands: '.',
      decimal: ','
    },

    abbreviations: {
      thousand: 'k',
      million: 'mm',
      billion: 'b',
      trillion: 't'
    },

    ordinal (number: number) {
      const b = number % 10

      return b === 1 || b === 3
        ? 'er'
        : b === 2
          ? 'do'
          : b === 7 || b === 0 ? 'mo' : b === 8 ? 'vo' : b === 9 ? 'no' : 'to'
    },

    currency: {
      symbol: '$'
    }
  }
}
