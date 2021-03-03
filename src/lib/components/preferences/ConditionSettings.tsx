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
import LabeledSwitch from './items/LabeledSwitch'

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

type ConditionType = 'linking' | 'display'
const operatorOptions: DropdownOption[] = [
    { id: 'EQUAL', label: <Trans>Equals</Trans> },
    { id: 'NOT_EQUAL', label: <Trans>Does not equals</Trans> },
    { id: 'IN', label: <Trans>Contains</Trans> },
    { id: 'NOT_IN', label: <Trans>Does not contains</Trans> }
]

const ConditionRule: React.FC<{ type: ConditionType }> = ({ type }) => {
    const { values, setFieldValue } = useFormikContext<Condition>()
   
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
                .filter(
                    (key) =>
                        key !== '__container' &&
                        key !== '__condition' &&
                        key !== '__displayCondition'
                )
                .map((valueKey) => ({
                    id: `${valueKey}/${entity.id}`,
                    label: `${entity.name}.${valueKey}`
                }))
        )
    const flatFormFields = [].concat.apply([], formFields)
    fields = type === 'linking' ? fields : flatFormFields
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
                    {values.rules?.length > 1 && (
                        <Grid item xs={12}>
                            <Field
                                name="type"
                                Component={Dropdown}
                                defaultValue="OR"
                                label={<Trans>Group by </Trans>}
                                options={[
                                    { id: 'AND', label: 'AND' },
                                    { id: 'OR', label: 'OR' }
                                ]}
                            />
                        </Grid>
                    )}
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
                                            
                                            setFieldValue('rules', values.rules)
                                        }}
                                    >
                                        remove
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    ))}
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
            )}
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
            label: <Trans>Linking Condition</Trans>,
            type: 'template',
            component: <ConditionRule type="linking" />
        },
        {
            id: '__displayCondition',
            settings: [],
            label: <Trans>Display Condition</Trans>,
            type: 'template',
            component: <ConditionRule type="display" />
        }
    ]
    const values = editorContext.state.entities[editorContext.active]?.values ?? {}

    return (
        <SettingsBase
            {...props}
            renderProps={editorContext}
            initialValues={values}
            settings={settings}
            id={editorContext.active}
        ></SettingsBase>
    )
}

export default ConditionSettings
