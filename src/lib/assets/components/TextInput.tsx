import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { TextField } from '@material-ui/core'
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
        const props = state?.url ? { href: state.url } : {}
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        return (
            <TextField
                id={`${renderProps.item.id}-${id}`}
                type={state?.inputType || 'text'}
                onClick={handleClick}
                multiline={state?.multiline}
                rows={state?.rows}
                {...props}
                variant="outlined"
                fullWidth
                InputLabelProps={state?.labelProps}
                label={labelText}
                placeholder={state?.placeholder}
                value={state?.defaultValue}
                helperText={state?.hint}
                disabled
            />
        )
    },
    export: () => {
        return ''
    },
    initialValues: {
        question: 'Question',
        placeholder: 'Placeholder',
        hint: 'Optional Hint',
        inputType: 'text',
        multiline: false,
        validation: { type: 'none' },
        characterLimit: '12',
        pii: '',
        className: '',
        required: true,
        enabled: true,
        lableProps: {
            shrink: false
        },
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
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ]
} as DndComponentItem
