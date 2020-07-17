import { Trans } from '@lingui/macro'
import DndEditorSettings from '../../components/DndEditorSettings'
import { DndTab } from '../../types'
import React from 'react'

export default {
    id: 'settings',
    component: <DndEditorSettings />,
    label: <Trans>Settings</Trans>
} as DndTab
