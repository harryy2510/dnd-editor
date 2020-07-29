import { Trans } from '@lingui/macro'
import React from 'react'
import { useFonts } from '../../../utils'
import Dropdown, { DropdownOption, DropdownProps } from '../components/Dropdown'

const FontWeight: React.FC<DropdownProps> = (props) => {
    const { fontWeights } = useFonts()
    const options: DropdownOption[] = fontWeights.map((weight) => ({
        ...weight,
        style: {
            fontWeight: weight.id
        }
    }))
    return <Dropdown label={<Trans>Font Weight</Trans>} {...props} options={options} />
}

export default FontWeight
