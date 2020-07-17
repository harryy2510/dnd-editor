import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { groupBy } from 'lodash-es'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../../DndEditorProvider'
import { DndEditorBlockProps, DndItem, DndTab, ItemType } from '../../types'

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
        block: {
            display: 'flex',
            width: '100%',
            '& > div': {
                padding: spacing(2),
                backgroundColor: action.selected,
                border: `4px solid ${action.focus}`
            }
        },
        list: {
            '& $button': {
                border: `1px solid ${divider}`,
                borderRadius
            },
            '& $block': {
                marginBottom: spacing(1.25)
            }
        }
    })
)

const DndEditorBlock: React.FC<DndEditorBlockProps> = () => {
    const { items } = useDndEditorContext()
    const classes = useStyles()
    const groupedItems: Record<ItemType, DndItem[]> = groupBy(items, 'type') as any
    return (
        <>
            {groupedItems?.block?.length! > 0 && (
                <ReactSortable
                    animation={150}
                    group={{ name: 'blocks', pull: 'clone', put: false }}
                    list={groupedItems.block}
                    sort={false}
                    setList={() => undefined}
                    className={clsx(classes.list)}
                >
                    {groupedItems.block.map((blockItem) => (
                        <div
                            className={clsx(classes.button, classes.block, 'dnd-block-item')}
                            key={blockItem.id}
                        >
                            {blockItem.component}
                        </div>
                    ))}
                </ReactSortable>
            )}
        </>
    )
}

export default {
    id: 'blocks',
    component: <DndEditorBlock />,
    label: <Trans>Blocks</Trans>
} as DndTab
