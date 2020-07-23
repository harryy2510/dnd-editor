import { Trans } from '@lingui/macro'
import { ImageAspectRatioOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'header',
    type: 'group',
    icon: ImageAspectRatioOutlined,
    label: <Trans>Headers</Trans>
} as DndGroupItem
