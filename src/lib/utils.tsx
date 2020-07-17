import { FormikValues } from 'formik'
import { merge, omitBy } from 'lodash-es'
import { nanoid } from 'nanoid'
import React from 'react'
import { DndItem, DndState, DndStateItemEntity, DndStateLayout, RenderProps } from './types'
import DndItemPreview from './components/DndItemPreview'
// @ts-ignore
import reactToCSS from 'react-style-object-to-css'

export const removeItem = (renderProps: RenderProps, id: string) => {
    renderProps.onActiveChange(null)
    renderProps.onTabChange(0)
    const stateItem = renderProps.state.entities[id]
    renderProps.setState((existingState) => {
        const updatedEntities = omitBy(existingState.entities, (e, i) => i === id)
        const updatedItems = stateItem.gridId
            ? existingState.items.map((item) => ({
                  ...item,
                  items: item.items?.map((child) => child.filter((ch) => ch.id !== id))
              }))
            : existingState.items.filter((item) => item.id !== id)
        return {
            ...existingState,
            items: updatedItems,
            entities: updatedEntities
        }
    })
}

export const updateItem = (renderProps: RenderProps, update: FormikValues) => {
    renderProps.setState((existingState) => {
        return {
            ...existingState,
            entities: {
                ...existingState.entities,
                [renderProps.item.id]: {
                    ...existingState.entities[renderProps.item.id],
                    state: merge({}, existingState.entities[renderProps.item.id].state, update)
                }
            }
        }
    })
}

export const setList = (
    renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity },
    gridIndex?: number,
    gridId?: string
) => (newState: DndStateItemEntity[]) => {
    const rawItemIndex = newState.findIndex((item) => Boolean(((item as unknown) as DndItem).type))
    const updatedNewState = [...newState]
    const updatedNewEntities = {
        ...renderProps.state.entities
    }
    if (rawItemIndex > -1) {
        const rawItem = (newState[rawItemIndex] as unknown) as DndItem
        const id = nanoid()
        updatedNewState[rawItemIndex] = {
            id
        }
        updatedNewEntities[id] = {
            id,
            parent: rawItem.id,
            type: rawItem.type,
            state: rawItem.settings?.initialValues ?? {},
            gridIndex,
            gridId
        }
    }
    if (typeof gridIndex !== 'undefined') {
        const updatedState = renderProps.state.items.map((st) => {
            if (st.id === renderProps.item?.id) {
                if (!st.items) {
                    st.items = []
                }
                st.items[gridIndex] = updatedNewState
            }
            return st
        })
        renderProps.setState({
            ...renderProps.state,
            entities: updatedNewEntities,
            items: updatedState
        })
    } else {
        renderProps.setState({
            ...renderProps.state,
            entities: updatedNewEntities,
            items: updatedNewState
        })
    }
}

export const renderItems = (
    items: DndStateItemEntity[] = [],
    renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
) =>
    items?.map((item) => {
        const updatedRenderProps = { ...renderProps, item }
        const stateItem = renderProps.state.entities[item.id]
        return (
            <div key={item.id}>
                <DndItemPreview {...updatedRenderProps}>
                    {renderProps.itemsMap[stateItem.parent]?.render?.(updatedRenderProps)}
                </DndItemPreview>
            </div>
        )
    })

export const exportItems = (
    items: DndStateItemEntity[] = [],
    renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
) =>
    items
        ?.map((item) => {
            const updatedRenderProps = { ...renderProps, item }
            const stateItem = renderProps.state.entities[item.id]
            return `
                <div style="position: relative">
                    ${renderProps.itemsMap[stateItem.parent]?.export?.(updatedRenderProps)}
                </div>
            `
        })
        .join('\n')

export const exportToHtml = (
    renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
) => {
    return `
        <div style="${styleToCss(renderProps.state?.layout?.state?.layoutStyle)}">
            <div style="${styleToCss(renderProps.state?.layout?.state?.contentStyle)}">
                ${exportItems(renderProps.state.items, renderProps)}
            </div>
        </div>
    `
}

export const useLocalStorage = <T extends any = any>(
    key: string,
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = React.useState<T>(() => {
        const storedValue = window.localStorage.getItem(key)
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue
    })
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
    return [value, setValue]
}

export const useDidMountEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    const isMounted = React.useRef(false)

    React.useEffect(() => {
        if (isMounted.current) {
            return effect()
        } else {
            isMounted.current = true
        }
    }, deps)
}

export const createDndState = (initialState?: Partial<DndState>): DndState => {
    const layout: DndStateLayout = {
        id: nanoid(),
        ...(initialState?.layout ?? {})
    }
    return {
        items: [],
        entities: {},
        ...(initialState ?? {}),
        layout
    }
}

export const styleToCss = (style: React.CSSProperties = {}) => reactToCSS(style)
