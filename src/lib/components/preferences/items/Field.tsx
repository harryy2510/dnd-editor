import { useFormikContext } from 'formik'
import { get } from 'lodash-es'
import React from 'react'
import { Primitive, SettingComponentType } from '../../../types'

import { default as BackgroundColor } from './BackgroundColor'
import { default as Border } from './Border'
import { default as BorderColor } from './BorderColor'
import { default as BorderRadius } from './BorderRadius'
import { default as ButtonAlign } from './ButtonAlign'
import { default as ButtonType } from './ButtonType'
import { default as FontColor } from './FontColor'
import { default as FontFamily } from './FontFamily'
import { default as FontWeight } from './FontWeight'
import { default as Height } from './Height'
import { default as LinkColor } from './LinkColor'
import { default as Padding } from './Padding'
import { default as Size } from './Size'
import { default as Space } from './Space'
import { default as Spacing } from './Spacing'
import { default as TextAlign } from './TextAlign'
import { default as Width } from './Width'

const fields: Record<string, React.FC<any>> = {
    backgroundColor: BackgroundColor,
    border: Border,
    borderColor: BorderColor,
    borderRadius: BorderRadius,
    buttonAlign: ButtonAlign,
    buttonType: ButtonType,
    fontColor: FontColor,
    fontFamily: FontFamily,
    fontWeight: FontWeight,
    height: Height,
    linkColor: LinkColor,
    padding: Padding,
    size: Size,
    space: Space,
    spacing: Spacing,
    textAlign: TextAlign,
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
