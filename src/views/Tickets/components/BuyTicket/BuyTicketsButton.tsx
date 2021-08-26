import { Text, Button, useModal } from 'zswap-uikit'
import { LayoutProps, SpaceProps } from 'styled-system'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BuyTicketsModal from './BuyTicketsModal'

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTimeRange from 'views/Tickets/hooks/useTimeRange'
import { useState, useEffect } from 'react'

interface btnProps extends LayoutProps, SpaceProps {
  accountTip?: string
  noAccountTip?: string
  onDismiss?: () => void
}

const BuyTicketsButton: React.FC<btnProps> = ({ onDismiss, accountTip, noAccountTip, ...props }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [useBuyTicketsModal] = useModal(<BuyTicketsModal onDismiss={onDismiss} />)
  const timeRange = useTimeRange()

  const [btnLabel, setBtnLabel] = useState(t('Buy Tickets'))
  const [btnDisabled, setBtnDisabled] = useState(true)

  useEffect(() => {
    const changeBtnStatus = () => {
      const date = new Date().getTime()
      if (!timeRange) return
      if (!timeRange.start || timeRange.start > date) {
        setBtnLabel(t('Sales Immediately'))
        setBtnDisabled(true)
        return
      }
      if (!timeRange.end || timeRange.end < date) {
        setBtnLabel(t('Waiting for the lottery'))
        setBtnDisabled(true)
        return
      }
      setBtnLabel(t('Buy Tickets'))
      setBtnDisabled(false)
    }
    changeBtnStatus()
    const timer = setInterval(() => {
      changeBtnStatus()
    }, 1000)
    return () => {
      setBtnLabel(t('Buy Tickets'))
      setBtnDisabled(true)
      clearInterval(timer)
    }
  }, [timeRange])

  return (
    <>
      {(accountTip || noAccountTip) && (
        <Text textAlign="center" mb="20px">
          {account ? accountTip : noAccountTip}
        </Text>
      )}
      {account ? (
        <Button width="210px" {...props} disabled={btnDisabled} onClick={useBuyTicketsModal}>
          {btnLabel}
        </Button>
      ) : (
        <ConnectWalletButton {...props} />
      )}
    </>
  )
}

export default BuyTicketsButton
