import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { ETHER } from 'zswap-sdk'
import useZUSDPrice from 'hooks/useZUSDPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useStakedTokenBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { ZSWAP_DEX_ADDRESS, ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'

import pools from 'config/constants/zswap/pools'

const useTotalLocked = () => {
  const stakeContract = useZSwapStakeContract()
  const address = useMemo(() => {
    return pools.map((pool) => getAddress(pool.stakingToken.address))
  }, [pools])

  console.log(stakeContract)
}

export default useTotalLocked
