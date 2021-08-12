import { Currency, ETHER, Token } from 'zswap-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'DEX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
