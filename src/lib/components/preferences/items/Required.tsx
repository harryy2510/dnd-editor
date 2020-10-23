import { Trans } from '@lingui/macro'
import React from 'react'
import ToggleSwitch, { ToggleSwitchProps } from '../components/ToggleSwitch'

const Required: React.FC<ToggleSwitchProps> = (props) => {
    return <ToggleSwitch label={<Trans>Required</Trans>} {...props} />
}

export default Required
