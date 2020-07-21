import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Height: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Height</Trans>} {...props} />
}

export default Height
