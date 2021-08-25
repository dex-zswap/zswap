import React from 'react'
import { CardHeader, Heading, Flex } from 'zswap-uikit'
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
  color: #ffffff;
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
  const isCakePool = earningToken.symbol === 'CAKE' && stakingToken.symbol === 'CAKE'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto')
    }
    if (isCakePool) {
      // manual cake
      return t('Manual')
    }
    // all other pools
    return t('Earn')
  }

  const getSubHeading = () => {
    if (isAutoVault) {
      return t('Automatic restaking')
    }
    if (isCakePool) {
      return t('Earn CAKE, stake CAKE')
    }
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
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
          {/* <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text> */}
        </Flex>
        {/* {isAutoVault ? (
          <CakeVaultTokenPairImage width={64} height={64} />
        ) : (
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
        )} */}
        <WeightWrap>weight: {weight}</WeightWrap>
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
