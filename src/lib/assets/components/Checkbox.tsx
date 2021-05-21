import React, { useState } from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import {
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Grid
} from '@material-ui/core'
import { DndComponentItem, FormValue, RenderProps, StringFormValue } from '../../types'
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
        const checked: any = {}
        if (formik && formKey) {
            formikProps = getFormikProps(formKey, formik)
            formikProps.value = formik.values[formKey] || []
            let otherOption: StringFormValue[] = formikProps.value.filter(
                (value: StringFormValue) =>
                    !!state.options.find((o: InputOption) => o.label !== value.text)
            )
            // const [inputValue, setInputValue] = useState(
            //     otherOption?.length > 0 ? otherOption[0]?.text : ''
            // )
            formikProps.onChange = (option: string, checked: boolean) => {
                let oldValue: StringFormValue[] = formikProps.value.filter(
                    (formValue: StringFormValue) => formValue.text !== option
                )
                if (checked) oldValue = [{ text: option, valueType: 'String' }, ...oldValue]
                formik.setFieldValue(formKey, oldValue)
            }
            // formikProps = { ...formikProps, inputValue }
            formikProps.onOtherCheckboxChange = (checked: boolean, inputValue: string) => {
                let oldValue: StringFormValue[] = formikProps.value.filter(
                    (value: StringFormValue) =>
                        state.options.find((o: InputOption) => o.label === value.text)
                )
                if (checked) oldValue.push({ text: inputValue, valueType: 'String' })
                formik.setFieldValue(formKey, oldValue)
            }
            formikProps.setInputValue = (newInputValue: string) => {
                let oldValue: StringFormValue[] = formikProps.value.filter(
                    (value: StringFormValue) =>
                        state.options.find((o: InputOption) => o.label !== value.text)
                )
                formikProps.onOtherCheckboxChange(oldValue.length !== 0, newInputValue)
                // setInputValue(newInputValue)
            }
            formikProps.value.forEach(
                (value: FormValue) => (checked[(value as StringFormValue).text] = true)
            )
        }
        return (
            <FormControl
                fullWidth
                component="fieldset"
                style={{ textAlign: 'left' }}
                onClick={formikProps.onControlClick}
                error={formikProps?.error}
            >
                <FormLabel component="legend" style={{ marginBottom: 4, display: 'block' }}>
                    Country
                </FormLabel>
                <FormGroup>
                    {state?.options
                        ?.filter((option: InputOption) => option.label.length > 0)
                        .map((option: InputOption, i: number) => (
                            <FormControlLabel
                                key={i}
                                control={
                                    <Checkbox
                                        name={option.label}
                                        checked={!!checked[option.label]}
                                        onChange={(e) =>
                                            formikProps?.onChange?.(option.label, e.target.checked)
                                        }
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                </FormGroup>
                <FormHelperText>{formikProps.helperText || state?.hint}</FormHelperText>
            </FormControl>
        )
    },
    export: () => '',
    initialValues: {
        question: 'Multiple Choice',
        placeholder: '',
        showOther: false,
        hint: '',
        options: [{ key: 'yes', label: 'Yes', value: { text: 'Yes', valueType: 'String' } }],
        validation: { type: 'none' },
        pii: '',
        className: '',
        required: false,
        enabled: true,
        itemType: 'Checkbox',
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
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps, id, parentSchema) => {
        return yup.array()
    }
} as DndComponentItem
