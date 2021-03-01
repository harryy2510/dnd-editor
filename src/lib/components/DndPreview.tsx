import { Trans } from '@lingui/macro'
import { ButtonBase, Theme, Tooltip, Typography } from '@material-ui/core'
import { SendOutlined, VisibilityOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { useDndEditorContext } from '../DndEditorProvider'
import DndPreviewDialog from './preview/DndPreviewDialog'
import DndSendEmailDialog from './preview/DndSendEmailDialog'

const useStyles = makeStyles(
    ({
        spacing,
        shape: { borderRadius },
        palette: { background, getContrastText },
        breakpoints: { down }
    }: Theme) => ({
        actions: {
            display: 'flex',
            alignItems: 'center',
            borderRadius,
            position: 'fixed',
            bottom: spacing(2),
            overflow: 'hidden',
            zIndex: 1,
            right: spacing(60)
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
                <ButtonBase onClick={() => setPreviewOpen(true)} className={classes.button}>
                    <VisibilityOutlined fontSize="small" />
                    &nbsp;
                    <Typography variant="subtitle1">
                        <Trans>Preview</Trans>
                    </Typography>
                </ButtonBase>
                {onSendEmail && (
                    <ButtonBase onClick={() => setSendEmailOpen(true)} className={classes.button}>
                        <SendOutlined fontSize="small" />
                        &nbsp;
                        <Typography variant="subtitle1">
                            <Trans>Send Test Email</Trans>
                        </Typography>
                    </ButtonBase>
                )}
            </div>
        </>
    )
}

export default DndPreview
