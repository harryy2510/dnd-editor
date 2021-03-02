import { useFormikContext } from 'formik'
import { get } from 'lodash-es'
import React from 'react'
import { Primitive, SettingComponentType } from '../../../types'

import Align from './Align'
import BackgroundColor from './BackgroundColor'
import Border from './Border'
import BorderColor from './BorderColor'
import BorderRadius from './BorderRadius'
import ButtonType from './ButtonType'
import Color from './Color'
import FontColor from './FontColor'
import FontFamily from './FontFamily'
import FontWeight from './FontWeight'
import Height from './Height'
import Image from './Image'
import ImagePadding from './ImagePadding'
import LinkColor from './LinkColor'
import Padding from './Padding'
import Size from './Size'
import Space from './Space'
import Spacing from './Spacing'
import TextAlign from './TextAlign'
import Url from './Url'
import VerticalAlign from './VerticalAlign'
import Width from './Width'
import LabeledTextInput from './LabeledTextInput'
import LabeledSwitch from './LabeledSwitch'
import InputValidation from './InputValidation'
import InputOptions from './InputOptions'
import MultilineValidation from './MultilineValidation'
import LabeledNumberInput from './LabeledNumberInput'

const fields: Record<string, React.FC<any>> = {
    align: Align,
    backgroundColor: BackgroundColor,
    border: Border,
    borderColor: BorderColor,
    borderRadius: BorderRadius,
    buttonType: ButtonType,
    color: Color,
    fontColor: FontColor,
    fontFamily: FontFamily,
    fontWeight: FontWeight,
    height: Height,
    image: Image,
    imagePadding: ImagePadding,
    linkColor: LinkColor,
    padding: Padding,
    size: Size,
    space: Space,
    spacing: Spacing,
    textAlign: TextAlign,
    url: Url,
    verticalAlign: VerticalAlign,
    width: Width,
    labeledTextInput: LabeledTextInput,
    inputValidation: InputValidation,
    multilineValidation: MultilineValidation,
    inputOptions: InputOptions,
    labeledNumberInput: LabeledNumberInput,
    labeledSwitch: LabeledSwitch
}

interface Props {
    name: string
    type?: SettingComponentType
    Component?: React.ComponentType<any>
    hideIfSet?: string
    [key: string]: any
}

const Field: React.FC<Props> = ({ name, type, Component: _Component, hideIfSet, ...props }) => {
    const Component = _Component || (type && fields[type])
    const formik = useFormikContext()
    let formikProps: any = {}
    if (formik) {
        formikProps.value = get(formik.values, name)
        formikProps.onChange = (value: Primitive) => formik.setFieldValue(name, value, true)
        if (hideIfSet && Boolean(get(formik.values, hideIfSet))) {
            return null
        }
    }
    if (Component) {
        return <Component {...props} {...formikProps} />
    }
    return null
}

export default Field
