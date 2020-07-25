import { Trans } from '@lingui/macro'
import { ImageOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'image',
    type: 'group',
    icon: ImageOutlined,
    label: <Trans>Images</Trans>,
    priority: 5
} as DndGroupItem
