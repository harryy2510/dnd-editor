import { Trans } from '@lingui/macro'
import React from 'react'
import Colorpicker, { ColorpickerProps } from '../components/Colorpicker'

const FontColor: React.FC<ColorpickerProps> = (props) => {
    return <Colorpicker label={<Trans>Font Color</Trans>} {...props} />
}

export default FontColor
