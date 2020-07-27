import { Container, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../DndEditorProvider'
import { renderItems, setList } from '../utils'
import clsx from 'clsx'

const useStyles = makeStyles(({ palette: { primary }, spacing }: Theme) => ({
    document: {
        padding: spacing(4, 2)
    },
    root: {
        width: '100%',
        minHeight: 240,
        '& .dnd-item': {
            height: 40,
            backgroundColor: fade(primary.main, 0.08),
            border: `2px dashed ${primary.main}`,
            '& > *': {
                opacity: 0
            }
        }
    },
    active: {
        '& > *': {
            outline: `1px solid ${primary.main}`
        }
    }
}))

const DndEditorPreview: React.FC = () => {
    const classes = useStyles()
    const renderProps = useDndEditorContext()

    const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation()
        renderProps.onActiveChange(null)
    }
    const children = (
        <ReactSortable
            animation={300}
            group={{ name: 'shared', put: ['shared'] }}
            list={renderProps.state.items}
            setList={setList(renderProps)}
            className={classes.root}
            handle=".sortable-handle"
            setData={(dataTransfer, draggedElement) => {
                const dragImage = document.createElement('img')
                dragImage.src = draggedElement.dataset.dragImage as string
                dataTransfer.setDragImage(dragImage, -10, -10)
            }}
        >
            {renderItems(renderProps.state.items, renderProps)}
        </ReactSortable>
    )
    return (
        <Container
            className={clsx(classes.document, !renderProps.active && classes.active)}
            maxWidth="md"
            onClick={handleClick}
        >
            <>{renderProps.template.render(renderProps, children)}</>
        </Container>
    )
}

export default DndEditorPreview
