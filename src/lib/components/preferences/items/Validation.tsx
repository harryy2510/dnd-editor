import { Trans } from '@lingui/macro'
import React from 'react'
import Dropdown, { DropdownProps, DropdownOption } from '../components/Dropdown'
import LabeledTextInput from './LabeledTextInput'
import { groupBy } from 'lodash-es'
import { FormValue } from '../../../types'

export interface ValidationValue {
    formValue?: FormValue[]
    key: string
}

export interface ValidationProps extends Omit<DropdownProps, 'value' | 'onChange'> {
    validations: any
    value: ValidationValue
    onChange: (value: ValidationValue) => void
}
const Validation: React.FC<ValidationProps> = ({ validations, onChange, value, ...props }) => {

    const [error, setError] = React.useState(false)
    const [helperText, setHelperText] = React.useState("")
    const selectedValidationType = value.key
    const selectedValidation = validations[selectedValidationType]
    const showInput = selectedValidation.showInput
    const inputString = selectedValidation.toString?.(value.formValue)
    const handleOnChange = (type: any, value = '') => {
        if (!Boolean(value)) {
            const newValidation = validations[type]
            const formValue = newValidation.toFormValue?.(value)
            onChange({
                key: newValidation.id,
                formValue: formValue
            })
        } else {
            setError(false)
            setHelperText("")
            if (type === "MinLength" || "MaxLength") {

                const a: any = value
                if (a > 0 || typeof a === "number" || null) {
                    const newValidation = validations[type]
                    const formValue = newValidation.toFormValue?.(value)
                    
                    onChange({
                        key: newValidation.id,
                        formValue: formValue
                    })

                } else {
                    setError(true)

                    setHelperText("Please enter a number greater than 0")
                }

            } else {
                const newValidation = validations[type]
                const formValue = newValidation.toFormValue?.(value)
                onChange({
                    key: newValidation.id,
                    formValue: formValue
                })
            }
        }
    }
    return (
        <>
            <Dropdown
                label={<Trans>Validation</Trans>}
                value={selectedValidationType}
                onChange={handleOnChange}
                {...props}
                options={Object.values(validations) as DropdownOption[]}
            />
            {showInput && (
                <LabeledTextInput
                    label={<Trans>Validation value</Trans>}
                    value={inputString || ''}
                    error={error}
                    helperText={error ? helperText : null}
                    onChange={(inputValue) => handleOnChange(value.key, inputValue as string)}
                ></LabeledTextInput>
            )
            }
        </>
    )
}

export default Validation
