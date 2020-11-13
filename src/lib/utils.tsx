import { Trans } from '@lingui/macro'
import { FormikValues, FormikContextType } from 'formik'
import { cloneDeep, forEach, isEqual, merge, omit, omitBy, set, get } from 'lodash-es'
import { nanoid } from 'nanoid'
import React from 'react'
// @ts-ignore
import reactToCSS from 'react-style-object-to-css'
import juice from 'juice'

import Container from './assets/Container'
import DndItemPreview from './components/DndItemPreview'
import emailTemplate from './emailTemplate'
import {
    Condition,
    DndItem,
    DndState,
    DndStateItemEntity,
    DndTemplateItem,
    Primitive,
    RenderProps
} from './types'

export const removeItem = (renderProps: RenderProps, id?: string) => {
    if (id) {
        renderProps.onActiveChange(null)
        renderProps.setState((existingState) => {
            const updatedEntities = omitBy(existingState.entities, (e, i) => i === id)
            const updatedItems = existingState.items.filter((item) => item.id !== id)
            return {
                ...existingState,
                items: updatedItems,
                entities: updatedEntities
            }
        })
    }
}

export const updateItemName = (renderProps: RenderProps, id: string, newName: string) => {
    renderProps.setState((existingState) => {
        const obj = existingState.entities[id]
        return {
            ...existingState,
            entities: {
                ...existingState.entities,
                [id]: {
                    ...obj,
                    name: newName
                }
            }
        }
    })
}

export const updateItem = (renderProps: RenderProps, id: string, update: FormikValues) => {
    renderProps.setState((existingState) => {
        const obj = existingState.entities[id]
        const newValues = Object.keys(update).reduce<any>(
            (res, o) => set(res, o, update[o]),
            obj.values
        )
        return {
            ...existingState,
            entities: {
                ...existingState.entities,
                [obj.id]: {
                    ...obj,
                    values: cloneDeep(newValues)
                }
            }
        }
    })
}

export const addItem = (renderProps: RenderProps, newItem: DndItem) => {
    const id = nanoid()
    const newState: DndState = {
        entities: {
            ...renderProps.state.entities,
            [id]: {
                id,
                name: id,
                values: merge({}, { __container: Container.initialValues }, newItem.initialValues),
                parent: { id: newItem.id, type: newItem.type }
            }
        },
        items: [
            ...renderProps.state.items,
            {
                id
            }
        ]
    }

    renderProps.setState(newState)
    renderProps.onActiveChange(id)
}

export const setList = (renderProps: RenderProps) => (newState: DndStateItemEntity[]) => {
    const rawItemIndex = newState.findIndex((item) => Boolean(((item as unknown) as DndItem).type))
    const updatedNewState = cloneDeep(newState).map((item) => omit(item, 'layoutId'))
    const updatedNewEntities = {
        ...renderProps.state.entities
    }
    if (rawItemIndex > -1) {
        const rawItem = (newState[rawItemIndex] as unknown) as DndItem
        const id = nanoid()
        updatedNewState[rawItemIndex] = {
            id
        }
        updatedNewEntities[id] = {
            id,
            name: id,
            parent: {
                id: rawItem.id,
                type: rawItem.type
            },
            values: merge({}, { __container: Container.initialValues }, rawItem.initialValues)
        }
    }
    const stateToSet = {
        entities: updatedNewEntities,
        items: updatedNewState
    }
    if (!isEqual(stateToSet, renderProps.state)) {
        renderProps.setState(stateToSet)
    }
}

export const renderItems = (items: DndStateItemEntity[] = [], renderProps: RenderProps) =>
    items?.map((item) => {
        const updatedRenderProps = { ...renderProps, item }
        const stateItem = renderProps.state.entities[item.id]
        return (
            <DndItemPreview key={item.id} {...updatedRenderProps}>
                {Container.render(
                    updatedRenderProps,
                    renderProps.itemsMap[stateItem.parent.id]?.render?.(updatedRenderProps)
                )}
            </DndItemPreview>
        )
    })

export const conditionBuilder = (condition: Condition | undefined) => {
    const result = {
        conditionStart: '',
        conditionEnd: '',
        conditionText: ''
    }
    if (condition?.display === 'DISPLAY') {
        const rules = condition.rules
            ?.filter((rule) => rule.id)
            ?.map((rule) => {
                const result: Primitive[] = [rule.id]
                switch (rule.operator) {
                    case 'NOT_EQUAL':
                        result.push('!=')
                        break
                    case 'IN':
                        result.push('contains')
                        break
                    default:
                        result.push('==')
                }
                const value = rule.value ?? ''
                result.push(`"${value}"`)
                return result.join(' ')
            })
        if (rules?.length) {
            result.conditionText = `${rules.join(' and ')}`
            result.conditionStart = `{% if ${result.conditionText} %}`
            result.conditionEnd = '{% endif %}'
        }
    }
    return result
}

export const exportItems = (items: DndStateItemEntity[] = [], renderProps: RenderProps) =>
    items
        ?.map((item) => {
            const updatedRenderProps = { ...renderProps, item }
            const stateItem = renderProps.state.entities[item.id]
            const { conditionStart, conditionEnd } = conditionBuilder(stateItem.values.__condition)
            return `
                ${conditionStart}
                    <div style="position: relative">
                        ${Container.export(
                            updatedRenderProps,
                            renderProps.itemsMap[stateItem.parent.id]?.export?.(updatedRenderProps)
                        )}
                    </div>
                ${conditionEnd}
            `
        })
        .join('\n')

export const exportToHtml = (renderProps: RenderProps): string => {
    const body = `
        ${renderProps.template.export(
            renderProps,
            exportItems(renderProps.state.items, renderProps)
        )}
    `
    const head = document.getElementById('google-fonts')?.outerHTML ?? ''
    const replacer = {
        '{{head}}': head,
        '{{body}}': body,
        '{{footer}}': ''
    }
    let template = emailTemplate
    forEach(replacer, (value, key) => {
        template = template.replace(key, value)
    })
    return juice(template)
}

export const createDndState = (
    initialState?: Partial<DndState>,
    template?: DndTemplateItem
): DndState => {
    return {
        items: [],
        ...(initialState ?? {}),
        entities: {
            ...(template
                ? {
                      [template.id]: {
                          parent: {
                              id: template.id,
                              type: template.type
                          },
                          id: template.id,
                          values: template.initialValues ?? {}
                      }
                  }
                : {}),
            ...(initialState?.entities ?? {})
        }
    }
}

export const styleToCss = (style: React.CSSProperties = {}) => reactToCSS(style)

export const useValidations = () => {
    const commonValidation = [
        { label: <Trans>None</Trans>, id: 'none', value: '.*' },
        { label: <Trans>Alphanumberic</Trans>, id: 'alphanumeric', value: '^[a-zA-Z0-9]*$' },
        { label: <Trans>Alphabetic</Trans>, id: 'alphabetic', value: '^[a-zA-Z]*$' }
    ]
    const inputValidation = [
        ...commonValidation,
        { label: <Trans>Email</Trans>, id: 'email', value: '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$' },
        {
            label: <Trans>Currency</Trans>,
            id: 'currency',
            value: '^-?(?:0|[1-9]d{0,2}(?:,?d{3})*)(?:.d+)?$'
        },
        {
            label: <Trans>Url</Trans>,
            id: 'url',
            value:
                '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})'
        },
        { label: <Trans>Numeric</Trans>, id: 'numeric', value: '^[0-9]$' },
        { label: <Trans>Custom regex</Trans>, id: 'regex' }
    ]
    return { commonValidation: commonValidation, inputValidation }
}
export const useFonts = () => {
    const fontWeights = [
        {
            label: <Trans>300 Thin</Trans>,
            id: 300
        },
        {
            label: <Trans>400 Regular</Trans>,
            id: 400
        },
        {
            label: <Trans>500 Semi Bold</Trans>,
            id: 500
        },
        {
            label: <Trans>600 Bold</Trans>,
            id: 600
        }
    ]
    const fontFamily = [
        {
            label: 'Alegreya',
            id: 'Alegreya'
        },
        {
            label: 'B612',
            id: 'B612'
        },
        {
            label: 'Muli',
            id: 'Muli'
        },
        {
            label: 'Titillium Web',
            id: 'Titillium Web'
        },
        {
            label: 'Varela',
            id: 'Varela'
        },
        {
            label: 'Vollkorn',
            id: 'Vollkorn'
        },
        {
            label: 'IBM Plex',
            id: 'IBM Plex'
        },
        {
            label: 'Crimson Text',
            id: 'Crimson Text'
        },
        {
            label: 'BioRhyme',
            id: 'BioRhyme'
        },
        {
            label: 'Karla',
            id: 'Karla'
        },
        {
            label: 'Lora',
            id: 'Lora'
        },
        {
            label: 'Frank Ruhl Libre',
            id: 'Frank Ruhl Libre'
        },
        {
            label: 'Playfair Display',
            id: 'Playfair Display'
        },
        {
            label: 'Archivo',
            id: 'Archivo'
        },
        {
            label: 'Spectral',
            id: 'Spectral'
        },
        {
            label: 'Fjalla One',
            id: 'Fjalla One'
        },
        {
            label: 'Roboto',
            id: 'Roboto'
        },
        {
            label: 'Montserrat',
            id: 'Montserrat'
        },
        {
            label: 'Rubik',
            id: 'Rubik'
        },
        {
            label: 'Source Sans',
            id: 'Source Sans'
        },
        {
            label: 'Cardo',
            id: 'Cardo'
        },
        {
            label: 'Cormorant',
            id: 'Cormorant'
        },
        {
            label: 'Work Sans',
            id: 'Work Sans'
        },
        {
            label: 'Rakkas',
            id: 'Rakkas'
        },
        {
            label: 'Concert One',
            id: 'Concert One'
        },
        {
            label: 'Yatra One',
            id: 'Yatra One'
        },
        {
            label: 'Arvo',
            id: 'Arvo'
        },
        {
            label: 'Lato',
            id: 'Lato'
        },
        {
            label: 'Abril FatFace',
            id: 'Abril FatFace'
        },
        {
            label: 'Ubuntu',
            id: 'Ubuntu'
        },
        {
            label: 'PT Serif',
            id: 'PT Serif'
        },
        {
            label: 'Old Standard TT',
            id: 'Old Standard TT'
        },
        {
            label: 'Oswald',
            id: 'Oswald'
        },
        {
            label: 'PT Sans',
            id: 'PT Sans'
        },
        {
            label: 'Poppins',
            id: 'Poppins'
        },
        {
            label: 'Fira Sans',
            id: 'Fira Sans'
        },
        {
            label: 'Nunito',
            id: 'Nunito'
        },
        {
            label: 'Oxygen',
            id: 'Oxygen'
        },
        {
            label: 'Exo 2',
            id: 'Exo 2'
        },
        {
            label: 'Open Sans',
            id: 'Open Sans'
        },
        {
            label: 'Merriweather',
            id: 'Merriweather'
        },
        {
            label: 'Noto Sans',
            id: 'Noto Sans'
        },
        {
            label: 'Source Sans Pro',
            id: 'Source Sans Pro'
        }
    ]
    return {
        fontWeights,
        fontFamily
    }
}

export const getComponentState = (renderProps: RenderProps, id?: string) => {
    if (!renderProps.item || !id) {
        return {}
    }
    return renderProps.state.entities[renderProps.item.id]?.values?.[id] || {}
}
export const getFromikProps = (formKey: string, formik: FormikContextType<unknown>) => {
    const formikProps: any = {}
    if (formik) {
        formikProps.name = formKey
        formikProps.onBlur = formik.handleBlur
        formikProps.value = get(formik.values, formKey) || ''
        formikProps.onChange = formik.handleChange
        formikProps.helperText =
            !!(get(formik.touched, formKey) || formik.submitCount > 0) &&
            get(formik.errors, formKey)
        formikProps.error =
            !!(get(formik.touched, formKey) || formik.submitCount > 0) &&
            !!get(formik.errors, formKey)
    }
    return formikProps
}
