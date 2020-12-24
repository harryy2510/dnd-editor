import { useStore } from '@harryy/rehooks'
import { Trans } from '@lingui/macro'
import { Box, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { EventOutlined, ImageAspectRatioOutlined, ListOutlined } from '@material-ui/icons'
import { ThemeProvider } from '@material-ui/styles'
import { merge, noop } from 'lodash-es'
import React from 'react'
import { DndEditor, Renderer } from './lib'
import * as Blocks from './lib/assets/blocks'
import Button from './lib/assets/components/Button'
import Image from './lib/assets/components/Image'
import Text from './lib/assets/components/Text'
import * as Groups from './lib/assets/groups'
import { DndItem, DndState, RenderProps } from './lib/types'
import { createDndState, styleToCss } from './lib/utils'
import Divider from './lib/assets/components/Divider'

const smartyTags = {
    'Customer.FirstName': 'Customer FirstName',
    'Customer.LastName': 'Customer LastName',
    'Customer.Email': 'Customer Email',
    ServiceName: 'Appointment ServiceName',
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
        renderMode: 'container',
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
                    textAlign: 'left',
                    display: 'block'
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
        renderMode: 'container',
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
                <p>You are receiving this email because you are registered under <span class="suggestion" data-value="{{business.name}}">{{business.name}}</span></span> as a customer and were associated to this order.</p>
                <p></p>
                <p>This is a software generated message sent by Appointy on behalf of <span class="suggestion" data-value="{{business.email}}">{{business.email}}</span> Please do not reply to this message.</p>
                <p></p>
                <p></p>
                <p></p>
                <p><em>Powered By</em></p> 
                <p><a href="https://appointy.com"><img src="data:image/png;base64,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" alt=""></a></p>
            `,
                style: {
                    color: '#777',
                    fontSize: '12px'
                }
            }),
            __container: {
                style: {
                    textAlign: 'center',
                    display: 'block'
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
        {% for appointment in appointments %}
            <p>
                ${Text.export(renderProps, 'text-1')}
            </p>
        {% endfor %}
        <p>${Divider.export(renderProps, 'divider-1')}</p>
        <p style="text-align: center">
            ${Button.export(renderProps, 'button-1')}
        </p>
        <p>
            <br/>
        </p>
        <p style="text-align: center">
            ${Button.export(renderProps, 'button-2')}
        </p>
        <p>${Divider.export(renderProps, 'divider-1')}</p>
        <p>
            ${Text.export(renderProps, 'text-2')}
        </p>
    `,
        render: (renderProps) => {
            return (
                <>
                    <p>{Text.render(renderProps, 'text-1')}</p>
                    <p>{Divider.render(renderProps, 'divider-1')}</p>
                    <p style={{ textAlign: 'center' }}>{Button.render(renderProps, 'button-1')}</p>
                    <p>
                        <br />
                    </p>
                    <p style={{ textAlign: 'center' }}>{Button.render(renderProps, 'button-2')}</p>
                    <p>{Divider.render(renderProps, 'divider-2')}</p>
                    <p>{Text.render(renderProps, 'text-2')}</p>
                </>
            )
        },
        initialValues: {
            'text-1': merge({}, Text.initialValues, {
                label: `
                    <p>Appointment confirmation for <span class="suggestion" data-value="{{customer.firstName}}">{{customer.firstName}}</span> <span class="suggestion" data-value="{{customer.lastName}}">{{customer.lastName}}</span></p>
                    <p></p>
                    <table>
                        <tr>
                            <td>What</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{appointment.service.name}}">{{appointment.service.name}}</span></td>
                        </tr>
                        <tr>
                            <td>When</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{appointment.startTime}}">{{appointment.startTime}}</span></td>
                        </tr>
                        <tr>
                            <td>With</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{appointment.staff.name}}">{{appointment.staff.name}}</span></td>
                        </tr>
                    </table>
                    <p></p>
                    <p></p>
                `
            }),
            'text-2': merge({}, Text.initialValues, {
                label: `
                    <p></p>
                    <p>If you require further assistance with your booking or have any questions, you can reach us at:</p>
                    <p></p>
                    <table>
                        <tr>
                            <td>Business address</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{business.address}}">{{business.address}}</span></td>
                        </tr>
                        <tr>
                            <td>Business email</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{business.email}}">{{business.email}}</span></td>
                        </tr>
                        <tr>
                            <td>Business phone</td>
                            <td>:</td>
                            <td><span class="suggestion" data-value="{{business.phone}}">{{business.phone}}</span></td>
                        </tr>
                    </table>
                    <p></p>
                    <p></p>
                `
            }),
            'button-1': merge({}, Button.initialValues, {
                label: 'Reschedule',
                style: {
                    width: '240px'
                }
            }),
            'button-2': merge({}, Button.initialValues, {
                label: 'Cancel',
                style: {
                    width: '240px'
                }
            }),
            'divider-1': merge({}, Divider.initialValues, {
                style: {
                    borderColor: '#E2E2E2',
                    borderWidth: '1px',
                    margin: '32px auto'
                }
            }),
            'divider-2': merge({}, Divider.initialValues, {
                style: {
                    borderColor: '#E2E2E2',
                    borderWidth: '1px',
                    margin: '32px auto'
                }
            }),
            __container: {
                style: {
                    textAlign: 'left'
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
                id: 'text-2',
                label: <Trans>Text - 2</Trans>,
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
            },
            {
                id: 'divider-1',
                label: <Trans>Divider - 1</Trans>,
                type: 'text',
                settings: [
                    ...(Divider.settings ?? []),
                    { id: 'style.borderColor', type: 'color', grid: 12 }
                ]
            },
            {
                id: 'divider-2',
                label: <Trans>Divider - 2</Trans>,
                type: 'text',
                settings: [
                    ...(Divider.settings ?? []),
                    { id: 'style.borderColor', type: 'color', grid: 12 }
                ]
            }
        ]
    },
    {
        id: 'appointment',
        type: 'group',
        renderMode: 'container',
        icon: EventOutlined,
        render: () => <></>,
        export: () => '',
        label: <Trans>Appointment</Trans>,
        priority: 1.75
    }
]

function App() {
    const [value, setValue] = useStore<DndState>('dnd-test-4', createDndState())
    const [submission, setSubmission] = useStore<DndState>('submission', createDndState())
    const theme = React.useMemo(
        () => createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } }),
        []
    )

    // <DndEditor
    //     smartyTags={smartyTags}
    //     items={[...Object.values(Groups), ...Object.values(Blocks), ...customItems]}
    //     value={value}
    //     onChange={setValue}
    //     sampleData={sampleData}
    // />
    // <Renderer
    //     smartyTags={smartyTags}
    //     items={[...Object.values(Groups), ...Object.values(Blocks), ...customItems]}
    //     value={value}
    //     initialValues={submission}
    //     onSubmit={setSubmission}
    //     onChange={noop}
    //     sampleData={sampleData}
    // />
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box position="absolute" top={0} right={0} bottom={0} left={0}>
                <DndEditor
                    smartyTags={smartyTags}
                    items={[...Object.values(Groups), ...Object.values(Blocks), ...customItems]}
                    value={value}
                    onChange={setValue}
                    sampleData={sampleData}
                />
            </Box>
        </ThemeProvider>
    )
}

export default App
