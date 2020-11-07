import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { TextField } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import { updateItem } from '../../utils'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const handleChange = (value: string) =>
            updateItem(renderProps, renderProps.item!.id, { [`${id}.label`]: value })
        const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const props = state?.url ? { href: state.url } : {}
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        return (
            <TextField
                id={`${renderProps.item.id}-${id}`}
                onClick={handleClick}
                {...props}
                fullWidth
                label={labelText}
                placeholder={state?.placeholder}
                value={state?.defaultValue}
                helperText={state?.hint}
            />
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
        characterLimit: '12',
        pii: '',
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
            type: 'labeledTextInput',
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
        { id: 'validation', type: 'inputValidation', grid: 12, label: <Trans>Validation</Trans> },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ]
} as DndComponentItem
