import { Trans } from '@lingui/macro'
import React from 'react'
import Input, { InputProps } from '../components/Input'
import Uploader from '../components/Uploader'

const Image: React.FC<InputProps> = (props) => {
    return (
        <>
            <Uploader {...props} />
            <Input label={<Trans>URL</Trans>} {...props} />
        </>
    )
}

export default Image
