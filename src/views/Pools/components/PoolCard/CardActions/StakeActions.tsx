import React from 'react'
import { Flex, Text, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton, useTooltip } from 'zswap-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import NotEnoughTokensModal from 'views/Pools/components/PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from 'views/Pools/components/PoolCard/Modals/StakeModal'
import ManageStakeModal from 'views/Pools/components/PoolCard/Modals/ManageStakeModal'

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
}) => {
  const { stakingToken, stakingTokenPrice, isFinished, userData } = pool
  const { totalStakedBalance, stakedPercent } = userData
  const { t } = useTranslation()
  const stakedTokenBalance = getBalanceNumber(stakedBalance, 0)
  const userTokenBalance = getBalanceNumber(stakingTokenBalance, 0)
  const stakedTokenDollarBalance = getBalanceNumber(stakedBalance.multipliedBy(stakingTokenPrice), 0)
  const stakingTokenDollarBalance = getBalanceNumber(totalStakedBalance.multipliedBy(stakingTokenPrice), 0)
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [manageStake] = useModal(
    <ManageStakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  // const [onPresentUnstake] = useModal(
  //   <StakeModal
  //     stakingTokenBalance={stakingTokenBalance}
  //     isBnbPool={isBnbPool}
  //     pool={pool}
  //     stakingTokenPrice={stakingTokenPrice}
  //     isRemovingStake
  //   />,
  // )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this pool!'),
    { placement: 'bottom' },
  )

  // const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)
  const reachStakingLimit = false

  {
    /* <Flex justifyContent="space-between" alignItems="center">
          <Text>Value Locked</Text>
          <Text>
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              value={userTokenBalance}
              unit={stakingToken.symbol}
            />
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>Value Locked</Text>
          <Text>
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              value={stakingTokenDollarBalance}
              prefix="~"
              unit=" USD"
            />
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>Your Share</Text>
          <Text>
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              value={stakedTokenDollarBalance}
              prefix="~"
              unit={`USD(${stakedPercent})`}
            />
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <>
              <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={stakedTokenDollarBalance}
                  prefix="~"
                  unit="USD"
                />
              </Text>
            </>
          </Flex>

          <Flex>
            <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="primary" width="24px" />
            </IconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <IconButton variant="secondary" disabled>
                  <AddIcon color="textDisabled" width="24px" height="24px" />
                </IconButton>
              </span>
            ) : (
              <IconButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="24px" height="24px" />
              </IconButton>
            )}
          </Flex>
          {tooltipVisible && tooltip}
        </Flex> */
  }

  const renderStakeAction = () => {
    return (
      <div style={{ marginBottom: '25px' }}>
        {isStaked ? (
          <Button width="100%" onClick={manageStake}>
            {t('Manage Stake')}
          </Button>
        ) : (
          <Button
            width="100%"
            disabled={isFinished}
            onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
          >
            {t('Join')}
          </Button>
        )}
      </div>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
