import React, { useState } from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import {
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Grid,
    Radio
} from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'
import * as yup from 'yup'
import { getComponentState, getFormikProps } from '../../utils'
import { FormikValues, useFormikContext } from 'formik'
import { InputOption } from '../../components/preferences/items/InputOptions'

export default {
    render: (renderProps: RenderProps, id: string, formKey) => {
        const state = getComponentState(renderProps, id)
        const handleClick = (ev: React.MouseEvent<HTMLFieldSetElement>) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const labelText = `${state?.question}${state?.required ? '*' : ''}`

        let formikProps: any = {
            onControlClick: handleClick,
            inputValue: '',
            setInputValue: () => {}
        }
        const formik = useFormikContext<FormikValues>()
        if (formik && formKey) {
            formikProps = getFormikProps(formKey, formik)
            if (Array.isArray(formikProps.value)) {
                formik.setFieldValue(formKey, formikProps.value[0])
            }
            formikProps.value = formikProps.value?.text
            const hasOther = !state?.options.find(
                (option: InputOption) => option.label === formikProps.value
            )
            const [inputValue, setInputValue] = useState(hasOther ? formikProps.value : '')
            formikProps.onChange = (value: string | boolean) => {
                formik.setFieldValue(formKey, { text: value, valueType: 'String' })
            }
            formikProps = { ...formikProps, ...{ inputValue, setInputValue } }
            formikProps.onControlClick = () => {}
        }

        return (
            <FormControl
                fullWidth
                component="fieldset"
                style={{ textAlign: 'left' }}
                onClick={formikProps.onControlClick}
                error={formikProps?.error}
            >
                <FormLabel component="legend">{labelText}</FormLabel>
                <FormGroup>
                    {state?.options
                        ?.filter((option: InputOption) => option.label.length > 0)
                        .map((option: InputOption, i: number) => (
                            <FormControlLabel
                                key={i}
                                control={
                                    <Radio
                                        name={option.label}
                                        checked={formikProps?.value === option.label}
                                        onClick={() => formikProps?.onChange?.(option.label)}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    {state?.showOther && (
                        <FormControlLabel
                            key={'other'}
                            control={
                                <Radio
                                    checked={formikProps?.value === formikProps.inputValue}
                                    onClick={() => formikProps.onChange?.(formikProps.inputValue)}
                                />
                            }
                            label={
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Trans>Other</Trans>
                                    </Grid>
                                    <Input
                                        type="text"
                                        placeholder="Custom option"
                                        defaultValue={formikProps.inputValue}
                                        onBlur={(e) => formikProps.setInputValue(e.target.value)}
                                    />
                                </Grid>
                            }
                        />
                    )}
                </FormGroup>
                <FormHelperText>{formikProps.helperText || state?.hint}</FormHelperText>
            </FormControl>
        )
    },
    export: () => '',
    initialValues: {
        question: 'Question',
        placeholder: 'Placeholder',
        showOther: false,
        hint: 'Optional Hint',
        options: [{ key: 'yes', label: 'Yes', value: { text: 'Yes', valueType: 'String' } }],
        validation: { type: 'none' },
        pii: '',
        className: '',
        required: true,
        enabled: true,
        itemType: 'Radio',
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
        { id: 'className', type: 'labeledTextInput', grid: 12, label: <Trans>Class name</Trans> },
        { id: 'options', type: 'inputOptions', grid: 12, label: <Trans>Options</Trans> },
        {
            id: 'showOther',
            type: 'labeledSwitch',
            grid: 12,
            label: <Trans>Show other option with custom text</Trans>
        },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps, id) => {
        const state = getComponentState(renderProps, id)
        let schema: any = yup.object()
        return schema
    }
} as DndComponentItem
