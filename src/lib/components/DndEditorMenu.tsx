import {
    ButtonBase,
    Card,
    CardContent,
    ClickAwayListener,
    Fade,
    Popper,
    Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { groupBy } from 'lodash-es'
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
        typography: { caption, fontWeightBold },
        palette: { divider, text, action, background },
        shape: { borderRadius }
    }: Theme) => ({
        root: {
            padding: spacing(2, 0),
            '& $item': {
                marginBottom: spacing(1.5),
                border: `1px solid ${divider}`,
                '&:hover': {
                    boxShadow: `2px 2px 10px ${action.focus}`
                }
            },
            '& .dnd-layout-item': {
                height: 28
            }
        },
        section: {
            padding: spacing(2)
        },
        heading: {
            ...caption,
            marginBottom: spacing(1),
            fontWeight: fontWeightBold,
            opacity: 0.36,
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        content: {
            marginBottom: spacing(2)
        },
        item: {
            width: '100%',
            padding: spacing(0.5),
            borderRadius
        },
        layout: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            '& > *': {
                display: 'flex',
                height: '100%',
                backgroundColor: action.hover,
                border: `2px solid ${action.focus}`
            }
        },
        block: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start'
        },
        element: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing(1, 0, 0.5),
            ...caption,
            fontWeight: 500,
            color: text.secondary,
            textTransform: 'uppercase',
            '& .MuiSvgIcon-root': {
                marginBottom: spacing(1)
            }
        },
        popper: {
            height: `calc(100% - ${spacing(1.5)}px)`,
            width: spacing(40),
            padding: spacing(0, 3)
        },
        card: {
            width: '100%',
            height: '100%',
            boxShadow: `4px 4px 20px ${action.focus}`,
            backgroundColor: background.default,
            overflow: 'auto'
        },
        imgItem: {
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
                maxHeight: '50%',
                borderRadius: 'inherit'
            },
            '&:hover': {
                boxShadow: `2px 2px 10px ${action.focus}`
            }
        },
        list: {
            width: '100%'
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
        <>
            <ClickAwayListener onClickAway={() => popupState.close()}>
                <Popper
                    transition
                    placement="right"
                    className={classes.popper}
                    {...bindPopper(popupState)}
                    keepMounted={false}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <ReactSortable
                                        animation={300}
                                        group={{ name: 'shared', pull: 'clone', put: false }}
                                        list={hoveredItems}
                                        sort={false}
                                        setList={() => undefined}
                                        className={classes.list}
                                        onStart={() => document.body.classList.add('is-dragging')}
                                        onEnd={() => document.body.classList.remove('is-dragging')}
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
                                            >
                                                <span className={classes.block}>
                                                    <span className={classes.heading}>
                                                        {hvItem.label}
                                                    </span>
                                                    <span className={classes.imgItem}>
                                                        <img src={hvItem.image} alt="" />
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
            </ClickAwayListener>
            <div className={classes.root}>
                <div className={classes.section}>
                    <div className={classes.heading}>Elements</div>
                    <div className={classes.content}>
                        {groupedItems.group
                            .filter((item) => groupedBlocks[item.id])
                            .map((item: any, i) => (
                                <ButtonBase
                                    key={i}
                                    {...bindHover(popupState)}
                                    disableRipple
                                    className={clsx(classes.item, 'dnd-group-item', 'dnd-item')}
                                    onMouseEnter={handleMouseEnter(item)}
                                >
                                    <span className={classes.element}>
                                        <item.icon fontSize="large" />
                                        <span>{item.label}</span>
                                    </span>
                                </ButtonBase>
                            ))}
                    </div>
                </div>
                <div className={classes.section}>
                    <div className={classes.heading}>Layouts</div>
                    <ReactSortable
                        animation={300}
                        group={{ name: 'shared', pull: 'clone', put: false }}
                        list={groupedItems.layout}
                        sort={false}
                        setList={() => undefined}
                        className={classes.content}
                        onStart={() => document.body.classList.add('is-dragging')}
                        onEnd={() => document.body.classList.remove('is-dragging')}
                    >
                        {groupedItems.layout.map((item: any, i) => (
                            <ButtonBase
                                key={i}
                                disableRipple
                                onClick={handleAddItem(item)}
                                className={clsx(classes.item, 'dnd-layout-item', 'dnd-item')}
                            >
                                <span className={classes.layout}>{item.component}</span>
                            </ButtonBase>
                        ))}
                    </ReactSortable>
                </div>
            </div>
        </>
    )
}

export default DndEditorMenu
