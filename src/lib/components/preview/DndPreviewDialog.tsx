import { Trans } from '@lingui/macro'
import {
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    Theme,
    Tooltip,
    Typography
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import {
    CloseOutlined,
    LaptopMacOutlined,
    PhoneIphoneOutlined,
    TabletMacOutlined
} from '@material-ui/icons'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { makeStyles, useTheme } from '@material-ui/styles'
import clsx from 'clsx'
import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'
import { Device, DeviceType } from '../../types'
import { exportToHtml } from '../../utils'
import './DndPreviewDialog.css'

const useStyles = makeStyles(
    ({ spacing, shape: { borderRadius }, palette: { primary, text, divider } }: Theme) => ({
        headerActions: {
            position: 'absolute',
            right: spacing(1),
            top: spacing(1)
        },
        toggleButton: {
            borderRadius: `${borderRadius * 2}px!important`,
            border: 'none',
            marginRight: spacing(0.5),
            '&:hover': {
                color: text.primary
            },
            '&.Mui-selected, &.Mui-selected:hover': {
                color: primary.main,
                backgroundColor: fade(primary.main, 0.2)
            }
        },
        dialogContent: {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
        },
        dialogTitle: {
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${divider}`
        },
        toggleButtons: {
            marginLeft: spacing(2)
        },
        iframe: {
            width: '100%',
            height: '100%',
            overflow: 'auto',
            border: 'none',
            boxShadow: 'none'
        }
    })
)

export interface DndPreviewDialogProps extends Omit<DialogProps, 'children'> {}

const devices: Device[] = [
    {
        type: 'laptop',
        icon: LaptopMacOutlined,
        label: <Trans>Laptop</Trans>
    },
    {
        type: 'tablet',
        icon: TabletMacOutlined,
        label: <Trans>Tablet</Trans>
    },
    {
        type: 'mobile',
        icon: PhoneIphoneOutlined,
        label: <Trans>Mobile</Trans>
    }
]

const DndPreviewDialog: React.FC<DndPreviewDialogProps> = (props) => {
    const {
        palette: { type }
    } = useTheme<Theme>()
    const classes = useStyles()
    const editorContext = useDndEditorContext()
    const [device, setDevice] = React.useState<DeviceType>('laptop')

    const renderDevice = React.useMemo(() => {
        if (!props.open) {
            return null
        }
        const childComponent = (
            <iframe className={classes.iframe} srcDoc={exportToHtml(editorContext)} />
        )
        switch (device) {
            case 'tablet':
                return (
                    <div
                        className={clsx(
                            'marvel-device',
                            'ipad',
                            type === 'dark' ? 'silver' : 'dark'
                        )}
                    >
                        <div className="camera" />
                        <div className="screen">{childComponent}</div>
                        <div className="home" />
                    </div>
                )
            case 'mobile':
                return (
                    <div
                        className={clsx(
                            'marvel-device',
                            'iphone5s',
                            type === 'dark' ? 'silver' : 'dark'
                        )}
                    >
                        <div className="top-bar" />
                        <div className="sleep" />
                        <div className="volume" />
                        <div className="camera" />
                        <div className="sensor" />
                        <div className="speaker" />
                        <div className="screen">{childComponent}</div>
                        <div className="home" />
                        <div className="bottom-bar" />
                    </div>
                )
            default:
                return (
                    <div className="marvel-device macbook">
                        <div className="top-bar" />
                        <div className="camera" />
                        <div className="screen">{childComponent}</div>
                        <div className="bottom-bar" />
                    </div>
                )
        }
    }, [props.open, device])

    return (
        <Dialog fullScreen {...props}>
            <DialogTitle className={classes.dialogTitle} disableTypography>
                <Typography variant="h5" color="primary">
                    <Trans>Preview</Trans>
                </Typography>
                <ToggleButtonGroup
                    value={device}
                    exclusive
                    size="small"
                    className={classes.toggleButtons}
                    onChange={(event, newMode) => {
                        if (newMode) {
                            setDevice(newMode)
                        }
                    }}
                >
                    {devices.map((item, i) => (
                        <ToggleButton className={classes.toggleButton} value={item.type} key={i}>
                            <item.icon />
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>{renderDevice}</DialogContent>
            <div className={classes.headerActions}>
                <Tooltip title={<Trans>Close</Trans>}>
                    <IconButton onClick={() => props.onClose?.({}, 'backdropClick')}>
                        <CloseOutlined />
                    </IconButton>
                </Tooltip>
            </div>
        </Dialog>
    )
}

export default DndPreviewDialog
