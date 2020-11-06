import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const LabeledTextInput: React.FC<InputProps> = (props) => {
    return <Input type="text" {...props} />
}

export default LabeledTextInput
