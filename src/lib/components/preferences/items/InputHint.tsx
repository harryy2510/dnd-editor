import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const InputHint: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Hint</Trans>} type="text" {...props} />
}

export default InputHint
