import styled from 'styled-components'
import { Text, Flex } from 'zswap-uikit'

interface cardProps {
  title: string
  subTitle?: string
  width?: string
}

const CardWrap = styled.div<{ width?: string | number }>`
  width: ${({ width }) => width || '750px'};
  min-height: 328px;
  padding: 25px 30px;
  margin: auto;
  background: #2d2d2d;
  box-shadow: 0px 0px 32px 0px rgba(19, 53, 93, 0.51);
  border-radius: 30px;
`

const Card: React.FC<cardProps> = ({ width, title, subTitle, children }) => {
  return (
    <CardWrap width={width}>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Text fontSize="16px" bold>
          {title}
        </Text>
        {subTitle && (
          <Text fontSize="16px" bold>
            {subTitle}
          </Text>
        )}
      </Flex>
      {children}
    </CardWrap>
  )
}

export default Card
