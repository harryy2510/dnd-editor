import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import { getComponentState, getFromikProps } from '../../utils'
import * as yup from 'yup'
import { useFormikContext } from 'formik'

export default {
    render: (renderProps: RenderProps, id: string, formKey) => {
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = getComponentState(renderProps, id)

        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        let formikProps: any = {}
        if (!renderProps.builderMode && formKey) {
            formikProps = getFromikProps(formKey, useFormikContext())
        }
        console.log('dropdown', state)
        return (
            <FormControl
                fullWidth
                variant="outlined"
                style={{ textAlign: 'left' }}
                onClick={handleClick}
                disabled={renderProps.builderMode}
            >
                <InputLabel id="demo-simple-select-outlined-label">{labelText}</InputLabel>
                <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value=""
                    label={labelText}
                    {...formikProps}
                >
                    {state?.options?.map((option: string, i: number) => (
                        <MenuItem key={i} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText id="my-helper-text" error={formikProps.error}>
                    {formikProps?.helperText || state?.hint}
                </FormHelperText>
            </FormControl>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        return ''
    },
    initialValues: {
        question: 'Question',
        placeholder: 'Placeholder',
        hint: 'Optional Hint',
        pii: '',
        defaultValue: 'Option 1',
        options: ['Option 1', 'Option 2'],
        className: '',
        required: true,
        enabled: true,
        style: {
            textAlign: 'left'
        }
    },
    settings: [
        { id: 'question', type: 'labeledTextInput', grid: 12, label: <Trans>Question</Trans> },
        {
            id: 'placeholder',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Custom Placeholder</Trans>
        },
        { id: 'hint', type: 'labeledTextInput', grid: 12, label: <Trans>Hint</Trans> },
        { id: 'pii', type: 'labeledTextInput', grid: 12, label: <Trans>PII</Trans> },
        {
            id: 'defaultValue',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Default value</Trans>
        },
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        {
            id: 'validation',
            type: 'validation',
            grid: 12,
            label: <Trans>Validation</Trans>
        },
        { id: 'options', type: 'inputOptions', grid: 12, label: <Trans>Options</Trans> },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps, id, parentSchema) => {
        const state = getComponentState(renderProps, id)
        let schema: any = yup.string()
        schema = state?.required ? schema.required('required field') : schema
        return schema
    }
} as DndComponentItem
