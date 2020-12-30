import React from 'react'

import { DndEditorContextProps } from './types'
import { createDndState } from './utils'

export const DndEditorContext = React.createContext<DndEditorContextProps>({
    active: null,
    state: createDndState(),
    items: [],
    itemsMap: {},
    onActiveChange: () => undefined,
    setState: () => undefined,
    template: null as any,
    buildermode: false
})

export const useDndEditorContext = () => React.useContext(DndEditorContext)

const DndEditorProvider: React.FC<DndEditorContextProps> = ({ children, ...props }) => {
    return <DndEditorContext.Provider value={props}>{children}</DndEditorContext.Provider>
}

export default DndEditorProvider
