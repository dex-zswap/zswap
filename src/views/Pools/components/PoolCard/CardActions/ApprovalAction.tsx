import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import { useApprovePool } from 'views/Pools/hooks/useApprove'

interface ApprovalActionProps {
  pool: Pool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useApprovePool(stakingTokenContract)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button disabled={requestedApproval} onClick={handleApprove} width="100%">
          {requestedApproval ? t('Approving') + '...' : t('Approve')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
