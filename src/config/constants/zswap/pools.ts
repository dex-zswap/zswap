import { PoolConfig, PoolCategory } from 'config/constants/types'

import {
  ZSWAP_DEX_ADDRESS,
  ZSWAP_ZB_ADDRESS,
  ZSWAP_ZBST_ADDRESS,
  ZSWAP_STAKE_ADDRESS,
  ZSWAP_ZERO_ADDRESS,
} from './address'
import EARNING_TOKEN from './earing-token'

const tokens = {
  wdex: {
    symbol: 'DEX',
    address: {
      3603102: ZSWAP_DEX_ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  zb: {
    symbol: 'ZB',
    address: {
      3603102: ZSWAP_ZB_ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  zbst: {
    symbol: 'ZBST',
    address: {
      3603102: ZSWAP_ZBST_ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
}

const pools: PoolConfig[] = [
  {
    sousId: 8,
    stakingToken: tokens.wdex,
    earningToken: EARNING_TOKEN,
    contractAddress: {
      3603102: ZSWAP_STAKE_ADDRESS,
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 10,
    stakingToken: tokens.zb,
    earningToken: EARNING_TOKEN,
    contractAddress: {
      3603102: ZSWAP_STAKE_ADDRESS,
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 11,
    stakingToken: tokens.zbst,
    earningToken: EARNING_TOKEN,
    contractAddress: {
      3603102: ZSWAP_STAKE_ADDRESS,
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools
