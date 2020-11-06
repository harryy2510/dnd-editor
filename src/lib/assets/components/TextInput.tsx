import React from 'react'
import PubSub from '@harryy/pubsub'
import { TextField } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import { updateItem } from '../../utils'
import { Trans } from '@lingui/macro'

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
                value={state?.placeholder}
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
        required: true,
        style: {
            textAlign: 'left'
        }
    },
    settings: [
        { id: 'question', type: 'labledTextInput', grid: 12, label: <Trans>Question</Trans> },
        {
            id: 'placeholder',
            type: 'labledTextInput',
            grid: 12,
            label: <Trans>Custom Placeholder</Trans>
        },
        { id: 'hint', type: 'labledTextInput', grid: 12, label: <Trans>Hint</Trans> },
        { id: 'required', type: 'required', grid: 12 }
    ]
} as DndComponentItem
