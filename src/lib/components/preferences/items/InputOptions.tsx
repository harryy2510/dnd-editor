import { Trans } from '@lingui/macro'
import React from 'react'
import { InputProps } from '@material-ui/core'
import LabeledTextInput from './LabeledTextInput'

export interface OptionsProps extends Omit<InputProps, 'value' | 'onChange'> {
    value: any[]
    onChange: (value: any[]) => void
}
const InputOptions: React.FC<OptionsProps> = ({ onChange, value, ...props }) => {
    const handleOnChange = (value: any) => {
        onChange(
            value.split('\n').map((option: string) => ({
                key: option.split(' ').join('-').toLowerCase(),
                label: option,
                value: {
                    text: option,
                    valueType: 'String'
                }
            }))
        )
    }
    const inputValue = value && value.map((v) => v.label).join('\n')
    console.log('input options', inputValue, value)
    return (
        <LabeledTextInput
            label={<Trans>Options</Trans>}
            value={inputValue}
            multiline={true}
            rows="4"
            onChange={handleOnChange}
            helperText={<Trans>Options should be seperated by new line.</Trans>}
        ></LabeledTextInput>
    )
}

export default InputOptions
