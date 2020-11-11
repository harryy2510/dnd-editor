import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        return (
            <FormControl
                fullWidth
                variant="outlined"
                style={{ textAlign: 'left' }}
                onClick={handleClick}
                disabled
            >
                <InputLabel id="demo-simple-select-outlined-label">{labelText}</InputLabel>
                <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value=""
                    label={labelText}
                >
                    {state?.options?.map((option: string) => (
                        <MenuItem value={option}>{option}</MenuItem>
                    ))}
                </Select>
                <FormHelperText id="my-helper-text">{state?.hint}</FormHelperText>
            </FormControl>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        return ''
    },
    initialValues: {
        question: 'Question',
        placeholder: 'Placeholder',
        hint: 'Optional Hint',
        validation: { type: 'none' },
        multiline: { type: 'none' },
        characterLimit: '12',
        pii: '',
        defaultValue: 'Option 1',
        options: ['Option 1', 'Option 2'],
        className: '',
        required: true,
        enabled: true,
        style: {
            textAlign: 'left'
        }
    },
    settings: [
        { id: 'question', type: 'labeledTextInput', grid: 12, label: <Trans>Question</Trans> },
        {
            id: 'placeholder',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Custom Placeholder</Trans>
        },
        { id: 'hint', type: 'labeledTextInput', grid: 12, label: <Trans>Hint</Trans> },
        {
            id: 'characterLimit',
            type: 'labeledNumberInput',
            grid: 12,
            label: <Trans>Character limit</Trans>
        },
        { id: 'pii', type: 'labeledTextInput', grid: 12, label: <Trans>PII</Trans> },
        {
            id: 'defaultValue',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Default value</Trans>
        },
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        {
            id: 'validation',
            type: 'validation',
            grid: 12,
            label: <Trans>Validation</Trans>
        },
        { id: 'options', type: 'inputOptions', grid: 12, label: <Trans>Options</Trans> },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ]
} as DndComponentItem
