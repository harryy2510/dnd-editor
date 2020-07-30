import { useStore } from '@harryy/rehooks'
import { Trans } from '@lingui/macro'
import { Box, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { EventOutlined, ImageAspectRatioOutlined, ListOutlined } from '@material-ui/icons'
import { ThemeProvider } from '@material-ui/styles'
import { merge } from 'lodash-es'
import React from 'react'
import { DndEditor } from './lib'
import * as Blocks from './lib/assets/blocks'
import Button from './lib/assets/components/Button'
import Image from './lib/assets/components/Image'
import Text from './lib/assets/components/Text'
import * as Groups from './lib/assets/groups'
import { DndItem, DndState, RenderProps } from './lib/types'
import { createDndState, styleToCss } from './lib/utils'

const smartyTags = {
    'Customer.FirstName': 'Customer FirstName',
    'Customer.LastName': 'Customer LastName',
    'Customer.Email': 'Customer Email',
    'Appointment.ServiceName': 'Appointment ServiceName',
    'Appointment.StaffName': 'Appointment StaffName',
    'Appointment.Time': 'Appointment Time'
}

const sampleData = {
    Customer: {
        FirstName: 'Hariom',
        LastName: 'Sharma',
        Email: 'hariom@appointy.com'
    },
    Appointments: [
        {
            ServiceName: 'HairCut',
            StaffName: 'Henry M Cope',
            Time: '3rd Oct, 2020'
        },
        {
            ServiceName: 'HairCut',
            StaffName: 'Raul D Sims',
            Time: '3rd Oct, 2020'
        },
        {
            ServiceName: 'HairCut',
            StaffName: 'Audra T Mobley',
            Time: '3rd Oct, 2020'
        }
    ]
}

const customItems: DndItem[] = [
    {
        id: 'header',
        type: 'group',
        icon: ImageAspectRatioOutlined,
        render: () => <></>,
        export: () => '',
        label: <Trans>Header</Trans>,
        priority: 1.5
    },
    {
        id: 'logo',
        type: 'block',
        parent: 'header',
        image: '',
        render: (renderProps) => Image.render(renderProps, 'image-1'),
        export: (renderProps: RenderProps) => {
            if (!renderProps.item) {
                return ''
            }
            const stateImage = renderProps.state.entities[renderProps.item.id].values['image-1']
            const stateText = renderProps.state.entities[renderProps.item.id].values['text-1']
            return `
            {% if business.logo == "" %}
            <div style="${styleToCss(stateText.style)}">
                {{business.name}}
            </div>
            {% endif %}
            {% if business.logo != "" %}
            <img src="{{business.logo}}"  style="${styleToCss(stateImage.style)}" alt="">
            {% endif %}
        `
        },
        label: <Trans>Logo</Trans>,
        initialValues: {
            'image-1': merge({}, Image.initialValues, {
                url: 'http://placehold.jp/24/ccc/444/240x240.png?text=Logo',
                style: {
                    height: '80px',
                    width: 'auto'
                }
            }),
            'text-1': merge({}, Text.initialValues, {
                label: 'Business Name',
                style: {
                    fontSize: '24px',
                    fontWeight: '600'
                }
            }),
            __container: {
                style: {
                    justifyContent: 'flex-start',
                    textAlign: 'left'
                }
            }
        },
        settings: [
            {
                id: 'image-1',
                label: <Trans>Logo</Trans>,
                settings: Image.settings?.filter((set) => set.type !== 'image'),
                type: 'image'
            },
            {
                id: 'text-1',
                label: <Trans>Business Name</Trans>,
                settings: Text.settings,
                type: 'text'
            }
        ]
    },
    {
        id: 'footer',
        type: 'group',
        icon: ListOutlined,
        render: () => <></>,
        export: () => '',
        label: <Trans>Footer</Trans>,
        priority: 6
    },
    {
        id: 'branding',
        label: <Trans>Branding</Trans>,
        render: (renderProps) => Text.render(renderProps, 'text-1'),
        export: (renderProps) => Text.export(renderProps, 'text-1'),
        image: '',
        initialValues: {
            'text-1': merge({}, Text.initialValues, {
                label: `
                <p>You are receiving this email because you are registered under <span class="mention" data-mentin="{{business.name}}">{{business.name}}</span></span> as a customer and were associated to this order.</p>
                <p>This is a software generated message sent by Appointy on behalf of <span class="mention" data-mentin="{{business.email}}">{{business.email}}</span> Please do not reply to this message.</p>
                <p>Powered By <a href="https://appointy.com">Appointy</a></p>
            `,
                style: {
                    color: '#777',
                    fontSize: '10px'
                }
            }),
            __container: {
                style: {
                    textAlign: 'center'
                }
            }
        },
        parent: 'footer',
        settings: [
            {
                id: 'text-1',
                label: <Trans>Text - 1</Trans>,
                type: 'text',
                settings: Text.settings
            }
        ],
        type: 'block'
    },
    {
        id: 'appointment-confirmation',
        type: 'block',
        parent: 'appointment',
        image: '',
        label: <Trans>Appointment Confirmation</Trans>,
        export: (renderProps) => `
        <div>
            {% for appointment in appointments %}
            <div style="${styleToCss({ width: '100%' })}">${Text.export(
            renderProps,
            'text-1'
        )}</div>
            {% endfor %}
            <div style="${styleToCss({ width: '100%', marginBottom: 4 })}">
                ${Button.export(renderProps, 'button-1')}
            </div>
            <div style="${styleToCss({ width: '100%' })}">${Button.export(
            renderProps,
            'button-2'
        )}</div>
        </div>
    `,
        render: (renderProps) => {
            return (
                <div>
                    <div style={{ width: '100%' }}>{Text.render(renderProps, 'text-1')}</div>
                    <div style={{ width: '100%', marginBottom: 4 }}>
                        {Button.render(renderProps, 'button-1')}
                    </div>
                    <div style={{ width: '100%' }}>{Button.render(renderProps, 'button-2')}</div>
                </div>
            )
        },
        initialValues: {
            'text-1': {
                label: `
                <p style="margin-bottom: 16px">Appointment confirmation for <span class="mention" data-mention="{{customer.firstName}}">{{customer.firstName}}</span>  <span class="mention" data-mention="{{customer.lastName}}">{{customer.lastName}}</span></p>
                <table>
                    <tr>
                        <td>What</td>
                        <td><span class="mention" data-mention="{{appointment.service.name}}">{{appointment.service.name}}</span></td>
                    </tr>
                    <tr>
                        <td>When</td>
                        <td><span class="mention" data-mention="{{appointment.startTime}}">{{appointment.startTime}}</span></td>
                    </tr>
                    <tr>
                        <td>With</td>
                        <td><span class="mention" data-mention="{{appointment.staff.name}}">{{appointment.staff.name}}</span></td>
                    </tr>
                </table>
                <br/>
                <br/>
                <p>If you require further assistance with your booking or have any questions, you can reach us at:</p>
                <table>
                    <tr>
                        <td>Business address</td>
                        <td><span class="mention" data-mention="{{business.address}}">{{business.address}}</span></td>
                    </tr>
                    <tr>
                        <td>Business email</td>
                        <td><span class="mention" data-mention="{{business.email}}">{{business.email}}</span></td>
                    </tr>
                    <tr>
                        <td>Business phone</td>
                        <td><span class="mention" data-mention="{{business.phone}}">{{business.phone}}</span></td>
                    </tr>
                </table>
            `,
                style: Text.initialValues?.style
            },
            'button-1': {
                label: 'Reschedule',
                style: {
                    ...(Button.initialValues?.style ?? {}),
                    width: '90%'
                }
            },
            'button-2': {
                label: 'Cancel',
                style: {
                    ...(Button.initialValues?.style ?? {}),
                    width: '90%'
                }
            }
        },
        settings: [
            {
                id: 'text-1',
                label: <Trans>Text - 1</Trans>,
                type: 'text',
                settings: Text.settings
            },
            {
                id: 'button-1',
                label: <Trans>Button - 1</Trans>,
                type: 'button',
                settings: Button.settings
            },
            {
                id: 'button-2',
                label: <Trans>Button - 2</Trans>,
                type: 'button',
                settings: Button.settings
            }
        ]
    },
    {
        id: 'appointment',
        type: 'group',
        icon: EventOutlined,
        render: () => <></>,
        export: () => '',
        label: <Trans>Appointment</Trans>,
        priority: 1.75
    }
]

function App() {
    const [value, onChange] = useStore<DndState>('dnd-test-3', createDndState())
    return (
        <ThemeProvider
            theme={createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } })}
        >
            <CssBaseline />
            <Box position="absolute" top={0} right={0} bottom={0} left={0}>
                <DndEditor
                    smartyTags={smartyTags}
                    items={[...Object.values(Groups), ...Object.values(Blocks), ...customItems]}
                    value={value}
                    onChange={onChange}
                    sampleData={sampleData}
                />
            </Box>
        </ThemeProvider>
    )
}

export default App
