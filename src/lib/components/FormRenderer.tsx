import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndComponentItem } from '../types'
import FormElements from './FormElements'
import FormObserver from './preferences/components/FormObserver'

export interface FormRendererProps {
    onSubmit?: (value: any) => void
    onChange?: (value: any) => void
    formId: string
    initialValues?: any
}

const FormRenderer: React.FC<FormRendererProps> = ({
    onSubmit,
    onChange,
    formId,
    initialValues: _initialValues,
    children
}) => {
    const renderProps = useDndEditorContext()
    let validation: any = {}
    renderProps.state.items?.map((item) => {
        const stateItem = renderProps.state.entities[item.id]
        const name = stateItem.name
        const updatedRenderProps = { ...renderProps, item, name }
        const itemValidation = (renderProps.itemsMap[
            stateItem.parent.id
        ] as DndComponentItem)?.validationSchema?.(updatedRenderProps)
        if (itemValidation && stateItem.name) validation = { ...validation, ...itemValidation }
    })
    const validationSchema = yup.object().shape(validation)

    const initialValues = {
        ..._initialValues
    }
    console.log('initialValues', initialValues)
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(s) => onSubmit?.(s)}
            validationSchema={validationSchema}
        >
            <Form id={formId}>
                {renderProps.template.render(
                    renderProps,
                    <FormElements renderProps={renderProps} />
                )}
                {children}
                {onChange && <FormObserver onChange={onChange} />}
            </Form>
        </Formik>
    )
}

export default FormRenderer
