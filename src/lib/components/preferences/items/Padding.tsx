import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { InputProps } from '../components/Input'
import Label from '../components/Label'
import StyledTextField from '../components/StyledTextField'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    container: {
        width: '100%',
        marginBottom: spacing(1)
    },
    flex: {
        marginTop: spacing(1),
        display: 'flex',
        '& > div': {
            flex: 1,
            '&:not(:last-child)': {
                marginRight: spacing(1)
            }
        }
    }
}))

const Padding: React.FC<InputProps> = (props) => {
    const classes = useStyles()
    const values = (props.value as string).split(' ') ?? []
    const handleChange = (index: number) => (value: any = '0px') => {
        const newValues = [...values]
        newValues[index] = value
        props.onChange(newValues.join(' '))
    }
    return (
        <div className={classes.container}>
            <Label>
                <Trans>Padding</Trans>
            </Label>
            <div className={classes.flex}>
                <StyledTextField
                    helperText={<Trans>Top</Trans>}
                    value={values[0]}
                    onChange={handleChange(0)}
                />
                <StyledTextField
                    helperText={<Trans>Right</Trans>}
                    value={values[1]}
                    onChange={handleChange(1)}
                />
                <StyledTextField
                    helperText={<Trans>Bottom</Trans>}
                    value={values[2]}
                    onChange={handleChange(2)}
                />
                <StyledTextField
                    helperText={<Trans>Left</Trans>}
                    value={values[3]}
                    onChange={handleChange(3)}
                />
            </div>
        </div>
    )
}

export default Padding
