import { PoolConfig, PoolCategory } from 'config/constants/types'

import { ZSWAP_DEX_ADDRESS, ZSWAP_ZB_ADDRESS, ZSWAP_STAKE_ADDRESS } from './address'
import EARNING_TOKEN from './earing-token'

const tokens = {
  dex: {
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
}

const pools: PoolConfig[] = [
  {
    sousId: 9,
    stakingToken: tokens.dex,
    earningToken: EARNING_TOKEN,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
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
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
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
