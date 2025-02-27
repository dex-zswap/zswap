import { useEffect } from 'react'
import { useCakeBusdPrice } from 'hooks/useZUSDPrice'

const useGetDocumentTitlePrice = () => {
  const cakePriceBusd = useCakeBusdPrice()
  useEffect(() => {
    const cakePriceBusdString = cakePriceBusd ? cakePriceBusd.toFixed(2) : ''
    document.title = `ZSwap - ${cakePriceBusdString}`
  }, [cakePriceBusd])
}
export default useGetDocumentTitlePrice
