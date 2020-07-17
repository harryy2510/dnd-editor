import { Trans } from '@lingui/macro'
import { CodeOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem, RenderProps } from '../../types'
import { updateItem } from '../../utils'

import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'

// @ts-ignore
import FroalaEditorComponent from 'react-froala-wysiwyg'

export default {
    id: 'html',
    type: 'component',
    icon: CodeOutlined,
    label: <Trans>Html</Trans>,
    render: (renderProps: RenderProps) => {
        const config = {
            placeholderText: 'Edit Your Content Here!',
            charCounterCount: false,
            toolbarInline: true
        }
        const stateItem = renderProps.state.entities[renderProps.item.id]
        const handleChange = (newValue: string) => {
            updateItem(renderProps, { html: newValue })
        }
        return (
            <FroalaEditorComponent
                config={config}
                model={stateItem.state?.html}
                onModelChange={handleChange}
                tag="textarea"
            />
        )
    },
    settings: {
        initialValues: {
            html: ''
        },
        items: []
    }
} as DndItem
