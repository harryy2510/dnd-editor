import { Trans } from '@lingui/macro'
import { ButtonBase, Divider, Theme, Tooltip } from '@material-ui/core'
import {
    LaptopMacOutlined,
    PhoneIphoneOutlined,
    TabletMacOutlined,
    VisibilityOutlined
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import React from 'react'
import { Device, DeviceType, DndPreviewProps } from '../types'
import DndPreviewDialog from './DndPreviewDialog'

const useStyles = makeStyles(
    ({
        spacing,
        shape: { borderRadius },
        shadows,
        palette: { background, getContrastText },
        transitions
    }: Theme) => ({
        root: {
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        preview: {
            maxWidth: '100%',
            maxHeight: '100%',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            transition: transitions.create('all', {
                duration: transitions.duration.shortest,
                easing: transitions.easing.sharp
            }),
            boxShadow: shadows[5]
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            borderRadius,
            position: 'absolute',
            bottom: spacing(2),
            left: spacing(2),
            overflow: 'hidden'
        },
        active: {},
        button: {
            backgroundColor: getContrastText(background.default),
            color: background.default,
            padding: spacing(1),
            opacity: 0.3,

            '&:hover, &:active, &$active': {
                opacity: 0.8
            }
        },
        divider: {
            width: 2
        },
        laptop: {},
        tablet: {
            width: 576,
            height: 768
        },
        mobile: {
            width: 320,
            height: 568
        }
    })
)

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

const DndPreview: React.FC<DndPreviewProps> = ({ children, renderProps }) => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const [device, setDevice] = React.useState<DeviceType>('laptop')
    const handleModeChange = (mode: DeviceType) => () => setDevice(mode)
    return (
        <>
            {open && (
                <DndPreviewDialog
                    renderProps={renderProps}
                    devices={devices}
                    device={device}
                    onDeviceChange={setDevice}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
            <div className={classes.root}>
                <div className={clsx(classes.preview, (classes as any)[device])}>{children}</div>
                <div className={classes.actions}>
                    <Tooltip title={<Trans>Preview</Trans>}>
                        <ButtonBase onClick={() => setOpen(true)} className={classes.button}>
                            <VisibilityOutlined fontSize="small" />
                        </ButtonBase>
                    </Tooltip>
                    <Divider className={classes.divider} orientation="vertical" flexItem />{' '}
                    {devices.map((item, i) => (
                        <Tooltip title={item.label} key={i}>
                            <ButtonBase
                                onClick={handleModeChange(item.type)}
                                className={clsx(
                                    classes.button,
                                    item.type === device && classes.active
                                )}
                            >
                                <item.icon fontSize="small" />
                            </ButtonBase>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </>
    )
}

export default DndPreview
