import { range } from 'lodash-es'
import React from 'react'
import { DndItem } from '../../types'
import ContentBase from './GridBase'

const looper = range(1)

export default ContentBase('one', looper) as DndItem
