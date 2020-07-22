import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'

const Url: React.FC<InputProps> = (props) => {
    return <Input label={<Trans>URL</Trans>} type="url" placeholder="https://..." {...props} />
}

export default Url
