import styled from 'styled-components'
import { Link, Button } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const LearMoreBtn = ({ href, ...props }) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="secondary"
      {...props}
      onClick={() => {
        window.open(href)
      }}
    >
      {t('Learn More')}
    </Button>
  )
}

export default LearMoreBtn
