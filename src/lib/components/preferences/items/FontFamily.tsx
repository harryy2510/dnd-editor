import { Trans } from '@lingui/macro'
import React from 'react'
import Dropdown, { DropdownOption, DropdownProps } from '../components/Dropdown'

const FontFamily: React.FC<DropdownProps> = (props) => {
    const options: DropdownOption[] = [
        {
            label: <Trans>Helvetica</Trans>,
            id: 'Helvetica, sans-serif',
            style: {
                fontFamily: 'Helvetica, sans-serif'
            }
        },
        {
            label: <Trans>Arial</Trans>,
            id: 'Arial, sans-serif',
            style: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        {
            label: <Trans>Open Sans</Trans>,
            id: 'Open Sans, sans-serif',
            style: {
                fontFamily: 'Open Sans, sans-serif'
            }
        },

        {
            label: <Trans>Poppins</Trans>,
            id: 'Poppins, sans-serif',
            style: {
                fontFamily: 'Poppins, sans-serif'
            }
        }
    ]
    return <Dropdown options={options} label={<Trans>Font Family</Trans>} {...props} />
}

export default FontFamily
