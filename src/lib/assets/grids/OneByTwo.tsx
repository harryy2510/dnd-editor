import { range } from 'lodash-es'
import React from 'react'
import { DndItem } from '../../types'
import ContentBase from './GridBase'

const looper = range(2)

export default ContentBase('oneByTwo', looper) as DndItem
