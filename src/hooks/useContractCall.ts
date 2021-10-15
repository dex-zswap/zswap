import { useState, useEffect, useMemo } from 'react'

import useRefresh from 'hooks/useRefresh'
import { Contract } from '@ethersproject/contracts'

export function useContractCall(
  contract: Contract | null | any,
  methodName: string,
  inputs: Array<unknown> = [],
  reload: boolean = true,
) {
  const { fastRefresh } = useRefresh()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(
    () => {
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
          setError(() => error)
          setLoading(() => false)
        }
      }

      call()
    },
    reload ? [fastRefresh, ...inputs] : [...inputs],
  )

  return useMemo(() => {
    return {
      result,
      loading,
      error,
    }
  }, [result, loading, error])
}

export function useContractCalls(
  contract: Contract | null | any,
  methodName: string,
  inputs: Array<Array<unknown>> = [],
) {
  const [result, setResult] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const call = async () => {
      const method = contract?.[methodName]
      if (typeof method !== 'function') {
        throw new Error(`contract.${methodName} is not a function!`)
      }
      const callQueue = inputs.map((input) => method(...input))
      try {
        setLoading(true)
        const res = await Promise.all(callQueue)
        setResult(() => res)
        setLoading(false)
      } catch (e) {
        setError(() => error)
        setLoading(false)
      }
    }

    call()
  }, [])

  return {
    result,
    loading,
    error,
  }
}
