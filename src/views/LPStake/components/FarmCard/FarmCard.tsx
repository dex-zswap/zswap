import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from 'zswap-uikit'
import { Farm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ZbstLogo from 'components/Logo/tokens/ZBST.png'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
  [key: string]: any
}

const AccentGradient = keyframes`  
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

const StyledCardAccent = styled.div`
  background: ${({ theme }) => `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`};
  background-size: 400% 400%;
  animation: ${AccentGradient} 2s linear infinite;
  border-radius: 32px;
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -3px;
  left: -1px;
  z-index: -1;
`

const FCard = styled.div<{ isPromotedFarm: boolean }>`
  width: 100%;
  height: 100%;
  align-self: baseline;
  background: #292929;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin: 10px 0 25px;
  background-color: #fff;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, account }) => {
  const { t } = useTranslation()

  const lpLabel = farm.lpSymbol

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.token.address,
    tokenAddress: farm.quoteToken.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'CAKE'

  const userData = farm.userData

  return (
    <FCard isPromotedFarm={isPromotedFarm}>
      {isPromotedFarm && <StyledCardAccent />}
      <CardHeading
        weight={farm.pair.weight}
        lpLabel={lpLabel}
        multiplier={farm.pair.weight}
        isCommunityFarm={farm.isCommunity}
        token={farm.token}
        quoteToken={farm.quoteToken}
      />
      {!removed && (
        <>
          <Flex style={{ marginTop: '40px' }} justifyContent="space-between" alignItems="center">
            <Text fontSize="16px" mr="10px">
              {t('APR')}
            </Text>
            <Text fontSize="32px" bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.displayApr ? <>{displayApr}%</> : <Skeleton height={24} width={80} />}
            </Text>
          </Flex>
          <Divider />
        </>
      )}
      <Flex mb="7px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{t('Reward Token')}</Text>
        <img width="24px" src={ZbstLogo} />
      </Flex>

      <Flex mb="7px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{t('Value Locked')}</Text>
        <Text fontSize="14px">{farm.lpTotalTokens.toString()}</Text>
      </Flex>

      <Flex mb="7px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{t('Your Share')}</Text>
        <Text fontSize="14px">
          ${userData.stakedBalance.toString()} ({userData.userSharePercent})
        </Text>
      </Flex>

      <Flex mb="7px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{t('Pledge Number')}</Text>
        <Text fontSize="14px">
          {farm.tokenAmount} {farm.token.symbol} / {farm.quoteTokenAmount} {farm.quoteToken.symbol}
        </Text>
      </Flex>

      <Flex mb="25px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{t('Your Reward')}</Text>
        <Text fontSize="14px">{userData.earnings.toString()}</Text>
      </Flex>
      <CardActionsContainer farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
      <DetailsSection
        removed={removed}
        bscScanAddress={getBscScanLink(lpAddress, 'address')}
        infoAddress={`https://pancakeswap.info/pool/${lpAddress}`}
        totalValueFormatted={farm.lpTotalTokens}
        lpLabel={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
      />
    </FCard>
  )
}

export default FarmCard
