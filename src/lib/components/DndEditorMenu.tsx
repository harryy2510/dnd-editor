import { Fade, Popper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { groupBy, sortBy } from 'lodash-es'
import React from 'react'
import { usePopupState, bindPopper } from 'material-ui-popup-state/hooks'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndBlockItem, DndItem, DndGroupItem } from '../types'
import { addItem } from '../utils'
import { MenuHoverList, MenuItem } from './menu/MenuItem'

const useStyles = makeStyles(({ spacing, zIndex }: Theme) => ({
    root: {
        padding: spacing(4, 0)
    },
    popper: {
        zIndex: zIndex.tooltip
    }
}))

const DndEditorMenu: React.FC = () => {
    const [hovered, setHovered] = React.useState('')
    const [minimized, setMinimized] = React.useState(true)
    const editorContext = useDndEditorContext()
    const groupedItems = React.useMemo(() => groupBy(editorContext.items, 'type'), [
        editorContext.items
    ])
    const groupedBlocks = React.useMemo(() => groupBy(groupedItems.block, 'parent'), [
        editorContext.items
    ])
    const hoveredItems = React.useMemo(() => groupedBlocks[hovered], [
        hovered,
        editorContext.items
    ]) as DndBlockItem[]

    const popupState = usePopupState({
        variant: 'popper',
        popupId: 'dnd-menu-item',
        disableAutoFocus: true
    })
    const classes = useStyles()
    const handleMouseEnter = (item: DndItem) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setHovered(item.id)
        popupState.open(event)
    }

    const handleAddItem = (item: DndItem) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        event.preventDefault()
        addItem(editorContext, item)
    }

    const menuItemProps = (group: DndItem) => {
        return {
            group: group as DndGroupItem,
            blocks: groupedBlocks[group.id] as DndBlockItem[],
            classes,
            popupState,
            isHovered: group.id === hovered,
            handleMouseEnter,
            minimized,
            addItem: handleAddItem
        }
    }
    return (
        <>
            <div
                className={classes.root}
                onMouseLeave={() => setMinimized(true)}
                onMouseEnter={() => setMinimized(false)}
            >
                <Popper
                    transition
                    placement="right"
                    className={classes.popper}
                    {...bindPopper(popupState)}
                    keepMounted={false}
                    onMouseLeave={() => popupState.close()}
                >
                    {/* {({ TransitionProps }) => ( */}
                    {/* <Fade {...TransitionProps}> */}
                    <MenuHoverList listItems={hoveredItems} handleAddItem={handleAddItem} />
                    {/* </Fade>
                    )} */}
                </Popper>
                {sortBy(groupedItems.group, 'priority')
                    .filter((item) => groupedBlocks[item.id])
                    .map((item, i) => (
                        <div key={i}>
                            <MenuItem {...menuItemProps(item)} />
                        </div>
                    ))}
            </div>
        </>
    )
}

export default DndEditorMenu
