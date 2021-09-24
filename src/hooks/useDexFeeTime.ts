// WDEXTaxRateStartTime
import { useMemo } from 'react'
import { useFactoryContract } from './useContract'
import { useContractCall } from './useContractCall'

export default function useDexFeeTime() {
  const factory = useFactoryContract()
  const startTime = useContractCall(factory, 'WDEXTaxRateStartTime', [], true)
  const time = useMemo(() => {
    if (!startTime.result) {
      return 0
    }

    console.log('fee startTime: ', Number(startTime.result.toString()) * 1000)

    return Number(startTime.result.toString()) * 1000
  }, [startTime])

  return time
}
