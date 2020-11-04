import { Grid, Switch } from '@material-ui/core'
import React from 'react'
import Label from './Label'

export interface ToggleSwitchProps {
    label: React.ReactNode,
    value: boolean,
    onChange: (value: boolean) => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({label, value, onChange}) => {
    return <> 
        <Grid container justify='space-between' alignItems='center'>
            <Label>{label}</Label>
            <Switch onChange={e => onChange(e.target.checked)} checked={value}></Switch>
        </Grid>
    </>
}

export default ToggleSwitch;