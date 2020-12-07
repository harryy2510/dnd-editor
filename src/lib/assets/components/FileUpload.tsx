import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Grid, FormHelperText, InputLabel } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import Uploader from '../../components/preferences/components/Uploader'

export default {
    render: (renderProps: RenderProps, id: string) => {
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
            <Grid container spacing={2} style={{ textAlign: 'left' }} onClick={handleClick}>
                <Grid item xs={12}>
                    <InputLabel htmlFor="my-input">{labelText}</InputLabel>
                </Grid>
                <Uploader value="" onChange={() => {}} />
                <Grid item xs={12}>
                    <FormHelperText id="my-helper-text">{state?.hint}</FormHelperText>
                </Grid>
            </Grid>
        )
    },
    export: () => {
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
