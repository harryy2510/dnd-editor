import { keyBy } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import * as Blocks from './assets/blocks'
import FormElement from './assets/blocks/FormElement'
import * as Groups from './assets/groups'
import * as Templates from './assets/templates'
import FormRenderer, { FormRendererProps } from './components/FormRenderer'
import DndEditorProvider from './DndEditorProvider'
import { DndEditorContextProps, DndState } from './types'

export interface RendererProps extends FormRendererProps {
    state: DndState
    smartyTags?: Record<string, string>
    sampleData?: any
    template?: any
    items?: any[]
    initialValues: any
}

const Renderer: React.FC<RendererProps> = ({
    state: initialState,
    items = [],
    smartyTags,
    sampleData,
    template,
    ...props
}) => {
    const [state, setState] = useState(initialState)
    useEffect(() => {
        setState(initialState)
    }, [initialState])
    const itemsMap = { ...React.useMemo(() => keyBy(items, 'id'), [items]), element: FormElement }
    const editorContextProps: DndEditorContextProps = {
        active: null,
        onActiveChange: () => {},
        template,
        itemsMap,
        setState,
        state,
        items,
        smartyTags,
        sampleData,
        buildermode: false
    }
    return (
        <DndEditorProvider {...editorContextProps}>
            <FormRenderer {...props} />
        </DndEditorProvider>
    )
}
Renderer.defaultProps = {
    items: [...Object.values(Groups), ...Object.values(Blocks)],
    template: Templates.Form
}
export default Renderer
