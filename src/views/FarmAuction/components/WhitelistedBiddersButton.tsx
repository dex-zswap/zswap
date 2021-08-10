import React from 'react'
import { useModal, Button, Skeleton } from 'zswap-uikit'
import useWhitelistedAddresses from 'views/FarmAuction/hooks/useWhitelistedAddresses'
import WhitelistedBiddersModal from './WhitelistedBiddersModal'

const WhitelistedBiddersButton: React.FC = () => {
  const whitelistedBidders = useWhitelistedAddresses()
  const [onShowWhitelistedBidders] = useModal(<WhitelistedBiddersModal />)

  return whitelistedBidders ? (
    <Button p="0" variant="text" scale="sm" onClick={onShowWhitelistedBidders}>
      {whitelistedBidders.length}
    </Button>
  ) : (
    <Skeleton height="24px" width="46px" />
  )
}

export default WhitelistedBiddersButton
