import { Trans } from '@lingui/macro'
import React from 'react'
import { ToggleButtonOption } from '../components/StyledToggleButtons'
import ToggleButtons, { ToggleButtonsProps } from '../components/ToggleButtons'

const ButtonType: React.FC<ToggleButtonsProps> = (props) => {
    const options: ToggleButtonOption[] = [
        {
            label: <Trans>Link</Trans>,
            id: 'link'
        },
        {
            label: <Trans>Button</Trans>,
            id: 'button'
        },
        {
            label: <Trans>Text</Trans>,
            id: 'text'
        }
    ]
    return <ToggleButtons options={options} label={<Trans>Button Type</Trans>} {...props} />
}

export default ButtonType
