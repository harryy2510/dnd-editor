import React from 'react'
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
        return (
            <div style={state.style?.container}>
                <button style={state.style?.content}>
                    <Editor value={state.label} onChange={handleChange} />
                </button>
            </div>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        return `
            <div style="${styleToCss(state.style?.container)}">
                <button style="${state.style?.content}">
                    ${state.label}
                </button>
            </div>
        `
    },
    initialValues: {
        label: 'Button',
        style: {
            container: {
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            content: {
                boxShadow: 'none',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                lineHeight: '',
                fontWeight: 500,
                letterSpacing: '',
                color: '#fff',
                backgroundColor: '#3f51b5',
                borderRadius: '4px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#3f51b5',
                padding: '14px 28px 14px 28px'
            }
        }
    },
    settings: [
        { id: 'buttonType', type: 'buttonType', grid: 12 },
        { id: 'style.content.fontSize', type: 'size', grid: 4 },
        { id: 'style.content.fontFamily', type: 'fontFamily', grid: 8 },
        { id: 'style.content.lineHeight', type: 'height', grid: 4 },
        { id: 'style.content.fontWeight', type: 'fontWeight', grid: 8 },
        { id: 'style.content.letterSpacing', type: 'space', grid: 4 },
        { id: 'style.content.color', type: 'fontColor', grid: 8 },
        { id: 'style.container.justifyContent', type: 'buttonAlign', grid: 12 },
        { id: 'style.content.backgroundColor', type: 'backgroundColor', grid: 12 },
        { id: 'style.content.borderRadius', type: 'borderRadius', grid: 12 },
        { id: 'style.content.borderWidth', type: 'border', grid: 4 },
        { id: 'style.content.borderColor', type: 'borderColor', grid: 8 },
        { id: 'style.content.padding', type: 'padding', grid: 12 }
    ]
} as DndComponentItem
