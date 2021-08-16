import { useState, useEffect, useMemo } from 'react'

import { Contract } from '@ethersproject/contracts'

export function useContractCall(contract: Contract | null, methodName: string, inputs: Array<unknown> = []) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const call = async() => {
      const method = contract?.[methodName]
      try {
        if (typeof method === 'function') {
          setLoading(true)
          const res = await method(...inputs)
          setResult(res)
          setLoading(false)
        }
      } catch (e) {
        setError(error)
        setLoading(false)
      }
    }

    call()
  }, [])

  return useMemo(() => {
    return {
      result,
      loading,
      error,
    }
  }, [result, loading, error])
}
