import { nanoid } from 'nanoid'
import React from 'react'
import { Mail } from './assets/layouts'
import { DndEditorContextProps } from './types'

export const DndEditorContext = React.createContext<DndEditorContextProps>({
    active: null,
    tabs: [],
    state: {
        entities: {},
        layout: {
            id: nanoid(),
            state: {
                layoutStyle: {},
                contentStyle: {}
            }
        },
        items: []
    },
    layout: Mail,
    items: [],
    itemsMap: {},
    tab: 0,
    onTabChange: () => undefined,
    onActiveChange: () => undefined,
    setState: () => undefined
})

export const useDndEditorContext = () => React.useContext(DndEditorContext)

const DndEditorProvider: React.FC<DndEditorContextProps> = ({ children, ...props }) => {
    return <DndEditorContext.Provider value={props}>{children}</DndEditorContext.Provider>
}

export default DndEditorProvider
