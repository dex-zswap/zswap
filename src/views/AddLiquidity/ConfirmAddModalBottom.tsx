import { Currency, CurrencyAmount, Fraction, Percent } from 'zswap-sdk'
import React from 'react'
import styled from 'styled-components'
import { Button, Text } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { Field } from 'state/mint/actions'

const RowWrap = styled.div`
  padding: 15px 20px;
  background: #2b2b2b;
  border-radius: 20px;
  > div {
    margin-bottom: 7px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <RowWrap>
        <RowBetween>
          <Text bold>
            {t('%asset% Deposited', {
              asset: currencies[Field.CURRENCY_A]?.symbol,
            })}
          </Text>
          <RowFixed>
            {/* <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} /> */}
            <Text bold>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <Text bold>
            {t('%asset% Deposited', {
              asset: currencies[Field.CURRENCY_B]?.symbol,
            })}
          </Text>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <Text bold>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <Text bold>{t('Rates')}</Text>
          <Text bold>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text bold>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text bold>{t('Share of Pool')}:</Text>
          <Text bold>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
        </RowBetween>
      </RowWrap>
      <Button width="100%" onClick={onAdd} mt="20px">
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
