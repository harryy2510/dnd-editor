import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { FormLabel, TextField } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers'
import { FormikValues, useFormikContext } from 'formik'
import { get, noop } from 'lodash-es'
import React from 'react'
import * as yup from 'yup'
import { DndComponentItem, RenderProps } from '../../types'
import { getComponentState, getFormikProps, useValidations } from '../../utils'

export default {
    render: (renderProps: RenderProps, id: string, formKey: string) => {
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = getComponentState(renderProps, id)
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        let formikProps: any = {
            value: null
        }
        const formik = useFormikContext<FormikValues>()
        if (formik && formKey) {
            formikProps = getFormikProps(formKey, formik, (value: Date) => {
                return {
                    text: value?.toISOString?.() ?? null,
                    valueType: 'Timestamp'
                }
            })
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            if (Array.isArray(formikProps.value)) {
                formik.setFieldValue(formKey, formikProps.value[0])
            }
            formikProps.value = formikProps.value?.text ? new Date(formikProps.value?.text) : null
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            formikProps.onChange = (date: Date) =>
                formik.setFieldValue(formKey, {
                    text: date?.toISOString?.() ?? '',
                    valueType: 'Timestamp'
                })
        }
        const error = (formik?.errors?.[formKey] as any)?.text
        return (
            <div onClick={handleClick}>
                <FormLabel component="legend" style={{ marginBottom: 4, display: 'block' }}>
                    {labelText}
                </FormLabel>
                <DatePicker
                    disableMaskedInput
                    inputFormat="MMM DD, YYYY"
                    value={formikProps.value}
                    onChange={formikProps.onChange || noop}
                    renderInput={(props) => (
                        <TextField
                            {...formikProps}
                            {...props}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={Boolean(error)}
                            helperText={error}
                        />
                    )}
                />
            </div>
        )
    },
    export: () => {
        return ''
    },
    initialValues: {
        question: 'Date',
        placeholder: '',
        hint: '',
        inputType: 'text',
        multiline: false,
        characterLimit: null,
        pii: '',
        className: '',
        required: false,
        enabled: true,
        grid: 12,
        itemType: 'Datepicker',
        validation: { key: 'none' },
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
        {
            id: 'characterLimit',
            type: 'labeledNumberInput',
            grid: 12,
            label: <Trans>Character limit</Trans>
        },
        { id: 'pii', type: 'labeledTextInput', grid: 12, label: <Trans>PII</Trans> },
        { id: 'validation', type: 'inputValidation', grid: 12, label: <Trans>Validation</Trans> },
        {
            id: 'defaultValue',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Default value</Trans>
        },
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps: RenderProps, id: string, parentSchema) => {
        const state = getComponentState(renderProps, id)
        const { validations } = useValidations()
        const validation = get(validations, state?.validation.key)
        let schema =
            validation?.validation?.(validation.toString(state?.validation.formValue)) ||
            parentSchema ||
            yup.string()
        schema = state?.required ? schema.required('Required field') : schema
        if (!state?.required) {
            return yup.object().shape({ text: schema }).nullable()
        }
        return yup.object().shape({ text: schema })
    }
} as DndComponentItem
