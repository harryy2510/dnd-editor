import { Trans } from '@lingui/macro'
import React from 'react'
import PubSub from '@harryy/pubsub'
import { DndContainerItem, RenderProps } from '../types'
import { styleToCss } from '../utils'

export default {
    render: (renderProps: RenderProps, children: React.ReactNode) => {
        if (!renderProps.item) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.__container

        const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
            if (ev.currentTarget === ev.target) {
                PubSub.publish('component/click', { type: 'container', data: '__container' })
            }
        }
        const modifiedStyle = {
            ...state.style,
            ...(state.style.backgroundImage
                ? { backgroundImage: `url(${state.style.backgroundImage})` }
                : {})
        }
        return (
            <div onClick={handleClick} style={modifiedStyle}>
                {children}
            </div>
        )
    },
    export: (renderProps: RenderProps, children: string) => {
        if (!renderProps.item) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.__container
        const modifiedStyle = {
            ...state.style,
            ...(state.style.backgroundImage
                ? { backgroundImage: `url(${state.style.backgroundImage})` }
                : {})
        }
        return `
            <div style="${styleToCss(modifiedStyle)}">
                ${children}
            </div>
        `
    },
    initialValues: {
        style: {
            padding: '24px 24px 24px 24px',
            backgroundColor: '',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            width: '100%'
        }
    },
    settings: [
        {
            id: '__container',
            settings: [
                { id: 'style.backgroundImage', type: 'image', grid: 12 },
                { id: 'style.padding', type: 'imagePadding', grid: 12 },
                { id: 'style.justifyContent', type: 'align', grid: 12 },
                { id: 'style.alignItems', type: 'verticalAlign', grid: 12 },
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 }
            ],
            label: <Trans>Container</Trans>,
            type: 'container'
        }
    ]
} as DndContainerItem
