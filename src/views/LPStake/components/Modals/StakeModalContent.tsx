import React, { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, Slider, BalanceInput, AutoRenewIcon, Link } from 'zswap-uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'
import { Farm } from 'state/types'
import useHarvestFarm from 'views/LPStake/hooks/useHarvestFarm'
import PercentageButton from './PercentageButton'
import ZbstLogo from 'components/Logo/tokens/ZBST.png'
import Dots from 'components/Loader/Dots'

interface FarmProps extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
  [key: string]: any
}
interface StakeModalContentProps {
  farm: FarmProps
  tabType?: string
  isRemovingStake?: boolean
  isReward?: boolean
  handleStake?: (amount: string) => void
  handleUnstake?: (amount: string) => void
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
  farm,
  tabType,
  isRemovingStake = false,
  isReward = false,
  handleStake,
  handleUnstake,
  onDismiss,
}) => {
  const { userData } = farm
  const max = new BigNumber(isRemovingStake ? userData?.staked : userData?.tokenBalance).toFixed(
    2,
    BigNumber.ROUND_DOWN,
  )
  const stakingToken = farm.token
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    return new BigNumber(max)
  }
  useEffect(() => {
    setStakeAmount('')
    setPercent(0)
  }, [tabType])

  useEffect(() => {
    if (!isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 0)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(max))
    }
  }, [stakeAmount, userData, stakingToken, isRemovingStake, setHasReachedStakedLimit])

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(max), 0)
  }, [max])

  const stakeAmountNum = new BigNumber(stakeAmount)
  const fullBalanceNumber = new BigNumber(fullBalance)

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
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, 0)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const stakeConfirm = async () => {
    setPendingTx(true)
    try {
      await handleStake(stakeAmount)
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }

  const unstakeConfirm = async () => {
    setPendingTx(true)
    try {
      await handleUnstake(stakeAmount)
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }

  const { onReward } = useHarvestFarm(farm.pair.pair, farm.lpSymbol)

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    try {
      await onReward()
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }

  return (
    <>
      {!isReward && !isRemovingStake && (
        <>
          <Text bold>{t('LP Pledge Mining')}</Text>
          <Text style={{ marginBottom: '35px' }}>
            {t('You need to obtain')}
            {' ' + farm.lpSymbol + ' '}
            {t('token first, which can be obtained by adding funds to')}
            {' ' + farm.lpSymbol.split(' LP')[0] + ' '}
            {t('liquidity pool, and then you can stake LP token on this page.')}
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
          <Text bold>{farm.displayApr}%</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text mb="10px">{t('Claimable Rewards')}</Text>
          <Text bold>{userData?.earnings.toString()}</Text>
        </Flex>
      </RewordTokenWrap>
      <Flex justifyContent="space-between">
        <Text fontSize="16px" mb="15px" bold>
          {isReward ? t('Withdraw Reward') : isRemovingStake ? t('Withdraw Lp') : t('Stake')}
        </Text>
        {!isReward && (
          <Text bold>
            {t('Available') + ': '}
            {max}
            {/* <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0050FF', marginLeft: '10px' }}>
              {t('MAX')}
            </span> */}
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
              {userData?.earnings.toString()}
            </Text>
          </StakeTokenWrap>
          <Button onClick={handleHarvestConfirm} disabled={pendingTx || !userData?.earnings.toString()} mt="24px">
            {pendingTx ? <Dots>{t('Withdrawing Reward')}</Dots> : t('Withdraw Reward')}
          </Button>
        </>
      )}
      {!isReward && (
        <>
          <StakeTokenWrap>
            <Flex flex="1" alignItems="center">
              <TokenPairImage secondaryToken={farm.token} width={24} height={24} />
              <TokenPairImage
                style={{ margin: '0 14px 0 -3px' }}
                secondaryToken={farm.quoteToken}
                width={25}
                height={25}
              />
              <Text fontSize="16px" bold>
                {farm.lpSymbol}
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
          {/* <Flex>
            <Text fontSize="16px" bold>
              {isRemovingStake ? t('Amount Withdrawed') : t('Amount Staked')}:{' '}
              {stakeAmount ? parseFloat(stakeAmount).toFixed(2) : 0} ≈ $
              {usdValueStaked ? parseFloat(usdValueStaked).toFixed(2) : 0}
            </Text>
          </Flex> */}
          <Button
            onClick={isRemovingStake ? unstakeConfirm : stakeConfirm}
            disabled={
              pendingTx ||
              !stakeAmountNum ||
              !stakeAmountNum.isFinite() ||
              stakeAmountNum.eq(0) ||
              stakeAmountNum.gt(fullBalanceNumber)
            }
            mt="24px"
          >
            {pendingTx ? (
              isRemovingStake ? (
                <Dots>{t('Withdrawing Lp')}</Dots>
              ) : (
                <Dots>{t('Staking')}</Dots>
              )
            ) : isRemovingStake ? (
              t('Withdraw Lp')
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
