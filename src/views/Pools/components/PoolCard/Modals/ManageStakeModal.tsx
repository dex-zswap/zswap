import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon, Link } from 'zswap-uikit'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import useStakePool from 'views/Pools/hooks/useStakePool'
import useUnstakePool from 'views/Pools/hooks/useUnstakePool'
import { getAddress } from 'utils/addressHelpers'
import PercentageButton from './PercentageButton'

interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
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

const StyledLink = styled(Link)`
  width: 100%;
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { apr, sousId, stakingToken, userData, stakingLimit, earningToken } = pool

  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useStakePool(pool.stakingToken)
  const { onUnstake } = useUnstakePool(pool.stakingToken)
  const { toastSuccess, toastError } = useToast()
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
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, 0)
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
        await onUnstake(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await onStake(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the pool!', {
            symbol: stakingToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    }
  }

  // <Text color="secondary" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
  //   {t('Max stake for this pool: %amount% %token%', {
  //     amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
  //     token: stakingToken.symbol,
  //   })}
  // </Text>

  return (
    <Modal
      title={isRemovingStake ? t('Unstake') : t('Stake in Pool')}
      minWidth="640px"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {!isRemovingStake && (
        <>
          <Text bold>{t('Single Currency Pledge Mining')}</Text>
          <Text style={{ marginBottom: '35px' }}>
            {t('Stake')}
            {' ' + stakingToken.symbol + ' '}
            {t('here to get reward token')}
          </Text>
        </>
      )}
      {/* <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image
            src={`/images/tokens/${getAddress(stakingToken.address)}.png`}
            width={24}
            height={24}
            alt={stakingToken.symbol}
          />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex> */}
      <RewordTokenWrap>
        <Flex flexDirection="column">
          <Text mb="10px">{t('Reward Token')}</Text>
          <Flex>
            <CurrencyLogo style={{ marginRight: '10px' }} currency={userData?.earningCurrency} size="18px" />
            <Text bold>{earningToken.symbol}</Text>
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Text mb="10px">{t('APR')}</Text>
          <Text bold>{apr}</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text mb="10px">{t('Claimable Rewards')}</Text>
          <Text bold>{userData?.pendingReward.toString()}</Text>
        </Flex>
      </RewordTokenWrap>
      <Flex justifyContent="space-between">
        <Text fontSize="16px" mb="15px" bold>
          {t('Stake')}
        </Text>
        <Text bold>
          {t('Available')}: {userData?.stakingTokenBalance.toString()}
        </Text>
      </Flex>
      <StakeTokenWrap>
        <Flex alignItems="center">
          <CurrencyLogo style={{ marginRight: '14px' }} currency={userData?.stakedCurrency} size="25px" />
          <Text fontSize="16px" bold>
            {earningToken.symbol}
          </Text>
        </Flex>
        <BalanceInput
          value={stakeAmount}
          onUserInput={handleStakeInputChange}
          currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
          isWarning={hasReachedStakeLimit}
          decimals={stakingToken.decimals}
        />
      </StakeTokenWrap>

      {/* {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )} */}
      {/* <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(getCalculatedStakingLimit(), 0),
        })}
      </Text> */}
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
      <Flex>
        <Text fontSize="16px" bold>
          {t('Amount Staked')}: {stakeAmount || 0} ≈ ${usdValueStaked || 0}
        </Text>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit}
        mt="24px"
      >
        {pendingTx ? t('Staking') : t('Stake')}
      </Button>
      {/* {!isRemovingStake && (
        <StyledLink external href="/swap">
          <Button width="100%" mt="8px" variant="secondary">
            {t('Get %symbol%', { symbol: stakingToken.symbol })}
          </Button>
        </StyledLink>
      )} */}
    </Modal>
  )
}

export default StakeModal
