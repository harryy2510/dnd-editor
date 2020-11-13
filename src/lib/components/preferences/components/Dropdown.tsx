import React from 'react'
import Input from './Input'
import { StyledTextFieldProps } from './StyledTextField'
import { MenuItem } from '@material-ui/core'

export type DropdownOption =
    | string
    | {
          label: React.ReactNode
          id: string | number
          style?: React.CSSProperties
      }
export interface DropdownProps extends StyledTextFieldProps {
    options: DropdownOption[]
}

const Dropdown: React.FC<DropdownProps> = ({ options = [], ...props }) => {
    const children = React.useMemo(() => {
        return options?.map((option, i) => {
            const opt =
                typeof option === 'string' ? { label: option, id: option, style: {} } : option
            return (
                <MenuItem dense key={i} value={opt.id} style={opt.style}>
                    {opt.label}
                </MenuItem>
            )
        })
    }, [options])
    const items = [
        ...(props.placeholder
            ? [
                  <MenuItem value="" selected disabled style={{ display: 'none' }}>
                      {props.placeholder}
                  </MenuItem>
              ]
            : []),
        children
    ]
    return (
        <Input select {...props}>
            {items}
        </Input>
    )
}

export default Dropdown
