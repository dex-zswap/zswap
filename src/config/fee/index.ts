import { JSBI, Currency, ETHER, Token, currencyEquals } from 'zswap-sdk'
import { Percent } from 'zswap-sdk/entities/fractions'
import { getOnlineDayOffset } from 'config/constants/zswap/online-time'
import { ZSWAP_DEX_ADDRESS } from 'config/constants/zswap/address'

export const SWAP_FEE = {
  sevenEth: JSBI.BigInt(2000),
  yearEth: JSBI.BigInt(8000),
  normal: JSBI.BigInt(9980),
  default: JSBI.BigInt(0)
}

export const PRICE_FEE = {
  sevenEth: new Percent(JSBI.BigInt(800), JSBI.BigInt(1000)),
  yearEth: new Percent(JSBI.BigInt(200), JSBI.BigInt(1000)),
  normal: new Percent(JSBI.BigInt(2), JSBI.BigInt(1000)),
  default: new Percent(JSBI.BigInt(0), JSBI.BigInt(1000))
}

export const RECIVED_RATE = {
  sevenEth: new Percent(JSBI.BigInt(200), JSBI.BigInt(1000)),
  yearEth: new Percent(JSBI.BigInt(800), JSBI.BigInt(1000)),
  normal: new Percent(JSBI.BigInt(998), JSBI.BigInt(1000)),
  default: new Percent(JSBI.BigInt(1000), JSBI.BigInt(1000))
}

export default class FeeHelper {
  static getFeeOnSwap(currency: Currency | Token) {
    const dayOffset = getOnlineDayOffset()

    if (currency) {
      if ((currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_DEX_ADDRESS)) {
        return (dayOffset <= 7) ? SWAP_FEE.sevenEth : SWAP_FEE.yearEth
      }
  
      return SWAP_FEE.normal
    }

    return SWAP_FEE.default
  }

  static getPriceFee(currency: Currency | Token) {
    const dayOffset = getOnlineDayOffset()

    if (currency) {
      if ((currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_DEX_ADDRESS)) {
        return (dayOffset <= 7) ? PRICE_FEE.sevenEth : PRICE_FEE.yearEth
      }

      return PRICE_FEE.normal
    }

    return PRICE_FEE.default
  }

  static getRecivedRate(currency: Currency | Token) {
    const dayOffset = getOnlineDayOffset()

    if (currency) {
      if ((currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_DEX_ADDRESS)) {
        return (dayOffset <= 7) ? RECIVED_RATE.sevenEth : RECIVED_RATE.yearEth
      }

      return RECIVED_RATE.normal
    }

    return RECIVED_RATE.default
  }
}

