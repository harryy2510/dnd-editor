import { Trans } from '@lingui/macro'
import React from 'react'
import { DndItem } from '../../types'
import LayoutBase from './LayoutBase'

export default LayoutBase('column1', <Trans>Column 1x1</Trans>, [1]) as DndItem
