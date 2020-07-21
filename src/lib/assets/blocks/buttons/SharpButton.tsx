import { Trans } from '@lingui/macro'
import { merge } from 'lodash-es'
import React from 'react'
import { DndBlockItem } from '../../../types'
import Button from '../../components/Button'

export default {
    id: 'sharpButton',
    label: <Trans>Sharp Button</Trans>,
    export: (renderProps) => Button.export(renderProps, 'button-1'),
    render: (renderProps) => Button.render(renderProps, 'button-1'),
    image:
        'data:image/png;base64,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',
    initialValues: {
        'button-1': merge({}, Button.initialValues, {
            label: 'Sharp Button',
            style: {
                content: {
                    borderRadius: '0px'
                }
            }
        })
    },
    parent: 'button',
    settings: [
        {
            id: 'button-1',
            label: <Trans>Sharp Button - 1</Trans>,
            type: 'button',
            settings: Button.settings
        }
    ],
    type: 'block'
} as DndBlockItem
