import React from 'react'
import PubSub from '@harryy/pubsub'
import { DndComponentItem, RenderProps } from '../../types'
import { updateItem } from '../../utils'
import Input from '../../components/preferences/components/Input'
import Label from '../../components/preferences/components/Label'
import { FormHelperText } from '@material-ui/core'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const handleChange = (value: string) =>
            updateItem(renderProps, renderProps.item!.id, { [`${id}.label`]: value })
        const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const props = state?.url ? { href: state.url } : {}
        return (
            <a
                id={`${renderProps.item.id}-${id}`}
                onClick={handleClick}
                style={state?.style}
                {...props}
            >
                <Input label={<Label>{state?.question} {state?.required ? '*' : ''}</Label>} value='' placeholder={state?.placeholder} onChange={() => {}} aria-describedby='helper-text'></Input>
        <FormHelperText id="helper-text">{state?.hint}</FormHelperText>
            </a>
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
        {id: 'question', type: 'question', grid: 12},
        {id: 'placeholder', type: 'placeholder', grid: 12},
        {id: 'hint', type: 'hint', grid: 12},
        {id: 'required', type: 'required', grid: 12}
    ]
} as DndComponentItem
