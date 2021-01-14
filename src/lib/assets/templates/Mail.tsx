import { Trans } from '@lingui/macro'
import React from 'react'
import DndPreview from '../../components/DndPreview'
import { DndTemplateItem } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'mail',
    type: 'template',
    render: (renderProps, children) => {
        const stateItem = renderProps.state.entities.mail
        return (
            <div style={stateItem?.values?.outer?.style}>
                <div style={stateItem?.values?.inner?.style}>{children}</div>
                <DndPreview />
            </div>
        )
    },
    export: (renderProps, children) => {
        const stateItem = renderProps.state.entities.mail
        return `
            <div style="${styleToCss(stateItem?.values?.outer?.style)}">
                <div style="${styleToCss(stateItem?.values?.inner?.style)}">
                    ${children}
                     {% if branding %}
                        {{footer}}
                     {% endif %}
                </div>
            </div>
        `
    },
    initialValues: {
        outer: {
            style: {
                backgroundColor: '#eee',
                padding: '16px 0px 16px 0px',
                boxSizing: 'border-box'
            }
        },
        inner: {
            style: {
                position: 'relative',
                width: 600,
                borderRadius: '0px',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                fontFamily: 'Poppins, sans-serif',
                padding: '0px 0px 0px 0px',
                color: '#000',
                margin: 'auto'
            }
        }
    },
    settings: [
        {
            label: <Trans>Outer Container</Trans>,
            id: 'outer',
            type: 'template',
            settings: [
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.padding', type: 'padding', grid: 12 }
            ]
        },
        {
            label: <Trans>Inner Container</Trans>,
            id: 'inner',
            type: 'template',
            settings: [
                { id: 'style.fontFamily', type: 'fontFamily', grid: 12 },
                { id: 'style.color', type: 'fontColor', grid: 12 },
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.padding', type: 'padding', grid: 12 },
                { id: 'style.borderRadius', type: 'borderRadius', grid: 12 }
            ]
        }
    ]
} as DndTemplateItem
