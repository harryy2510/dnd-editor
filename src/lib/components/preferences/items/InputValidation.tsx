import { Trans } from '@lingui/macro'
import React from 'react'
import { useValidations } from '../../../utils'
import Dropdown, { DropdownProps } from '../components/Dropdown'
import LabeledTextInput from './LabeledTextInput'

export interface ValidationValue {
    type: string
    value?: string
}

export interface ValidationProps extends Omit<DropdownProps, 'value' | 'onChange'> {
    value: ValidationValue
    onChange: (value: ValidationValue) => void
}
const InputValidation: React.FC<ValidationProps> = ({ onChange, value, ...props }) => {
    const { inputValidation } = useValidations()
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
                options={inputValidation}
            />
            {value.type === 'regex' && (
                <LabeledTextInput
                    label={<Trans>Regex</Trans>}
                    value={value?.value || ''}
                    onChange={(regex) => handleOnChange(value.type, regex)}
                ></LabeledTextInput>
            )}
        </>
    )
}

export default InputValidation
