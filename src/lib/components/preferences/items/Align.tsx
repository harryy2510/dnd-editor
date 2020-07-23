import { Trans } from '@lingui/macro'
import {
    FormatAlignCenterOutlined,
    FormatAlignLeftOutlined,
    FormatAlignRightOutlined
} from '@material-ui/icons'
import React from 'react'
import { ToggleButtonOption } from '../components/StyledToggleButtons'
import ToggleButtons, { ToggleButtonsProps } from '../components/ToggleButtons'

const Align: React.FC<ToggleButtonsProps> = (props) => {
    const options: ToggleButtonOption[] = [
        {
            icon: FormatAlignLeftOutlined,
            id: 'flex-start'
        },
        {
            icon: FormatAlignCenterOutlined,
            id: 'center'
        },
        {
            icon: FormatAlignRightOutlined,
            id: 'flex-end'
        }
    ]
    return <ToggleButtons options={options} label={<Trans>Align</Trans>} {...props} />
}

export default Align
