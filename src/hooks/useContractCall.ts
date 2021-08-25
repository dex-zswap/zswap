import { useState, useEffect, useMemo } from 'react'

import useRefresh from 'hooks/useRefresh'
import { Contract } from '@ethersproject/contracts'

export function useContractCall(contract: Contract | null | any, methodName: string, inputs: Array<unknown> = []) {
  const { fastRefresh } = useRefresh()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const call = async () => {
      const method = contract?.[methodName]
      if (typeof method !== 'function') {
        throw new Error(`contract.${methodName} is not a function!`)
      }
      try {
        setLoading(true)
        const res = await method(...inputs)
        setResult(() => res)
        setLoading(() => false)
      } catch (e) {
        console.error(`call contract.${methodName} throws ${e.message}`)
        setError(() => error)
        setLoading(() => false)
      }
    }

    call()
  }, [fastRefresh])

  return useMemo(() => {
    return {
      result,
      loading,
      error,
    }
  }, [result, loading, error])
}
