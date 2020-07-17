import { VisibilityOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { ButtonBase, Theme } from '@material-ui/core'
import React from 'react'
import { DndPreviewProps } from '../types'

const useStyles = makeStyles(
    ({ spacing, shape: { borderRadius }, palette: { background, getContrastText } }: Theme) => ({
        root: {
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative'
        },
        preview: {
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        },
        actions: {
            borderRadius,
            backgroundColor: getContrastText(background.default),
            color: background.default,
            position: 'absolute',
            bottom: spacing(2),
            left: spacing(2),
            opacity: 0.5,

            '&:hover, &:active, &:focus, &:focus-within': {
                opacity: 1
            }
        },
        button: {
            padding: spacing(1)
        }
    })
)

const DndPreview: React.FC<DndPreviewProps> = ({ children }) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div className={classes.preview}>{children}</div>
            <div className={classes.actions}>
                <ButtonBase className={classes.button}>
                    <VisibilityOutlined fontSize="small" />
                </ButtonBase>
            </div>
        </div>
    )
}

export default DndPreview
