import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'
import SettingsBase from './SettingsBase'

const GeneralSettings: React.FC = () => {
    const editorContext = useDndEditorContext()
    const id = editorContext.template.id
    const settings = editorContext.template.settings?.filter((s) => s.type === 'generalSettings')
    const values = editorContext.state.entities[id]?.values ?? {}

    return (
        <SettingsBase
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={id}
        />
    )
}

export default GeneralSettings
