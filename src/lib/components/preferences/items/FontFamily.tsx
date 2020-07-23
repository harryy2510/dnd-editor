import { Trans } from '@lingui/macro'
import React from 'react'
import { useFonts } from '../../../utils'
import Dropdown, { DropdownOption, DropdownProps } from '../components/Dropdown'

const FontFamily: React.FC<DropdownProps> = (props) => {
    const { fontFamily } = useFonts()
    const options: DropdownOption[] = fontFamily.map((family) => ({
        ...family,
        id: `${family.id}, sans-serif`,
        style: {
            fontFamily: `${family.id}, sans-serif`
        }
    }))
    return <Dropdown options={options} label={<Trans>Font Family</Trans>} {...props} />
}

export default FontFamily
