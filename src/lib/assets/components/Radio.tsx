import React from 'react'
import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import {
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
    RadioGroup,
    Radio,
    Input
} from '@material-ui/core'
import { DndComponentItem, RenderProps } from '../../types'

export default {
    render: (renderProps: RenderProps, id: string) => {
        if (!renderProps.item || !id) {
            return null
        }

        const state = renderProps.state.entities[renderProps.item.id]?.values?.[id]
        const handleClick = (ev: React.MouseEvent<HTMLFieldSetElement>) => {
            ev.preventDefault()
            PubSub.publish('component/click', { type: 'form-elements', data: id })
        }
        const labelText = `${state?.question}${state?.required ? '*' : ''}`
        return (
            <FormControl
                fullWidth
                component="fieldset"
                style={{ textAlign: 'left' }}
                onClick={handleClick}
                disabled
            >
                <FormLabel component="legend">{labelText}</FormLabel>
                <RadioGroup aria-label="gender">
                    {state?.options
                        ?.filter((option: string) => option.length > 0)
                        .map((option: string) => (
                            <FormControlLabel
                                control={
                                    <Radio checked={state?.defaultValue === option} name={option} />
                                }
                                label={option}
                            />
                        ))}
                    {state?.showOther && (
                        <FormControlLabel
                            control={<Radio checked={false} />}
                            label={
                                <>
                                    <Trans>Other</Trans>
                                    <Input type="text" placeholder="Custom option" />
                                </>
                            }
                        />
                    )}
                </RadioGroup>
                <FormHelperText>{state?.hint}</FormHelperText>
            </FormControl>
        )
    },
    export: () => '',
    initialValues: {
        question: 'Question',
        placeholder: 'Placeholder',
        hint: 'Optional Hint',
        options: ['Yes', 'No'],
        validation: { type: 'none' },
        pii: '',
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
        {
            id: 'characterLimit',
            type: 'labeledTextInput',
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
            type: 'multilineValidation',
            grid: 12,
            label: <Trans>Validation</Trans>
        },
        { id: 'options', type: 'inputOptions', grid: 12, label: <Trans>Options</Trans> },
        {
            id: 'showOther',
            type: 'labeledSwitch',
            grid: 12,
            label: <Trans>Show other option with custom text</Trans>
        },
        { id: 'required', type: 'labeledSwitch', grid: 12, label: <Trans>Required</Trans> },
        { id: 'enabled', type: 'labeledSwitch', grid: 12, label: <Trans>Enabled</Trans> }
    ]
} as DndComponentItem
