import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from 'zswap-sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon } from 'zswap-uikit'
import { Field } from 'state/swap/actions'
import { isAddress, shortenAddress } from 'utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { useTranslation } from 'contexts/Localization'

const RowWrap = styled.div`
  padding: 19px 23px;
  background: #2b2b2b;
  border-radius: 20px;
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <AutoColumn gap="md">
      <RowWrap>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <CurrencyLogo currency={trade.inputAmount.currency} size="20px" style={{ marginRight: '12px' }} />
            <TruncatedText
              fontSize="20px"
              fontWeight="bold"
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
            >
              {trade.inputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="20px" ml="10px" bold>
              {trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed margin="auto">
          <ArrowDownIcon width="24px" />
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <CurrencyLogo currency={trade.outputAmount.currency} size="20px" style={{ marginRight: '12px' }} />
            <TruncatedText
              fontSize="20px"
              fontWeight="bold"
              color={
                priceImpactSeverity > 2
                  ? 'failure'
                  : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                  ? 'primary'
                  : 'text'
              }
            >
              {trade.outputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="20px" ml="10px" bold>
              {trade.outputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </RowWrap>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold>{' ' + t('Price Updated')}</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>{t('Accept')}</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '0 30px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <Text small color="pink" textAlign="left" style={{ width: '360px' }} bold>
            {t('Output is estimated. You will receive at least ')}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {t(' or the transaction will revert.')}
          </Text>
        ) : (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {t(' or the transaction will revert.')}
          </Text>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {t('Output will be sent to ')}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
