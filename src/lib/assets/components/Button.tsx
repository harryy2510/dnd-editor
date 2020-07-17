import { Trans } from '@lingui/macro'
import { RadioButtonCheckedOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'button',
    type: 'component',
    icon: RadioButtonCheckedOutlined,
    label: <Trans>Button</Trans>,
    render: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return (
            <div style={stateItem.state?.containerStyle}>
                <button style={stateItem.state?.style}>{stateItem.state?.label}</button>
            </div>
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                <button style="${styleToCss(stateItem.state?.style)}">
                    ${stateItem.state?.label ?? ''}
                </button>
            </div>
        `
    },
    settings: {
        initialValues: {
            label: 'Click Me!',
            style: {
                border: 'none',
                boxShadow: 'none',
                padding: '8px 16px',
                color: '#ffffff',
                backgroundColor: '#211f1f',
                borderRadius: '4px'
            },
            containerStyle: {
                display: 'flex',
                padding: '4px',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        items: [
            {
                id: 'label',
                type: 'input',
                label: <Trans>Label</Trans>
            },
            {
                id: 'style.color',
                type: 'color',
                label: <Trans>Text Color</Trans>
            },
            {
                id: 'style.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                id: 'style.padding',
                type: 'dropdown',
                label: <Trans>Size</Trans>,
                items: [
                    {
                        label: <Trans>Small</Trans>,
                        value: '4px'
                    },
                    {
                        label: <Trans>Medium</Trans>,
                        value: '8px 16px'
                    },
                    {
                        label: <Trans>Large</Trans>,
                        value: '16px 32px'
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
            },
            {
                id: 'style.borderRadius',
                type: 'dropdown',
                label: <Trans>Border Radius</Trans>,
                items: [
                    {
                        label: <Trans>None</Trans>,
                        value: '0px'
                    },
                    {
                        label: <Trans>Small</Trans>,
                        value: '4px'
                    },
                    {
                        label: <Trans>Medium</Trans>,
                        value: '8px'
                    },
                    {
                        label: <Trans>Large</Trans>,
                        value: '16px'
                    }
                ]
            }
        ]
    }
} as DndItem
