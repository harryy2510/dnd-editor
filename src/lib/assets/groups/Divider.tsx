import { Trans } from '@lingui/macro'
import { RemoveOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'divider',
    icon: RemoveOutlined,
    type: 'group',
    label: <Trans>Dividers</Trans>
} as DndGroupItem
