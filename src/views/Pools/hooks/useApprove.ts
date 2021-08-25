import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import { ZSWAP_STAKE_ADDRESS } from 'config/constants/zswap/address'
import useToast from 'hooks/useToast'
import useLastUpdated from 'hooks/useLastUpdated'

export const useApprovePool = (lpContract: Contract) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const tx = await lpContract.approve(ZSWAP_STAKE_ADDRESS, ethers.constants.MaxUint256)
      const receipt = await tx.wait()

      // dispatch(updateUserAllowance(sousId, account))
      if (receipt.status) {
        toastSuccess(
          t('Contract Enabled'),
          // t('You can now stake in the %symbol% pool!', {
          //   symbol: earningTokenSymbol,
          // }),
        )
        setRequestedApproval(false)
      } else {
        // user rejected tx or didn't go thru
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setRequestedApproval(false)
      }
    } catch (e) {
      setRequestedApproval(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }, [account, lpContract, t, toastError, toastSuccess])

  return { handleApprove, requestedApproval }
}

// Approve CAKE auto pool
export const useVaultApprove = (setLastUpdated: () => void) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const cakeContract = useCake()

  const handleApprove = async () => {
    const tx = await cakeContract.approve(cakeVaultContract.address, ethers.constants.MaxUint256)
    setRequestedApproval(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Contract Enabled'), t('You can now stake in!', { symbol: 'CAKE' }))
      setLastUpdated()
      setRequestedApproval(false)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setRequestedApproval(false)
    }
  }

  return { handleApprove, requestedApproval }
}

export const useCheckVaultApprovalStatus = () => {
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const cakeVaultContract = useCakeVaultContract()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await cakeContract.allowance(account, cakeVaultContract.address)
        const currentAllowance = new BigNumber(response.toString())
        setIsVaultApproved(currentAllowance.gt(0))
      } catch (error) {
        setIsVaultApproved(false)
      }
    }

    checkApprovalStatus()
  }, [account, cakeContract, cakeVaultContract, lastUpdated])

  return { isVaultApproved, setLastUpdated }
}
