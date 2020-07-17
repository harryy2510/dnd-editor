import { Trans } from '@lingui/macro'
import { ImageOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'
import { styleToCss } from '../../utils'

export default {
    id: 'image',
    type: 'component',
    icon: ImageOutlined,
    label: <Trans>Image</Trans>,
    render: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return (
            <div style={stateItem.state?.containerStyle}>
                <img
                    style={stateItem.state?.style}
                    src={stateItem.state?.src}
                    alt={stateItem.state?.alt}
                />
            </div>
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                <img
                    style="${styleToCss(stateItem.state?.style)}"
                    src="${stateItem.state?.src ?? ''}"
                    alt="${stateItem.state?.alt ?? ''}"
                />
            </div>
        `
    },
    settings: {
        initialValues: {
            alt: '',
            src: 'https://picsum.photos/id/237/536/354',
            style: {
                width: '100%'
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
                id: 'alt',
                type: 'input',
                label: <Trans>Alt Text</Trans>
            },
            {
                id: 'src',
                type: 'input',
                label: <Trans>Url</Trans>
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
