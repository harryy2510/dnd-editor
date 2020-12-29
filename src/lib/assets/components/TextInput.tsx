import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { TextField, Box } from '@material-ui/core'
import * as yup from 'yup'
import { DndComponentItem, RenderProps, Primitive } from '../../types'
import { useFormikContext } from 'formik'
import { getFromikProps, getComponentState, useValidations } from '../../utils'
import { get } from 'lodash-es'

export default {
    render: (renderProps: RenderProps, id: string, formKey: string) => {
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = getComponentState(renderProps, id)
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        let formikProps: any = {}
        const formik = useFormikContext()
        if (formik && formKey) {
            formikProps = getFromikProps(formKey, formik, (value) => {
                return {
                    text: value,
                    valueType: 'String'
                }
            })
            formikProps.helperText = formikProps.helperText?.text || state?.hint
            formikProps.value = Array.isArray(formikProps.value)
                ? formikProps.value[0]
                : formikProps.value
        }
        return (
            <div onClick={handleClick}>
                <TextField
                    size="small"
                    id={`${renderProps?.item?.id}-${id}`}
                    type={state?.inputType || 'text'}
                    multiline={state?.multiline}
                    rows={state?.rows}
                    variant="outlined"
                    fullWidth
                    label={labelText}
                    placeholder={state?.placeholder}
                    value={state?.defaultValue}
                    helperText={state?.hint}
                    {...formikProps}
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
