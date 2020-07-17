import { Trans } from '@lingui/macro'
import { RemoveOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'divider',
    icon: RemoveOutlined,
    type: 'component',
    label: <Trans>Divider</Trans>,
    render: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return (
            <div style={stateItem.state?.containerStyle}>
                <hr style={stateItem.state?.style} />
            </div>
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                <hr style="${styleToCss(stateItem.state?.style)}" />
            </div>
        `
    },
    settings: {
        initialValues: {
            style: {
                width: '100%',
                color: '#211f1f'
            },
            containerStyle: {
                display: 'flex',
                padding: '4px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff'
            }
        },
        items: [
            {
                id: 'style.color',
                type: 'color',
                label: <Trans>Color</Trans>
            },
            {
                id: 'containerStyle.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                id: 'style.width',
                type: 'dropdown',
                label: <Trans>Size</Trans>,
                items: [
                    {
                        label: <Trans>Small</Trans>,
                        value: '50%'
                    },
                    {
                        label: <Trans>Medium</Trans>,
                        value: '75%'
                    },
                    {
                        label: <Trans>Large</Trans>,
                        value: '100%'
                    }
                ]
            },
            {
                id: 'containerStyle.justifyContent',
                type: 'dropdown',
                label: <Trans>Align</Trans>,
                items: [
                    {
                        label: <Trans>Left</Trans>,
                        value: 'flex-start'
                    },
                    {
                        label: <Trans>Center</Trans>,
                        value: 'center'
                    },
                    {
                        label: <Trans>Right</Trans>,
                        value: 'flex-end'
                    }
                ]
            }
        ]
    }
} as DndItem
