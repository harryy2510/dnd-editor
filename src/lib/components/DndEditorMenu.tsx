import { Fade, Popper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { groupBy, sortBy } from 'lodash-es'
import React from 'react'
import { usePopupState, bindPopper } from 'material-ui-popup-state/hooks'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndBlockItem, DndItem, DndGroupItem } from '../types'
import { addItem } from '../utils'
import { MenuHoverList, MenuItem } from './menu/MenuItem'

const useStyles = makeStyles(
    ({
        spacing,
        typography: { caption, fontWeightBold, body2 },
        palette: { text, action, background, primary, grey },
        shape: { borderRadius },
        transitions,
        zIndex
    }: Theme) => ({
        root: {
            padding: spacing(4, 0),
            '& $item': {
                marginBottom: spacing(0.5),
                '&:hover, &$hovered': {
                    backgroundColor: grey[600],
                    color: 'white'
                }
            }
        },
        hovered: {},
        heading: {
            ...caption,
            marginBottom: spacing(1),
            fontWeight: fontWeightBold,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff'
        },
        item: {
            width: '100%',
            color: text.secondary,
            padding: spacing(0.5)
        },
        block: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start'
        },
        addIconParent: {
            '&:hover $addIcon': {
                opacity: 1
            }
        },
        element: {
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            padding: spacing(2),
            ...body2,
            fontWeight: 500,
            textTransform: 'none',
            '& .MuiSvgIcon-root': {
                marginRight: spacing(3)
            }
        },
        popper: {
            // height: '100%',
            width: spacing(40),
            // transform: `translate3d(60px, 0px, 0px)!important`,
            zIndex: zIndex.tooltip,
            marginLeft: -140
        },
        card: {
            width: '100%',
            height: '100%',
            // boxShadow: `4px 4px 20px ${action.focus}`,
            // backgroundColor: grey[200],
            overflow: 'auto',
            backgroundColor: grey[600],
            color: 'white'
        },
        imgItem: {
            position: 'relative',
            backgroundColor: background.paper,
            marginBottom: spacing(4),
            boxShadow: `1px 1px 4px ${action.focus}`,
            width: '100%',
            height: 64,
            borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
                maxWidth: '95%',
                maxHeight: '95%',
                borderRadius: 'inherit'
            },
            '&:hover': {
                boxShadow: `2px 2px 10px ${action.focus}`
            }
        },
        list: {
            width: '100%'
        },
        addIcon: {
            opacity: 0,
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            backgroundColor: primary.main,
            color: primary.contrastText,
            borderRadius: 24,
            boxShadow: `2px 2px 20px ${action.active}`,
            transition: transitions.create('opacity')
        }
    })
)

const DndEditorMenu: React.FC = () => {
    const [hovered, setHovered] = React.useState('')
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

    const menuItemProps = (group: DndItem, idx: number) => {
        return {
            group: group as DndGroupItem,
            blocks: groupedBlocks[group.id] as DndBlockItem[],
            classes,
            popupState,
            key: idx,
            isHovered: group.id === hovered,
            handleMouseEnter,
            addItem: handleAddItem
        }
    }
    return (
        <>
            <div className={classes.root}>
                <Popper
                    transition
                    placement="right"
                    className={classes.popper}
                    {...bindPopper(popupState)}
                    keepMounted={false}
                    onMouseLeave={() => popupState.close()}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps}>
                            <MenuHoverList
                                classes={classes}
                                listItems={hoveredItems}
                                handleAddItem={handleAddItem}
                            />
                        </Fade>
                    )}
                </Popper>
                {sortBy(groupedItems.group, 'priority')
                    .filter((item) => groupedBlocks[item.id])
                    .map((item, i) => (
                        <MenuItem {...menuItemProps(item, i)} />
                    ))}
            </div>
        </>
    )
}

export default DndEditorMenu
