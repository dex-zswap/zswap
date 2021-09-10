import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Button } from 'zswap-uikit'
import { getAddress } from 'utils/addressHelpers'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useApproveLp from 'views/LPStake/hooks/useApprove'
import StakeAction from './StakeAction'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  [key: string]: any
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance.isGreaterThan(0)

  const lpContract = useERC20(lpAddress)
  const { onApprove } = useApproveLp(lpContract, lpAddress)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, account, pid, useApproveLp])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        farm={farm}
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        lpAddress={lpAddress}
        pair={farm.pair.pair}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve Contract')}
      </Button>
    )
  }

  return <>{!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}</>
}

export default CardActions
