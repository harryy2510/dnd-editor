import { Trans } from '@lingui/macro'
import React from 'react'
import Colorpicker, { ColorpickerProps } from '../components/Colorpicker'

const BackgroundColor: React.FC<ColorpickerProps> = (props) => {
    return <Colorpicker label={<Trans>Background Color</Trans>} {...props} />
}

export default BackgroundColor
