import React from 'react'
import StakeModalContent from './StakeModalContent'
import { Modal } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'

interface FarmProps extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
  [key: string]: any
}

interface StakeModalProps {
  farm: FarmProps
  handleStake: (amount: string) => void
  onDismiss?: () => void
}

const StakeModal: React.FC<StakeModalProps> = ({ farm, handleStake, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal
      style={{ width: '640px' }}
      title={t('Join')}
      minWidth="640px"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <StakeModalContent farm={farm} handleStake={handleStake} onDismiss={onDismiss} />
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
