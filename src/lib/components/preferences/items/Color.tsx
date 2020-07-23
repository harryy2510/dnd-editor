import { Trans } from '@lingui/macro'
import React from 'react'
import Colorpicker, { ColorpickerProps } from '../components/Colorpicker'

const Color: React.FC<ColorpickerProps> = (props) => {
    return <Colorpicker label={<Trans>Color</Trans>} {...props} />
}

export default Color
