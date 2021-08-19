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

const useLocked = (tokenAddress: string) => {
  const stakeContract = useZSwapStakeContract()
  const isDEX = tokenAddress === ZSWAP_DEX_ADDRESS

  const token = useToken(tokenAddress)

  const tokenBalance = useStakedTokenBalance(tokenAddress, stakeContract.address, isDEX)
  const tokenPrice = useZUSDPrice(token)

  return useMemo(() => {
    if (!tokenBalance.balance || !tokenPrice || !token) {
      return BIG_ZERO
    }

    const priceBigNumber = new BigNumber(tokenPrice.toSignificant(6))
    return tokenBalance.balance.dividedBy(BIG_TEN.pow(token.decimals)).multipliedBy(priceBigNumber)
  }, [tokenBalance, tokenPrice, token])
}

export default useLocked
