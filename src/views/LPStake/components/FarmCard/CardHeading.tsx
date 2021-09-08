import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, useTooltip } from 'zswap-uikit'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'

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
  color: #fff;
  cursor: pointer;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, token, quoteToken, weight }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Weight represents the ratio of ZBST reward from the pool to the ratio of the standard reward. In general, the higher the weight, the higher ZBST reward can be obtained by the pool.',
    ),
    {
      placement: 'top',
      trigger: 'hover',
    },
  )

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flex="1" alignItems="center">
          <TokenPairImage secondaryToken={token} width={31} height={31} />
          <TokenPairImage style={{ margin: '0 10px 0 -3px' }} secondaryToken={quoteToken} width={32} height={32} />
          <Heading>{lpLabel}</Heading>
        </Flex>
        {tooltipVisible && tooltip}
        <WeightWrap ref={targetRef}>
          {t('Weight')}: {weight}
        </WeightWrap>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
