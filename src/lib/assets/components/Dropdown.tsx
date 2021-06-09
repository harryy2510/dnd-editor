import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { FormLabel, MenuItem, TextField } from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import { getComponentState, getFormikProps } from '../../utils'
import * as yup from 'yup'
import { FormikValues, useFormikContext } from 'formik'

export default {
    render: (renderProps: RenderProps, id: string, formKey) => {
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = getComponentState(renderProps, id)

        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        let formikProps: any = {}
        const formik = useFormikContext<FormikValues>()
        if (formik && formKey) {
            formikProps = getFormikProps(formKey, formik, (value) => ({
                text: value,
                valueType: 'String'
            }))
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            if (Array.isArray(formikProps.value)) {
                formik.setFieldValue(formKey, formikProps.value[0])
            }
            formikProps.value = formikProps.value?.text
        }
        return (
            <div onClick={handleClick}>
                <FormLabel component="legend" style={{ marginBottom: 4, display: 'block' }}>
                    {labelText}
                </FormLabel>
                <TextField
                    size="small"
                    id={`${renderProps?.item?.id}-${id}`}
                    select
                    rows={state?.rows}
                    variant="outlined"
                    fullWidth
                    placeholder={state?.placeholder}
                    value={state?.defaultValue}
                    helperText={state?.hint}
                    {...formikProps}
                >
                    {state?.options?.map((option: any, i: number) => (
                        <MenuItem key={i} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        )
    },
    export: (renderProps: RenderProps, id: string) => {
        return ''
    },
    initialValues: {
        question: 'Dropdown',
        placeholder: '',
        hint: '',
        pii: '',
        defaultValue: 'Option 1',
        options: [
            { key: 'option-1', label: 'Option 1', value: { text: 'Option 1', valueType: 'String' } }
        ],
        className: '',
        required: false,
        enabled: true,
        itemType: 'Dropdown',
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
        schema = state?.required ? schema.required('Required field') : schema
        return yup.object().shape({ text: schema })
    }
} as DndComponentItem
