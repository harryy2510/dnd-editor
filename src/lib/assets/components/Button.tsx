import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { pick } from 'lodash-es'
import React from 'react'
import { DndComponentItem, RenderProps } from '../../types'
import { styleToCss, updateItem } from '../../utils'
import SimpleInput from './SimpleInput'

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
            PubSub.publish('component/click', { type: 'button', data: id })
        }
        const props = state?.url ? { href: state.url } : {}
        const inputStyles = pick(state?.style, [
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'color',
            'fontFamily'
        ])

        if (state?.outlook) {
            const allStyles = state?.style
            const outerStyles = pick(allStyles, [
                'boxSizing',
                'boxShadow',
                'textAlign',
                'display',
                'backgroundColor',
                'borderRadius',
                'borderWidth',
                'borderStyle',
                'borderColor',
                'width'
            ])
            const innerStyles = pick(allStyles, [
                'boxSizing',
                'textDecoration',
                'fontSize',
                'lineHeight',
                'fontWeight',
                'letterSpacing',
                'color',
                'padding',
                'textAlign',
                'display',
                'width'
            ])

            return (
                <table style={{ display: 'inline-block' }}>
                    <tbody>
                        <tr>
                            <td style={outerStyles}>
                                <a
                                    id={`${renderProps.item.id}-${id}`}
                                    onClick={handleClick}
                                    style={innerStyles}
                                    {...props}
                                >
                                    <SimpleInput
                                        value={state?.label}
                                        onChange={handleChange}
                                        style={inputStyles}
                                    />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        }

        return (
            <a
                id={`${renderProps.item.id}-${id}`}
                onClick={handleClick}
                style={state?.style}
                {...props}
            >
                <SimpleInput value={state?.label} onChange={handleChange} style={inputStyles} />
            </a>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]

        if (state?.outlook) {
            const allStyles = state?.style
            const outerStyles = pick(allStyles, [
                'boxSizing',
                'boxShadow',
                'textAlign',
                'display',
                'backgroundColor',
                'borderRadius',
                'borderWidth',
                'borderStyle',
                'borderColor',
                'width'
            ])
            const innerStyles = pick(allStyles, [
                'boxSizing',
                'textDecoration',
                'fontSize',
                'lineHeight',
                'fontWeight',
                'letterSpacing',
                'color',
                'padding',
                'textAlign',
                'display',
                'width'
            ])
            return `
        <table style="display: inline-block">
            <tbody>
                <tr>
                    <td style="${styleToCss(outerStyles)}">
                        <a style="${styleToCss(innerStyles)}" ${
                state?.url ? 'href="' + state.url + '"' : ''
            }>
                            ${state?.label}
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        `
        }

        return `
            <a style="${styleToCss(state?.style)}" ${state?.url ? 'href="' + state.url + '"' : ''}>
                ${state?.label}
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
            textAlign: 'center',
            display: 'inline-block'
        },
        outlook: false
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
        { id: 'style.padding', type: 'padding', grid: 12 },
        { id: 'style.width', type: 'width', grid: 12 },
        { id: 'outlook', type: 'labeledSwitch', grid: 12, label: <Trans>Outlook</Trans> }
    ]
} as DndComponentItem
