import { Trans } from '@lingui/macro'
import { Assignment } from '@material-ui/icons'
import React from 'react'
import { DndGroupItem } from '../../types'

export default {
    id: 'form-elements',
    type: 'group',
    renderMode: 'hidden',
    icon: Assignment,
    label: <Trans>Form Elements</Trans>,
    priority: 2
} as DndGroupItem
