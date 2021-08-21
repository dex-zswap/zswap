import React from 'react'
import { CardHeader, Heading, Text, Flex } from 'zswap-uikit'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useUserHistory from 'views/Tickets/hooks/useUserHistory'

import { StyledCard, StyledCardInner } from './StyledCard'

const UserHistory = () => {
  const { account } = useActiveWeb3React()
  const history = useUserHistory()

  return (
    <StyledCard>
      <CardHeader>
        <Heading>
          <Text>User History</Text>
        </Heading>
      </CardHeader>
      {!account ? <ConnectWalletButton /> : <StyledCardInner></StyledCardInner>}
    </StyledCard>
  )
}

export default UserHistory
