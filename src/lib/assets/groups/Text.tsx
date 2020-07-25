import { Trans } from '@lingui/macro'
import { FormatColorTextOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'text',
    type: 'group',
    icon: FormatColorTextOutlined,
    label: <Trans>Text</Trans>,
    priority: 3
} as DndGroupItem
