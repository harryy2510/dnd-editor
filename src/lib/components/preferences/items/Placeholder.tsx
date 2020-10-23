import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Placeholder: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Placeholder</Trans>} type="text" {...props} />
}

export default Placeholder
