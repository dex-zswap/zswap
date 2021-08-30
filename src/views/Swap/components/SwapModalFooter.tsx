import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from 'zswap-sdk'
import { Button, Text, AutoRenewIcon } from 'zswap-uikit'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const SwapModalFooterContainer = styled(AutoColumn)`
  max-width: 480px;
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

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
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
          <Text>Price</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text>{trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}</Text>
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
            <Text>Price Impact</Text>
            {/* <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" /> */}
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text>Liquidity Provider Fee</Text>
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
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
