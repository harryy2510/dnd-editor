import { Container, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../DndEditorProvider'
import { renderItems, setList } from '../utils'

const useStyles = makeStyles(({ palette: { action, primary }, spacing }: Theme) => ({
    '@global': {
        'body.is-dragging .dnd-grid': {
            '&:empty:before': {
                backgroundColor: action.selected
            }
        }
    },
    document: {
        padding: spacing(4, 2)
    },
    root: {
        width: '100%',
        minHeight: 240,
        '& .dnd-item': {
            height: 40,
            backgroundColor: fade(primary.main, 0.08)
        },
        '& .dnd-grid': {
            '&:empty:before': {
                content: '""',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                width: `calc(100% - ${spacing(1)}px)`,
                height: `calc(100% - ${spacing(1)}px)`,
                padding: spacing(2),
                margin: spacing(0.5)
            }
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
            onStart={() => document.body.classList.add('is-dragging')}
            onEnd={() => document.body.classList.remove('is-dragging')}
        >
            {renderItems(renderProps.state.items, renderProps)}
        </ReactSortable>
    )
    return (
        <Container className={classes.document} maxWidth="md" onClick={handleClick}>
            <>{renderProps.template.render(renderProps, children)}</>
        </Container>
    )
}

export default DndEditorPreview
