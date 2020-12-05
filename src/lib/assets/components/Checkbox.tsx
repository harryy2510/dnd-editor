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
import { DndComponentItem, RenderProps } from '../../types'
import * as yup from 'yup'
import { getComponentState, getFromikProps } from '../../utils'
import { useFormikContext } from 'formik'

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
        if (!renderProps.buildermode && formKey) {
            const formik = useFormikContext()
            const [inputValue, setInputValue] = useState('')
            formikProps = getFromikProps(formKey, formik)
            formikProps.onChange = (option: string, value: string | boolean) => {
                let oldValue = formikProps.value || {}
                oldValue[option] = value
                formik.setFieldValue(formKey, oldValue)
            }
            formikProps = { ...formikProps, ...{ inputValue, setInputValue } }
            formikProps.onOtherCheckboxChange = (value: boolean) => {
                let oldValue = formikProps.value || {}
                if (value) oldValue['other'] = inputValue
                else delete oldValue['other']
                formik.setFieldValue(formKey, oldValue)
            }
            formikProps.onControlClick = () => {}
        }

        console.log('checkbox values')
        return (
            <FormControl
                fullWidth
                component="fieldset"
                style={{ textAlign: 'left' }}
                disabled={renderProps.buildermode}
                onClick={formikProps.onControlClick}
                error={formikProps?.error}
            >
                <FormLabel component="legend">{labelText}</FormLabel>
                <FormGroup>
                    {state?.options
                        ?.filter((option: any) => option.label.length > 0)
                        .map((option: any, i: number) => (
                            <FormControlLabel
                                key={i}
                                control={
                                    <Checkbox
                                        name={option.label}
                                        checked={formikProps?.value?.[option]}
                                        onChange={(e) =>
                                            formikProps?.onChange(option.label, e.target.checked)
                                        }
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    {state?.showOther && (
                        <FormControlLabel
                            key={'other'}
                            control={
                                <Checkbox
                                    defaultChecked={formikProps?.value?.['other']}
                                    onChange={(e) =>
                                        formikProps.onOtherCheckboxChange(e.target.checked)
                                    }
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
        {
            id: 'showOther',
            type: 'labeledSwitch',
            grid: 12,
            label: <Trans>Show other option with custom text</Trans>
        },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps, id, parentSchema) => {
        const state = getComponentState(renderProps, id)
        let schema: any = yup.object()
        schema = state?.required
            ? schema
                  .required('Field is required')
                  .test('empty-check', 'Field is required', (value: any) =>
                      Object.keys(value || []).reduce((acc, key) => {
                          return acc || !!value[key]
                      }, false)
                  )
            : schema
        return schema
    }
} as DndComponentItem
