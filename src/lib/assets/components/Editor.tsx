import { StringMap } from 'quill'
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import './Editor.scss'

const defaultModules: StringMap = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'clean']
    ]
}

const defaultFormats: string[] = [
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

interface Props {
    modules?: StringMap
    formats?: string[]
    value?: string
    onChange?: (text: string) => void
}

const Editor: React.FC<Props> = ({
    value,
    onChange,
    formats = defaultFormats,
    modules = defaultModules
}) => {
    const textRef = React.useRef(value ?? '')
    React.useEffect(() => {
        if (value !== textRef.current) {
            onChange?.(textRef.current)
        }
    }, [textRef.current])
    return (
        <ReactQuill
            modules={modules}
            formats={formats}
            theme="bubble"
            value={textRef.current}
            onChange={(newValue) => {
                textRef.current = newValue
            }}
        />
    )
}

export default React.memo(Editor)
