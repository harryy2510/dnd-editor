import { WysiwygEditor, WysiwygEditorProps } from '@harryy/wysiwyg-editor'
import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'

interface Props extends Omit<WysiwygEditorProps, 'value' | 'onChange'> {
    value?: string
    onChange?: (text: string) => void
}

const Editor: React.FC<Props> = ({ value, onChange }) => {
    const { smartyTags } = useDndEditorContext()
    const suggestions = React.useRef(Object.keys(smartyTags ?? {}).map((key) => `{{${key}}}`))
        .current
    return <WysiwygEditor suggestions={suggestions} value={value} onChange={onChange} />
}

export default Editor
