import { Trans } from '@lingui/macro'
import {
    FormatAlignCenterOutlined,
    FormatAlignLeftOutlined,
    FormatAlignRightOutlined
} from '@material-ui/icons'
import React from 'react'
import { ToggleButtonOption } from '../components/StyledToggleButtons'
import ToggleButtons, { ToggleButtonsProps } from '../components/ToggleButtons'

const TextAlign: React.FC<ToggleButtonsProps> = (props) => {
    const options: ToggleButtonOption[] = [
        {
            icon: FormatAlignLeftOutlined,
            id: 'left'
        },
        {
            icon: FormatAlignCenterOutlined,
            id: 'center'
        },
        {
            icon: FormatAlignRightOutlined,
            id: 'right'
        }
    ]
    return <ToggleButtons options={options} label={<Trans>Text Align</Trans>} {...props} />
}

export default TextAlign
