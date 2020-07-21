import { Trans } from '@lingui/macro'
import React from 'react'
import Colorpicker, { ColorpickerProps } from '../components/Colorpicker'

const LinkColor: React.FC<ColorpickerProps> = (props) => {
    return <Colorpicker label={<Trans>Link Color</Trans>} {...props} />
}

export default LinkColor
