import { Trans } from '@lingui/macro'
import React from 'react'
import { InputProps } from '@material-ui/core'
import LabeledTextInput from './LabeledTextInput'

export interface OptionsProps extends Omit<InputProps, 'value' | 'onChange'> {
    value: string[]
    onChange: (value: string[]) => void
}
const InputOptions: React.FC<OptionsProps> = ({ onChange, value, ...props }) => {
    const handleOnChange = (value: string) => {
        onChange(value.split('\n'))
    }
    const inputValue = value && value.join('\n')
    return (
        <LabeledTextInput
            label={<Trans>Options</Trans>}
            value={inputValue}
            multiline={true}
            rowsMax="4"
            onChange={handleOnChange}
            helperText={<Trans>Options should be seperated by new line.</Trans>}
        ></LabeledTextInput>
    )
}

export default InputOptions
