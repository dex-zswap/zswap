import React from 'react'
import { CardHeader, Heading, Flex, useTooltip } from 'zswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

const Wrapper = styled(CardHeader)<{
  isFinished?: boolean
  background?: string
}>`
  background: #292929;
  border-radius: 30px 0 0;
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

const StyledCardHeader: React.FC<{
  earningToken: Token
  stakingToken: Token
  weight: number
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({ earningToken, stakingToken, weight, isFinished = false, isAutoVault = false, isStaking = false }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Weight represents the ratio of ZBst reward from the pool to the ratio of the standard reward. In general, the higher the weight, the higher ZBst reward can be obtained by the pool.',
    ),
    {
      placement: 'top',
      trigger: 'hover',
    },
  )

  return (
    <Wrapper isFinished={isFinished}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          <TokenPairImage
            style={{ marginRight: '10px' }}
            primaryToken={earningToken}
            secondaryToken={stakingToken}
            width={46}
            height={46}
          />
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {stakingToken.symbol}
          </Heading>
        </Flex>
        {tooltipVisible && tooltip}
        <WeightWrap ref={targetRef}>
          {t('Weight')}: {weight}
        </WeightWrap>
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
