import { Trans } from '@lingui/macro'
import { Divider, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { groupBy } from 'lodash-es'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../../DndEditorProvider'
import { DndEditorContentProps, DndItem, DndTab, ItemType } from '../../types'
import React from 'react'

const useStyles = makeStyles(
    ({
        palette: { divider, text, background, action },
        spacing,
        shape: { borderRadius }
    }: Theme) => ({
        button: {
            backgroundColor: background.paper,
            justifyContent: 'center',
            alignItems: 'center',
            color: text.secondary,
            textTransform: 'uppercase',
            padding: spacing(0.5),
            cursor: 'grab',
            userSelect: 'none'
        },
        component: {
            display: 'inline-flex',
            width: spacing(10),
            height: spacing(10),
            flexDirection: 'column'
        },
        icon: {
            margin: spacing(0.5),
            verticalAlign: 'middle'
        },
        divider: {
            margin: spacing(4, 0)
        },
        grid: {
            display: 'flex',
            width: '100%',
            '& > div': {
                padding: spacing(2),
                backgroundColor: action.selected,
                border: `4px solid ${action.focus}`
            }
        },
        disabled: {
            pointerEvents: 'none',
            opacity: 0.54
        },
        list: {
            '& $button': {
                border: `1px solid ${divider}`,
                borderRadius
            },
            '& $grid': {
                marginBottom: spacing(1.25)
            },
            '& $component': {
                margin: spacing(0, 1.25, 1.25, 0)
            }
        }
    })
)

const DndEditorContent: React.FC<DndEditorContentProps> = () => {
    const { items, state } = useDndEditorContext()
    const classes = useStyles()
    const groupedItems: Record<ItemType, DndItem[]> = groupBy(items, 'type') as any
    return (
        <>
            {groupedItems.component.length > 0 && (
                <>
                    <Typography variant="body2" gutterBottom>
                        <Trans>Components</Trans>
                    </Typography>
                    <ReactSortable
                        animation={150}
                        group={{ name: 'components', pull: 'clone', put: false }}
                        list={groupedItems.component}
                        sort={false}
                        setList={() => undefined}
                        className={clsx(classes.list, !state.items.length && classes.disabled)}
                    >
                        {groupedItems.component.map((item) => (
                            <div
                                className={clsx(
                                    classes.button,
                                    classes.component,
                                    'dnd-component-item'
                                )}
                                key={item.id}
                            >
                                {item.icon && (
                                    <item.icon className={classes.icon} fontSize="large" />
                                )}
                                <Typography variant="caption">{item.label}</Typography>
                            </div>
                        ))}
                    </ReactSortable>
                </>
            )}
            {groupedItems.component.length > 0 && groupedItems.grid.length > 0 && (
                <Divider className={classes.divider} />
            )}
            {groupedItems.grid.length > 0 && (
                <>
                    <Typography variant="body2" gutterBottom>
                        <Trans>Grids</Trans>
                    </Typography>
                    <ReactSortable
                        animation={150}
                        group={{ name: 'grids', pull: 'clone', put: false }}
                        list={groupedItems.grid}
                        sort={false}
                        setList={() => undefined}
                        className={clsx(classes.list)}
                    >
                        {groupedItems.grid.map((contentItem) => (
                            <div
                                className={clsx(classes.button, classes.grid, 'dnd-grid-item')}
                                key={contentItem.id}
                            >
                                {contentItem.component}
                            </div>
                        ))}
                    </ReactSortable>
                </>
            )}
        </>
    )
}

export default {
    id: 'content',
    component: <DndEditorContent />,
    label: <Trans>Content</Trans>
} as DndTab
