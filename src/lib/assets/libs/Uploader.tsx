import { Trans } from '@lingui/macro'
import { Button, CircularProgress, Grid, Snackbar, Theme, Typography } from '@material-ui/core'
import { CloudUploadOutlined } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { last } from 'lodash-es'
import React, { useRef, useState } from 'react'

function formatFileSize(bytes: number, decimalPoint: number = 2) {
    if (bytes == 0) return '0 Bytes'
    const k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const useStyles = makeStyles(
    ({
        spacing,
        palette: { divider, action, text, background },
        shape: { borderRadius },
        transitions
    }: Theme) => ({
        container: {
            width: '100%',
            position: 'relative',
            minHeight: 100,
            border: `1px solid ${divider}`,
            borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: text.hint
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
            zIndex: 3,
            transition: transitions.create('opacity'),
            backgroundColor: action.focus,
            color: text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        },
        darkOverlay: {
            backgroundColor: action.active,
            color: background.paper
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
            zIndex: 5,
            '&:hover + $overlay': {
                opacity: 1
            }
        },
        placeholder: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        },
        icon: {
            fontSize: 28
        },
        preview: {
            height: '100%',
            width: '100%',
            padding: spacing(2),
            margin: 0
        },
        loader: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 6,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: action.active,
            color: background.default,
            padding: spacing(0.5)
        },
        button: {
            top: spacing(-3.5),
            right: 0,
            position: 'absolute',
            textTransform: 'none'
        },
        imgIcon: {
            height: 80
        },
        flex: {
            display: 'flex',
            marginBottom: spacing(1),
            alignItems: 'center',
            '& > *': {
                marginRight: spacing(0.5)
            }
        }
    })
)

const extensions = [
    '3ds',
    'ai',
    'asp',
    'avi',
    'bin',
    'com',
    'css',
    'csv',
    'dbf',
    'dll',
    'doc',
    'docx',
    'dwg',
    'eml',
    'eps',
    'exe',
    'file',
    'fla',
    'gif',
    'htm',
    'html',
    'ico',
    'ini',
    'iso',
    'jar',
    'jpeg',
    'jpg',
    'js',
    'mkv',
    'mov',
    'mp3',
    'mp4',
    'nfo',
    'obj',
    'otf',
    'pdf',
    'pkg',
    'png',
    'ppt',
    'pptx',
    'psd',
    'rtf',
    'svg',
    'ttf',
    'txt',
    'vcf',
    'wav',
    'wmv',
    'xls',
    'xlsx',
    'xml',
    'zip'
]

const Uploader: React.FC<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ value, onChange, name, ...props }) => {
    const fileRef = React.useRef<globalThis.File>()
    const [progress, setProgress] = React.useState(false)
    const [, forceUpdate] = useState({})
    const errorRef = useRef('')
    const [visible, setVisible] = useState(false)
    const classes = useStyles()
    const handleChangeEvent = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0]
        if (file) {
            if (file.size > 3145728) {
                errorRef.current = 'File size cannot exceed more than 3MB'
                setVisible(true)
                return
            }

            console.log(file)
            setProgress(true)
            const formData = new FormData()
            formData.append('file', file)
            fetch(process.env.REACT_APP_FILE_UPLOAD_URL!, {
                body: formData,
                method: 'POST',
                credentials: 'include'
            })
                .then((response) => response.json())
                .then((response) => {
                    fileRef.current = file
                    onChange?.({ target: { value: response.file, name } } as any)
                    setProgress(false)
                })
                .catch((error) => {
                    errorRef.current = error?.message
                    setVisible(true)
                    setProgress(false)
                })
        }
    }
    const handleClose = () => setVisible(false)
    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        fileRef.current = undefined
        onChange?.({ target: { value: '', name } } as any)
        forceUpdate({})
    }

    const ext = fileRef.current ? last(fileRef.current.name.split('.')) ?? '' : ''
    const iconUrl = fileRef.current
        ? `${process.env.REACT_APP_SAASTACK_CDN_URL}/files/${
              extensions.includes(ext) ? ext : 'file'
          }.svg`
        : ''

    return (
        <div className={classes.container}>
            <Snackbar autoHideDuration={3000} open={visible} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorRef.current}
                </Alert>
            </Snackbar>
            {fileRef.current && (
                <Button onClick={removeFile} size="small" className={classes.button}>
                    <Typography color="error" variant="caption">
                        <Trans>Remove File</Trans>
                    </Typography>
                </Button>
            )}
            <input {...props} onChange={handleChangeEvent} type="file" className={classes.input} />
            {fileRef.current ? (
                <>
                    <div className={clsx(classes.overlay, classes.darkOverlay)}>
                        <CloudUploadOutlined className={classes.icon} />
                        <Typography variant="caption">
                            <Trans>Change File</Trans>
                        </Typography>
                    </div>
                    <Grid alignItems="center" spacing={4} container className={classes.preview}>
                        <Grid item xs="auto">
                            <img src={iconUrl} className={classes.imgIcon} alt="" />
                        </Grid>
                        <Grid item xs>
                            <div className={classes.flex}>
                                <Typography variant="body1">Name:</Typography>{' '}
                                <Typography variant="body1" color="textPrimary">
                                    {fileRef.current.name}
                                </Typography>
                            </div>
                            <div className={classes.flex}>
                                <Typography variant="body1">Size:</Typography>{' '}
                                <Typography variant="body1" color="textPrimary">
                                    {formatFileSize(fileRef.current.size)}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <div className={classes.overlay} />
                    <div className={classes.placeholder}>
                        <CloudUploadOutlined className={classes.icon} />
                        <Typography variant="caption">
                            <Trans>
                                Drag and drop or click to upload, file size should be less than 3MB
                            </Trans>
                        </Typography>
                    </div>
                </>
            )}
            {progress && (
                <div className={classes.loader}>
                    <CircularProgress
                        disableShrink
                        size={20}
                        variant="indeterminate"
                        color="inherit"
                    />
                </div>
            )}
        </div>
    )
}

export default Uploader
