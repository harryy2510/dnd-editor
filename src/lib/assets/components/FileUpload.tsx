import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Grid, Button, FormHelperText, InputLabel, Theme } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import { CloudUpload } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(
    ({
        spacing,
        typography: { h3, fontWeightBold, body2 },
        palette: { text, action, background, primary, grey }
    }: Theme) => ({
        root: {
            padding: spacing(1),
            textAlign: 'left'
        },
        dragDropContainer: {
            textAlign: 'center',
            border: `1px dotted ${grey[400]}`,
            backgroundColor: grey[200]
        },
        uploadIcon: {
            ...h3,
            color: grey[500]
        }
    })
)
export default {
    render: (renderProps: RenderProps, id: string) => {
        const classes = useStyles()
        if (!renderProps.item || !id) {
            return null
        }
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        return (
            <Grid
                container
                spacing={2}
                className={classes.root}
                alignItems="center"
                onClick={handleClick}
            >
                <Grid item xs={12}>
                    <InputLabel htmlFor="my-input">{labelText}</InputLabel>
                </Grid>
                <Grid item xs={12} className={classes.dragDropContainer}>
                    <Grid container xs={12}>
                        <Grid alignContent="center" item xs={12}>
                            <CloudUpload className={classes.uploadIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <Trans>Browse Files</Trans>
                        </Grid>
                        <Grid item xs={12}>
                            <Trans>Drag and drop files here</Trans>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <FormHelperText id="my-helper-text">{state?.hint}</FormHelperText>
                </Grid>
            </Grid>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        return ''
    },
    initialValues: {
        question: 'Upload',
        hint: 'Optional Hint',
        className: '',
        multiple: false,
        required: true,
        enabled: true
    },
    settings: [
        { id: 'question', type: 'labeledTextInput', grid: 12, label: <Trans>Question</Trans> },
        { id: 'hint', type: 'labeledTextInput', grid: 12, label: <Trans>Hint</Trans> },
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        {
            id: 'multiple',
            type: 'labeledSwitch',
            grid: 12,
            label: <Trans>Allow multiple files</Trans>
        },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ]
} as DndComponentItem
