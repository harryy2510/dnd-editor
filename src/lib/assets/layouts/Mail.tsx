import { Trans } from '@lingui/macro'
import React from 'react'
import { DndLayout } from '../../types'

export default {
    id: 'mail',
    settings: {
        initialValues: {
            contentStyle: {
                minHeight: '100%',
                width: '100%',
                position: 'relative',
                maxWidth: 600,
                borderRadius: '0px',
                boxSizing: 'border-box'
            },
            layoutStyle: {
                height: '100%',
                width: '100%',
                overflow: 'auto',
                backgroundColor: '#eee',
                display: 'flex',
                padding: '16px',
                justifyContent: 'center',
                boxSizing: 'border-box'
            }
        },
        items: [
            {
                id: 'layoutStyle.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                id: 'layoutStyle.padding',
                type: 'dropdown',
                label: <Trans>Padding</Trans>,
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
} as DndLayout
