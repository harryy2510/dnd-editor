import React from 'react'
import PubSub from '../../PubSub'
import { DndComponentItem, RenderProps } from '../../types'
import { styleToCss, updateItem } from '../../utils'
import Editor from './Editor'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        const handleChange = (value: string) =>
            updateItem(renderProps, renderProps.item!.id, { [`${id}.label`]: value })
        const handleClick = () => {
            PubSub.publish('component/click', { type: 'text', data: id })
        }
        return (
            <span id={`${renderProps.item.id}-${id}`} onClick={handleClick} style={state.style}>
                <Editor value={state.label} onChange={handleChange} />
            </span>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        return `
            <span id="${renderProps.item.id}-${id}" style="${styleToCss(state.style)}">
                ${state.label}
            </span>
        `
    },
    initialValues: {
        label: 'Text',
        style: {
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '18px',
            fontWeight: 500,
            letterSpacing: '0px',
            color: '#000'
        }
    },
    settings: [
        { id: 'style.fontSize', type: 'size', grid: 4 },
        { id: 'style.fontFamily', type: 'fontFamily', grid: 8 },
        { id: 'style.lineHeight', type: 'height', grid: 4 },
        { id: 'style.fontWeight', type: 'fontWeight', grid: 8 },
        { id: 'style.letterSpacing', type: 'space', grid: 4 },
        { id: 'style.color', type: 'fontColor', grid: 8 }
    ]
} as DndComponentItem
