import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Theme,
    Typography,
    Box
} from '@material-ui/core'
import { ArrowDropDownOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Form, Formik, FormikValues } from 'formik'
import { get } from 'lodash-es'
import React from 'react'
import { DndItemSetting, InitialValues, RenderProps } from '../../types'
import { updateItem } from '../../utils'
import FormObserver from './components/FormObserver'
import Field from './items/Field'
import { Trans } from '@lingui/macro'

const useStyles = makeStyles(({ palette: { text } }: Theme) => ({
    root: {
        borderLeftWidth: 0,
        borderRightWidth: 0,
        '&.Mui-expanded': {
            margin: 0
        },
        '&:not(:last-child)': {
            borderBottomWidth: 0
        },
        '&:before': {
            content: '"none"',
            display: 'none'
        }
    },
    label: {
        fontWeight: 500
    },
    form: {
        width: '100%'
    },
    summary: {
        color: text.disabled,
        '&.Mui-expanded': {
            color: text.primary
        }
    }
}))

interface Props {
    initialValues?: InitialValues
    settings?: DndItemSetting[]
    renderProps: RenderProps
    id: string
    expanded: string
    setExpanded: React.Dispatch<React.SetStateAction<string>>
    defaultExpanded?: boolean
}

const SettingsBase: React.FC<Props> = ({
    initialValues = {},
    settings = [],
    renderProps,
    id,
    expanded,
    setExpanded,
    defaultExpanded,
    children
}) => {
    const handleChange = (childId: string) => (newValues: InitialValues) => {
        updateItem(renderProps, id, { [childId]: newValues })
    }
    const classes = useStyles()
    const canExpand = !Boolean(defaultExpanded) && settings.length > 1

    return (
        <>
            {settings?.map((setting, i) => {
                const isExpanded = expanded === setting.id || !canExpand
                return (
                    <Accordion
                        square
                        variant="outlined"
                        className={classes.root}
                        expanded={isExpanded}
                        onChange={
                            canExpand ? (e, v) => setExpanded(v ? setting.id : '') : undefined
                        }
                        TransitionProps={{ mountOnEnter: true, unmountOnExit: true }}
                        key={`${id}-${i}`}
                    >
                        <AccordionSummary
                            className={classes.summary}
                            expandIcon={canExpand && <ArrowDropDownOutlined color="inherit" />}
                        >
                            <Typography color="inherit" variant="body2" className={classes.label}>
                                {setting.label}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Formik
                                enableReinitialize
                                key={i}
                                initialValues={
                                    (get(initialValues, setting.id) as FormikValues) ?? {}
                                }
                                onSubmit={handleChange(setting.id)}
                            >
                                <Form className={classes.form}>
                                    <Grid container spacing={2}>
                                        {children ||
                                            setting.settings?.map((st, i) => (
                                                <Grid item xs={st.grid ?? 12} key={i}>
                                                    <Field name={st.id} {...st} />
                                                </Grid>
                                            ))}
                                    </Grid>
                                    <FormObserver onChange={handleChange(setting.id)} />
                                </Form>
                            </Formik>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
            {settings?.length === 0 && (
                <Box style={{ padding: '16px' }}>
                    <Trans>No settings available!</Trans>
                </Box>
            )}
        </>
    )
}

export default SettingsBase
