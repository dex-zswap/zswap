import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
// import { useVaultApprove } from 'views/Pools/hooks/useApprove'

interface ApprovalActionProps {
  setLastUpdated: () => void
  isLoading?: boolean
}

const VaultApprovalAction: React.FC<ApprovalActionProps> = ({ isLoading = false, setLastUpdated }) => {
  const { t } = useTranslation()

  // const { handleApprove, requestedApproval } = useVaultApprove(setLastUpdated)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        // <Button
        //   isLoading={requestedApproval}
        //   endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
        //   disabled={requestedApproval}
        //   onClick={handleApprove}
        //   width="100%"
        // >
        //   {t('Approve')}
        // </Button>
        <div></div>
      )}
    </>
  )
}

export default VaultApprovalAction
