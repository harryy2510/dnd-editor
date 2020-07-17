import { Trans } from '@lingui/macro'
import { CodeOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem, RenderProps } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'html',
    type: 'component',
    icon: CodeOutlined,
    label: <Trans>Html</Trans>,
    render: (renderProps: RenderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item.id]
        return (
            <div
                style={stateItem.state?.containerStyle}
                dangerouslySetInnerHTML={{ __html: stateItem.state?.html }}
            />
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                ${stateItem.state?.html ?? ''}
            </div>
        `
    },
    settings: {
        initialValues: {
            html: '',
            containerStyle: {
                minHeight: '40px',
                backgroundColor: '#fff'
            }
        },
        items: [
            {
                id: 'containerStyle.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                type: 'code',
                id: 'html'
            }
        ]
    }
} as DndItem
