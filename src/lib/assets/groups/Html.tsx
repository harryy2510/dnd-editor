import { Trans } from '@lingui/macro'
import { CodeOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'html',
    type: 'group',
    icon: CodeOutlined,
    label: <Trans>Html</Trans>
} as DndGroupItem
