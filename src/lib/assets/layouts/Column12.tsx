import { Trans } from '@lingui/macro'
import React from 'react'
import { DndItem } from '../../types'
import LayoutBase from './LayoutBase'

export default LayoutBase('column12', <Trans>Column 1:2</Trans>, [1, 2]) as DndItem
