import React, { useState } from 'react'
import {
  Modal,
  Text,
  Button,
  Heading,
  Flex,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'
import { formatNumber } from 'utils/formatBalance'
import useHarvestPool from 'views/Pools/hooks/useHarvestPool'
import useStakePool from 'views/Pools/hooks/useStakePool'
import Dots from 'components/Loader/Dots'

interface CollectModalProps {
  formattedBalance: string
  fullBalance: string
  earningToken: Token
  stakingToken?: Token
  earningsDollarValue: number
  sousId: number
  isBnbPool: boolean
  isCompoundPool?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  stakingToken,
  earningsDollarValue,
  sousId,
  isBnbPool,
  isCompoundPool = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const { onReward } = useHarvestPool(stakingToken)
  const { onStake } = useStakePool(stakingToken)
  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text mb="12px">{t('Compound: collect and restake CAKE into pool.')}</Text>
      <Text>{t('Harvest: collect CAKE and send to wallet')}</Text>
    </>,
    { placement: 'bottom-end', tooltipOffset: [20, 10] },
  )

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    // compounding
    if (shouldCompound) {
      try {
        const success = await onStake(fullBalance, earningToken.decimals)
        if (success) {
          // toastSuccess(
          //   `${t('Compounded')}!`,
          //   t('Your %symbol% earnings have been re-invested into the pool!', {
          //     symbol: earningToken.symbol,
          //   }),
          // )
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
        console.error(e)
        setPendingTx(false)
      }
    } else {
      // harvesting
      try {
        const success = await onReward()
        if (success) {
          toastSuccess(
            `${t('Harvested')}!`,
            t('Your %symbol% earnings have been sent to your wallet!', {
              symbol: earningToken.symbol,
            }),
          )
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
        console.error(e)
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal
      title={`${earningToken.symbol} ${isCompoundPool ? t('Collect') : t('Harvest')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isCompoundPool && (
        <Flex justifyContent="center" alignItems="center" mb="24px">
          <ButtonMenu
            activeIndex={shouldCompound ? 0 : 1}
            scale="sm"
            variant="subtle"
            onItemClick={(index) => setShouldCompound(!index)}
          >
            <ButtonMenuItem as="button">{t('Compound')}</ButtonMenuItem>
            <ButtonMenuItem as="button">{t('Harvest')}</ButtonMenuItem>
          </ButtonMenu>
          <Flex ml="10px" ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </Flex>
          {tooltipVisible && tooltip}
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>{shouldCompound ? t('Compounding') : t('Harvesting')}:</Text>
        <Flex flexDirection="column">
          <Heading>
            {formattedBalance} {earningToken.symbol}
          </Heading>
          {earningsDollarValue > 0 && (
            <Text fontSize="12px" color="textSubtle">{`~${formatNumber(earningsDollarValue)} USD`}</Text>
          )}
        </Flex>
      </Flex>

      <Button mt="8px" onClick={handleHarvestConfirm} disabled={pendingTx}>
        {pendingTx ? <Dots>{t('Confirming')}</Dots> : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default CollectModal
