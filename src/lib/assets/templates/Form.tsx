import { Trans } from '@lingui/macro'
import React from 'react'
import { DndTemplateItem } from '../../types'

export default {
    id: 'form',
    type: 'template',
    render: (renderProps, children) => {
        const stateItem = renderProps.state.entities.form
        return <div style={stateItem?.values?.container?.style}>{children}</div>
    },
    export: (renderProps, children) => {
        return ''
    },
    initialValues: {
        container: {
            style: {
                backgroundColor: '',
                padding: '0px 0px 0px 0px',
                boxSizing: 'border-box',
                position: 'relative',
                width: '100%',
                borderRadius: '0px'
            }
        }
    },
    settings: [
        {
            label: <Trans>Form Settings</Trans>,
            id: 'container',
            type: 'template',
            settings: [
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.padding', type: 'padding', grid: 12 }
            ]
        }
    ]
} as DndTemplateItem
