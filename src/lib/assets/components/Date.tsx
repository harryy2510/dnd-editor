import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { TextField } from '@material-ui/core'
import * as yup from 'yup'
import { DndComponentItem, RenderProps } from '../../types'
import { FormikValues, useFormikContext } from 'formik'
import { getFormikProps, getComponentState, useValidations } from '../../utils'
import { get, noop } from 'lodash-es'
import { DatePicker } from '@material-ui/pickers'

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
                    text: value.toISOString(),
                    valueType: 'String'
                }
            })
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            if (Array.isArray(formikProps.value)) {
                formik.setFieldValue(formKey, formikProps.value[0])
            }
            formikProps.value = formikProps.value?.text ? new Date(formikProps.value?.text) : null
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            formikProps.onChange = (date: Date) =>
                formik.setFieldValue(formKey, { text: date.toISOString(), valueType: 'String' })
        }
        return (
            <div onClick={handleClick}>
                <DatePicker
                    label={labelText}
                    value={formikProps.value}
                    onChange={formikProps.onChange || noop}
                    renderInput={(props) => (
                        <TextField
                            {...formikProps}
                            {...props}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label={labelText}
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
        question: 'Question',
        placeholder: 'Placeholder',
        hint: 'Optional Hint',
        inputType: 'text',
        multiline: false,
        characterLimit: '12',
        pii: '',
        className: '',
        required: true,
        enabled: true,
        grid: 12,
        itemType: 'Input',
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
        schema = state?.characterLimit
            ? schema.max(state?.characterLimit, `Character limit is ${state?.characterLimit}`)
            : schema
        return yup.object().shape({ text: schema })
    }
} as DndComponentItem
