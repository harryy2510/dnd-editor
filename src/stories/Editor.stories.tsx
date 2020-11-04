import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles'
import { createDndState } from '../lib/utils';
import { DndEditor, DndEditorProps } from '../lib';
import * as Blocks from '../lib/assets/blocks'
import * as Groups from '../lib/assets/groups'
import * as Templates from '../lib/assets/templates'
import { DndItem } from '../lib/types';
import FormElements from '../lib/assets/groups/FormElements';

export default {
  title: 'Editor',
  component: DndEditor,
  decorators: [story => <ThemeProvider theme={createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } })}>{story()}</ThemeProvider>]
} as Meta;

const defaultProps = {
    smartyTags: {
        'Customer.FirstName': 'Customer FirstName',
        'Customer.LastName': 'Customer LastName',
        'Customer.Email': 'Customer Email',
        'Appointment.ServiceName': 'Appointment ServiceName',
        'Appointment.StaffName': 'Appointment StaffName',
        'Appointment.Time': 'Appointment Time'
    },
    value: createDndState({}),
    items: [...Object.values(Groups), ...Object.values(Blocks)],
    onChange: (_: any) => {},
}

const Template: Story<DndEditorProps> = (args) => <DndEditor {...args} />;

export const Mail = Template.bind({});
Mail.args = {
    ...defaultProps, template : Templates.Mail
};

const formItems: DndItem[] = [
    FormElements, ...Object.values(Blocks)
]
export const Form = Template.bind({});
Form.args = {
    ...defaultProps, items: formItems, template : Templates.Form
};
