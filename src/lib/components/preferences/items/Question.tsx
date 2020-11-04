import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Question: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Question</Trans>} type="text" {...props} />
}

export default Question
