import React from 'react'
import StakeModalContent from './StakeModalContent'
import { Modal } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StakeModal: React.FC<StakeModalProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // <Text color="secondary" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
  //   {t('Max stake for this pool: %amount% %token%', {
  //     amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
  //     token: stakingToken.symbol,
  //   })}
  // </Text>

  // <Text color="secondary" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
  //   {t('Max stake for this pool: %amount% %token%', {
  //     amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
  //     token: stakingToken.symbol,
  //   })}
  // </Text>

  return (
    <Modal
      title={t('Join')}
      minWidth="640px"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <StakeModalContent
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice}
        onDismiss={onDismiss}
        fromStakeModal
      />
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
