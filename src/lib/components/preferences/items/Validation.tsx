import { Trans } from '@lingui/macro'
import React from 'react'
import Dropdown, { DropdownProps, DropdownOption } from '../components/Dropdown'
import LabeledTextInput from './LabeledTextInput'

export interface ValidationValue {
    type: string
    value?: string
}

export interface ValidationProps extends Omit<DropdownProps, 'value' | 'onChange'> {
    validations: DropdownOption[]
    value: ValidationValue
    onChange: (value: ValidationValue) => void
}
const Validation: React.FC<ValidationProps> = ({ validations, onChange, value, ...props }) => {
    const currentValue = value && value.type
    const handleOnChange = (type: string, value = '') => {
        onChange({ type, value })
    }
    return (
        <>
            <Dropdown
                label={<Trans>Validation</Trans>}
                value={currentValue}
                onChange={handleOnChange}
                {...props}
                options={validations}
            />
            {value.type === 'regex' && (
                <LabeledTextInput
                    label={<Trans>Regex</Trans>}
                    value={value?.value}
                    onChange={(regex) => handleOnChange(value.type, regex)}
                ></LabeledTextInput>
            )}
        </>
    )
}

export default Validation
