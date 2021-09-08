import { useCallback } from 'react'
import { useZSwapStakeContract } from 'hooks/useContract'
import { Token } from 'config/constants/types'
import { useTransactionAdder } from 'state/transactions/hooks'
import { ZSWAP_DEX_ADDRESS } from 'config/constants/zswap/address'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'

const useHarvestPool = (token: Token) => {
  const { t } = useTranslation()
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()
  const addTransaction = useTransactionAdder()

  const handleHarvest = useCallback(async () => {
    const tx = await stakeContract.harvest(isUsingDEX ? ZSWAP_DEX_ADDRESS : tokenAddress)
    addTransaction(tx, {
      summary: t(`Claim %assets% Stake Rewards`, { assets: token.symbol }),
    })
    const receipt = await tx.wait()
    return Boolean(receipt.status)
  }, [isUsingDEX, stakeContract, addTransaction, token.symbol])

  return { onReward: handleHarvest }
}

export default useHarvestPool
