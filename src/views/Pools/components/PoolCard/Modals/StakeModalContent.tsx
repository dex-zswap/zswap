import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { HelpIcon, useTooltip, Text, Flex, Button, Slider, BalanceInput } from 'zswap-uikit'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import useStakePool from 'views/Pools/hooks/useStakePool'
import useHarvestPool from 'views/Pools/hooks/useHarvestPool'
import useUnstakePool from 'views/Pools/hooks/useUnstakePool'
import PercentageButton from './PercentageButton'
import ZbstLogo from 'components/Logo/tokens/ZBST.png'
import Dots from 'components/Loader/Dots'

interface StakeModalContentProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  tabType?: string
  isRemovingStake?: boolean
  isReward?: boolean
  fromStakeModal?: boolean
  onDismiss?: () => void
}

const RewordTokenWrap = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  border: 1px solid #2e2e2e;
  border-radius: 14px;
  padding: 15px 20px;
  margin-bottom: 35px;
`

const StakeTokenWrap = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  background: #2e2e2e;
  border-radius: 14px;
  padding: 20px 18px;
  margin-bottom: 10px;
`

const PercentageButtonWrap = styled(Flex)`
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  > button {
    margin-right: 14px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const StakeModalContent: React.FC<StakeModalContentProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  tabType,
  isRemovingStake = false,
  isReward = false,
  fromStakeModal = false,
  onDismiss,
}) => {
  const { apr, stakingToken, userData, stakingLimit } = pool
  const { t } = useTranslation()
  const { onStake } = useStakePool(pool.stakingToken)
  const { onUnstake } = useUnstakePool(pool.stakingToken)
  const { toastError } = useToast()
  const { onReward } = useHarvestPool(stakingToken)
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingTokenBalance
  }

  useEffect(() => {
    setStakeAmount('')
    setPercent(0)
  }, [tabType])
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  useEffect(() => {
    if (!isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 0)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
    }
  }, [stakeAmount, userData, stakingToken, isRemovingStake, setHasReachedStakedLimit])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), 0)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, 0, 8)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        const success = await onUnstake(stakeAmount, stakingToken.decimals)
        if (success) {
          setPendingTx(false)
          onDismiss()
        } else {
          toastError(
            t('Error'),
            t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
          )
          setPendingTx(false)
        }
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    } else {
      try {
        const success = await onStake(stakeAmount, stakingToken.decimals)
        if (success) {
          setPendingTx(false)
          onDismiss()
        } else {
          toastError(
            t('Error'),
            t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
          )
          setPendingTx(false)
        }
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    }
  }

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    try {
      await onReward()
      setPendingTx(false)
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('The amount of tokens you have staked. You can withdraw them at any time.'),
    {
      placement: 'right',
      trigger: 'hover',
    },
  )

  return (
    <>
      {!isReward && !isRemovingStake && (
        <>
          <Text bold>{t('Single Currency Pledge Mining')}</Text>
          <Text style={{ marginBottom: '35px' }}>
            {t('Stake')}
            {' ' + stakingToken.symbol + ' '}
            {t('here to get reward token')}
          </Text>
        </>
      )}
      <RewordTokenWrap>
        <Flex flexDirection="column">
          <Text mb="10px">{t('Reward Token')}</Text>
          <Flex>
            <img style={{ marginRight: '10px' }} width="24px" src={ZbstLogo} />
            <Text bold>ZBST</Text>
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Text mb="10px">{t('APR')}</Text>
          <Text bold>{apr}%</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text mb="10px">{t('Claimable Rewards')}</Text>
          <Text bold>{userData?.pendingReward.toFixed(4)}</Text>
        </Flex>
      </RewordTokenWrap>

      <Flex justifyContent="space-between">
        <Text fontSize="16px" mb="15px" bold>
          {isReward ? t('Withdraw Reward') : isRemovingStake ? t('Withdraw Principal') : t('Stake')}
        </Text>
        {!isReward && (
          <Text bold>
            {t('Available') + ': '}
            {isRemovingStake
              ? userData?.stakedBalance.toFixed(4, BigNumber.ROUND_DOWN)
              : userData?.stakingTokenBalance.toFixed(4)}
          </Text>
        )}
      </Flex>
      {isReward && (
        <>
          <StakeTokenWrap>
            <Flex alignItems="center">
              <img style={{ marginRight: '14px' }} width="24px" src={ZbstLogo} />
              <Text fontSize="16px" bold>
                ZBST
              </Text>
            </Flex>
            <Text fontSize="20px" bold>
              {parseFloat(userData?.pendingReward.toFixed(2))}
            </Text>
          </StakeTokenWrap>
          <Button
            onClick={handleHarvestConfirm}
            disabled={pendingTx || !parseFloat(userData?.pendingReward.toFixed(2))}
            mt="24px"
          >
            {pendingTx ? <Dots>{t('Withdrawing Reward')}</Dots> : t('Withdraw Reward')}
          </Button>
        </>
      )}

      {!isReward && (
        <>
          <StakeTokenWrap>
            <Flex alignItems="center">
              <CurrencyLogo style={{ marginRight: '14px' }} currency={userData?.stakedCurrency} size="25px" />
              <Text fontSize="16px" bold>
                {stakingToken.symbol}
              </Text>
            </Flex>
            <BalanceInput
              value={stakeAmount}
              onUserInput={handleStakeInputChange}
              isWarning={hasReachedStakeLimit}
              decimals={stakingToken.decimals}
            />
          </StakeTokenWrap>
          <Slider
            min={0}
            max={100}
            value={percent}
            onValueChanged={handleChangePercent}
            name="stake"
            valueLabel={`${percent}%`}
            step={1}
          />
          <PercentageButtonWrap>
            <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
          </PercentageButtonWrap>
          <Flex alignItems="center">
            <Text fontSize="16px" bold>
              {isRemovingStake ? t('Amount Withdrawed') : t('Amount Staked')}: {stakeAmount || 0} ≈ $
              {usdValueStaked || 0}
            </Text>
            {fromStakeModal && (
              <>
                {tooltipVisible && tooltip}
                <div ref={targetRef}>
                  <HelpIcon cursor="pointer" width="18px" ml="5px" mt="2px" />
                </div>
              </>
            )}
          </Flex>
          <Button
            onClick={handleConfirmClick}
            disabled={pendingTx || !stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit}
            mt="24px"
          >
            {pendingTx ? (
              isRemovingStake ? (
                <Dots>{t('Withdrawing Principal')}</Dots>
              ) : (
                <Dots>{t('Staking')}</Dots>
              )
            ) : isRemovingStake ? (
              t('Withdraw Principal')
            ) : (
              t('Stake')
            )}
          </Button>
        </>
      )}
    </>
  )
}

export default StakeModalContent
