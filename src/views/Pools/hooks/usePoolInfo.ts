import { useCallback, useEffect, useState } from 'react'
import { ethers, Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { ETHER } from 'zswap-sdk'
import { useAppDispatch } from 'state'
import useZUSDPrice from 'hooks/useZUSDPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useCakeVaultContract } from 'hooks/useContract'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useSingleContractMultipleData, useMultipleContractSingleData } from 'state/multicall/hooks'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useStakedTokenBalance } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { ZSWAP_DEX_ADDRESS } from 'config/constants/zswap/address'

const usePoolInfo = (pool: Pool) => {
  const { account } = useActiveWeb3React()
  const contractAddress = getAddress(pool.contractAddress)
  const stakingTokenAddress = getAddress(pool.stakingToken.address)
  const earningTokenAddress = getAddress(pool.earningToken.address)

  const stakedCurrency = useCurrency(stakingTokenAddress)
  const earningCurrency = useCurrency(earningTokenAddress)
  const stakedToken = useToken(stakingTokenAddress)

  const isDEX = stakingTokenAddress === ZSWAP_DEX_ADDRESS

  const stakedTokenBalance = useCurrencyBalance(account ?? undefined, isDEX ? ETHER : stakedCurrency)
  const earningTokenBalance = useCurrencyBalance(account ?? undefined, earningCurrency)

  const allowance = useTokenAllowance(stakedToken, account, contractAddress)
  const stakingBalance = useStakedTokenBalance(stakingTokenAddress, contractAddress, isDEX)

  const stakingTokenPrice = useZUSDPrice(stakedToken)

  return {
    ...pool,
    stakingTokenPrice: new BigNumber(stakingTokenPrice?.toSignificant(6) ?? 0).toNumber(),
    earningTokenBalance: new BigNumber(earningTokenBalance?.toSignificant(6) ?? 0).toNumber(),
    userData: {
      allowance: allowance ? new BigNumber(allowance.toSignificant(4)) : BIG_ZERO,
      stakedBalance: (stakingBalance.balance ?? BIG_ZERO).dividedBy(BIG_TEN.pow(stakedToken?.decimals)),
      stakingTokenBalance: stakedTokenBalance ? new BigNumber(stakedTokenBalance.toSignificant(4)) : BIG_ZERO,
      pendingReward: BIG_ZERO,
    },
  }
}

export default usePoolInfo
