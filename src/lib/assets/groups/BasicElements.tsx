import { Trans } from '@lingui/macro'
import { AppsOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'basic-elements',
    type: 'group',
    renderMode: 'container',
    icon: AppsOutlined,
    label: <Trans>Basic Elements</Trans>,
    priority: 1
} as DndGroupItem
