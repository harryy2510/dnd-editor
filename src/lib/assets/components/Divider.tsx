import { Trans } from '@lingui/macro'
import { Divider } from '@material-ui/core'
import { RemoveOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'

export default {
    id: 'divider',
    icon: RemoveOutlined,
    type: 'component',
    label: <Trans>Divider</Trans>,
    render: () => <Divider />
} as DndItem
