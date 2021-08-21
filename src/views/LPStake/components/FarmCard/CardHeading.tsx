import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading } from 'zswap-uikit'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  weight?: number
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  width: 100%;
  > div {
    width: 100%;
  }
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const WeightWrap = styled(Flex)`
  width: 80px;
  height: 24px;
  line-height: 24px;
  background: #ff66ff;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  weight,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flex="1" alignItems="center">
          <TokenPairImage secondaryToken={quoteToken} width={31} height={31} />
          <TokenPairImage style={{ margin: '0 10px 0 -3px' }} secondaryToken={token} width={32} height={32} />
          <Heading>{lpLabel}</Heading>
        </Flex>
        <WeightWrap>Weight: {weight}</WeightWrap>
      </Flex>

      {/* <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex> */}
    </Wrapper>
  )
}

export default CardHeading
