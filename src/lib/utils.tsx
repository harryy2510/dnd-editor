import { Trans } from '@lingui/macro'
import { FormikValues, FormikContextType } from 'formik'
import { cloneDeep, forEach, isEqual, merge, omit, omitBy, set, get } from 'lodash-es'
import { nanoid } from 'nanoid'
import React from 'react'
// @ts-ignore
import reactToCSS from 'react-style-object-to-css'
import juice from 'juice'
import * as yup from 'yup'

import Container from './assets/Container'
import DndItemPreview from './components/DndItemPreview'
import emailTemplate from './emailTemplate'
import {
    Condition,
    DndItem,
    DndState,
    DndStateItemEntity,
    DndTemplateItem,
    FormValue,
    Primitive,
    RenderProps,
    StringFormValue
} from './types'
import TextInput from './assets/components/TextInput'
import Checkbox from './assets/components/Checkbox'
import Radio from './assets/components/Radio'
import Dropdown from './assets/components/Dropdown'
import Date from './assets/components/Date'

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
                values: merge(
                    {},
                    { __container: Container[renderProps.template.id].initialValues },
                    newItem.initialValues
                ),
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
            values: merge(
                {},
                { __container: Container[renderProps.template.id].initialValues },
                rawItem.initialValues
            )
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
                {Container[renderProps.template.id].render(
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
                        ${Container[renderProps.template.id].export(
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
                          name: template.id,
                          values: template.initialValues ?? {}
                      }
                  }
                : {}),
            ...(initialState?.entities ?? {})
        }
    }
}

export const styleToCss = (style: React.CSSProperties = {}) => reactToCSS(style)

//     Between
//     Compulsion
//     Email
//     Equals
//     GreaterThan
//     GreaterThanEquals
//     LengthEquals
//     LessThan
//     LessThanEquals
//     MaxLength
//     MinLength
//     NotEquals
//     NotPresentIn
//     OneTimeField
//     PresentIn
//     RegexPattern
//     Url
type Validation = {
    label: JSX.Element
    id: string
    showInput: boolean
    validation?: (input: FormValue[]) => any
    toFormValue?: (input: string) => FormValue[]
    toString?: (formValue: FormValue[]) => string
}

export const useValidations = () => {
    const validations = {
        none: {
            label: <Trans>None</Trans>,
            id: 'none',
            showInput: false
        },
        Email: {
            label: <Trans>Email</Trans>,
            id: 'Email',
            showInput: false,
            validation: () => yup.string().email('Input should be an email'),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        },
        PresentIn: {
            label: <Trans>Present In</Trans>,
            id: 'PresentIn',
            showInput: true,
            validation: (input: any) =>
                yup.string().matches(new RegExp(`^(${input.split(',').join('|')})$`)),
            toFormValue: (input: string) =>
                input.split(',').map((option: string) => ({ text: option, valueType: 'String' })),
            toString: (input: FormValue[]) =>
                input.map((formValue) => (formValue as StringFormValue).text).join(',')
        },
        NotPresentIn: {
            label: <Trans>Not Present In</Trans>,
            id: 'NotPresentIn',
            showInput: true,
            validation: (input: any) =>
                yup
                    .string()
                    .test(
                        'notPresentIn',
                        `Input should not be one of ${input}`,
                        (value) => !input.split(',').find(value)
                    ),
            toFormValue: (input: string) =>
                input.split(',').map((option: string) => ({ text: option, valueType: 'String' })),
            toString: (input: FormValue[]) =>
                input.map((formValue) => (formValue as StringFormValue).text).join(',')
        },
        RegexPattern: {
            label: <Trans>Regex Pattern</Trans>,
            id: 'RegexPattern',
            showInput: true,
            validation: (input: any) => ({
                matches: { regex: input?.[0]?.text },
                errors: {
                    matches: "Input doesn't match the regex pattern."
                }
            }),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        },
        Url: {
            label: <Trans>Url</Trans>,
            id: 'Url',
            showInput: false,
            validation: () => yup.string().url('Input should be an url'),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        },
        MaxLength: {
            label: <Trans>Max Length</Trans>,
            id: 'MaxLength',
            showInput: true,
            validation: (input: string) =>
                yup.string().max(parseInt(input), `Min length should be ${input}`),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        },
        MinLength: {
            label: <Trans>Min Length</Trans>,
            id: 'MinLength',
            showInput: true,
            validation: (input: string) =>
                yup.string().max(parseInt(input), `Min length should be ${input}`),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        }
    }
    const commonValidation: Validation[] = [
        {
            label: <Trans>None</Trans>,
            id: 'none',
            showInput: false
        },
        {
            label: <Trans>Email</Trans>,
            id: 'Email',
            showInput: false,
            validation: () => yup.string().email('Input should be an email'),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        },
        {
            label: <Trans>Regex Pattern</Trans>,
            id: 'RegexPattern',
            showInput: true,
            validation: (input: any) => ({
                matches: { regex: input?.[0]?.text },
                errors: {
                    matches: "Input doesn't match the regex pattern."
                }
            }),
            toFormValue: (input: string) => [{ text: input, valueType: 'String' }] as FormValue[],
            toString: (input: FormValue[]) =>
                (input?.[0]?.valueType === 'String' && input[0].text) || ''
        }
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
    return { commonValidation: commonValidation, inputValidation, validations }
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

export const getFromikProps = (
    formKey: string,
    formik: FormikContextType<FormikValues>,
    mapFn?: (arg: any) => any,
    valueKey?: string
) => {
    const formikProps: any = {}
    if (formik) {
        formikProps.name = formKey
        formikProps.onBlur = formik.handleBlur
        formikProps.value = get(formik.values, formKey)
        formikProps.onChange = (e: any) => {
            const value = e.target.value
            formik.setFieldValue(formKey, mapFn ? mapFn(value) : value)
        }
        formikProps.helperText =
            !!(get(formik.touched, formKey) || formik.submitCount > 0) &&
            get(formik.errors, formKey)
        formikProps.error =
            !!(get(formik.touched, formKey) || formik.submitCount > 0) &&
            !!get(formik.errors, formKey)
    }
    return formikProps
}

export const checkForDiplayCondition = (
    condition: Condition,
    formik: FormikContextType<unknown>,
    sampleData: any
) => {
    if (condition && condition.display === 'DISPLAY' && condition.rules) {
        const { id, operator, value } = condition.rules[0]
        if (!sampleData) {
            return false
        }
        // const [blockKey, itemKey] = id.split('.')
        // let formValue = get(formik.values, blockKey)
        // formValue = !!itemKey ? get(formValue, itemKey) : value
        const formValue = sampleData[id] || ''
        switch (operator) {
            case 'EQUAL':
                return formValue !== value
            case 'NOT_EQUAL':
                return formValue === value
            case 'IN':
                return !(value as string).split(',').filter((v) => v === formValue)
        }
    }
    return true
}

export const getFormElementItemComponent = (type: string) => {
    switch (type) {
        case 'Input':
            return TextInput
        case 'Datepicker':
            return Date
        case 'Checkbox':
            return Checkbox
        case 'Radio':
            return Radio
        case 'Dropdown':
            return Dropdown
    }
}
