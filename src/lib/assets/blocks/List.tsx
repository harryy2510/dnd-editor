import { Trans } from '@lingui/macro'
import { merge } from 'lodash-es'
import React from 'react'
import { DndBlockItem } from '../../types'
import Text from '../components/Text'

export default {
    id: 'list',
    label: <Trans>List</Trans>,
    render: (renderProps) => Text.render(renderProps, 'list-1'),
    export: (renderProps) => Text.export(renderProps, 'list-1'),
    image:
        'data:image/png;base64,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',
    initialValues: {
        'list-1': merge({}, Text.initialValues, {
            label: `
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ol>
            `
        })
    },
    parent: 'basic-elements',
    settings: [
        {
            id: 'list-1',
            label: <Trans>List - 1</Trans>,
            type: 'text',
            settings: Text.settings
        }
    ],
    type: 'block'
} as DndBlockItem
