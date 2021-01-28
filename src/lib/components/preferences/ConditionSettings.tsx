import { Trans } from '@lingui/macro'
import { Box, Button, Grid } from '@material-ui/core'
import { useFormikContext } from 'formik'
import { keyBy, map } from 'lodash-es'
import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'
import { Condition, DndItemSetting } from '../../types'
import Dropdown, { DropdownOption } from './components/Dropdown'
import Input from './components/Input'
import SettingsBase from './SettingsBase'
import Field from './items/Field'

interface Props {
    expanded: string
    setExpanded: React.Dispatch<React.SetStateAction<string>>
    showContainerTab: boolean
}

const displayOptions: DropdownOption[] = [
    {
        id: 'ALWAYS',
        label: <Trans>Always display</Trans>
    },
    {
        id: 'DISPLAY',
        label: <Trans>Display if</Trans>
    }
]
const operatorOptions: DropdownOption[] = [
    { id: 'EQUAL', label: <Trans>Equals</Trans> },
    { id: 'NOT_EQUAL', label: <Trans>Does not equals</Trans> },
    { id: 'IN', label: <Trans>Contains</Trans> }
]

const ConditionRule: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<Condition>()
    console.log(values)
    const {
        smartyTags,
        state: { entities, items }
    } = useDndEditorContext()
    let fields = map(smartyTags, (label, id) => ({ id, label }))
    const formFields: any[] = items
        .map((item) => entities[item.id])
        .filter((entity) => entity.parent.type !== 'template')
        .map((entity) =>
            Object.keys(entity.values)
                .filter((key) => key !== '__container' && key !== '__condition')
                .map((valueKey) => ({
                    id: `${entity.name}.${valueKey}`,
                    label: `${entity.name}.${valueKey}`
                }))
        )
    const flatFormFields = [].concat.apply([], formFields)
    fields = fields.concat(flatFormFields)
    values.rules = values.rules ?? [{ id: '', operator: 'EQUAL', value: '' }]
    return (
        <>
            <Grid item xs={12}>
                <Field
                    name="display"
                    Component={Dropdown}
                    defaultValue="ALWAYS"
                    SelectProps={{ displayEmpty: true }}
                    options={displayOptions}
                />
            </Grid>
            {Boolean(values.display && values.display !== 'ALWAYS') && (
                <>
                    {(values.rules ?? []).map((rule, index) => (
                        <Grid item xs={12} key={JSON.stringify(rule) + index}>
                            <Field
                                name={`rules.${index}.id`}
                                Component={Dropdown}
                                options={fields}
                                placeholder="Select Field"
                            />
                            <Field
                                name={`rules.${index}.operator`}
                                defaultValue="EQUAL"
                                Component={Dropdown}
                                options={operatorOptions}
                            />
                            <Field
                                name={`rules.${index}.value`}
                                Component={Input}
                                placeholder="Value"
                            />
                            {values.rules.length > 1 && (
                                <Box textAlign="right">
                                    <Button
                                        color="secondary"
                                        onClick={() => {
                                            values.rules.splice(index, 1)
                                            console.log(values.rules)
                                            setFieldValue('rules', values.rules)
                                        }}
                                    >
                                        remove
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    ))}
                </>
            )}
            <Button
                color="primary"
                variant="text"
                onClick={() =>
                    setFieldValue(
                        'rules',
                        values.rules.concat([{ id: '', operator: 'EQUAL', value: '' }])
                    )
                }
            >
                add more
            </Button>
        </>
    )
}

const ConditionSettings: React.FC<Props> = (props) => {
    const editorContext = useDndEditorContext()
    const activeItem = editorContext.active
        ? editorContext.itemsMap[editorContext.state.entities[editorContext.active].parent.id]
        : null
    if (!activeItem || !editorContext.active) {
        return null
    }
    const settings: DndItemSetting[] = [
        {
            id: '__condition',
            settings: [],
            label: <Trans>Condition</Trans>,
            type: 'template'
        }
    ]
    const values = editorContext.state.entities[editorContext.active]?.values ?? {}
    console.log('values', values)

    return (
        <SettingsBase
            {...props}
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={editorContext.active}
        >
            <ConditionRule />
        </SettingsBase>
    )
}

export default ConditionSettings
