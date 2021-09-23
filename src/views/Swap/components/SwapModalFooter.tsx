import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType, Pair } from 'zswap-sdk'
import { Button, Text } from 'zswap-uikit'
import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import TradePrice from './TradePrice'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { useTranslation } from 'contexts/Localization'
import { SwapCallbackError } from './styleds'

const SwapModalFooterContainer = styled(AutoColumn)`
  max-width: 100%;
  margin: 35px 0;
  padding: 19px 23px;
  background: #2b2b2b;
  border-radius: 20px;
  > div {
    margin-bottom: 7px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`
// max-width: 480px;

export default function SwapModalFooter({
  trade,
  usingTransit,
  pair,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  usingTransit: boolean
  pair: Pair
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(true)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Text>{t('Price')}</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            <TradePrice
              price={usingTransit ? trade.executionPrice : pair.token0Price}
              showInverted={showInverted}
              setShowInverted={() => setShowInverted(!showInverted)}
            />
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text>{trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}</Text>
            {/* <QuestionHelper
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              ml="4px"
            /> */}
          </RowFixed>
          <RowFixed>
            <Text>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text>{t('Price Impact')}</Text>
            {/* <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" /> */}
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text>{t('Liquidity Provider Fee')}</Text>
            {/* <QuestionHelper
              text={
                <>
                  <Text mb="12px">For each trade a 0.20% fee is paid</Text>
                  <Text>- 0.17% to LP token holders</Text>
                  <Text>- 0.03% to the Treasury</Text>
                  <Text>- 0.05% towards CAKE buyback and burn</Text>
                </>
              }
              ml="4px"
            /> */}
          </RowFixed>
          <Text>{realizedLPFee ? `${realizedLPFee.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}</Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? t('Swap Anyway') : t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
