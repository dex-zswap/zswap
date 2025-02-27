import BigNumber from 'bignumber.js'
import { JSBI, Currency, ETHER, Token, currencyEquals } from 'zswap-sdk'
import { Percent } from 'zswap-sdk/entities/fractions'
import onlineInfo from 'utils/online-info'
import { ZSWAP_WDEX_ADDRESS } from 'config/constants/zswap/address'
import { BIG_ONE } from 'utils/bigNumber'

export const SWAP_FEE = {
  sevenEth: JSBI.BigInt(2000),
  yearEth: JSBI.BigInt(8000),
  normal: JSBI.BigInt(9980),
  default: JSBI.BigInt(0),
}

export const PRICE_FEE = {
  sevenEth: new Percent(JSBI.BigInt(800), JSBI.BigInt(1000)),
  yearEth: new Percent(JSBI.BigInt(200), JSBI.BigInt(1000)),
  normal: new Percent(JSBI.BigInt(2), JSBI.BigInt(1000)),
  default: new Percent(JSBI.BigInt(0), JSBI.BigInt(1000)),
}

export const SWAP_INPUT_RATE = {
  sevenEth: new BigNumber(0.2),
  yearEth: new BigNumber(0.8),
  normal: new BigNumber(0.998),
  default: BIG_ONE,
}

class FeeHelper {
  getFeeOnSwap(currency: Currency | Token) {
    const outFirstWeek = onlineInfo.outFirstWeek()

    if (currency) {
      if (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_WDEX_ADDRESS) {
        return outFirstWeek ? SWAP_FEE.yearEth : SWAP_FEE.sevenEth
      }

      return SWAP_FEE.normal
    }

    return SWAP_FEE.default
  }

  getPriceFee(currency: Currency | Token) {
    const outFirstWeek = onlineInfo.outFirstWeek()

    if (currency) {
      if (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_WDEX_ADDRESS) {
        return outFirstWeek ? PRICE_FEE.yearEth : PRICE_FEE.sevenEth
      }

      return PRICE_FEE.normal
    }

    return PRICE_FEE.default
  }

  getRealInput(currency: Currency | Token, input: string) {
    const outFirstWeek = onlineInfo.outFirstWeek()
    const inputAmount = new BigNumber(input)
    let rate = SWAP_INPUT_RATE.default

    if (currency) {
      if (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_WDEX_ADDRESS) {
        rate = outFirstWeek ? SWAP_INPUT_RATE.yearEth : SWAP_INPUT_RATE.sevenEth
      } else {
        rate = SWAP_INPUT_RATE.normal
      }
    }

    return rate.multipliedBy(inputAmount).toString()
  }

  getIputAmount(currency: Currency | Token, input: string) {
    const outFirstWeek = onlineInfo.outFirstWeek()
    const inputAmount = new BigNumber(input)
    let rate = SWAP_INPUT_RATE.default
    if (currency) {
      if (currencyEquals(ETHER, currency) || (currency as Token).address === ZSWAP_WDEX_ADDRESS) {
        rate = outFirstWeek ? SWAP_INPUT_RATE.yearEth : SWAP_INPUT_RATE.sevenEth
      } else {
        rate = SWAP_INPUT_RATE.normal
      }
    }

    return rate.multipliedBy(inputAmount).integerValue(BigNumber.ROUND_DOWN).toString()
  }
}

const feeHelper = new FeeHelper()

export default feeHelper
