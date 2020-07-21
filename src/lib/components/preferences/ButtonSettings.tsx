import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'
import SettingsBase from './SettingsBase'

const ButtonSettings: React.FC = () => {
    const editorContext = useDndEditorContext()
    const activeItem = editorContext.active
        ? editorContext.itemsMap[editorContext.state.entities[editorContext.active].parent.id]
        : null
    if (!activeItem || !editorContext.active) {
        return null
    }
    const settings = activeItem.settings?.filter((s) => s.type === 'button')
    const values = editorContext.state.entities[editorContext.active]?.values ?? {}

    return (
        <SettingsBase
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={editorContext.active}
        />
    )
}

export default ButtonSettings
