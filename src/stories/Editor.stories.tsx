import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { DndEditor } from '../lib'
import * as Blocks from '../lib/assets/blocks'
import FormElements from '../lib/assets/groups/FormElements'
import * as Templates from '../lib/assets/templates'
import { DndBlockItem, DndState } from '../lib/types'

export default {
    title: 'Editor',
    component: DndEditor,
    decorators: [
        (story) => (
            <ThemeProvider
                theme={createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } })}
            >
                {story()}
            </ThemeProvider>
        )
    ]
} as Meta

export const Mail = () => {
    const args = {
        smartyTags: {
            'Customer.FirstName': 'Customer FirstName',
            'Customer.LastName': 'Customer LastName',
            'Customer.Email': 'Customer Email',
            'Appointment.ServiceName': 'Appointment ServiceName',
            'Appointment.StaffName': 'Appointment StaffName',
            'Appointment.Time': 'Appointment Time'
        },
        template: Templates.Mail
    }
    const [state, setState] = React.useState(initialValue)
    React.useEffect(() => {
        console.log(state)
    }, [state])
    return <DndEditor {...args} value={state} onChange={setState} />
}

const initialValue: DndState = {
    entities: {
        unziq_zzMslCMlE9xGbfS: {
            id: 'unziq_zzMslCMlE9xGbfS',
            name: 'unziq_zzMslCMlE9xGbfS',
            parent: { id: 'element', type: 'block' },
            values: {
                __container: {
                    style: {
                        padding: '12px 16px 12px 16px',
                        backgroundColor: '',
                        backgroundImage: '',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        width: '100%',
                        boxSizing: 'border-box',
                        textAlign: 'left'
                    }
                },
                __condition: {},
                'checkbox-1': {
                    showOther: false,
                    validation: { type: 'none' },
                    pii: '',
                    className: '',
                    required: true,
                    enabled: true,
                    style: { textAlign: 'left' },
                    key: 'checkbox-1',
                    question: 'Question',
                    placeholder: '',
                    hint: 'Optional Hint',
                    options: [
                        { key: 'yes', label: 'Yes', value: { text: 'Yes', valueType: 'String' } }
                    ],
                    itemType: 'Checkbox',
                    grid: 12
                }
            }
        }
    },
    items: [{ id: 'unziq_zzMslCMlE9xGbfS' }]
}
export const Form = () => {
    const args = {
        smartyTags: {
            'Appointment.ServiceName': 'Appointment ServiceName'
        },
        items: [
            FormElements,
            Blocks.Divider,
            ...Object.values(Blocks).filter(
                (block: DndBlockItem) => block.parent === 'form-elements'
            )
        ],
        template: Templates.Form
    }
    const [state, setState] = React.useState(initialValue)
    React.useEffect(() => {
        console.log(state)
    }, [state])
    return <DndEditor {...args} value={state} onChange={setState} />
}
