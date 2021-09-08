import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTokenBalances } from 'state/wallet/hooks'
import { ZSWAP_ZB_BURNED_ADDRESS } from 'config/constants/zswap/address'
import { useZBSTToken } from 'hooks/Tokens'
import { BIG_ZERO } from 'utils/bigNumber'

export default function useBurnedZBST() {
  const zbstToken = useZBSTToken()
  const tokenBalance = useTokenBalances(ZSWAP_ZB_BURNED_ADDRESS, zbstToken ? [zbstToken] : [])

  return useMemo(() => {
    if (!tokenBalance && !zbstToken) {
      return BIG_ZERO
    }

    return new BigNumber(tokenBalance[zbstToken.address]?.toSignificant(zbstToken.decimals)).integerValue()
  }, [tokenBalance, zbstToken])
}
