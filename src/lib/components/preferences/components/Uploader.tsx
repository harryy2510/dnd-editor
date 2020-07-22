import { Trans } from '@lingui/macro'
import { Theme, Typography } from '@material-ui/core'
import { CloudUploadOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { InputProps } from './Input'

const useStyles = makeStyles(
    ({
        spacing,
        palette: { divider, action, text },
        shape: { borderRadius },
        transitions
    }: Theme) => ({
        container: {
            width: '100%',
            marginBottom: spacing(2),
            position: 'relative',
            height: 100,
            border: `1px solid ${divider}`,
            borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: text.hint,
            '&:hover $overlay': {
                opacity: 1
            }
        },
        overlay: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            width: '100%',
            opacity: 0,
            zIndex: 4,
            transition: transitions.create('opacity'),
            backgroundColor: action.hover
        },
        input: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            width: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 5
        },
        placeholder: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        },
        icon: {
            fontSize: 28
        }
    })
)

const Uploader: React.FC<InputProps> = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <div className={classes.placeholder}>
                <CloudUploadOutlined className={classes.icon} />
                <Typography variant="caption">
                    <Trans>Drag and drop or click to upload</Trans>
                </Typography>
            </div>
            <div className={classes.overlay} />
            <input type="file" className={classes.input} />
        </div>
    )
}

export default Uploader
