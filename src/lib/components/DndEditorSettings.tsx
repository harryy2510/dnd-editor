import { FiberManualRecord } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { get } from 'lodash-es'
import { nanoid } from 'nanoid'
import { useFormik } from 'formik'
import React from 'react'
import { useDndEditorContext } from '../DndEditorProvider'
import { DndEditorSettingsProps, DndSetting } from '../types'
import {
    Button,
    CardActions,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Popover,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Theme,
    Typography
} from '@material-ui/core'
import { usePopupState, bindPopover, bindTrigger } from 'material-ui-popup-state/hooks'
import { SketchPicker } from 'react-color'
import { Trans } from '@lingui/macro'
import { useDebouncedCallback } from 'use-debounce'

import AceEditor from 'react-ace'
import 'ace-builds/src-min-noconflict/mode-html'
import 'ace-builds/src-min-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const useStyles = makeStyles(({}: Theme) => ({
    root: {},
    childItem1: {
        flex: 1,
        alignItems: 'center',
        display: 'flex'
    },
    childItem2: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        display: 'flex'
    },
    input: {
        maxWidth: 120
    }
}))

interface ColorPickerProps {
    value: string
    onChange: (e: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
    const [color, setColor] = React.useState('')
    const popupState = usePopupState({
        popupId: nanoid(),
        variant: 'popover'
    })
    const handleCancel = () => {
        setColor(value)
        popupState.close()
    }
    const handleSave = () => {
        onChange(color)
        popupState.close()
    }
    return (
        <>
            <IconButton
                style={{ border: `1px solid #ccc`, padding: 0 }}
                size="small"
                {...bindTrigger(popupState)}
            >
                <FiberManualRecord style={{ color: value }} />
            </IconButton>
            <Popover {...bindPopover(popupState)}>
                <SketchPicker
                    color={color}
                    onChange={(e) => setColor(e.hex)}
                    disableAlpha
                    styles={{ default: { picker: { boxShadow: 'none' } } }}
                />
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={handleCancel} size="small">
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button onClick={handleSave} size="small" color="primary">
                        <Trans>Save</Trans>
                    </Button>
                </CardActions>
            </Popover>
        </>
    )
}

const DndEditorSettings: React.FC<DndEditorSettingsProps> = ({}) => {
    const classes = useStyles()
    const { active, itemsMap, layout, setState, state } = useDndEditorContext()
    const item = active ? itemsMap[state.entities[active].parent] : layout
    const itemState = active ? state.entities[active] : state.layout
    const settings = item.settings

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: itemState?.state ?? settings?.initialValues ?? {},
        validationSchema: settings?.validationSchema,
        onSubmit: (values) => {
            if (active) {
                setState((existingState) => ({
                    ...existingState,
                    entities: {
                        ...existingState.entities,
                        [active]: {
                            ...existingState.entities[active],
                            state: values
                        }
                    }
                }))
            } else {
                setState((existingState) => ({
                    ...existingState,
                    layout: {
                        ...existingState.layout,
                        state: { ...existingState.layout.state, ...values }
                    }
                }))
            }
        }
    })
    const [submitForm] = useDebouncedCallback(formik.submitForm, 100)
    React.useEffect(() => {
        submitForm()
    }, [formik.values])
    const renderField = (item: DndSetting) => {
        switch (item.type) {
            case 'checkbox':
                return (
                    <>
                        <ListItemText className={classes.childItem1} secondary={item.label} />
                        <ListItemText disableTypography className={classes.childItem2}>
                            <Checkbox
                                onChange={(e, v) => formik.setFieldValue(item.id, v, true)}
                                checked={get(formik.values, item.id)}
                                size="small"
                            />
                        </ListItemText>
                    </>
                )
            case 'color':
                return (
                    <>
                        <ListItemText className={classes.childItem1} secondary={item.label} />
                        <ListItemText disableTypography className={classes.childItem2}>
                            <ColorPicker
                                value={get(formik.values, item.id)}
                                onChange={(e) => formik.setFieldValue(item.id, e, true)}
                            />
                        </ListItemText>
                    </>
                )
            case 'dropdown':
                return (
                    <>
                        <ListItemText className={classes.childItem1} secondary={item.label} />
                        <ListItemText disableTypography className={classes.childItem2}>
                            <Select
                                onChange={(e) =>
                                    formik.setFieldValue(item.id, e.target.value, true)
                                }
                                value={get(formik.values, item.id)}
                                input={<InputBase />}
                            >
                                {item.items.map((child, i) => (
                                    <MenuItem key={i} value={child.value as any}>
                                        {child.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </ListItemText>
                    </>
                )
            case 'input':
                return (
                    <>
                        <ListItemText className={classes.childItem1} secondary={item.label} />
                        <ListItemText disableTypography className={classes.childItem2}>
                            <TextField
                                onChange={(e) =>
                                    formik.setFieldValue(item.id, e.target.value, true)
                                }
                                value={get(formik.values, item.id)}
                                className={classes.input}
                                placeholder={item.placeholder}
                                size="small"
                            />
                        </ListItemText>
                    </>
                )
            case 'radio':
                return (
                    <ListItemText disableTypography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {item.label}
                        </Typography>
                        <RadioGroup
                            onChange={(e, v) => formik.setFieldValue(item.id, v, true)}
                            value={get(formik.values, item.id)}
                        >
                            {item.items.map((child, i) => (
                                <FormControlLabel
                                    key={i}
                                    label={child.label}
                                    control={<Radio size="small" />}
                                    value={child.value}
                                />
                            ))}
                        </RadioGroup>
                    </ListItemText>
                )
            case 'code':
                return (
                    <ListItemText disableTypography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {item.label}
                        </Typography>
                        <AceEditor
                            mode="html"
                            theme="monokai"
                            name={`code-editor-${item.id}`}
                            value={get(formik.values, item.id)}
                            onChange={(e) => formik.setFieldValue(item.id, e, true)}
                            setOptions={{
                                useWorker: false,
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                tabSize: 2
                            }}
                        />
                    </ListItemText>
                )
        }
    }
    return settings?.items?.length ? (
        <form onSubmit={formik.handleSubmit}>
            <List dense disablePadding>
                {settings.items.map((item, i) => (
                    <ListItem key={i} divider disableGutters dense>
                        {renderField(item)}
                    </ListItem>
                ))}
            </List>
        </form>
    ) : null
}

export default DndEditorSettings
