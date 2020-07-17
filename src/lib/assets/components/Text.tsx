import { Trans } from '@lingui/macro'
import { FormatColorTextOutlined } from '@material-ui/icons'
import React from 'react'
import { DndItem, RenderProps } from '../../types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import './Text.css'
import { styleToCss, updateItem } from '../../utils'

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'clean']
    ]
}

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link'
]

export default {
    id: 'text',
    type: 'component',
    icon: FormatColorTextOutlined,
    label: <Trans>Text</Trans>,
    render: (renderProps: RenderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item.id]
        const handleChange = (newValue: string) => {
            updateItem(renderProps, { text: newValue })
        }
        return (
            <div style={stateItem.state?.containerStyle}>
                <ReactQuill
                    modules={modules}
                    formats={formats}
                    theme="bubble"
                    value={stateItem.state?.text}
                    onBlur={(a, b, c) => handleChange(c.getHTML())}
                />
            </div>
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                ${stateItem.state?.text ?? ''}
            </div>
        `
    },
    settings: {
        initialValues: {
            text: '',
            containerStyle: {
                backgroundColor: '#fff'
            }
        },
        items: [
            {
                id: 'containerStyle.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            }
        ]
    }
} as DndItem
