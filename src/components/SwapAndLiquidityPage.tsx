import styled from 'styled-components'
import Page from 'views/Page'

const SwapAndLiquidityPage = styled(Page)`
  position: relative;

  #swap-currency-input,
  #swap-currency-output {
    background-color: #303030;
    border-radius: 20px;
  }

  &::before {
    content: '';
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    left: 20%;
    top: 30%;
    z-index: 0;
  }

  &::after {
    content: '';
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #f866ff;
    filter: blur(150px);
    position: absolute;
    right: 30%;
    top: 20%;
    z-index: 0;
  }
`

export default SwapAndLiquidityPage
