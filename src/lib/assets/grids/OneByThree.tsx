import { range } from 'lodash-es'
import React from 'react'
import { DndItem } from '../../types'
import ContentBase from './GridBase'

const looper = range(3)

export default ContentBase('oneByThree', looper) as DndItem
