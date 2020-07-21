import { Trans } from '@lingui/macro'
import React from 'react'
import Dropdown, { DropdownOption, DropdownProps } from '../components/Dropdown'

const FontWeight: React.FC<DropdownProps> = (props) => {
    const options: DropdownOption[] = [
        {
            label: <Trans>300 Thin</Trans>,
            id: 300,
            style: {
                fontWeight: 300
            }
        },
        {
            label: <Trans>400 Regular</Trans>,
            id: 400,
            style: {
                fontWeight: 400
            }
        },
        {
            label: <Trans>500 Semi Bold</Trans>,
            id: 500,
            style: {
                fontWeight: 500
            }
        },
        {
            label: <Trans>600 Bold</Trans>,
            id: 600,
            style: {
                fontWeight: 600
            }
        }
    ]
    return <Dropdown options={options} label={<Trans>Font Weight</Trans>} {...props} />
}

export default FontWeight
