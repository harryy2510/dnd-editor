import { Trans } from '@lingui/macro'
import React from 'react'
import { DndTemplateItem } from '../../types'

export default {
    id: 'mail',
    type: 'template',
    render: (renderProps, children) => {
        const stateItem = renderProps.state.entities.mail
        return (
            <div style={stateItem.values?.generalSettings?.style?.container}>
                <div style={stateItem.values?.generalSettings?.style?.content}>{children}</div>
            </div>
        )
    },
    export: () => '',
    initialValues: {
        generalSettings: {
            style: {
                container: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    padding: '16px 16px 16px 16px',
                    justifyContent: 'center',
                    boxSizing: 'border-box'
                },
                content: {
                    minHeight: '100%',
                    position: 'relative',
                    width: 600,
                    borderRadius: '0px',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff',
                    fontFamily: 'Poppins, sans-serif',
                    padding: '0px'
                }
            }
        }
    },
    settings: [
        {
            label: <Trans>General Settings</Trans>,
            id: 'generalSettings',
            type: 'generalSettings',
            settings: [
                { id: 'style.content.fontFamily', type: 'fontFamily', grid: 12 },
                { id: 'style.container.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.content.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.content.width', type: 'width', grid: 12 },
                { id: 'style.container.padding', type: 'padding', grid: 12 },
                { id: 'style.content.padding', type: 'padding', grid: 12 },
                { id: 'style.content.borderRadius', type: 'borderRadius', grid: 12 }
            ]
        }
    ]
} as DndTemplateItem
