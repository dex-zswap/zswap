import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, TokenAmount, currencyEquals } from 'zswap-sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairState, usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { useCurrency } from 'hooks/Tokens'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { wrappedCurrency, wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { ZSWAP_ZB_ADDRESS as ZB_ADDRESS, ZSWAP_DEX_ADDRESS as DEX_ADDRESS } from 'config/constants/zswap/address'
import { AppDispatch, AppState } from 'state'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Field, typeInput } from './actions'
import { useTranslation } from 'contexts/Localization'

type ExistZBPair = {
  zbWithcurrencyA: boolean
  zbWithcurrencyB: boolean
}

const ZERO = JSBI.BigInt(0)

export function useCurrencyExistZBPair(
  currencyA: Currency | null,
  currencyB: Currency | null,
  noLiquidity: boolean,
): ExistZBPair {
  const ZB = useCurrency(ZB_ADDRESS)
  const DEX = useCurrency(DEX_ADDRESS)

  if (currencyEquals(currencyA, ETHER)) {
    currencyA = DEX
  }

  if (currencyEquals(currencyB, ETHER)) {
    currencyB = DEX
  }

  const [pairAState] = usePair(ZB, currencyA)
  const [pairBState] = usePair(ZB, currencyB)

  return useMemo<ExistZBPair>(() => {
    const allReadyZB = currencyEquals(ZB, currencyA) || currencyEquals(ZB, currencyB)

    return noLiquidity
      ? {
          zbWithcurrencyA: !currencyA || allReadyZB || pairAState === PairState.EXISTS,
          zbWithcurrencyB: !currencyB || allReadyZB || pairBState === PairState.EXISTS,
        }
      : {
          zbWithcurrencyA: true,
          zbWithcurrencyB: true,
        }
  }, [pairAState, pairBState, currencyA, currencyB, ZB])
}

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>((state) => state.mint)
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_A,
          typedValue,
          noLiquidity: noLiquidity === true,
        }),
      )
    },
    [dispatch, noLiquidity],
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_B,
          typedValue,
          noLiquidity: noLiquidity === true,
        }),
      )
    },
    [dispatch, noLiquidity],
  )

  return {
    onFieldAInput,
    onFieldBInput,
  }
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
  allExist: boolean
  createZBPairLink: string
  otherCurrencySymbol: string
} {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )

  const currencyId: {
    currencyA: string | undefined
    currencyB: string | undefined
  } = {
    currencyA: currencyA === ETHER ? 'DEX' : currencyA ? (currencyA as WrappedTokenInfo).address : undefined,
    currencyB: currencyB === ETHER ? 'DEX' : currencyB ? (currencyB as WrappedTokenInfo).address : undefined,
  }

  // get pair with state
  const [pairState, pair] = usePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  //  check each token has a allready exist trad pair with ZB
  const { zbWithcurrencyA, zbWithcurrencyB } = useCurrencyExistZBPair(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    noLiquidity,
  )
  const allExist = useMemo<boolean>(() => zbWithcurrencyA && zbWithcurrencyB, [zbWithcurrencyA, zbWithcurrencyB])
  const createZBPairLink = useMemo<string>(
    () => (allExist ? null : `/add/${ZB_ADDRESS}/${zbWithcurrencyA ? currencyId.currencyB : currencyId.currencyA}`),
    [allExist],
  )
  const otherCurrencySymbol = useMemo<string>(
    () => (allExist ? `` : zbWithcurrencyA ? currencyB.symbol : currencyA.symbol),
    [currencyA, currencyB, zbWithcurrencyA, allExist],
  )

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const price = pair.priceOf(dependentField === Field.CURRENCY_B ? tokenA : tokenB)
        const dependentTokenAmount = price.quote(wrappedIndependentAmount)
        console.log(wrappedIndependentAmount.toSignificant(6), price.toSignificant(6))
        return dependentCurrency === ETHER ? CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, chainId, currencyB, pair])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
      if (currencyAAmount && currencyBAmount) {
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)
      }
      return undefined
    }
    const wrappedCurrencyA = wrappedCurrency(currencyA, chainId)
    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
  }, [chainId, currencyA, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
    }
    return undefined
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Select a token'
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? t('Enter an amount')
  }

  if (!allExist) {
    error = 'Create ZB Pair'
  }

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    error = `Insufficient ${currencies[Field.CURRENCY_A]?.symbol} balance`
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    error = `Insufficient ${currencies[Field.CURRENCY_B]?.symbol} balance`
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    allExist,
    createZBPairLink,
    otherCurrencySymbol,
  }
}
