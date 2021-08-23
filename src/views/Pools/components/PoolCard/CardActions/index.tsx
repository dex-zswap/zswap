import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { TokenPairImage } from 'components/TokenImage'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Flex mb="7px" justifyContent="space-between">
              <Text fontSize="14px">{t('Reward Token')}</Text>
              <TokenPairImage secondaryToken={earningToken} width={46} height={46} />
            </Flex>

            <Flex mb="7px" justifyContent="space-between">
              <Text fontSize="14px">{t('Value Locked')}</Text>
              <Text fontSize="14px">${pool.userData?.totalStakedBalance.toFixed(2)}</Text>
            </Flex>

            <Flex mb="7px" justifyContent="space-between">
              <Text fontSize="14px">{t('Your Share')}</Text>
              <Text fontSize="14px">
                ${pool.userData?.stakedUSDTValue.toFixed(2)}（{pool.userData?.stakedPercent.toString()}）
              </Text>
            </Flex>

            <Flex mb="7px" justifyContent="space-between">
              <Text fontSize="14px">{t('Pooled Balance')}</Text>
              <Text fontSize="14px">
                {pool.userData?.stakedBalance.toFixed(2)}
                {' ' + stakingToken.symbol}
              </Text>
            </Flex>

            <Flex mb="25px" justifyContent="space-between">
              <Text fontSize="14px">{t('Your Reward')}</Text>
              <Text fontSize="14px">{pool.userData?.pendingReward.toFixed(2)}</Text>
            </Flex>

            {/* <Box display="inline">
              <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box> */}
            {/* <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              stakingToken={stakingToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
            /> */}
          </>
        )}
        {/* <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box> */}
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
