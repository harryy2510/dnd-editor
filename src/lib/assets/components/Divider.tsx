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
            PubSub.publish('component/divider', { type: 'text', data: id })
        }
        return <hr id={`${renderProps.item.id}-${id}`} onClick={handleClick} style={state.style} />
    },
    export: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id].values[id]
        return `<hr style="${styleToCss(state.style)}">`
    },
    initialValues: {
        label: 'Divider',
        style: {
            width: '100%',
            borderColor: 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid'
        }
    },
    settings: [
        { id: 'style.width', type: 'width', grid: 6 },
        { id: 'style.borderWidth', type: 'height', grid: 6 }
    ]
} as DndComponentItem
