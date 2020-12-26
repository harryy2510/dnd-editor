import React from 'react'
import { ButtonBase, Card, CardContent, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { ReactSortable } from 'react-sortablejs'
import { bindHover } from 'material-ui-popup-state/core'
import { AddOutlined } from '@material-ui/icons'
import { DndBlockItem, DndGroupItem } from '../../types'

const useStyles = makeStyles(
    ({
        spacing,
        typography: { caption, fontWeightBold, body2 },
        palette: { text, action, background, primary, grey },
        shape: { borderRadius },
        transitions,
        zIndex
    }: Theme) => ({
        hovered: {},
        heading: {
            ...caption,
            marginBottom: spacing(1),
            fontWeight: fontWeightBold,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff'
        },
        popperControl: {
            '&::after': {
                content: "'...'"
            }
        },
        item: {
            display: 'block',
            color: text.secondary,
            width: '100%',
            textAlign: 'left',
            padding: spacing(0.5),
            '&:hover, &$hovered': {
                minWidth: spacing(35),
                backgroundColor: grey[600],
                color: 'white'
            }
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
            textTransform: 'none'
        },
        card: {
            width: '100%',
            height: '100%',
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
        label: {
            flex: '1',
            marginLeft: spacing(3)
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

type MenuHoverListProps = {
    classes?: any
    listItems: DndBlockItem[]
    handleAddItem: (item: DndBlockItem) => any
}

type MenuItemProps = {
    classes?: any
    isHovered: boolean
    popupState: any
    group: DndGroupItem
    addItem: (block: DndBlockItem) => any
    handleMouseEnter: (group: DndGroupItem) => any
    blocks: DndBlockItem[]
    minimized: boolean
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
    const renderMode = props?.group.renderMode || 'container'
    const styles = useStyles()
    const menuItemProps = { ...props, classes: styles }
    switch (renderMode) {
        case 'container':
            return <ContainerGroupMenuItem {...menuItemProps} />
        case 'hidden':
            return <HiddenGroupMenuItem {...menuItemProps} />
        default:
            return <></>
    }
}

const HiddenGroupMenuItem: React.FC<MenuItemProps> = ({
    blocks,
    classes,
    isHovered,
    popupState,
    minimized,
    addItem
}) => {
    const icon = (item: DndBlockItem) => (item.icon ? <item.icon fontSize="small" /> : <></>)
    return (
        <ReactSortable
            animation={300}
            group={{ name: 'shared', pull: 'clone', put: false }}
            list={blocks}
            sort={false}
            setList={() => undefined}
            className={classes.list}
            setData={(dataTransfer: DataTransfer, draggedElement: HTMLElement) => {
                const dragImage = document.createElement('img')
                dragImage.src = draggedElement.dataset.dragImage as string
                dataTransfer.setDragImage(dragImage, -10, -10)
            }}
        >
            {blocks?.map((hvItem, i) => (
                <ButtonBase
                    key={i}
                    disableRipple
                    className={clsx(
                        classes.item,
                        'dnd-group-item',
                        'dnd-item',
                        isHovered && popupState.isOpen && classes.hovered
                    )}
                    onClick={addItem(hvItem)}
                    data-drag-image={hvItem.image}
                >
                    <span className={clsx(classes.element, classes.addIconParent)}>
                        {icon(hvItem)}
                        {!minimized && <div className={classes.label}>{hvItem.label}</div>}
                        <img src={hvItem.image} style={{ display: 'none' }} />
                        <AddOutlined fontSize="small" className={classes.addIcon} />
                    </span>
                </ButtonBase>
            ))}
        </ReactSortable>
    )
}

const ContainerGroupMenuItem: React.FC<MenuItemProps> = ({
    group,
    classes,
    isHovered,
    handleMouseEnter,
    minimized,
    popupState
}) => {
    return (
        <ButtonBase
            {...bindHover(popupState)}
            disableRipple
            className={clsx(
                classes.item,
                'dnd-group-item',
                'dnd-item',
                isHovered && popupState.isOpen && classes.hovered
            )}
            onMouseEnter={handleMouseEnter(group)}
        >
            <span className={classes.element}>
                <group.icon fontSize="small" />
                {!minimized && (
                    <div className={clsx(classes.label, classes.popperControl)}>{group.label}</div>
                )}
            </span>
        </ButtonBase>
    )
}

const MenuHoverList: React.FC<MenuHoverListProps> = ({ listItems, handleAddItem }) => {
    const classes = useStyles()
    return (
        <Card elevation={0} className={classes.card}>
            <CardContent>
                <ReactSortable
                    animation={300}
                    group={{ name: 'shared', pull: 'clone', put: false }}
                    list={listItems}
                    sort={false}
                    setList={() => undefined}
                    className={classes.list}
                    setData={(dataTransfer: DataTransfer, draggedElement: HTMLElement) => {
                        const dragImage = document.createElement('img')
                        dragImage.src = draggedElement.dataset.dragImage as string
                        dataTransfer.setDragImage(dragImage, -10, -10)
                    }}
                >
                    {listItems?.map((item, i) => (
                        <ButtonBase
                            disableRipple
                            key={i}
                            className={clsx(classes.block, 'dnd-block-item', 'dnd-item')}
                            onClick={handleAddItem(item)}
                            data-drag-image={item.image}
                        >
                            <span className={clsx(classes.block, classes.addIconParent)}>
                                <span className={classes.heading}>{item.label}</span>
                                <span className={classes.imgItem}>
                                    <img src={item.image} alt="" />
                                    <AddOutlined fontSize="small" className={classes.addIcon} />
                                </span>
                            </span>
                        </ButtonBase>
                    ))}
                </ReactSortable>
            </CardContent>
        </Card>
    )
}
export { MenuHoverList, MenuItem }
