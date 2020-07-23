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
    width: Width
}

interface Props {
    name: string
    type: SettingComponentType
}

const Field: React.FC<Props> = ({ name, type }) => {
    const Component = fields[type]
    const formik = useFormikContext()
    let props: any = {}
    if (formik) {
        props.value = get(formik.values, name)
        props.onChange = (value: Primitive) => formik.setFieldValue(name, value, true)
    }
    if (Component) {
        return <Component {...props} />
    }
    return null
}

export default Field
