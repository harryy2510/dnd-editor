import React from 'react'
import ToggleSwitch, { ToggleSwitchProps } from '../components/ToggleSwitch'

const LabeledSwitch: React.FC<ToggleSwitchProps> = (props) => {
    return <ToggleSwitch {...props} />
}

export default LabeledSwitch
