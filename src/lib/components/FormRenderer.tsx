import { Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { useDndEditorContext } from '../DndEditorProvider'
import { renderItems, setList } from '../utils'
import clsx from 'clsx'
import DndItemPreview from './DndItemPreview'
import Container from '../assets/Container'
import { Formik, Form, useFormikContext, Field } from 'formik'
import * as yup from 'yup'
import { DndItem } from '../types'

const useStyles = makeStyles(({ palette: { primary }, spacing }: Theme) => ({
    document: {
        padding: spacing(4, 2)
    },
    root: {
        width: '100%',
        minHeight: 240,
        '& .dnd-item': {
            height: 40,
            backgroundColor: fade(primary.main, 0.08),
            border: `2px dashed ${primary.main}`,
            '& > *': {
                opacity: 0
            }
        }
    },
    active: {
        '& > *': {
            outline: `1px solid ${primary.main}`
        }
    }
}))
export interface FormRendererProps {
    onChange?: (value: any) => void
    onBlur?: (value: any) => void
}
const FormRenderer: React.FC<FormRendererProps> = ({ onChange, onBlur }) => {
    const classes = useStyles()
    const renderProps = useDndEditorContext()

    const formikInitialValues = renderProps.state.items.map(
        (item) => renderProps.state.entities[item.id]
    )
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
        const itemValidation = renderProps.itemsMap[stateItem.parent.id]?.validationSchema?.(
            updatedRenderProps
        )
        if (itemValidation && stateItem.name) validation = { ...validation, ...itemValidation }
    })
    const validationSchema = yup.object().shape(validation)
    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            onChange={(s) => console.log(s)}
            onBlur={onBlur}
            onSubmit={(s) => console.log(s)}
            validationSchema={validationSchema}
        >
            <Form style={{ paddingBottom: '50px' }}>
                {renderProps.template.render(renderProps, <Children />)}
                <Field type="submit" value="Submit" id="submit"></Field>
            </Form>
        </Formik>
    )
}

FormRenderer.defaultProps = {
    onChange: (value: any) => undefined,
    onBlur: (value: any) => undefined
}

export default FormRenderer
