import styled from 'styled-components'
import Text from '../Text/Text'
import { tags, scales, HeadingProps } from './types'

const style = {
  [scales.MD]: {
    fontSize: '16px',
    fontSizeLg: '20px',
  },
  [scales.LG]: {
    fontSize: '28px',
    fontSizeLg: '24px',
  },
  [scales.XL]: {
    fontSize: '32px',
    fontSizeLg: '40px',
  },
  [scales.XXL]: {
    fontSize: '36px',
    fontSizeLg: '64px',
  },
}

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  display: flex;
  align-items: center;
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`

Heading.defaultProps = {
  as: tags.H2,
}

export default Heading
