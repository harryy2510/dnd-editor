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
    const values = props.value?.split(' ') ?? []
    const handleChange = (index: number) => (value: string = '0px') => {
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
                    parentId={props.parentId}
                />
                <StyledTextField
                    helperText={<Trans>Right</Trans>}
                    value={values[1]}
                    onChange={handleChange(1)}
                    parentId={props.parentId}
                />
                <StyledTextField
                    helperText={<Trans>Bottom</Trans>}
                    value={values[2]}
                    onChange={handleChange(2)}
                    parentId={props.parentId}
                />
                <StyledTextField
                    helperText={<Trans>Left</Trans>}
                    value={values[3]}
                    onChange={handleChange(3)}
                    parentId={props.parentId}
                />
            </div>
        </div>
    )
}

export default Padding
