import React from 'react'
import { useFormikContext } from 'formik'
import { RenderProps } from '../types'
import { checkForDiplayCondition } from '../utils'
import Container from '../assets/Container'

type Props = {
    renderProps: RenderProps
}

const FormElements: React.FC<Props> = ({ renderProps }) => {
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
                            {Container['form'].render(
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

export default FormElements
