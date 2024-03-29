import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Radio } from '@material-ui/core'
import { FormikValues, useFormikContext } from 'formik'
import { get } from 'lodash-es'
import React from 'react'
import * as yup from 'yup'
import { InputOption } from '../../components/preferences/items/InputOptions'
import { DndComponentItem, RenderProps } from '../../types'
import { getComponentState, getFormikProps, useValidations } from '../../utils'

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
            // const [inputValue, setInputValue] = useState(hasOther ? formikProps.value : '')
            formikProps.onChange = (value: string | boolean) => {
                formik.setFieldValue(formKey, { text: value, valueType: 'String' })
            }
            // formikProps = { ...formikProps, ...{ inputValue, setInputValue } }
            formikProps.onControlClick = () => {}
        }

        console.log(formikProps)

        return (
            <FormControl
                fullWidth
                component="fieldset"
                style={{ textAlign: 'left' }}
                onClick={formikProps.onControlClick}
                error={formikProps?.error}
            >
                <FormLabel component="legend" style={{ marginBottom: 4, display: 'block' }}>
                    {labelText}
                </FormLabel>
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
                </FormGroup>
                <FormHelperText>{formikProps.helperText?.text || state?.hint}</FormHelperText>
            </FormControl>
        )
    },
    export: () => '',
    initialValues: {
        question: 'Single Choice',
        placeholder: '',
        showOther: false,
        hint: '',
        options: [{ key: 'yes', label: 'Yes', value: { text: 'Yes', valueType: 'String' } }],
        validation: { type: 'none' },
        pii: '',
        className: '',
        required: false,
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
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ],
    validationSchema: (renderProps, id) => {
        const state = getComponentState(renderProps, id)
        const { validations } = useValidations()
        const validation = get(validations, state?.validation.key)
        let schema =
            validation?.validation?.(validation.toString(state?.validation.formValue)) ||
            yup.string()
        schema = state?.required ? schema.required('Required field') : schema
        if (!state?.required) {
            return yup.object().shape({ text: schema }).nullable()
        }
        return yup.object().shape({ text: schema })
    }
} as DndComponentItem
