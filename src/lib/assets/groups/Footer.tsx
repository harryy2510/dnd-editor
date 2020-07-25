import { Trans } from '@lingui/macro'
import { ListOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'footer',
    type: 'group',
    icon: ListOutlined,
    label: <Trans>Footer</Trans>,
    priority: 6
} as DndGroupItem
