import { Trans } from '@lingui/macro'
import { merge } from 'lodash-es'
import React from 'react'
import { DndBlockItem } from '../../../types'
import Text from '../../components/Text'

export default {
    id: 'title',
    label: <Trans>Title</Trans>,
    render: (renderProps) => Text.render(renderProps, 'title-1'),
    export: (renderProps) => Text.export(renderProps, 'title-1'),
    image:
        'data:image/png;base64,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',
    initialValues: {
        'title-1': merge({}, Text.initialValues, {
            label: 'Title',
            style: {
                fontSize: '24px',
                fontWeight: 600,
                lineHeight: '28px'
            }
        })
    },
    parent: 'text',
    settings: [
        {
            id: 'title-1',
            label: <Trans>Title - 1</Trans>,
            type: 'text',
            settings: Text.settings
        }
    ],
    type: 'block'
} as DndBlockItem
