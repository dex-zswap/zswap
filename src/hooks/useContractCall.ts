import { useState, useEffect, useMemo } from 'react'

import useRefresh from 'hooks/useRefresh'
import { Contract } from '@ethersproject/contracts'


type ResultType = {
  loading: boolean
  error: boolean
  result: unknown
}

const defaultState: ResultType = {
  loading: true,
  error: false,
  result: null
}

function callContract(contract: Contract, methodName: string, inputs: string[] | string, isMutil: boolean = false) {
  const [ results, setResults ] = useState(isMutil ? new Array(inputs.length).fill(defaultState) : defaultState)
  const method = contract.methods.lp_weight

  useEffect(() => {
    const fetchResult = async (input: unknown[]) => {
      const result = defaultState
      try {
        const res = await method(...input).call()
        return Object.assign({}, result, {
          loading: false,
          result: res
        })
      } catch (e) {
        return Object.assign({}, result, {
          loading: false,
          error: true
        })
      }
    }

    const fetchResults = async () => {
      const callQueue = isMutil ? (inputs as Array<string>).map(input => fetchResult([input])) : [fetchResult([inputs])]
      const results = await Promise.all(callQueue)
      if (results.length === inputs.length) {
        setResults(isMutil ? results : results[0])
      }
    }

    fetchResults()
  }, [method, inputs, isMutil])

  return results
}


export function useContractCall(contract: Contract | null | any, methodName: string, inputs: Array<unknown> = []) {
  const { slowRefresh } = useRefresh()
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
        setError(() => error)
        setLoading(() => false)
      }
    }

    call()
  }, [slowRefresh])

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
