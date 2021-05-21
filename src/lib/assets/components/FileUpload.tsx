import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Grid, FormHelperText, FormLabel } from '@material-ui/core'
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
            <Grid
                container
                spacing={2}
                style={{ textAlign: 'left', margin: 0, width: '100%' }}
                onClick={handleClick}
            >
                <Grid item xs={12}>
                    <FormLabel component="legend" style={{ marginBottom: 4, display: 'block' }}>
                        {labelText}
                    </FormLabel>
                </Grid>
                <Uploader value="" onChange={() => {}} />
                <Grid item xs={12}>
                    <FormHelperText>{state?.hint}</FormHelperText>
                </Grid>
            </Grid>
        )
    },
    export: () => {
        return ''
    },
    initialValues: {
        question: 'Upload',
        hint: '',
        className: '',
        multiple: false,
        required: false,
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
