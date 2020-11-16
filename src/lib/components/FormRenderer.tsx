import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { useDndEditorContext } from '../DndEditorProvider'
import Container from '../assets/Container'
import { DndComponentItem } from '../types'

export interface FormRendererProps {
    onSubmit: (value: any) => void
}

const FormRenderer: React.FC<FormRendererProps> = ({ onSubmit }) => {
    const renderProps = useDndEditorContext()

    const Children = () => (
        <div>
            {renderProps.state.items?.map((item) => {
                const stateItem = renderProps.state.entities[item.id]
                const name = stateItem.name
                const updatedRenderProps = { ...renderProps, item, name }
                return (
                    <div key={item.id}>
                        {Container.render(
                            updatedRenderProps,
                            renderProps.itemsMap[stateItem.parent.id]?.render?.(updatedRenderProps)
                        )}
                    </div>
                )
            })}
        </div>
    )

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

    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            onSubmit={(s) => onSubmit && onSubmit(s)}
            validationSchema={validationSchema}
        >
            <Form style={{ paddingBottom: '50px' }}>
                {renderProps.template.render(renderProps, <Children />)}
                <Field type="submit" value="Submit" id="submit"></Field>
            </Form>
        </Formik>
    )
}

export default FormRenderer
