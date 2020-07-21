import { Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../DndEditorProvider'
import { renderItems, setList } from '../utils'

const useStyles = makeStyles(({ palette: { text, action, primary }, spacing }: Theme) => ({
    document: {
        height: '100%',
        width: '100%'
    },
    root: {
        height: '100%',
        width: '100%',
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
                color: text.disabled,
                padding: spacing(2),
                backgroundColor: action.selected,
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
        >
            {renderItems(renderProps.state.items, renderProps)}
        </ReactSortable>
    )
    return (
        <div className={classes.document} onClick={handleClick}>
            {renderProps.template.render(renderProps, children)}
        </div>
    )
}

export default DndEditorPreview
