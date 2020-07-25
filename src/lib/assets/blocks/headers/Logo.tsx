import { Trans } from '@lingui/macro'
import { merge } from 'lodash-es'
import React from 'react'
import { DndBlockItem } from '../../../types'
import Image from '../../components/Image'

export default {
    id: 'logo',
    label: <Trans>Logo</Trans>,
    render: (renderProps) => Image.render(renderProps, 'image-1'),
    export: (renderProps) => Image.export(renderProps, 'image-1'),
    image:
        'data:image/png;base64,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',
    initialValues: {
        'image-1': merge({}, Image.initialValues, {
            label: 'Logo',
            url: 'http://placehold.jp/72/ccc/444/320x320.png?text=Logo',
            style: {
                width: 'auto',
                height: '80px'
            }
        }),
        __container: {
            style: {
                justifyContent: 'flex-start'
            }
        }
    },
    parent: 'header',
    settings: [
        {
            id: 'image-1',
            label: <Trans>Logo - 1</Trans>,
            type: 'image',
            settings: Image.settings
        }
    ],
    type: 'block'
} as DndBlockItem
