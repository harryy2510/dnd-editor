import React from 'react'
import Container from '../../assets/Container'
import { useDndEditorContext } from '../../DndEditorProvider'
import SettingsBase from './SettingsBase'
import LabeledTextInput from './items/LabeledTextInput'
import { updateItemName } from '../../utils'
import { Trans } from '@lingui/macro'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import { DndBlockItem } from '../../types'

interface Props {
    expanded: string
    setExpanded: React.Dispatch<React.SetStateAction<string>>
    showContainerTab: boolean
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
    formName: {
        padding: spacing(2)
    }
}))
const FormElementsSettings: React.FC<Props> = (props) => {
    const editorContext = useDndEditorContext()
    const activeItemBlock = editorContext.active
        ? editorContext.itemsMap[editorContext.state.entities[editorContext.active].parent.id]
        : null
    if (!activeItemBlock || !editorContext.active) {
        return null
    }
    const classes = useStyles()
    const activeItem = editorContext.state.entities[editorContext.active]
    const activeItemSettings = !!(activeItemBlock as DndBlockItem).generateSettings
        ? (activeItemBlock as DndBlockItem)?.generateSettings!(editorContext)
        : activeItemBlock?.settings
    const settings = [
        ...(activeItemSettings?.filter((s) => s.type === 'form-elements') ?? []),
        ...(!props.showContainerTab && Container.settings ? Container.settings : [])
    ]
    const values = editorContext.state.entities[editorContext.active]?.values ?? {}

    const blockNameProps = {
        value: activeItem.name,
        onChange: (newValue: any) => updateItemName(editorContext, activeItem.id, newValue),
        label: <Trans>Form element name</Trans>
    }
    console.log(activeItem)

    return (
        <>
            <div key={activeItem.id} className={classes.formName}>
                <LabeledTextInput {...blockNameProps} />
            </div>
            <SettingsBase
                {...props}
                renderProps={editorContext}
                initialValues={values}
                settings={settings}
                id={editorContext.active}
            />
        </>
    )
}

export default FormElementsSettings
