import { Trans } from '@lingui/macro'
import { ImageOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem } from '../../types'

export default {
    id: 'image',
    type: 'component',
    icon: ImageOutlined,
    label: <Trans>Image</Trans>,
    render: () => <img width="100%" src="https://picsum.photos/id/237/536/354" alt="" />
} as DndItem
