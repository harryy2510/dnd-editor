import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { TextField } from '@material-ui/core'
import * as yup from 'yup'
import { DndComponentItem, RenderProps, Primitive } from '../../types'
import { useFormikContext } from 'formik'
import { getFromikProps, getComponentState } from '../../utils'

export default {
    render: (renderProps: RenderProps, id: string, formKey: string) => {
        const handleClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const state = getComponentState(renderProps, id)
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        let formikProps: any = {}
        if (!renderProps.buildermode && formKey) {
            const formik = useFormikContext()
            formikProps = getFromikProps(formKey, formik)
            formikProps.helperText = formikProps.helperText || state?.hint
        }
        return (
            <TextField
                id={`${renderProps?.item?.id}-${id}`}
                type={state?.inputType || 'text'}
                onClick={handleClick}
                multiline={state?.multiline}
                rows={state?.rows}
                variant="outlined"
                fullWidth
                InputLabelProps={state?.labelProps}
                label={labelText}
                placeholder={state?.placeholder}
                value={state?.defaultValue}
                helperText={state?.hint}
                disabled={renderProps.buildermode}
                {...formikProps}
            />
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
        validation: { type: 'none' },
        characterLimit: '12',
        pii: '',
        className: '',
        required: true,
        enabled: true,
        lableProps: {
            shrink: false
        },
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
        {
            id: 'defaultValue',
            type: 'labeledTextInput',
            grid: 12,
            label: <Trans>Default value</Trans>
        },
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        {
            id: 'validation',
            type: 'inputValidation',
            grid: 12,
            label: <Trans>Validation</Trans>
        },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps: RenderProps, id: string, parentSchema) => {
        const state = getComponentState(renderProps, id)
        let schema = parentSchema || yup.string()
        schema = state?.required ? schema.required('Required field') : schema
        schema = state?.characterLimit
            ? schema.max(state?.characterLimit, `Character limit is ${state?.characterLimit}`)
            : schema
        schema = state?.validation
            ? schema.matches(new RegExp(state?.validation.value), {
                  message: `Input must match: ${state?.validation.type}`
              })
            : schema
        return schema
    }
} as DndComponentItem
