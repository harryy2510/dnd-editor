import { Trans } from '@lingui/macro'
import { RadioButtonCheckedOutlined } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'button',
    type: 'group',
    icon: RadioButtonCheckedOutlined,
    label: <Trans>Buttons</Trans>
} as DndGroupItem
