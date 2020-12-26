import React from 'react'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndComponentItem } from '../types'
import FormObserver from './preferences/components/FormObserver'
import FormElements from './FormElements'

export interface FormRendererProps {
    onSubmit?: (value: any) => void
    onChange?: (value: any) => void
    formId: string
}

const FormRenderer: React.FC<FormRendererProps> = ({ onSubmit, onChange, formId, ...props }) => {
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

    //@ts-ignore
    return (
        <Formik enableReinitialize initialValues={{}} onSubmit={(s) => onSubmit?.(s)}>
            <Form id={formId}>
                {renderProps.template.render(
                    renderProps,
                    <FormElements renderProps={renderProps} />
                )}
                {props.children}
                {onChange && <FormObserver onChange={onChange} />}
            </Form>
        </Formik>
    )
}

export default FormRenderer
