import { Trans } from '@lingui/macro'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { CloseOutlined } from '@material-ui/icons'
import React from 'react'
import {
    Button,
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    Theme,
    Tooltip,
    Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useDndEditorContext } from '../../DndEditorProvider'
import { exportToHtml } from '../../utils'
import Input from '../preferences/components/Input'

const useStyles = makeStyles(({ spacing, palette: { primary } }: Theme) => ({
    dialogContent: {
        padding: spacing(2, 3, 4)
    },
    inline: {
        display: 'flex',
        alignItems: 'center'
    },
    headerActions: {
        position: 'absolute',
        right: spacing(1),
        top: spacing(1)
    },

    notchedOutline: {},
    root: {
        height: 40,
        '&.Mui-focused $notchedOutline': {
            borderWidth: 2
        }
    },
    input: {
        padding: spacing(0.75, 1.25),
        fontSize: 16
    },
    button: {
        color: primary.main,
        backgroundColor: fade(primary.main, 0.2),
        fontWeight: 600,
        flex: '0 0 100px',
        marginLeft: spacing(2),
        marginBottom: spacing(0.25)
    }
}))

export interface DndSendEmailDialogProps extends Omit<DialogProps, 'children'> {}

const DndSendEmailDialog: React.FC<DndSendEmailDialogProps> = (props) => {
    const [email, setEmail] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const editorContext = useDndEditorContext()
    const classes = useStyles()
    const inputClasses = {
        root: classes.root,
        input: classes.input,
        notchedOutline: classes.notchedOutline
    }
    const handleSend = () => {
        if (email) {
            const emails = email.split(',').map((e) => e.trim())
            editorContext
                .onSendEmail?.(emails, exportToHtml(editorContext))
                .then(() => {
                    props.onClose?.({}, 'backdropClick')
                })
                .catch(console.log)
        } else {
            props.onClose?.({}, 'backdropClick')
        }
    }
    return (
        <Dialog fullWidth maxWidth="sm" {...props}>
            <DialogTitle disableTypography>
                <Typography variant="h5" color="primary">
                    <Trans>Send Test Email</Trans>
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography gutterBottom variant="body2" color="textSecondary">
                    <Trans>You can send to multiple emails, separated by a comma</Trans>
                </Typography>
                <div className={classes.inline}>
                    <Input
                        type="email"
                        value={email}
                        onChange={setEmail}
                        InputProps={{ classes: inputClasses }}
                        placeholder="Email"
                    />
                    <Button onClick={handleSend} className={classes.button}>
                        <Trans>Send Email</Trans>
                    </Button>
                </div>
            </DialogContent>
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

export default DndSendEmailDialog
