import { Box } from '@material-ui/core'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { DndItem } from '../../types'
import { renderItems, setList } from '../../utils'

export default (id: string, looper: number[]): DndItem => ({
    id,
    type: 'grid',
    component: (
        <>
            {looper.map((i) => (
                <Box flex={1} key={i} />
            ))}
        </>
    ),
    render: (renderProps) => {
        const items = renderProps.item?.items ?? []
        return (
            <div style={{ display: 'flex' }}>
                {looper.map((i) => {
                    return (
                        <ReactSortable
                            key={i}
                            animation={150}
                            group={{ name: 'components', put: ['components'] }}
                            list={items[i] ?? []}
                            setList={setList(renderProps, i, renderProps.item?.id)}
                            className="dnd-grid"
                            style={{
                                minHeight: 40,
                                width: '100%',
                                position: 'relative',
                                flex: 1
                            }}
                        >
                            {renderItems(items[i], renderProps)}
                        </ReactSortable>
                    )
                })}
            </div>
        )
    }
})
