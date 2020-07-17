import { Trans } from '@lingui/macro'
import { VerticalAlignCenterOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'spacer',
    type: 'component',
    icon: VerticalAlignCenterOutlined,
    label: <Trans>Spacer</Trans>,
    render: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return <div style={stateItem.state?.style} />
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `<div style="${styleToCss(stateItem.state?.style)}"></div>`
    },
    settings: {
        initialValues: {
            style: {
                width: '100%',
                backgroundColor: '#fff',
                padding: '8px 0'
            }
        },
        items: [
            {
                id: 'style.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                id: 'style.padding',
                type: 'dropdown',
                label: <Trans>Spacing</Trans>,
                items: [
                    {
                        label: <Trans>Small</Trans>,
                        value: '8px 0'
                    },
                    {
                        label: <Trans>Medium</Trans>,
                        value: '16px 0'
                    },
                    {
                        label: <Trans>Large</Trans>,
                        value: '32px 0'
                    }
                ]
            }
        ]
    }
} as DndItem
