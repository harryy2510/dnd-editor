import React from 'react'
import { ButtonBase, Card, CardContent } from '@material-ui/core'
import clsx from 'clsx'
import { ReactSortable } from 'react-sortablejs'
import { bindHover } from 'material-ui-popup-state/core'
import { AddOutlined } from '@material-ui/icons'
import { DndBlockItem, DndGroupItem } from '../../types'

type MenuHoverListProps = {
    classes: any
    listItems: DndBlockItem[]
    handleAddItem: (item: DndBlockItem) => any
}

type MenuItemProps = {
    classes: any
    isHovered: boolean
    popupState: any
    group: DndGroupItem
    addItem: (block: DndBlockItem) => any
    handleMouseEnter: (group: DndBlockItem) => any
    blocks: DndBlockItem[]
}
const MenuItem: React.FC<MenuItemProps> = (props) => {
    const renderMode = props?.group.renderMode || 'container'
    console.log(renderMode)
    switch (renderMode) {
        case 'container':
            return <ContainerGroupMenuItem {...props} />
        case 'hidden':
            return <HiddenGroupMenuItem {...props} />
        default:
            return <></>
    }
}

const HiddenGroupMenuItem: React.FC<MenuItemProps> = ({
    blocks,
    classes,
    isHovered,
    popupState,
    addItem
}) => {
    return (
        <ReactSortable
            animation={300}
            group={{ name: 'shared', pull: 'clone', put: false }}
            list={blocks}
            sort={false}
            setList={() => undefined}
            className={classes.list}
            setData={(dataTransfer, draggedElement) => {
                const dragImage = document.createElement('img')
                dragImage.src = draggedElement.dataset.dragImage as string
                console.log(dragImage)
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
                        <hvItem.icon fontSize="small" />
                        <span>{hvItem.label}</span>
                        <AddOutlined fontSize="small" className={classes.addIcon} />
                        <img src={hvItem.image} style={{ display: 'none' }} />
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
                <span>{group.label}</span>
            </span>
        </ButtonBase>
    )
}

const MenuHoverList: React.FC<MenuHoverListProps> = ({ classes, listItems, handleAddItem }) => {
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
                    setData={(dataTransfer, draggedElement) => {
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
