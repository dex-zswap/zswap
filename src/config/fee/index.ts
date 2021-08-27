import { JSBI, Currency, ETHER, Token, currencyEquals } from 'zswap-sdk'
import { Percent } from 'zswap-sdk/entities/fractions'
import ONLINE_TIME, { DATE_SECS } from 'config/constants/zswap/online-time'
import { ZSWAP_DEX_ADDRESS } from 'config/constants/zswap/address'

export const SWAP_FEE = {
  sevenEth: JSBI.BigInt(2000),
  yearEth: JSBI.BigInt(8000),
  normal: JSBI.BigInt(9800)
}

export const PRICE_FEE = {
  sevenEth: new Percent(JSBI.BigInt(800), JSBI.BigInt(1000)),
  yearEth: new Percent(JSBI.BigInt(200), JSBI.BigInt(1000)),
  normal: new Percent(JSBI.BigInt(20), JSBI.BigInt(1000))
}

export default class FeeHelper {
  static getFeeOnSwap(currency: Currency | Token) {
    const now = Date.now()
    const dayOffset = Math.floor((now - ONLINE_TIME) / DATE_SECS)

    if (currency && (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_DEX_ADDRESS)) {
      return (dayOffset <= 7) ? SWAP_FEE.sevenEth : SWAP_FEE.yearEth
    }

    return SWAP_FEE.normal
  }

  static getPriceFee(currency: Currency) {
    const now = Date.now()
    const dayOffset = Math.floor((now - ONLINE_TIME) / DATE_SECS)

    if (currency && (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_DEX_ADDRESS)) {
      return (dayOffset <= 7) ? PRICE_FEE.sevenEth : PRICE_FEE.yearEth
    }

    return PRICE_FEE.normal
  }
}

