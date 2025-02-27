import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Field } from 'state/swap/actions'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import { Trade, TradeType } from 'zswap-sdk'
import { Text } from 'zswap-uikit'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { t } = useTranslation()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <AutoColumn>
      <RowBetween marginY="3px">
        <RowFixed>
          <Text color="textSubtle">{isExactIn ? t('Minimum received') : t('Maximum sold')}</Text>
          {/* <QuestionHelper
            text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
            ml="4px"
          /> */}
        </RowFixed>
        <RowFixed>
          <Text>
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween marginY="3px">
        <RowFixed>
          <Text color="textSubtle">{t('Price Impact')}</Text>
          {/* <QuestionHelper
            text="The difference between the market price and estimated price due to trade size."
            ml="4px"
          /> */}
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>

      <RowBetween marginY="3px">
        <RowFixed>
          <Text color="textSubtle">{t('Liquidity Provider Fee')}</Text>
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
        <Text>{realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}</Text>
      </RowBetween>
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const { t } = useTranslation()

  const showRoute = Boolean(trade && trade.route.path.length > 1)

  return (
    <AutoColumn
      style={{
        width: '100%',
        padding: '24px',
        zIndex: 99,
        borderRadius: '20px',
      }}
      gap="0px"
    >
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ wordBreak: 'keep-all' }} color="textSubtle">
                    {t('Route')}
                  </Text>
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
