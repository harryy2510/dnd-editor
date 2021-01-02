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
        case 'Text':
            return Radio
        case 'Dropdown':
            return Dropdown
    }
}

export const useCountries = () => {
    return [
        {
            key: 'AD',
            label: 'Andorra',
            value: {
                text: 'Andorra',
                valueType: 'String'
            }
        },
        {
            key: 'AE',
            label: 'United Arab Emirates',
            value: {
                text: 'United Arab Emirates',
                valueType: 'String'
            }
        },
        {
            key: 'AF',
            label: 'Afghanistan',
            value: {
                text: 'Afghanistan',
                valueType: 'String'
            }
        },
        {
            key: 'AG',
            label: 'Antigua and Barbuda',
            value: {
                text: 'Antigua and Barbuda',
                valueType: 'String'
            }
        },
        {
            key: 'AI',
            label: 'Anguilla',
            value: {
                text: 'Anguilla',
                valueType: 'String'
            }
        },
        {
            key: 'AL',
            label: 'Albania',
            value: {
                text: 'Albania',
                valueType: 'String'
            }
        },
        {
            key: 'AM',
            label: 'Armenia',
            value: {
                text: 'Armenia',
                valueType: 'String'
            }
        },
        {
            key: 'AO',
            label: 'Angola',
            value: {
                text: 'Angola',
                valueType: 'String'
            }
        },
        {
            key: 'AQ',
            label: 'Antarctica',
            value: {
                text: 'Antarctica',
                valueType: 'String'
            }
        },
        {
            key: 'AR',
            label: 'Argentina',
            value: {
                text: 'Argentina',
                valueType: 'String'
            }
        },
        {
            key: 'AS',
            label: 'American Samoa',
            value: {
                text: 'American Samoa',
                valueType: 'String'
            }
        },
        {
            key: 'AT',
            label: 'Austria',
            value: {
                text: 'Austria',
                valueType: 'String'
            }
        },
        {
            key: 'AU',
            label: 'Australia',
            value: {
                text: 'Australia',
                valueType: 'String'
            }
        },
        {
            key: 'AW',
            label: 'Aruba',
            value: {
                text: 'Aruba',
                valueType: 'String'
            }
        },
        {
            key: 'AX',
            label: 'Åland Islands',
            value: {
                text: 'Åland Islands',
                valueType: 'String'
            }
        },
        {
            key: 'AZ',
            label: 'Azerbaijan',
            value: {
                text: 'Azerbaijan',
                valueType: 'String'
            }
        },
        {
            key: 'BA',
            label: 'Bosnia and Herzegovina',
            value: {
                text: 'Bosnia and Herzegovina',
                valueType: 'String'
            }
        },
        {
            key: 'BB',
            label: 'Barbados',
            value: {
                text: 'Barbados',
                valueType: 'String'
            }
        },
        {
            key: 'BD',
            label: 'Bangladesh',
            value: {
                text: 'Bangladesh',
                valueType: 'String'
            }
        },
        {
            key: 'BE',
            label: 'Belgium',
            value: {
                text: 'Belgium',
                valueType: 'String'
            }
        },
        {
            key: 'BF',
            label: 'Burkina Faso',
            value: {
                text: 'Burkina Faso',
                valueType: 'String'
            }
        },
        {
            key: 'BG',
            label: 'Bulgaria',
            value: {
                text: 'Bulgaria',
                valueType: 'String'
            }
        },
        {
            key: 'BH',
            label: 'Bahrain',
            value: {
                text: 'Bahrain',
                valueType: 'String'
            }
        },
        {
            key: 'BI',
            label: 'Burundi',
            value: {
                text: 'Burundi',
                valueType: 'String'
            }
        },
        {
            key: 'BJ',
            label: 'Benin',
            value: {
                text: 'Benin',
                valueType: 'String'
            }
        },
        {
            key: 'BL',
            label: 'Saint Barthélemy',
            value: {
                text: 'Saint Barthélemy',
                valueType: 'String'
            }
        },
        {
            key: 'BM',
            label: 'Bermuda',
            value: {
                text: 'Bermuda',
                valueType: 'String'
            }
        },
        {
            key: 'BN',
            label: 'Brunei',
            value: {
                text: 'Brunei',
                valueType: 'String'
            }
        },
        {
            key: 'BO',
            label: 'Bolivia',
            value: {
                text: 'Bolivia',
                valueType: 'String'
            }
        },
        {
            key: 'BQ',
            label: 'Bonaire, Sint Eustatius and Saba',
            value: {
                text: 'Bonaire, Sint Eustatius and Saba',
                valueType: 'String'
            }
        },
        {
            key: 'BR',
            label: 'Brazil',
            value: {
                text: 'Brazil',
                valueType: 'String'
            }
        },
        {
            key: 'BS',
            label: 'Bahamas',
            value: {
                text: 'Bahamas',
                valueType: 'String'
            }
        },
        {
            key: 'BT',
            label: 'Bhutan',
            value: {
                text: 'Bhutan',
                valueType: 'String'
            }
        },
        {
            key: 'BV',
            label: 'Bouvet Island',
            value: {
                text: 'Bouvet Island',
                valueType: 'String'
            }
        },
        {
            key: 'BW',
            label: 'Botswana',
            value: {
                text: 'Botswana',
                valueType: 'String'
            }
        },
        {
            key: 'BY',
            label: 'Belarus',
            value: {
                text: 'Belarus',
                valueType: 'String'
            }
        },
        {
            key: 'BZ',
            label: 'Belize',
            value: {
                text: 'Belize',
                valueType: 'String'
            }
        },
        {
            key: 'CA',
            label: 'Canada',
            value: {
                text: 'Canada',
                valueType: 'String'
            }
        },
        {
            key: 'CC',
            label: 'Cocos',
            value: {
                text: 'Cocos',
                valueType: 'String'
            }
        },
        {
            key: 'CD',
            label: 'Congo',
            value: {
                text: 'Congo',
                valueType: 'String'
            }
        },
        {
            key: 'CF',
            label: 'Central African Republic',
            value: {
                text: 'Central African Republic',
                valueType: 'String'
            }
        },
        {
            key: 'CG',
            label: 'Congo',
            value: {
                text: 'Congo',
                valueType: 'String'
            }
        },
        {
            key: 'CH',
            label: 'Switzerland',
            value: {
                text: 'Switzerland',
                valueType: 'String'
            }
        },
        {
            key: 'CI',
            label: 'Ivory Coast',
            value: {
                text: 'Ivory Coast',
                valueType: 'String'
            }
        },
        {
            key: 'CK',
            label: 'Cook Islands',
            value: {
                text: 'Cook Islands',
                valueType: 'String'
            }
        },
        {
            key: 'CL',
            label: 'Chile',
            value: {
                text: 'Chile',
                valueType: 'String'
            }
        },
        {
            key: 'CM',
            label: 'Cameroon',
            value: {
                text: 'Cameroon',
                valueType: 'String'
            }
        },
        {
            key: 'CN',
            label: 'China',
            value: {
                text: 'China',
                valueType: 'String'
            }
        },
        {
            key: 'CO',
            label: 'Colombia',
            value: {
                text: 'Colombia',
                valueType: 'String'
            }
        },
        {
            key: 'CR',
            label: 'Costa Rica',
            value: {
                text: 'Costa Rica',
                valueType: 'String'
            }
        },
        {
            key: 'CU',
            label: 'Cuba',
            value: {
                text: 'Cuba',
                valueType: 'String'
            }
        },
        {
            key: 'CV',
            label: 'Cabo Verde',
            value: {
                text: 'Cabo Verde',
                valueType: 'String'
            }
        },
        {
            key: 'CW',
            label: 'Curaçao',
            value: {
                text: 'Curaçao',
                valueType: 'String'
            }
        },
        {
            key: 'CX',
            label: 'Christmas Island',
            value: {
                text: 'Christmas Island',
                valueType: 'String'
            }
        },
        {
            key: 'CY',
            label: 'Cyprus',
            value: {
                text: 'Cyprus',
                valueType: 'String'
            }
        },
        {
            key: 'CZ',
            label: 'Czechia',
            value: {
                text: 'Czechia',
                valueType: 'String'
            }
        },
        {
            key: 'DE',
            label: 'Germany',
            value: {
                text: 'Germany',
                valueType: 'String'
            }
        },
        {
            key: 'DJ',
            label: 'Djibouti',
            value: {
                text: 'Djibouti',
                valueType: 'String'
            }
        },
        {
            key: 'DK',
            label: 'Denmark',
            value: {
                text: 'Denmark',
                valueType: 'String'
            }
        },
        {
            key: 'DM',
            label: 'Dominica',
            value: {
                text: 'Dominica',
                valueType: 'String'
            }
        },
        {
            key: 'DO',
            label: 'Dominican Republic',
            value: {
                text: 'Dominican Republic',
                valueType: 'String'
            }
        },
        {
            key: 'DZ',
            label: 'Algeria',
            value: {
                text: 'Algeria',
                valueType: 'String'
            }
        },
        {
            key: 'EC',
            label: 'Ecuador',
            value: {
                text: 'Ecuador',
                valueType: 'String'
            }
        },
        {
            key: 'EE',
            label: 'Estonia',
            value: {
                text: 'Estonia',
                valueType: 'String'
            }
        },
        {
            key: 'EG',
            label: 'Egypt',
            value: {
                text: 'Egypt',
                valueType: 'String'
            }
        },
        {
            key: 'EH',
            label: 'Western Sahara',
            value: {
                text: 'Western Sahara',
                valueType: 'String'
            }
        },
        {
            key: 'ER',
            label: 'Eritrea',
            value: {
                text: 'Eritrea',
                valueType: 'String'
            }
        },
        {
            key: 'ES',
            label: 'Spain',
            value: {
                text: 'Spain',
                valueType: 'String'
            }
        },
        {
            key: 'ET',
            label: 'Ethiopia',
            value: {
                text: 'Ethiopia',
                valueType: 'String'
            }
        },
        {
            key: 'FI',
            label: 'Finland',
            value: {
                text: 'Finland',
                valueType: 'String'
            }
        },
        {
            key: 'FJ',
            label: 'Fiji',
            value: {
                text: 'Fiji',
                valueType: 'String'
            }
        },
        {
            key: 'FK',
            label: 'Falkland Islands',
            value: {
                text: 'Falkland Islands',
                valueType: 'String'
            }
        },
        {
            key: 'FM',
            label: 'Micronesia',
            value: {
                text: 'Micronesia',
                valueType: 'String'
            }
        },
        {
            key: 'FO',
            label: 'Faroe Islands',
            value: {
                text: 'Faroe Islands',
                valueType: 'String'
            }
        },
        {
            key: 'FR',
            label: 'France',
            value: {
                text: 'France',
                valueType: 'String'
            }
        },
        {
            key: 'GA',
            label: 'Gabon',
            value: {
                text: 'Gabon',
                valueType: 'String'
            }
        },
        {
            key: 'GB',
            label: 'United Kingdom',
            value: {
                text: 'United Kingdom',
                valueType: 'String'
            }
        },
        {
            key: 'GD',
            label: 'Grenada',
            value: {
                text: 'Grenada',
                valueType: 'String'
            }
        },
        {
            key: 'GE',
            label: 'Georgia',
            value: {
                text: 'Georgia',
                valueType: 'String'
            }
        },
        {
            key: 'GF',
            label: 'French Guiana',
            value: {
                text: 'French Guiana',
                valueType: 'String'
            }
        },
        {
            key: 'GG',
            label: 'Guernsey',
            value: {
                text: 'Guernsey',
                valueType: 'String'
            }
        },
        {
            key: 'GH',
            label: 'Ghana',
            value: {
                text: 'Ghana',
                valueType: 'String'
            }
        },
        {
            key: 'GI',
            label: 'Gibraltar',
            value: {
                text: 'Gibraltar',
                valueType: 'String'
            }
        },
        {
            key: 'GL',
            label: 'Greenland',
            value: {
                text: 'Greenland',
                valueType: 'String'
            }
        },
        {
            key: 'GM',
            label: 'Gambia',
            value: {
                text: 'Gambia',
                valueType: 'String'
            }
        },
        {
            key: 'GN',
            label: 'Guinea',
            value: {
                text: 'Guinea',
                valueType: 'String'
            }
        },
        {
            key: 'GP',
            label: 'Guadeloupe',
            value: {
                text: 'Guadeloupe',
                valueType: 'String'
            }
        },
        {
            key: 'GQ',
            label: 'Equatorial Guinea',
            value: {
                text: 'Equatorial Guinea',
                valueType: 'String'
            }
        },
        {
            key: 'GR',
            label: 'Greece',
            value: {
                text: 'Greece',
                valueType: 'String'
            }
        },
        {
            key: 'GS',
            label: 'South Georgia and the South Sandwich Islands',
            value: {
                text: 'South Georgia and the South Sandwich Islands',
                valueType: 'String'
            }
        },
        {
            key: 'GT',
            label: 'Guatemala',
            value: {
                text: 'Guatemala',
                valueType: 'String'
            }
        },
        {
            key: 'GU',
            label: 'Guam',
            value: {
                text: 'Guam',
                valueType: 'String'
            }
        },
        {
            key: 'GW',
            label: 'Guinea-Bissau',
            value: {
                text: 'Guinea-Bissau',
                valueType: 'String'
            }
        },
        {
            key: 'GY',
            label: 'Guyana',
            value: {
                text: 'Guyana',
                valueType: 'String'
            }
        },
        {
            key: 'HK',
            label: 'Hong Kong',
            value: {
                text: 'Hong Kong',
                valueType: 'String'
            }
        },
        {
            key: 'HM',
            label: 'Heard Island and McDonald Islands',
            value: {
                text: 'Heard Island and McDonald Islands',
                valueType: 'String'
            }
        },
        {
            key: 'HN',
            label: 'Honduras',
            value: {
                text: 'Honduras',
                valueType: 'String'
            }
        },
        {
            key: 'HR',
            label: 'Croatia',
            value: {
                text: 'Croatia',
                valueType: 'String'
            }
        },
        {
            key: 'HT',
            label: 'Haiti',
            value: {
                text: 'Haiti',
                valueType: 'String'
            }
        },
        {
            key: 'HU',
            label: 'Hungary',
            value: {
                text: 'Hungary',
                valueType: 'String'
            }
        },
        {
            key: 'ID',
            label: 'Indonesia',
            value: {
                text: 'Indonesia',
                valueType: 'String'
            }
        },
        {
            key: 'IE',
            label: 'Ireland',
            value: {
                text: 'Ireland',
                valueType: 'String'
            }
        },
        {
            key: 'IL',
            label: 'Israel',
            value: {
                text: 'Israel',
                valueType: 'String'
            }
        },
        {
            key: 'IM',
            label: 'Isle of Man',
            value: {
                text: 'Isle of Man',
                valueType: 'String'
            }
        },
        {
            key: 'IN',
            label: 'India',
            value: {
                text: 'India',
                valueType: 'String'
            }
        },
        {
            key: 'IO',
            label: 'British Indian Ocean Territory',
            value: {
                text: 'British Indian Ocean Territory',
                valueType: 'String'
            }
        },
        {
            key: 'IQ',
            label: 'Iraq',
            value: {
                text: 'Iraq',
                valueType: 'String'
            }
        },
        {
            key: 'IR',
            label: 'Iran',
            value: {
                text: 'Iran',
                valueType: 'String'
            }
        },
        {
            key: 'IS',
            label: 'Iceland',
            value: {
                text: 'Iceland',
                valueType: 'String'
            }
        },
        {
            key: 'IT',
            label: 'Italy',
            value: {
                text: 'Italy',
                valueType: 'String'
            }
        },
        {
            key: 'JE',
            label: 'Jersey',
            value: {
                text: 'Jersey',
                valueType: 'String'
            }
        },
        {
            key: 'JM',
            label: 'Jamaica',
            value: {
                text: 'Jamaica',
                valueType: 'String'
            }
        },
        {
            key: 'JO',
            label: 'Jordan',
            value: {
                text: 'Jordan',
                valueType: 'String'
            }
        },
        {
            key: 'JP',
            label: 'Japan',
            value: {
                text: 'Japan',
                valueType: 'String'
            }
        },
        {
            key: 'KE',
            label: 'Kenya',
            value: {
                text: 'Kenya',
                valueType: 'String'
            }
        },
        {
            key: 'KG',
            label: 'Kyrgyzstan',
            value: {
                text: 'Kyrgyzstan',
                valueType: 'String'
            }
        },
        {
            key: 'KH',
            label: 'Cambodia',
            value: {
                text: 'Cambodia',
                valueType: 'String'
            }
        },
        {
            key: 'KI',
            label: 'Kiribati',
            value: {
                text: 'Kiribati',
                valueType: 'String'
            }
        },
        {
            key: 'KM',
            label: 'Comoros',
            value: {
                text: 'Comoros',
                valueType: 'String'
            }
        },
        {
            key: 'KN',
            label: 'Saint Kitts and Nevis',
            value: {
                text: 'Saint Kitts and Nevis',
                valueType: 'String'
            }
        },
        {
            key: 'KP',
            label: 'North Korea',
            value: {
                text: 'North Korea',
                valueType: 'String'
            }
        },
        {
            key: 'KR',
            label: 'South Korea',
            value: {
                text: 'South Korea',
                valueType: 'String'
            }
        },
        {
            key: 'KW',
            label: 'Kuwait',
            value: {
                text: 'Kuwait',
                valueType: 'String'
            }
        },
        {
            key: 'KY',
            label: 'Cayman Islands',
            value: {
                text: 'Cayman Islands',
                valueType: 'String'
            }
        },
        {
            key: 'KZ',
            label: 'Kazakhstan',
            value: {
                text: 'Kazakhstan',
                valueType: 'String'
            }
        },
        {
            key: 'LA',
            label: 'Laos',
            value: {
                text: 'Laos',
                valueType: 'String'
            }
        },
        {
            key: 'LB',
            label: 'Lebanon',
            value: {
                text: 'Lebanon',
                valueType: 'String'
            }
        },
        {
            key: 'LC',
            label: 'Saint Lucia',
            value: {
                text: 'Saint Lucia',
                valueType: 'String'
            }
        },
        {
            key: 'LI',
            label: 'Liechtenstein',
            value: {
                text: 'Liechtenstein',
                valueType: 'String'
            }
        },
        {
            key: 'LK',
            label: 'Sri Lanka',
            value: {
                text: 'Sri Lanka',
                valueType: 'String'
            }
        },
        {
            key: 'LR',
            label: 'Liberia',
            value: {
                text: 'Liberia',
                valueType: 'String'
            }
        },
        {
            key: 'LS',
            label: 'Lesotho',
            value: {
                text: 'Lesotho',
                valueType: 'String'
            }
        },
        {
            key: 'LT',
            label: 'Lithuania',
            value: {
                text: 'Lithuania',
                valueType: 'String'
            }
        },
        {
            key: 'LU',
            label: 'Luxembourg',
            value: {
                text: 'Luxembourg',
                valueType: 'String'
            }
        },
        {
            key: 'LV',
            label: 'Latvia',
            value: {
                text: 'Latvia',
                valueType: 'String'
            }
        },
        {
            key: 'LY',
            label: 'Libya',
            value: {
                text: 'Libya',
                valueType: 'String'
            }
        },
        {
            key: 'MA',
            label: 'Morocco',
            value: {
                text: 'Morocco',
                valueType: 'String'
            }
        },
        {
            key: 'MC',
            label: 'Monaco',
            value: {
                text: 'Monaco',
                valueType: 'String'
            }
        },
        {
            key: 'MD',
            label: 'Moldova',
            value: {
                text: 'Moldova',
                valueType: 'String'
            }
        },
        {
            key: 'ME',
            label: 'Montenegro',
            value: {
                text: 'Montenegro',
                valueType: 'String'
            }
        },
        {
            key: 'MF',
            label: 'Saint Martin',
            value: {
                text: 'Saint Martin',
                valueType: 'String'
            }
        },
        {
            key: 'MG',
            label: 'Madagascar',
            value: {
                text: 'Madagascar',
                valueType: 'String'
            }
        },
        {
            key: 'MH',
            label: 'Marshall Islands',
            value: {
                text: 'Marshall Islands',
                valueType: 'String'
            }
        },
        {
            key: 'MK',
            label: 'North Macedonia',
            value: {
                text: 'North Macedonia',
                valueType: 'String'
            }
        },
        {
            key: 'ML',
            label: 'Mali',
            value: {
                text: 'Mali',
                valueType: 'String'
            }
        },
        {
            key: 'MM',
            label: 'Myanmar',
            value: {
                text: 'Myanmar',
                valueType: 'String'
            }
        },
        {
            key: 'MN',
            label: 'Mongolia',
            value: {
                text: 'Mongolia',
                valueType: 'String'
            }
        },
        {
            key: 'MO',
            label: 'Macao',
            value: {
                text: 'Macao',
                valueType: 'String'
            }
        },
        {
            key: 'MP',
            label: 'Northern Mariana Islands',
            value: {
                text: 'Northern Mariana Islands',
                valueType: 'String'
            }
        },
        {
            key: 'MQ',
            label: 'Martinique',
            value: {
                text: 'Martinique',
                valueType: 'String'
            }
        },
        {
            key: 'MR',
            label: 'Mauritania',
            value: {
                text: 'Mauritania',
                valueType: 'String'
            }
        },
        {
            key: 'MS',
            label: 'Montserrat',
            value: {
                text: 'Montserrat',
                valueType: 'String'
            }
        },
        {
            key: 'MT',
            label: 'Malta',
            value: {
                text: 'Malta',
                valueType: 'String'
            }
        },
        {
            key: 'MU',
            label: 'Mauritius',
            value: {
                text: 'Mauritius',
                valueType: 'String'
            }
        },
        {
            key: 'MV',
            label: 'Maldives',
            value: {
                text: 'Maldives',
                valueType: 'String'
            }
        },
        {
            key: 'MW',
            label: 'Malawi',
            value: {
                text: 'Malawi',
                valueType: 'String'
            }
        },
        {
            key: 'MX',
            label: 'Mexico',
            value: {
                text: 'Mexico',
                valueType: 'String'
            }
        },
        {
            key: 'MY',
            label: 'Malaysia',
            value: {
                text: 'Malaysia',
                valueType: 'String'
            }
        },
        {
            key: 'MZ',
            label: 'Mozambique',
            value: {
                text: 'Mozambique',
                valueType: 'String'
            }
        },
        {
            key: 'NA',
            label: 'Namibia',
            value: {
                text: 'Namibia',
                valueType: 'String'
            }
        },
        {
            key: 'NC',
            label: 'New Caledonia',
            value: {
                text: 'New Caledonia',
                valueType: 'String'
            }
        },
        {
            key: 'NE',
            label: 'Niger',
            value: {
                text: 'Niger',
                valueType: 'String'
            }
        },
        {
            key: 'NF',
            label: 'Norfolk Island',
            value: {
                text: 'Norfolk Island',
                valueType: 'String'
            }
        },
        {
            key: 'NG',
            label: 'Nigeria',
            value: {
                text: 'Nigeria',
                valueType: 'String'
            }
        },
        {
            key: 'NI',
            label: 'Nicaragua',
            value: {
                text: 'Nicaragua',
                valueType: 'String'
            }
        },
        {
            key: 'NL',
            label: 'Netherlands',
            value: {
                text: 'Netherlands',
                valueType: 'String'
            }
        },
        {
            key: 'NO',
            label: 'Norway',
            value: {
                text: 'Norway',
                valueType: 'String'
            }
        },
        {
            key: 'NP',
            label: 'Nepal',
            value: {
                text: 'Nepal',
                valueType: 'String'
            }
        },
        {
            key: 'NR',
            label: 'Nauru',
            value: {
                text: 'Nauru',
                valueType: 'String'
            }
        },
        {
            key: 'NU',
            label: 'Niue',
            value: {
                text: 'Niue',
                valueType: 'String'
            }
        },
        {
            key: 'NZ',
            label: 'New Zealand',
            value: {
                text: 'New Zealand',
                valueType: 'String'
            }
        },
        {
            key: 'OM',
            label: 'Oman',
            value: {
                text: 'Oman',
                valueType: 'String'
            }
        },
        {
            key: 'PA',
            label: 'Panama',
            value: {
                text: 'Panama',
                valueType: 'String'
            }
        },
        {
            key: 'PE',
            label: 'Peru',
            value: {
                text: 'Peru',
                valueType: 'String'
            }
        },
        {
            key: 'PF',
            label: 'French Polynesia',
            value: {
                text: 'French Polynesia',
                valueType: 'String'
            }
        },
        {
            key: 'PG',
            label: 'Papua New Guinea',
            value: {
                text: 'Papua New Guinea',
                valueType: 'String'
            }
        },
        {
            key: 'PH',
            label: 'Philippines',
            value: {
                text: 'Philippines',
                valueType: 'String'
            }
        },
        {
            key: 'PK',
            label: 'Pakistan',
            value: {
                text: 'Pakistan',
                valueType: 'String'
            }
        },
        {
            key: 'PL',
            label: 'Poland',
            value: {
                text: 'Poland',
                valueType: 'String'
            }
        },
        {
            key: 'PM',
            label: 'Saint Pierre and Miquelon',
            value: {
                text: 'Saint Pierre and Miquelon',
                valueType: 'String'
            }
        },
        {
            key: 'PN',
            label: 'Pitcairn',
            value: {
                text: 'Pitcairn',
                valueType: 'String'
            }
        },
        {
            key: 'PR',
            label: 'Puerto Rico',
            value: {
                text: 'Puerto Rico',
                valueType: 'String'
            }
        },
        {
            key: 'PS',
            label: 'Palestine',
            value: {
                text: 'Palestine',
                valueType: 'String'
            }
        },
        {
            key: 'PT',
            label: 'Portugal',
            value: {
                text: 'Portugal',
                valueType: 'String'
            }
        },
        {
            key: 'PW',
            label: 'Palau',
            value: {
                text: 'Palau',
                valueType: 'String'
            }
        },
        {
            key: 'PY',
            label: 'Paraguay',
            value: {
                text: 'Paraguay',
                valueType: 'String'
            }
        },
        {
            key: 'QA',
            label: 'Qatar',
            value: {
                text: 'Qatar',
                valueType: 'String'
            }
        },
        {
            key: 'RE',
            label: 'Réunion',
            value: {
                text: 'Réunion',
                valueType: 'String'
            }
        },
        {
            key: 'RO',
            label: 'Romania',
            value: {
                text: 'Romania',
                valueType: 'String'
            }
        },
        {
            key: 'RS',
            label: 'Serbia',
            value: {
                text: 'Serbia',
                valueType: 'String'
            }
        },
        {
            key: 'RU',
            label: 'Russia',
            value: {
                text: 'Russia',
                valueType: 'String'
            }
        },
        {
            key: 'RW',
            label: 'Rwanda',
            value: {
                text: 'Rwanda',
                valueType: 'String'
            }
        },
        {
            key: 'SA',
            label: 'Saudi Arabia',
            value: {
                text: 'Saudi Arabia',
                valueType: 'String'
            }
        },
        {
            key: 'SB',
            label: 'Solomon Islands',
            value: {
                text: 'Solomon Islands',
                valueType: 'String'
            }
        },
        {
            key: 'SC',
            label: 'Seychelles',
            value: {
                text: 'Seychelles',
                valueType: 'String'
            }
        },
        {
            key: 'SD',
            label: 'Sudan',
            value: {
                text: 'Sudan',
                valueType: 'String'
            }
        },
        {
            key: 'SE',
            label: 'Sweden',
            value: {
                text: 'Sweden',
                valueType: 'String'
            }
        },
        {
            key: 'SG',
            label: 'Singapore',
            value: {
                text: 'Singapore',
                valueType: 'String'
            }
        },
        {
            key: 'SH',
            label: 'Saint Helena, Ascension and Tristan da Cunha',
            value: {
                text: 'Saint Helena, Ascension and Tristan da Cunha',
                valueType: 'String'
            }
        },
        {
            key: 'SI',
            label: 'Slovenia',
            value: {
                text: 'Slovenia',
                valueType: 'String'
            }
        },
        {
            key: 'SJ',
            label: 'Svalbard and Jan Mayen',
            value: {
                text: 'Svalbard and Jan Mayen',
                valueType: 'String'
            }
        },
        {
            key: 'SK',
            label: 'Slovakia',
            value: {
                text: 'Slovakia',
                valueType: 'String'
            }
        },
        {
            key: 'SL',
            label: 'Sierra Leone',
            value: {
                text: 'Sierra Leone',
                valueType: 'String'
            }
        },
        {
            key: 'SM',
            label: 'San Marino',
            value: {
                text: 'San Marino',
                valueType: 'String'
            }
        },
        {
            key: 'SN',
            label: 'Senegal',
            value: {
                text: 'Senegal',
                valueType: 'String'
            }
        },
        {
            key: 'SO',
            label: 'Somalia',
            value: {
                text: 'Somalia',
                valueType: 'String'
            }
        },
        {
            key: 'SR',
            label: 'Suriname',
            value: {
                text: 'Suriname',
                valueType: 'String'
            }
        },
        {
            key: 'SS',
            label: 'South Sudan',
            value: {
                text: 'South Sudan',
                valueType: 'String'
            }
        },
        {
            key: 'ST',
            label: 'Sao Tome and Principe',
            value: {
                text: 'Sao Tome and Principe',
                valueType: 'String'
            }
        },
        {
            key: 'SV',
            label: 'El Salvador',
            value: {
                text: 'El Salvador',
                valueType: 'String'
            }
        },
        {
            key: 'SX',
            label: 'Sint Maarten',
            value: {
                text: 'Sint Maarten',
                valueType: 'String'
            }
        },
        {
            key: 'SY',
            label: 'Syria',
            value: {
                text: 'Syria',
                valueType: 'String'
            }
        },
        {
            key: 'SZ',
            label: 'Eswatini',
            value: {
                text: 'Eswatini',
                valueType: 'String'
            }
        },
        {
            key: 'TC',
            label: 'Turks and Caicos Islands',
            value: {
                text: 'Turks and Caicos Islands',
                valueType: 'String'
            }
        },
        {
            key: 'TD',
            label: 'Chad',
            value: {
                text: 'Chad',
                valueType: 'String'
            }
        },
        {
            key: 'TF',
            label: 'French Southern Territories',
            value: {
                text: 'French Southern Territories',
                valueType: 'String'
            }
        },
        {
            key: 'TG',
            label: 'Togo',
            value: {
                text: 'Togo',
                valueType: 'String'
            }
        },
        {
            key: 'TH',
            label: 'Thailand',
            value: {
                text: 'Thailand',
                valueType: 'String'
            }
        },
        {
            key: 'TJ',
            label: 'Tajikistan',
            value: {
                text: 'Tajikistan',
                valueType: 'String'
            }
        },
        {
            key: 'TK',
            label: 'Tokelau',
            value: {
                text: 'Tokelau',
                valueType: 'String'
            }
        },
        {
            key: 'TL',
            label: 'Timor-Leste',
            value: {
                text: 'Timor-Leste',
                valueType: 'String'
            }
        },
        {
            key: 'TM',
            label: 'Turkmenistan',
            value: {
                text: 'Turkmenistan',
                valueType: 'String'
            }
        },
        {
            key: 'TN',
            label: 'Tunisia',
            value: {
                text: 'Tunisia',
                valueType: 'String'
            }
        },
        {
            key: 'TO',
            label: 'Tonga',
            value: {
                text: 'Tonga',
                valueType: 'String'
            }
        },
        {
            key: 'TR',
            label: 'Turkey',
            value: {
                text: 'Turkey',
                valueType: 'String'
            }
        },
        {
            key: 'TT',
            label: 'Trinidad and Tobago',
            value: {
                text: 'Trinidad and Tobago',
                valueType: 'String'
            }
        },
        {
            key: 'TV',
            label: 'Tuvalu',
            value: {
                text: 'Tuvalu',
                valueType: 'String'
            }
        },
        {
            key: 'TW',
            label: 'Taiwan',
            value: {
                text: 'Taiwan',
                valueType: 'String'
            }
        },
        {
            key: 'TZ',
            label: 'Tanzania',
            value: {
                text: 'Tanzania',
                valueType: 'String'
            }
        },
        {
            key: 'UA',
            label: 'Ukraine',
            value: {
                text: 'Ukraine',
                valueType: 'String'
            }
        },
        {
            key: 'UG',
            label: 'Uganda',
            value: {
                text: 'Uganda',
                valueType: 'String'
            }
        },
        {
            key: 'UM',
            label: 'United States Minor Outlying Islands',
            value: {
                text: 'United States Minor Outlying Islands',
                valueType: 'String'
            }
        },
        {
            key: 'US',
            label: 'United States of America',
            value: {
                text: 'United States of America',
                valueType: 'String'
            }
        },
        {
            key: 'UY',
            label: 'Uruguay',
            value: {
                text: 'Uruguay',
                valueType: 'String'
            }
        },
        {
            key: 'UZ',
            label: 'Uzbekistan',
            value: {
                text: 'Uzbekistan',
                valueType: 'String'
            }
        },
        {
            key: 'VA',
            label: 'Holy See',
            value: {
                text: 'Holy See',
                valueType: 'String'
            }
        },
        {
            key: 'VC',
            label: 'Saint Vincent and the Grenadines',
            value: {
                text: 'Saint Vincent and the Grenadines',
                valueType: 'String'
            }
        },
        {
            key: 'VE',
            label: 'Venezuela',
            value: {
                text: 'Venezuela',
                valueType: 'String'
            }
        },
        {
            key: 'VG',
            label: 'Virgin Islands (UK)',
            value: {
                text: 'Virgin Islands (UK)',
                valueType: 'String'
            }
        },
        {
            key: 'VI',
            label: 'Virgin Islands (US)',
            value: {
                text: 'Virgin Islands (US)',
                valueType: 'String'
            }
        },
        {
            key: 'VN',
            label: 'Vietnam',
            value: {
                text: 'Vietnam',
                valueType: 'String'
            }
        },
        {
            key: 'VU',
            label: 'Vanuatu',
            value: {
                text: 'Vanuatu',
                valueType: 'String'
            }
        },
        {
            key: 'WF',
            label: 'Wallis and Futuna',
            value: {
                text: 'Wallis and Futuna',
                valueType: 'String'
            }
        },
        {
            key: 'WS',
            label: 'Samoa',
            value: {
                text: 'Samoa',
                valueType: 'String'
            }
        },
        {
            key: 'YE',
            label: 'Yemen',
            value: {
                text: 'Yemen',
                valueType: 'String'
            }
        },
        {
            key: 'YT',
            label: 'Mayotte',
            value: {
                text: 'Mayotte',
                valueType: 'String'
            }
        },
        {
            key: 'ZA',
            label: 'South Africa',
            value: {
                text: 'South Africa',
                valueType: 'String'
            }
        },
        {
            key: 'ZM',
            label: 'Zambia',
            value: {
                text: 'Zambia',
                valueType: 'String'
            }
        },
        {
            key: 'ZW',
            label: 'Zimbabwe',
            value: {
                text: 'Zimbabwe',
                valueType: 'String'
            }
        }
    ]
}
