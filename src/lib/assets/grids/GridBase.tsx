import { Trans } from '@lingui/macro'
import { Box } from '@material-ui/core'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { DndItem } from '../../types'
import { exportItems, renderItems, setList, styleToCss } from '../../utils'

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
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        const items = renderProps.item?.items ?? []
        return (
            <div style={stateItem.state?.containerStyle}>
                {looper.map((i) => {
                    return (
                        <ReactSortable
                            key={i}
                            animation={150}
                            group={{ name: 'components', put: ['components'] }}
                            list={items[i] ?? []}
                            setList={setList(renderProps, i, renderProps.item?.id)}
                            className="dnd-grid"
                            style={stateItem.state?.style}
                        >
                            {renderItems(items[i], renderProps)}
                        </ReactSortable>
                    )
                })}
            </div>
        )
    },
    export: (renderProps) => {
        const stateItem = renderProps.state.entities[renderProps.item!.id]
        const items = renderProps.item?.items ?? []
        const exportedItems = looper
            .map((i) => {
                return `
                    <div style="${styleToCss(stateItem.state?.style)}">
                        ${exportItems(items[i], renderProps)}
                    </div>
                `
            })
            .join('\n')
        return `
            <div style="${styleToCss(stateItem.state?.containerStyle)}">
                ${exportedItems}
            </div>
        `
    },
    settings: {
        initialValues: {
            style: {
                minHeight: 40,
                width: '100%',
                position: 'relative',
                flex: 1
            },
            containerStyle: {
                display: 'flex',
                padding: '4px',
                backgroundColor: '#fff'
            }
        },
        items: [
            {
                id: 'containerStyle.backgroundColor',
                type: 'color',
                label: <Trans>Background Color</Trans>
            },
            {
                id: 'containerStyle.padding',
                type: 'dropdown',
                label: <Trans>Padding</Trans>,
                items: [
                    {
                        label: <Trans>None</Trans>,
                        value: '0px'
                    },
                    {
                        label: <Trans>Small</Trans>,
                        value: '4px'
                    },
                    {
                        label: <Trans>Medium</Trans>,
                        value: '8px 16px'
                    },
                    {
                        label: <Trans>Large</Trans>,
                        value: '16px 32px'
                    }
                ]
            }
        ]
    }
})
