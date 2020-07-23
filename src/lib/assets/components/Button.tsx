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
        const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'button', data: id })
        }
        const props = state.url ? { href: state.url } : {}
        return (
            <a
                id={`${renderProps.item.id}-${id}`}
                onClick={handleClick}
                style={state.style}
                {...props}
            >
                <Editor
                    modules={{
                        toolbar: [['bold', 'italic', 'underline', 'strike', 'clean']]
                    }}
                    formats={['bold', 'italic', 'underline', 'strike']}
                    value={state.label}
                    onChange={handleChange}
                />
            </a>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        return `
            <a style="${styleToCss(state.style)}" ${state.url ? 'href="' + state.url + '"' : ''}>
                ${state.label}
            </a>
        `
    },
    initialValues: {
        url: '',
        label: 'Button',
        style: {
            textDecoration: 'none',
            boxShadow: 'none',
            fontSize: '14px',
            fontFamily: '',
            lineHeight: '14px',
            fontWeight: 500,
            letterSpacing: '0px',
            color: '#fff',
            backgroundColor: '#3f51b5',
            borderRadius: '4px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#3f51b5',
            padding: '14px 28px 14px 28px',
            textAlign: 'center'
        }
    },
    settings: [
        { id: 'url', type: 'url', grid: 12 },
        { id: 'style.textAlign', type: 'textAlign', grid: 12 },
        { id: 'style.fontSize', type: 'size', grid: 4 },
        { id: 'style.fontFamily', type: 'fontFamily', grid: 8 },
        { id: 'style.lineHeight', type: 'height', grid: 4 },
        { id: 'style.fontWeight', type: 'fontWeight', grid: 8 },
        { id: 'style.letterSpacing', type: 'space', grid: 4 },
        { id: 'style.color', type: 'fontColor', grid: 8 },
        { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
        { id: 'style.borderRadius', type: 'borderRadius', grid: 12 },
        { id: 'style.borderWidth', type: 'border', grid: 4 },
        { id: 'style.borderColor', type: 'borderColor', grid: 8 },
        { id: 'style.padding', type: 'padding', grid: 12 }
    ]
} as DndComponentItem
