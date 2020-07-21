import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Border: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Border</Trans>} {...props} />
}

export default Border
