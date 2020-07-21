import { GridSize, SvgIconProps } from '@material-ui/core'
import React from 'react'

export type Primitive = string | boolean | number
export type DeviceType = 'laptop' | 'tablet' | 'mobile'
export type SettingItemType =
    | 'text'
    | 'image'
    | 'button'
    | 'backgroundColor'
    | 'backgroundImage'
    | 'generalSettings'

export type SettingComponentType =
    | 'backgroundColor'
    | 'border'
    | 'borderColor'
    | 'borderRadius'
    | 'buttonAlign'
    | 'buttonType'
    | 'fontColor'
    | 'fontFamily'
    | 'fontWeight'
    | 'height'
    | 'linkColor'
    | 'padding'
    | 'size'
    | 'space'
    | 'spacing'
    | 'textAlign'
    | 'width'

export interface Device {
    type: DeviceType
    label: React.ReactElement
    icon: React.ComponentType<SvgIconProps>
}

export type InitialValues = {
    label?: string
    style?: {
        container?: React.CSSProperties
        content?: React.CSSProperties
    } & {
        [key: string]: React.CSSProperties
    }
}

export type DndStateItem = {
    id: string
    parent: {
        id: string
        type: DndItem['type'] | DndTemplateItem['type']
    }
    values: InitialValues & {
        [key: string]: InitialValues
    }
}

export type DndComponentSetting = {
    type: SettingComponentType
    grid?: GridSize
    id: string
}

export type DndItemSetting = {
    id: string
    label: React.ReactNode
    type: SettingItemType
    settings?: DndComponentSetting[]
}

export type DndComponentItem = {
    render: (renderProps: RenderProps, id?: string) => React.ReactNode
    export: (renderProps: RenderProps, id?: string) => string
    initialValues?: DndStateItem['values']
    settings?: DndComponentSetting[]
}

export type DndBaseItem = {
    render: (renderProps: RenderProps, children?: React.ReactNode) => React.ReactNode
    export: (renderProps: RenderProps, children?: string) => string
    id: string
    label: React.ReactNode
    priority?: number
    initialValues?: DndStateItem['values']
    settings?: DndItemSetting[]
}
export type DndLayoutItem = DndBaseItem & {
    type: 'layout'
    component: React.ReactNode
}
export type DndGroupItem = DndBaseItem & {
    type: 'group'
    icon: React.ComponentType<SvgIconProps>
}
export type DndBlockItem = DndBaseItem & {
    type: 'block'
    parent: string
    image: string
}
export type DndItem = DndLayoutItem | DndGroupItem | DndBlockItem

export type DndTemplateItem = Omit<DndBaseItem, 'label'> & {
    type: 'template'
}

export interface DndStateItemEntity {
    id: string
    items?: DndStateItemEntity[][]
    layoutId?: string
}
export interface DndState {
    items: DndStateItemEntity[]
    entities: Record<string, DndStateItem>
}

export interface DndEditorContextProps {
    setState: React.Dispatch<React.SetStateAction<DndState>>
    state: DndState

    template: DndTemplateItem
    itemsMap: Record<string, DndItem>
    items: DndItem[]
    active: string | null
    onActiveChange: React.Dispatch<React.SetStateAction<string | null>>
}

export type RenderProps = DndEditorContextProps & {
    item?: DndStateItemEntity
}
