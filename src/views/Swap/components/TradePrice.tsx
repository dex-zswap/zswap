import React from 'react'
import { Price } from 'zswap-sdk'
import { Text, AutoRenewIcon } from 'zswap-uikit'
import { StyledBalanceMaxMini } from './styleds'
import { useTranslation } from 'contexts/Localization'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const { t } = useTranslation()
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} ${t('per')} ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} ${t('per')} ${price?.quoteCurrency?.symbol}`

  return (
    <Text
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewIcon width="14px" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
