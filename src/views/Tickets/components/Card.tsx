import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Flex, HelpIcon, Text, useTooltip } from 'zswap-uikit'

interface cardProps {
  width?: string
  title: string
  subTitle?: string
  rightContent?: React.ReactNode
  back?: () => void
  qa?: string
}

const CardWrap = styled.div<{ width?: string | number }>`
  width: ${({ width }) => width || '850px'};
  min-height: 328px;
  padding: 25px 30px;
  margin: auto;
  background: #2d2d2d;
  box-shadow: 0px 0px 32px 0px rgba(19, 53, 93, 0.51);
  border-radius: 30px;
`

const Card: React.FC<cardProps> = ({ width, title, subTitle, rightContent, children, back, qa = '' }) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t(qa), {
    placement: 'top',
    trigger: 'hover',
  })

  return (
    <CardWrap width={width}>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          {back && (
            <Button padding="0" mr="10px" variant="text" onClick={back}>
              <ArrowBackIcon color="text" />
            </Button>
          )}
          <Text fontSize="16px" bold>
            {title}
          </Text>
        </Flex>
        <Flex alignItems="center">
          {subTitle && (
            <Text fontSize="16px" bold>
              {subTitle}
            </Text>
          )}
          {qa && (
            <>
              {tooltipVisible && tooltip}
              <div ref={targetRef}>
                <HelpIcon cursor="pointer" width="18px" ml="5px" />
              </div>
            </>
          )}
          {rightContent && rightContent}
        </Flex>
      </Flex>
      {children}
    </CardWrap>
  )
}

export default Card
