import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Size: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Size</Trans>} {...props} />
}

export default Size
