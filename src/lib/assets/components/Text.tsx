import React from 'react'
import PubSub from '@harryy/pubsub'
import { DndComponentItem, RenderProps } from '../../types'
import { styleToCss, updateItem } from '../../utils'
import Editor from './Editor'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const handleChange = (value: string) =>
            updateItem(renderProps, renderProps.item!.id, { [`${id}.label`]: value })
        const handleClick = () => {
            PubSub.publish('component/click', { type: 'text', data: id })
        }
        const active = renderProps.active && renderProps.item.id === renderProps.active
        return (
            <div id={`${renderProps.item.id}-${id}`} onClick={handleClick} style={state?.style}>
                <Editor
                    className={active ? 'active' : ''}
                    value={state?.label}
                    onChange={handleChange}
                    readOnly={!renderProps.buildermode}
                />
            </div>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        return `
            <div style="${styleToCss(state?.style)}">
                ${state?.label}
            </div>
        `
    },
    initialValues: {
        label: 'Text',
        style: {
            width: '100%',
            fontSize: '14px',
            fontFamily: '',
            lineHeight: '18px',
            fontWeight: 400,
            letterSpacing: '0px',
            color: ''
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
