import { useMemo } from 'react'
import { constants } from 'ethers'
import { Token, Currency, ETHER, WDEX, currencyEquals, TokenAmount } from 'zswap-sdk'
import useActiveWeb3React from './useActiveWeb3React'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useTokenContract } from './useContract'

function useTokenAllowance(token?: Token | Currency, owner?: string, spender?: string): TokenAmount | undefined {
  let address
   if (token instanceof Token) {
    address = (token as Token).address
  }

  const { chainId } = useActiveWeb3React()
  const contract = useTokenContract(address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => {
      if (token instanceof Token) {
        return allowance ? new TokenAmount(token, allowance.toString()) : undefined
      } else {
        if (token instanceof Currency) {
          if (currencyEquals(ETHER, token)) {
            return new TokenAmount(WDEX[chainId], constants.MaxInt256.toString())
          }
        }
      }
    },
    [token, allowance],
  )
}

export default useTokenAllowance
