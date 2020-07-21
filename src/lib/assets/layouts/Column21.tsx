import { Trans } from '@lingui/macro'
import React from 'react'
import { DndItem } from '../../types'
import LayoutBase from './LayoutBase'

export default LayoutBase('column21', <Trans>Column 2:1</Trans>, [2, 1]) as DndItem
