import React from 'react'
import { CardHeader, Heading, Text, Flex } from 'zswap-uikit'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { StyledCard, StyledCardInner } from './StyledCard'

const UserPrizes = () => {
  const { account } = useActiveWeb3React()

  return (
    <StyledCard>
      <CardHeader>
        <Heading>
          <Text>Round 5</Text>
        </Heading>
      </CardHeader>
      <StyledCardInner>Prize Pot $668800 688000 ZBst</StyledCardInner>
    </StyledCard>
  )
}

export default UserPrizes
