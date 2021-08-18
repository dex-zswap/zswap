import { useCallback, useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers, Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useCakeVaultContract } from 'hooks/useContract'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useSingleContractMultipleData, useMultipleContractSingleData } from 'state/multicall/hooks'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useLPTokenBalance } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED } from 'utils/bigNumber'
import { Pool } from 'state/types'
import pools from 'config/constants/zswap/pools'

const usePoolInfo = (pool: Pool) => {
  const { account } = useActiveWeb3React()
  const stakeContract = useZSwapStakeContract()
  const contractAddress = getAddress(pool.contractAddress)
  const stakingTokenAddress = getAddress(pool.stakingToken.address)
  const earningTokenAddress = getAddress(pool.earningToken.address)

  const stakingCurrency = useCurrency(stakingTokenAddress)
  const stakingToken = useToken(stakingTokenAddress)
  const stakingTokenBalance = useCurrencyBalance(account ?? undefined, stakingCurrency)

  const allowance = useTokenAllowance(stakingToken, account, contractAddress)
  const stakedBalance = useLPTokenBalance(stakingTokenAddress, contractAddress)

  return {
    ...pool,
    userData: {
      allowance: allowance ? allowance : BIG_ZERO,
      stakingTokenBalance: stakingTokenBalance,
      stakedBalance: stakedBalance.balance ?? BIG_ZERO,
      pendingReward: BIG_ZERO,
    },
  }
}

export default usePoolInfo
