import React, { useRef } from 'react'
import { Formik, Form, Field, useFormikContext, FormikProps } from 'formik'
import * as yup from 'yup'
import { useDndEditorContext } from '../DndEditorProvider'
import Container from '../assets/Container'
import { DndComponentItem } from '../types'
import { checkForDiplayCondition } from '../utils'

export interface FormRendererProps {
    onSubmit: (value: any) => void
    onChange: (value: any) => void
}

const FormRenderer: React.FC<FormRendererProps> = ({ onSubmit, onChange, ...props }) => {
    const renderProps = useDndEditorContext()

    const Children = () => {
        const formik = useFormikContext()
        console.log(formik, 'display condition check')
        return (
            <div>
                {renderProps.state.items
                    ?.filter((item) =>
                        checkForDiplayCondition(
                            renderProps.state.entities[item.id].values.__condition,
                            formik
                        )
                    )
                    .map((item) => {
                        const stateItem = renderProps.state.entities[item.id]
                        const name = stateItem.name
                        const updatedRenderProps = { ...renderProps, item, name }
                        return (
                            <div key={item.id}>
                                {Container.render(
                                    updatedRenderProps,
                                    renderProps.itemsMap[stateItem.parent.id]?.render?.(
                                        updatedRenderProps
                                    )
                                )}
                            </div>
                        )
                    })}
            </div>
        )
    }

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
    const ref = useRef<FormikProps<{}>>(null)
    return (
        <Formik
            enableReinitialize
            innerRef={ref}
            initialValues={{}}
            onSubmit={(s) => onSubmit && onSubmit(s)}
        >
            <Form style={{ paddingBottom: '50px' }} onChange={(e) => onChange(ref.current?.values)}>
                {renderProps.template.render(renderProps, <Children />)}
                {props.children}
            </Form>
        </Formik>
    )
}

export default FormRenderer
