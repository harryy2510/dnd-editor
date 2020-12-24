import React, { useRef, useEffect } from 'react'
import { Formik, Form, Field, useFormikContext, FormikProps } from 'formik'
import * as yup from 'yup'
import { useDndEditorContext } from '../DndEditorProvider'
import Container from '../assets/Container'
import { DndComponentItem } from '../types'
import { checkForDiplayCondition } from '../utils'
import FormObserver from './preferences/components/FormObserver'

export interface FormRendererProps {
    onSubmit: (value: any) => void
    onChange: (value: any) => void
    initialValues: any
}

const FormRenderer: React.FC<FormRendererProps> = ({
    onSubmit,
    onChange,
    initialValues,
    ...props
}) => {
    const renderProps = useDndEditorContext()

    const Children = () => {
        const formik = useFormikContext()
        return (
            <div>
                {renderProps.state.items
                    ?.filter((item) =>
                        checkForDiplayCondition(
                            renderProps.state.entities[item.id].values.__condition,
                            formik,
                            renderProps.sampleData
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

    console.log('initialValues', initialValues)
    //@ts-ignore
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(s) => onSubmit && onSubmit(s)}
        >
            <Form style={{ paddingBottom: '50px' }}>
                {renderProps.template.render(renderProps, <Children />)}
                <FormObserver onChange={onChange} />
            </Form>
        </Formik>
    )
}

export default FormRenderer
