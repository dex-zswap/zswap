import BigNumber from 'bignumber.js'

import { ZSWAP_ZB_ADDRESS } from './address'

const EARNING_TOKEN = {
  symbol: 'ZBST',
  address: {
    3603102: ZSWAP_ZB_ADDRESS,
  },
  decimals: 18,
  projectLink: 'https://pancakeswap.finance/',
}

export const REWARD_BASE = new BigNumber(11.6)

export default EARNING_TOKEN
