import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { Flex, Text } from 'zswap-uikit'

const UpgradeWrap = styled(Flex)`
  position: relative;
  margin: auto;

  &::before {
    content: '';
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(150px);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform: translate(-50%, 50%);
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform: translate(50%, -50%);
    z-index: 0;
  }
`

const Upgrade = () => {
  return (
    <Page style={{ display: 'flex' }}>
      <UpgradeWrap flexDirection="column" justifyContent="center" alignItems="center">
        <img width="349px" src="/images/home/upgrade.png" />
        <Text margin="20px auto 100px" fontSize="30px" bold>
          敬请期待
        </Text>
      </UpgradeWrap>
    </Page>
  )
}

export default Upgrade
