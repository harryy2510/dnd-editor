import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'
import SettingsBase from './SettingsBase'

interface Props {
    expanded: string
    setExpanded: React.Dispatch<React.SetStateAction<string>>
}

const TemplateSettings: React.FC<Props> = (props) => {
    const editorContext = useDndEditorContext()
    const id = editorContext.template.id
    const settings = editorContext.template.settings?.filter((s) => s.type === 'template')
    const values = editorContext.state.entities[id]?.values ?? {}

    return (
        <SettingsBase
            {...props}
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={id}
            defaultExpanded
        />
    )
}

export default TemplateSettings
