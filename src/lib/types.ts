import { IconProps, Theme } from '@material-ui/core'
import { FormikValues } from 'formik'
import React from 'react'

export type Primitive = string | boolean | number
export type ItemType = 'component' | 'grid' | 'block'
export type RenderProps = DndEditorContextProps & {
    item: DndStateItemEntity
    theme: Theme
}

export interface DndSettingItem {
    label: React.ReactNode
    value: Primitive
}
export type DndBaseSetting = {
    id: string
    label?: React.ReactNode
    placeholder?: string
}
export type DndColorSetting = DndBaseSetting & {
    type: 'color'
}
export type DndInputSetting = DndBaseSetting & {
    type: 'input'
}
export type DndDropdownSetting = DndBaseSetting & {
    type: 'dropdown'
    items: DndSettingItem[]
}
export type DndCheckboxSetting = DndBaseSetting & {
    type: 'checkbox'
}
export type DndRadioSetting = DndBaseSetting & {
    type: 'radio'
    items: DndSettingItem[]
}
export type DndSetting =
    | DndColorSetting
    | DndInputSetting
    | DndDropdownSetting
    | DndCheckboxSetting
    | DndRadioSetting

export interface DndSettingsProps {
    items: DndSetting[]
    initialValues: FormikValues
    validationSchema?: any
}

export interface DndItem {
    id: string
    type: ItemType
    render: (renderProps: RenderProps) => React.ReactNode

    label?: React.ReactNode
    icon?: React.ComponentType<IconProps>
    component?: React.ReactNode

    settings?: DndSettingsProps
    priority?: number
    export?: (renderProps: RenderProps) => string
}

export interface DndLayout {
    id: string
    settings?: DndSettingsProps
}

export interface DndStateLayout {
    id: string
    state?: FormikValues
}

export interface DndTab {
    id: string
    label: React.ReactNode
    component: React.ReactNode
}

export interface DndStateItemEntity {
    id: string
    items?: DndStateItemEntity[][]
}

export interface DndState {
    layout: DndStateLayout
    items: DndStateItemEntity[]
    entities: Record<string, DndStateItem>
}

export interface DndEditorContextProps {
    setState: React.Dispatch<React.SetStateAction<DndState>>
    state: DndState

    layout: DndLayout
    itemsMap: Record<string, DndItem>
    items: DndItem[]
    tabs: DndTab[]
    tab: number
    onTabChange: React.Dispatch<React.SetStateAction<number>>
    active: string | null
    onActiveChange: React.Dispatch<React.SetStateAction<string | null>>
}
export interface DndEditorProps {
    value?: Partial<DndState>
    onChange?: (newValue: DndState) => void
    items?: DndItem[]
    layout?: DndLayout
    tabs?: DndTab[]
}

export interface DndStateItem {
    id: string
    parent: string
    type: ItemType
    gridId?: string
    gridIndex?: number
    state?: FormikValues
    items?: DndStateItem[][]
}

export interface DndPreviewProps {}
export interface DndEditorSettingsProps {}
export interface DndEditorPreviewProps {}
export interface DndEditorPreferenceProps {}
export interface DndEditorContentProps {}
