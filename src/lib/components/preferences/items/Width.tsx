import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Width: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Width</Trans>} {...props} />
}

export default Width
