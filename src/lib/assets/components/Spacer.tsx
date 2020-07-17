import { Trans } from '@lingui/macro'
import { VerticalAlignCenterOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'

export default {
    id: 'spacer',
    type: 'component',
    icon: VerticalAlignCenterOutlined,
    label: <Trans>Spacer</Trans>,
    render: () => <div style={{ padding: '16px 0' }} />
} as DndItem
