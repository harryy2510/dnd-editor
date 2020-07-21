import { Trans } from '@lingui/macro'
import React from 'react'
import Colorpicker, { ColorpickerProps } from '../components/Colorpicker'

const BorderColor: React.FC<ColorpickerProps> = (props) => {
    return <Colorpicker label={<Trans>Border Color</Trans>} {...props} />
}

export default BorderColor
