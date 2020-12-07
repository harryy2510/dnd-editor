import { Trans } from '@lingui/macro'
import React from 'react'
import { InputProps } from '@material-ui/core'
import LabeledTextInput from './LabeledTextInput'
import { StringFormValue } from '../../../types'

export type InputOption = {
    key: string
    label: string
    value: StringFormValue
}
export interface OptionsProps extends Omit<InputProps, 'value' | 'onChange'> {
    value: InputOption[]
    onChange: (value: InputOption[]) => void
}
const InputOptions: React.FC<OptionsProps> = ({ onChange, value }) => {
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
