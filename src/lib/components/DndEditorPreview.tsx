import { Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles, useTheme } from '@material-ui/styles'
import clsx from 'clsx'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndEditorPreviewProps } from '../types'
import { renderItems, setList } from '../utils'
import DndPreview from './DndPreview'

const useStyles = makeStyles(({ palette: { text, action, primary }, spacing }: Theme) => ({
    root: {
        '& .dnd-component-item': {
            maxHeight: 40,
            width: '100%',
            backgroundColor: fade(primary.main, 0.08),
            margin: 0,
            '& .MuiTypography-root': {
                display: 'none'
            },
            '& .MuiSvgIcon-fontSizeLarge': {
                fontSize: '1.8rem'
            }
        },
        '& .dnd-grid-item, & .dnd-block-item': {
            width: '100%',
            margin: 0,
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

const DndEditorPreview: React.FC<DndEditorPreviewProps> = ({}) => {
    const classes = useStyles()
    const editorContext = useDndEditorContext()
    const theme = useTheme<Theme>()
    const renderProps = {
        ...editorContext,
        theme
    }
    const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation()
        editorContext.onActiveChange(null)
    }
    return (
        <DndPreview renderProps={renderProps}>
            <div onClick={handleClick} style={editorContext?.state?.layout?.state?.layoutStyle}>
                <ReactSortable
                    animation={150}
                    group={{ name: 'root', put: ['grids', 'blocks'] }}
                    list={editorContext.state.items}
                    setList={setList(renderProps)}
                    className={clsx(classes.root)}
                    style={editorContext?.state?.layout?.state?.contentStyle}
                >
                    {renderItems(editorContext.state.items, renderProps)}
                </ReactSortable>
            </div>
        </DndPreview>
    )
}

export default DndEditorPreview
