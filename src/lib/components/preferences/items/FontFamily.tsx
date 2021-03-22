import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import React from 'react'
import { useDndEditorContext } from '../../../DndEditorProvider'
import { DndState } from '../../../types'
import { useFonts } from '../../../utils'
import Dropdown, { DropdownOption, DropdownProps } from '../components/Dropdown'

const useFontFamily = (value: string) => {
    const { template, state } = useDndEditorContext()
    const { typography } = useTheme<Theme>()

    if (value) {
        return value
    }

    const templateFontFamily = Object.values(state.entities[template.id].values).reduce(
        (p, n) => ({ ...p, ...n.style }),
        {}
    ).fontFamily

    if (templateFontFamily) {
        return templateFontFamily
    }

    return typography.fontFamily
}

const FontFamily: React.FC<DropdownProps> = (props) => {
    const value = useFontFamily(props.value)
    const { fontFamily } = useFonts()
    const options: DropdownOption[] = fontFamily.map((family) => {
        if (family.id === 'Helvetica') {
            return {
                ...family,
                id: `${family.id}, serif`,
                style: {
                    fontFamily: `${family.id}, serif`
                }
            }
        }

        return {
            ...family,
            id: `${family.id}, sans-serif`,
            style: {
                fontFamily: `${family.id}, sans-serif`
            }
        }
    })

    return (
        <Dropdown label={<Trans>Font Family</Trans>} {...props} options={options} value={value} />
    )
}

export default FontFamily
