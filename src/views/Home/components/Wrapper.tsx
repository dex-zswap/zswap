import styled from 'styled-components'
import { Flex } from 'zswap-uikit'

export const Wrap = styled(Flex)`
  width: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-bottom: 160px;
  > div {
    position: relative;
    z-index: 99;
    &:first-child {
      margin-right: 250px;
    }
  }
`

export const ButtonWrap = styled(Flex)`
  align-items: center;
  margin-top: 35px;
  > button:first-child {
    margin-right: 25px;
  }
`

export const TextWrap = styled.div`
  width: 370px;
`
