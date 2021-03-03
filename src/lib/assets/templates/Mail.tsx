import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import React from 'react'
import DndPreview from '../../components/DndPreview'
import { DndTemplateItem, RenderProps } from '../../types'
import { styleToCss } from '../../utils'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    tag: {
        padding: spacing(0.5, 1.5),
        backgroundColor: '#595757',
        color: '#fff',
        fontSize: '12px'
    },
    background: {
        '& .background-tag': {
            opacity: 0
        },
        '&:hover': {
            '& .background-tag': {
                opacity: 1
            }
        }
    },
    backgroundTag: {
        position: 'absolute',
        top: spacing(-2),
        right: spacing(-20.5),
        '& .email-tag': {
            opacity: 0
        }
    },
    email: {
        '&:hover': {
            '& .background-tag': {
                opacity: '0!important'
            },
            '& .email-tag': {
                opacity: 1
            }
        }
    },
    emailTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0
    }
}))

interface Props {
    renderProps: RenderProps
    children?: React.ReactNode
}

const Background: React.FC<Props> = ({ renderProps, children }) => {
    const stateItem = renderProps.state.entities.mail
    const classes = useStyles()
    return (
        <div style={stateItem?.values?.outer?.style} className={classes.background}>
            <div style={stateItem?.values?.inner?.style} className={classes.email}>
                <span className={clsx(classes.backgroundTag, 'background-tag', classes.tag)}>
                    <Trans>Background</Trans>
                </span>
                <span className={clsx(classes.emailTag, 'email-tag', classes.tag)}>
                    <Trans>Email</Trans>
                </span>
                {children}
            </div>
            <DndPreview />
        </div>
    )
}

export default {
    id: 'mail',
    type: 'template',
    render: (renderProps, children) => <Background renderProps={renderProps} children={children} />,
    export: (renderProps, children) => {
        const stateItem = renderProps.state.entities.mail
        return `
            <div style="${styleToCss(stateItem?.values?.outer?.style)}">
                <div style="${styleToCss(stateItem?.values?.inner?.style)}">
                    ${children}
                     {% if branding %}
                        {{footer}}
                     {% endif %}
                </div>
            </div>
        `
    },
    initialValues: {
        outer: {
            style: {
                backgroundColor: '#eee',
                padding: '16px 0px 16px 0px',
                boxSizing: 'border-box'
            }
        },
        inner: {
            style: {
                position: 'relative',
                width: 600,
                borderRadius: '0px',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                fontFamily: 'Poppins, sans-serif',
                padding: '0px 0px 0px 0px',
                color: '#000',
                margin: 'auto'
            }
        }
    },
    settings: [
        {
            label: <Trans>Background</Trans>,
            id: 'outer',
            type: 'template',
            settings: [
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.padding', type: 'padding', grid: 12 }
            ]
        },
        {
            label: <Trans>Email</Trans>,
            id: 'inner',
            type: 'template',
            settings: [
                { id: 'style.fontFamily', type: 'fontFamily', grid: 12 },
                { id: 'style.color', type: 'fontColor', grid: 12 },
                { id: 'style.backgroundColor', type: 'backgroundColor', grid: 12 },
                { id: 'style.padding', type: 'padding', grid: 12 },
                { id: 'style.borderRadius', type: 'borderRadius', grid: 12 }
            ]
        }
    ]
} as DndTemplateItem
