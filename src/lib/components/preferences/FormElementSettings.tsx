import React from 'react'
import Container from '../../assets/Container'
import { useDndEditorContext } from '../../DndEditorProvider'
import SettingsBase from './SettingsBase'

interface Props {
    expanded: string
    setExpanded: React.Dispatch<React.SetStateAction<string>>
    showContainerTab: boolean
}

const FormElementsSettings: React.FC<Props> = (props) => {
    const editorContext = useDndEditorContext()
    const activeItem = editorContext.active
        ? editorContext.itemsMap[editorContext.state.entities[editorContext.active].parent.id]
        : null
    if (!activeItem || !editorContext.active) {
        return null
    }
    const settings = [
        ...(activeItem.settings?.filter((s) => s.type === 'form-elements') ?? []),
        ...(!props.showContainerTab && Container.settings ? Container.settings : [])
    ]
    const values = editorContext.state.entities[editorContext.active]?.values ?? {}

    return (
        <SettingsBase
            {...props}
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={editorContext.active}
        />
    )
}

export default FormElementsSettings
