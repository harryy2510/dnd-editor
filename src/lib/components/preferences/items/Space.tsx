import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Space: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>Space</Trans>} {...props} />
}

export default Space
