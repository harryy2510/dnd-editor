import { FormikValues } from 'formik'
import { cloneDeep, isEqual, omit, set, omitBy } from 'lodash-es'
import { nanoid } from 'nanoid'
import React from 'react'
// @ts-ignore
import reactToCSS from 'react-style-object-to-css'
import Container from './assets/Container'
import DndItemPreview from './components/DndItemPreview'
import {
    DndState,
    RenderProps,
    DndStateItemEntity,
    DndItem,
    DndTemplateItem,
    InitialValues
} from './types'

export const removeItem = (renderProps: RenderProps, id?: string) => {
    if (id) {
        renderProps.onActiveChange(null)
        renderProps.setState((existingState) => {
            const updatedEntities = omitBy(existingState.entities, (e, i) => i === id)
            const updatedItems = existingState.items
                .filter((item) => item.id !== id)
                .map((item) => ({
                    ...item,
                    items: item.items?.map((child) => child.filter((ch) => ch.id !== id))
                }))
            return {
                ...existingState,
                items: updatedItems,
                entities: updatedEntities
            }
        })
    }
}

export const updateItem = (renderProps: RenderProps, id: string, update: FormikValues) => {
    renderProps.setState((existingState) => {
        const obj = existingState.entities[id]
        const newValues = Object.keys(update).reduce<any>(
            (res, o) => set(res, o, update[o]),
            obj.values
        )
        return {
            ...existingState,
            entities: {
                ...existingState.entities,
                [obj.id]: {
                    ...obj,
                    values: newValues
                }
            }
        }
    })
}

export const addItem = (renderProps: RenderProps, newItem: DndItem) => {
    const id = nanoid()
    const newState: DndState = {
        entities: {
            ...renderProps.state.entities,
            [id]: {
                id,
                values: {
                    ...(newItem.initialValues ?? {}),
                    __container: Container.initialValues
                },
                parent: { id: newItem.id, type: newItem.type }
            }
        },
        items: [
            ...renderProps.state.items,
            {
                id
            }
        ]
    }
    renderProps.setState(newState)
}

export const setChildList = (renderProps: RenderProps, layoutId: string, index: number) => (
    newState: DndStateItemEntity[]
) => {
    const rawItemIndex = newState.findIndex((item) => Boolean(((item as unknown) as DndItem).type))
    let updatedNewState = cloneDeep(newState).map((item) => ({ ...item, layoutId }))
    const updatedNewEntities = {
        ...renderProps.state.entities
    }
    if (rawItemIndex > -1) {
        const id = nanoid()
        const rawItem = (newState[rawItemIndex] as unknown) as DndItem
        updatedNewState[rawItemIndex] = {
            id,
            layoutId
        }
        updatedNewEntities[id] = {
            id,
            parent: {
                id: rawItem.id,
                type: rawItem.type
            },
            values: {
                ...(rawItem.initialValues ?? {}),
                __container: Container.initialValues
            }
        }
    }
    const stateToSet = {
        entities: updatedNewEntities,
        items: renderProps.state.items.map((item) => {
            if (item.id === layoutId) {
                if (!item.items) {
                    item.items = []
                }
                item.items[index] = updatedNewState
            }
            return item
        })
    }
    renderProps.setState(stateToSet)
}

export const setList = (renderProps: RenderProps) => (newState: DndStateItemEntity[]) => {
    const rawItemIndex = newState.findIndex((item) => Boolean(((item as unknown) as DndItem).type))
    const updatedNewState = cloneDeep(newState).map((item) => omit(item, 'layoutId'))
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
            parent: {
                id: rawItem.id,
                type: rawItem.type
            },
            values: {
                ...(rawItem.initialValues ?? {}),
                __container: Container.initialValues
            }
        }
    }
    const stateToSet = {
        entities: updatedNewEntities,
        items: updatedNewState
    }
    if (!isEqual(stateToSet, renderProps.state)) {
        renderProps.setState(stateToSet)
    }
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

export const renderItems = (items: DndStateItemEntity[] = [], renderProps: RenderProps) =>
    items?.map((item) => {
        const updatedRenderProps = { ...renderProps, item }
        const stateItem = renderProps.state.entities[item.id]
        return (
            <DndItemPreview key={item.id} {...updatedRenderProps}>
                {Container.render(
                    updatedRenderProps,
                    renderProps.itemsMap[stateItem.parent.id]?.render?.(updatedRenderProps)
                )}
            </DndItemPreview>
        )
    })

// export const exportItems = (
//     items: DndStateItemEntity[] = [],
//     renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
// ) =>
//     items
//         ?.map((item) => {
//             const updatedRenderProps = { ...renderProps, item }
//             const stateItem = renderProps.state.entities[item.id]
//             return `
//                 <div style="position: relative">
//                     ${Container.export(
//                         updatedRenderProps,
//                         renderProps.itemsMap[stateItem.parent.id]?.export?.(updatedRenderProps)
//                     )}
//                 </div>
//             `
//         })
//         .join('\n')
//
// export const exportToHtml = (
//     renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
// ) => {
//     return `
//         <div style="${styleToCss(renderProps.state?.layout?.state?.layoutStyle)}">
//             <div style="${styleToCss(renderProps.state?.layout?.state?.contentStyle)}">
//                 ${exportItems(renderProps.state.items, renderProps)}
//             </div>
//         </div>
//     `
// }

export const createDndState = (
    initialState?: Partial<DndState>,
    template?: DndTemplateItem
): DndState => {
    return {
        items: [],
        ...(initialState ?? {}),
        entities: {
            ...(template
                ? {
                      [template.id]: {
                          parent: {
                              id: template.id,
                              type: template.type
                          },
                          id: template.id,
                          values: template.initialValues ?? {}
                      }
                  }
                : {}),
            ...(initialState?.entities ?? {})
        }
    }
}

export const styleToCss = (style: React.CSSProperties = {}) => reactToCSS(style)
