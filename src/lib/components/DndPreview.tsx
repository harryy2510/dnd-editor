import { Trans } from '@lingui/macro'
import { ButtonBase, Theme, Tooltip } from '@material-ui/core'
import { SendOutlined, VisibilityOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { useDndEditorContext } from '../DndEditorProvider'
import DndPreviewDialog from './preview/DndPreviewDialog'
import DndSendEmailDialog from './preview/DndSendEmailDialog'

const useStyles = makeStyles(
    ({ spacing, shape: { borderRadius }, palette: { background, getContrastText } }: Theme) => ({
        actions: {
            display: 'flex',
            alignItems: 'center',
            borderRadius,
            position: 'fixed',
            bottom: spacing(2),
            left: spacing(28),
            overflow: 'hidden',
            zIndex: 1
        },
        button: {
            backgroundColor: getContrastText(background.default),
            color: background.default,
            padding: spacing(1),
            opacity: 0.5,

            '&:hover': {
                opacity: 0.8
            }
        }
    })
)

export interface DndPreviewProps {}

const DndPreview: React.FC<DndPreviewProps> = () => {
    const classes = useStyles()
    const [previewOpen, setPreviewOpen] = React.useState(false)
    const [sendEmailOpen, setSendEmailOpen] = React.useState(false)
    const { onSendEmail } = useDndEditorContext()

    return (
        <>
            {previewOpen && (
                <DndPreviewDialog open={previewOpen} onClose={() => setPreviewOpen(false)} />
            )}
            {sendEmailOpen && (
                <DndSendEmailDialog open={sendEmailOpen} onClose={() => setSendEmailOpen(false)} />
            )}
            <div className={classes.actions}>
                <Tooltip title={<Trans>Preview</Trans>}>
                    <ButtonBase onClick={() => setPreviewOpen(true)} className={classes.button}>
                        <VisibilityOutlined fontSize="small" />
                    </ButtonBase>
                </Tooltip>
                {onSendEmail && (
                    <Tooltip title={<Trans>Send Test Email</Trans>}>
                        <ButtonBase
                            onClick={() => setSendEmailOpen(true)}
                            className={classes.button}
                        >
                            <SendOutlined fontSize="small" />
                        </ButtonBase>
                    </Tooltip>
                )}
            </div>
        </>
    )
}

export default DndPreview
