import { Trans } from '@lingui/macro'
import React from 'react'
import { DndBlockItem } from '../../types'
import { getFormikKey } from '../../utils'
import TextInput from '../components/TextInput'
import { TextFields } from '@material-ui/icons'

export default {
    id: 'multiline',
    label: <Trans>Multiline Input</Trans>,
    icon: TextFields,
    parent: 'form-elements',
    render: (renderProps) =>
        TextInput.render(renderProps, 'multiline-1', getFormikKey(renderProps, 'multiline-1')),
    export: () => '',
    image:
        'data:image/png;base64,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',
    initialValues: {
        'multiline-1': { ...TextInput.initialValues, multiline: true, rows: 5 }
    },
    settings: [
        {
            id: 'multiline-1',
            label: <Trans>Multiline Input</Trans>,
            type: 'form-elements',
            settings: TextInput.settings || []
        }
    ],
    type: 'block'
} as DndBlockItem
