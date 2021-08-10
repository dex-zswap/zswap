import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'zswap-uikit'
import Page from 'components/Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  )
}

export default PageLoader
