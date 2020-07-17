import { range } from 'lodash-es'
import React from 'react'
import { DndItem } from '../../types'
import ContentBase from './GridBase'

const looper = range(4)

export default ContentBase('oneByFour', looper) as DndItem
