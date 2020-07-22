import { Box } from '@material-ui/core'
import React from 'react'
import { DndLayoutItem } from '../../types'
import { ReactSortable } from 'react-sortablejs'
import { renderItems, setChildList } from '../../utils'

export default (id: string, label: React.ReactNode, grids: number[]): DndLayoutItem => ({
    id,
    label,
    type: 'layout',
    component: (
        <>
            {grids.map((i, j) => (
                <Box component="span" flex={i} key={j} />
            ))}
        </>
    ),
    render: (renderProps) => {
        if (!renderProps.item) {
            return null
        }
        const stateItem = renderProps.state.entities[renderProps.item.id]
        return (
            <div style={stateItem.values?.style}>
                {grids.map((i, j) => {
                    return (
                        <ReactSortable
                            key={j}
                            animation={300}
                            group={{
                                name: 'shared',
                                put: ['shared']
                            }}
                            list={renderProps.item?.items?.[j] ?? []}
                            setList={setChildList(renderProps, stateItem.id, j)}
                            className="dnd-grid"
                            style={{ flex: i }}
                        >
                            {renderItems(renderProps.item?.items?.[j] ?? [], renderProps)}
                        </ReactSortable>
                    )
                })}
            </div>
        )
    },
    export: (renderProps) => {
        if (!renderProps.item) {
            return ''
        }
        // const stateItem = renderProps.state.entities[renderProps.item.id]
        // const items = renderProps.item?.items ?? []
        // const exportedItems = grids
        //     .map((i) => {
        //         return `
        //             <div style="${styleToCss(stateItem.state?.style)}">
        //                 ${exportItems(items[i], renderProps)}
        //             </div>
        //         `
        //     })
        //     .join('\n')
        // return `
        //     <div style="${styleToCss(stateItem.state?.containerStyle)}">
        //         ${exportedItems}
        //     </div>
        // `
        return ''
    },
    initialValues: {
        style: {
            width: '100%',
            minHeight: 40,
            display: 'flex'
        }
    }
})
