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
import { useCurrencyBalances } from 'state/wallet/hooks'
import useToast from 'hooks/useToast'

import pools from 'config/constants/zswap/pools'

const useAllPools = () => {
  const { account } = useActiveWeb3React()
  const stakeContract = useZSwapStakeContract()

  return pools
}

export default useAllPools
