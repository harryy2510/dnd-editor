import { Trans } from '@lingui/macro'
import { RemoveOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'divider',
    icon: RemoveOutlined,
    type: 'group',
    renderMode: 'container',
    label: <Trans>Separator</Trans>,
    priority: 4
} as DndGroupItem
