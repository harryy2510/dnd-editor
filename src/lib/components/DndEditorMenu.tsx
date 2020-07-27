import {
    ButtonBase,
    Card,
    CardContent,
    ClickAwayListener,
    Fade,
    Popper,
    Theme
} from '@material-ui/core'
import { AddOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { groupBy, sortBy } from 'lodash-es'
import React from 'react'
import { usePopupState, bindHover, bindPopper } from 'material-ui-popup-state/hooks'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndBlockItem, DndItem } from '../types'
import clsx from 'clsx'
import { addItem } from '../utils'

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
            alignItems: 'flex-start',
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
            height: '100%',
            width: spacing(40),
            transform: `translate3d(60px, 0px, 0px)!important`,
            zIndex: zIndex.tooltip
        },
        card: {
            width: '100%',
            height: '100%',
            boxShadow: `4px 4px 20px ${action.focus}`,
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
        addItem(editorContext, item)
    }

    return (
        <ClickAwayListener onClickAway={() => popupState.close()}>
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
                            <Card square className={classes.card}>
                                <CardContent>
                                    <ReactSortable
                                        animation={300}
                                        group={{ name: 'shared', pull: 'clone', put: false }}
                                        list={hoveredItems}
                                        sort={false}
                                        setList={() => undefined}
                                        className={classes.list}
                                        setData={(dataTransfer, draggedElement) => {
                                            const dragImage = document.createElement('img')
                                            dragImage.src = draggedElement.dataset
                                                .dragImage as string
                                            dataTransfer.setDragImage(dragImage, -10, -10)
                                        }}
                                    >
                                        {hoveredItems?.map((hvItem, i) => (
                                            <ButtonBase
                                                disableRipple
                                                key={i}
                                                className={clsx(
                                                    classes.block,
                                                    'dnd-block-item',
                                                    'dnd-item'
                                                )}
                                                onClick={handleAddItem(hvItem)}
                                                data-drag-image={hvItem.image}
                                            >
                                                <span className={classes.block}>
                                                    <span className={classes.heading}>
                                                        {hvItem.label}
                                                    </span>
                                                    <span className={classes.imgItem}>
                                                        <img src={hvItem.image} alt="" />
                                                        <AddOutlined
                                                            fontSize="small"
                                                            className={classes.addIcon}
                                                        />
                                                    </span>
                                                </span>
                                            </ButtonBase>
                                        ))}
                                    </ReactSortable>
                                </CardContent>
                            </Card>
                        </Fade>
                    )}
                </Popper>
                {sortBy(groupedItems.group, 'priority')
                    .filter((item) => groupedBlocks[item.id])
                    .map((item: any, i) => (
                        <ButtonBase
                            key={i}
                            {...bindHover(popupState)}
                            disableRipple
                            className={clsx(
                                classes.item,
                                'dnd-group-item',
                                'dnd-item',
                                hovered === item.id && popupState.isOpen && classes.hovered
                            )}
                            onMouseEnter={handleMouseEnter(item)}
                        >
                            <span className={classes.element}>
                                <item.icon fontSize="small" />
                                <span>{item.label}</span>
                            </span>
                        </ButtonBase>
                    ))}
            </div>
        </ClickAwayListener>
    )
}

export default DndEditorMenu
