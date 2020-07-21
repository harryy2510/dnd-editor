import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Spacing: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Spacing</Trans>} {...props} />
}

export default Spacing
