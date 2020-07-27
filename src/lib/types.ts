import { GridSize, SvgIconProps } from '@material-ui/core'
import React from 'react'

export type Primitive = string | boolean | number
export type DeviceType = 'laptop' | 'tablet' | 'mobile'
export type SettingItemType = 'text' | 'image' | 'button' | 'container' | 'template'

export type SettingComponentType =
    | 'align'
    | 'backgroundColor'
    | 'border'
    | 'borderColor'
    | 'borderRadius'
    | 'buttonType'
    | 'color'
    | 'fontColor'
    | 'fontFamily'
    | 'fontWeight'
    | 'height'
    | 'image'
    | 'imagePadding'
    | 'linkColor'
    | 'padding'
    | 'size'
    | 'space'
    | 'spacing'
    | 'textAlign'
    | 'url'
    | 'verticalAlign'
    | 'width'

export type ConditionOperator = 'EQUAL' | 'NOT_EQUAL' | 'IN'
export type ConditionType = 'AND' | 'OR'
export type ConditionDisplay = 'ALWAYS' | 'DISPLAY'
export type ConditionRule = {
    id: string
    operator: ConditionOperator
    value: Primitive
}

export interface Condition {
    type: ConditionType
    display: ConditionDisplay
    rules: ConditionRule[]
}

export interface Device {
    type: DeviceType
    label: React.ReactElement
    icon: React.ComponentType<SvgIconProps>
}

export type InitialValues = {
    label?: string
    style?: React.CSSProperties
    [key: string]: any
}

export type DndStateItem = {
    id: string
    parent: {
        id: string
        type: DndItem['type'] | DndTemplateItem['type']
    }
    values: InitialValues
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

export type DndContainerItem = {
    render: (renderProps: RenderProps, children?: React.ReactNode) => React.ReactNode
    export: (renderProps: RenderProps, children?: string) => string
    initialValues: InitialValues
    settings?: DndItemSetting[]
}

export type DndComponentItem = {
    render: (renderProps: RenderProps, id?: string) => React.ReactNode
    export: (renderProps: RenderProps, id?: string) => string
    initialValues?: InitialValues
    settings?: DndComponentSetting[]
}

export type DndBaseItem = {
    render: (renderProps: RenderProps, children?: React.ReactNode) => React.ReactNode
    export: (renderProps: RenderProps, children?: string) => string
    id: string
    label: React.ReactNode
    priority?: number
    initialValues?: InitialValues
    settings?: DndItemSetting[]
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
export type DndItem = DndGroupItem | DndBlockItem

export type DndTemplateItem = Omit<DndBaseItem, 'label'> & {
    type: 'template'
}

export interface DndStateItemEntity {
    id: string
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

    smartyTags?: Record<string, string>
    sampleData?: any
}

export type RenderProps = DndEditorContextProps & {
    item?: DndStateItemEntity
}
