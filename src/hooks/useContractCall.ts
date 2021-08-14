import { useState, useEffect, useMemo, useCallback } from 'react'

import { Contract } from '@ethersproject/contracts'

export function useContractCall(contract: Contract | null, methodName: string, inputs: Array<unknown> = []) {
  const [ result, setResult ] = useState(null)
  const [ error, setError ] = useState(false)
  const [ loading, setLoading] = useState(false)

  const call = useCallback(() => {
    const method = contract?.[methodName]
    if (typeof method === 'function') {
      setLoading(true)
      method(...inputs).then((result) => {
        setResult(result)
        setLoading(false)
      }, (error) => {
        setError(error)
        setLoading(false)
      }).catch((error) => {
        setError(error)
        setLoading(false)
      })
    }
  }, [contract, methodName, inputs])

  useEffect(() => {
    call()
  }, [])

  return useMemo(() => {
    return {
      result, loading, error
    }
  }, [result, loading, error])
}
