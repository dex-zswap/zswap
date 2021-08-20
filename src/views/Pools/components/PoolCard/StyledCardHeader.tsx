import React from 'react'
import { CardHeader, Heading, Text, Flex } from 'zswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
import CakeVaultTokenPairImage from 'views/Pools/components/CakeVaultCard/CakeVaultTokenPairImage'

const Wrapper = styled(CardHeader)<{
  isFinished?: boolean
  background?: string
}>`
  background: #292929;
  border-radius: 30px 0 0;
`

const StyledCardHeader: React.FC<{
  earningToken: Token
  stakingToken: Token
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({ earningToken, stakingToken, isFinished = false, isAutoVault = false, isStaking = false }) => {
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
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
