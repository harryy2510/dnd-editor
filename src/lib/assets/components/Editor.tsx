import { StringMap } from 'quill'
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import './Editor.scss'

const defaultModules: StringMap = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', { list: 'ordered' }, { list: 'bullet' }, 'clean']
    ]
}

const defaultFormats: string[] = ['bold', 'italic', 'underline', 'strike', 'list', 'bullet']

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
