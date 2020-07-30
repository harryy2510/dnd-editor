import React from 'react'
import PubSub from '@harryy/pubsub'
import { DndComponentItem, RenderProps } from '../../types'
import { styleToCss } from '../../utils'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        const handleClick = () => {
            PubSub.publish('component/click', { type: 'image', data: id })
        }
        return (
            <img
                id={`${renderProps.item.id}-${id}`}
                src={state.url}
                onClick={handleClick}
                style={state.style}
                alt=""
            />
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        return `<img src="${state.url ?? ''}"  style="${styleToCss(state.style)}" alt="">`
    },
    initialValues: {
        label: 'Image',
        url: 'http://placehold.jp/24/ccc/444/480x240.png?text=Image',
        style: {
            width: '100%',
            height: 'auto',
            borderRadius: '4px'
        }
    },
    settings: [
        { id: 'url', type: 'image', grid: 12 },
        { id: 'style.width', type: 'width', grid: 6 },
        { id: 'style.height', type: 'height', grid: 6 },
        { id: 'style.borderRadius', type: 'borderRadius', grid: 12 }
    ]
} as DndComponentItem
