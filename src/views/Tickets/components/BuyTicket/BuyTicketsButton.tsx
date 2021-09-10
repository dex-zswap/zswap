import { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { LotteryContext } from 'contexts/Lottery'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { Text, Button, useModal } from 'zswap-uikit'
import { LayoutProps, SpaceProps } from 'styled-system'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BuyTicketsModal from './BuyTicketsModal'
interface btnProps extends LayoutProps, SpaceProps {
  accountTip?: string
  noAccountTip?: string
  onDismiss?: () => void
}

const BuyTicketsButton: React.FC<btnProps> = ({ onDismiss, accountTip, noAccountTip, ...props }) => {
  const { t } = useTranslation()
  const { timeRange } = useContext(LotteryContext)

  const { account } = useActiveWeb3React()
  const [useBuyTicketsModal] = useModal(<BuyTicketsModal onDismiss={onDismiss} />)

  const [btnLabel, setBtnLabel] = useState<string>(t('Buy Tickets'))
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true)

  useEffect(() => {
    const changeBtnStatus = () => {
      if (!timeRange) return
      const date = new Date().getTime()
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
    }, 5000)
    return () => {
      setBtnLabel(t('Buy Tickets'))
      setBtnDisabled(true)
      timer && clearInterval(timer)
    }
  }, [timeRange, t])

  return (
    <>
      {(accountTip || noAccountTip) && (
        <Text textAlign="center" mb="20px">
          {account ? accountTip : noAccountTip}
        </Text>
      )}
      {account ? (
        <Button minWidth="210px" {...props} disabled={btnDisabled} onClick={useBuyTicketsModal}>
          {btnLabel}
        </Button>
      ) : (
        <ConnectWalletButton {...props} />
      )}
    </>
  )
}

export default BuyTicketsButton
