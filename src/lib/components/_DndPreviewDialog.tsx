// import { Trans } from '@lingui/macro'
// import {
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     Theme,
//     Tooltip,
//     IconButton,
//     Grid,
//     Typography,
//     DialogProps
// } from '@material-ui/core'
// import { CloseOutlined } from '@material-ui/icons'
// import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
// import { makeStyles, useTheme } from '@material-ui/styles'
// import clsx from 'clsx'
// import React from 'react'
// import { useDndEditorContext } from '../DndEditorProvider'
// import { Device, DeviceType, DndStateItemEntity, RenderProps } from '../types'
// import './_DndPreview.css'
// import { exportToHtml } from '../utils'
//
// const useStyles = makeStyles(
//     ({ spacing, shape: { borderRadius }, palette: { primary, text } }: Theme) => ({
//         paperFullScreen: {
//             borderRadius,
//             maxWidth: '95%',
//             maxHeight: '95%'
//         },
//         headerActions: {
//             position: 'absolute',
//             right: spacing(1),
//             top: spacing(1)
//         },
//         toggleButton: {
//             borderColor: primary.main,
//             color: text.secondary,
//             textTransform: 'none',
//             padding: spacing(0.5, 1.5),
//             '&.Mui-selected': {
//                 color: primary.contrastText,
//                 backgroundColor: primary.main,
//                 '&:hover': {
//                     color: primary.contrastText,
//                     backgroundColor: primary.main
//                 }
//             }
//         },
//         center: {
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         },
//         dialogContent: {
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         }
//     })
// )
//
// interface Props extends Omit<DialogProps, 'children'> {
//     devices: Device[]
//     device: DeviceType
//     onDeviceChange: (e: DeviceType) => void
//     renderProps: Omit<RenderProps, 'item'> & { item?: DndStateItemEntity }
// }
//
// const _DndPreviewDialog: React.FC<Props> = ({
//     device,
//     onDeviceChange,
//     devices,
//     renderProps,
//     ...props
// }) => {
//     const {
//         palette: { type }
//     } = useTheme<Theme>()
//     const classes = useStyles()
//     const html = exportToHtml(renderProps)
//     const renderDevice = React.useMemo(() => {
//         switch (device) {
//             case 'tablet':
//                 return (
//                     <div
//                         className={clsx(
//                             'marvel-device',
//                             'ipad',
//                             type === 'dark' ? 'silver' : 'dark'
//                         )}
//                     >
//                         <div className="camera" />
//                         <div className="screen" dangerouslySetInnerHTML={{ __html: html }} />
//                         <div className="home" />
//                     </div>
//                 )
//             case 'mobile':
//                 return (
//                     <div
//                         className={clsx(
//                             'marvel-device',
//                             'iphone5s',
//                             type === 'dark' ? 'silver' : 'dark'
//                         )}
//                     >
//                         <div className="top-bar" />
//                         <div className="sleep" />
//                         <div className="volume" />
//                         <div className="camera" />
//                         <div className="sensor" />
//                         <div className="speaker" />
//                         <div className="screen" dangerouslySetInnerHTML={{ __html: html }} />
//                         <div className="home" />
//                         <div className="bottom-bar" />
//                     </div>
//                 )
//             default:
//                 return (
//                     <div className="marvel-device macbook">
//                         <div className="top-bar" />
//                         <div className="camera" />
//                         <div className="screen" dangerouslySetInnerHTML={{ __html: html }} />
//                         <div className="bottom-bar" />
//                     </div>
//                 )
//         }
//     }, [open, device])
//     return (
//         <Dialog
//             TransitionProps={{ mountOnEnter: true, unmountOnExit: true }}
//             fullScreen
//             classes={{ paperFullScreen: classes.paperFullScreen }}
//             {...props}
//         >
//             <DialogTitle disableTypography>
//                 <Grid container>
//                     <Grid item xs={4}>
//                         <Typography variant="h6">
//                             <Trans>Preview</Trans>
//                         </Typography>
//                     </Grid>
//                     <Grid className={classes.center} item xs={4}>
//                         <ToggleButtonGroup
//                             value={device}
//                             exclusive
//                             size="small"
//                             onChange={(event, newMode) => {
//                                 if (newMode) {
//                                     onDeviceChange(newMode)
//                                 }
//                             }}
//                         >
//                             {devices.map((item, i) => (
//                                 <ToggleButton
//                                     className={classes.toggleButton}
//                                     value={item.type}
//                                     key={i}
//                                 >
//                                     {item.label}
//                                 </ToggleButton>
//                             ))}
//                         </ToggleButtonGroup>
//                     </Grid>
//                     <Grid item xs={4} />
//                 </Grid>
//             </DialogTitle>
//             <DialogContent className={classes.dialogContent}>{renderDevice}</DialogContent>
//             <div className={classes.headerActions}>
//                 <Tooltip title={<Trans>Close</Trans>}>
//                     <IconButton onClick={() => props.onClose?.({}, 'backdropClick')}>
//                         <CloseOutlined />
//                     </IconButton>
//                 </Tooltip>
//             </div>
//         </Dialog>
//     )
// }
//
// export default _DndPreviewDialog
