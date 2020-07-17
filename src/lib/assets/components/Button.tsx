import { Trans } from '@lingui/macro'
import { RadioButtonCheckedOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem, RenderProps } from '../../types'

export default {
    id: 'button',
    type: 'component',
    icon: RadioButtonCheckedOutlined,
    label: <Trans>Button</Trans>,
    render: (renderProps: RenderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return <button style={stateItem.state?.style}>{stateItem.state?.label}</button>
    },
    settings: {
        initialValues: {
            label: 'Click Me!',
            style: {
                padding: '8px 16px'
            }
        },
        items: [
            {
                id: 'label',
                type: 'input',
                label: <Trans>Label</Trans>
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
                id: 'layoutStyle.justifyContent',
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
                id: 'contentStyle.borderRadius',
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
