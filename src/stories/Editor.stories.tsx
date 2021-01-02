import { useStore } from '@harryy/rehooks'
import { Button } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { LocalizationProvider } from '@material-ui/pickers'
import MomentUtils from '@material-ui/pickers/adapter/moment'
import { ThemeProvider } from '@material-ui/styles'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { DndEditor, Renderer } from '../lib'
import * as Blocks from '../lib/assets/blocks'
import FormElements from '../lib/assets/groups/FormElements'
import * as Templates from '../lib/assets/templates'
import { DndBlockItem, DndState } from '../lib/types'
import { createDndState } from '../lib/utils'

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
    const [state, setState] = useStore<DndState>('mail-state', createDndState())
    React.useEffect(() => {
        console.log(state)
    }, [state])
    return <DndEditor {...args} value={state} onChange={setState} />
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
    const [state, setState] = useStore<DndState>('form-state', createDndState())
    React.useEffect(() => {
        console.log(state)
    }, [state])
    return <DndEditor {...args} value={state} onChange={setState} />
}
export const FormRenderer = () => {
    const [state] = useStore<DndState>('form-state', createDndState())
    const [initialValues, setInitialValues] = useStore('form-initialValues', {})
    React.useEffect(() => {
        console.log(state)
    }, [state])
    React.useEffect(() => {
        console.log(initialValues)
    }, [initialValues])
    return (
        <LocalizationProvider dateAdapter={MomentUtils}>
            <Button form="asdasdasd" type="submit">
                Submit
            </Button>
            <Renderer
                state={state}
                initialValues={initialValues}
                onChange={setInitialValues}
                formId="asdasdasd"
            />
        </LocalizationProvider>
    )
}
