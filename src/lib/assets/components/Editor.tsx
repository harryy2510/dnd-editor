import { Button, Card, ClickAwayListener, List, ListItem, Popper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { bindHover, bindPopper, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { nanoid } from 'nanoid'
import { StringMap } from 'quill'

import 'quill-mention'
import 'quill-mention/dist/quill.mention.css'
import React from 'react'
import ReactQuill, { Range } from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import './Editor.scss'
import { useDndEditorContext } from '../../DndEditorProvider'

const defaultModules: StringMap = {
    toolbar: [
        'bold',
        'italic',
        'underline',
        'strike',
        { list: 'ordered' },
        { list: 'bullet' },
        'link',
        'clean'
    ]
}
const defaultFormats: string[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'mention'
]

interface Props {
    modules?: StringMap
    formats?: string[]
    value?: string
    onChange?: (text: string) => void
}

const useStyles = makeStyles(({}: Theme) => ({
    button: {
        minWidth: 0
    },
    popper: {
        zIndex: 2
    }
}))

const Editor: React.FC<Props> = ({
    value,
    onChange,
    formats = defaultFormats,
    modules = defaultModules
}) => {
    const classes = useStyles()
    const popupId = React.useRef(`popup-${nanoid()}`).current
    const menuId = React.useRef(`menu-${nanoid()}`).current

    const { smartyTags } = useDndEditorContext()

    const _modules = React.useMemo(() => {
        const allTags = smartyTags?.map((id) => ({ id, value: id })) ?? []
        return {
            ...modules,
            ...(smartyTags
                ? {
                      mention: {
                          allowedChars: /^[A-Za-z.{}]*$/,
                          mentionDenotationChars: ['{{'],
                          showDenotationChar: false,
                          source: (
                              searchTerm: string,
                              renderList: (list: typeof allTags, searchTerm: string) => void
                          ) => {
                              if (!searchTerm) {
                                  renderList(allTags, searchTerm)
                              } else {
                                  const matches = allTags.filter((tag) =>
                                      tag.value.includes(searchTerm)
                                  )
                                  renderList(matches, searchTerm)
                              }
                          }
                      }
                  }
                : {})
        }
    }, [smartyTags])

    const containerRef = React.useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
    const editorRef = React.useRef<ReactQuill>() as React.RefObject<ReactQuill>
    const cursorRef = React.useRef<Range>(null)
    const textRef = React.useRef(value ?? '')

    const popupState = usePopupState({
        popupId,
        variant: 'popper'
    })
    const menuState = usePopupState({
        popupId: menuId,
        variant: 'popper'
    })

    React.useEffect(() => {
        if (value !== textRef.current) {
            onChange?.(textRef.current)
        }
    }, [textRef.current])
    const handleSelectionChange = (selection: Range) => {
        if (selection) {
            cursorRef.current = selection
        }
    }
    const handleChange = (newValue: string) => {
        textRef.current = newValue
    }
    const handleTagInsert = (tag: string) => {
        menuState.close()
        const quillRef = editorRef.current?.getEditor()
        if (quillRef) {
            const cursorPosition = cursorRef.current
                ? cursorRef.current.index
                : quillRef.getLength() - 1
            const render = {
                denotationChar: '',
                id: tag,
                index: '0',
                value: tag
            }
            quillRef.insertEmbed(cursorPosition, 'mention', render, 'user')
            quillRef.insertText(cursorPosition + 1, ' ', 'user')
            quillRef.setSelection(cursorPosition + 2, 0, 'user')
        }
    }
    return (
        <ClickAwayListener
            onClickAway={() => {
                popupState.close()
                menuState.close()
            }}
        >
            <div {...bindHover(popupState)} ref={containerRef}>
                {smartyTags && (
                    <>
                        <Popper
                            {...bindPopper(menuState)}
                            className={classes.popper}
                            placement="right-start"
                        >
                            <Card variant="outlined">
                                <List dense>
                                    {smartyTags.map((tag, i) => (
                                        <ListItem
                                            button
                                            key={i}
                                            onClick={() => handleTagInsert(tag)}
                                        >
                                            {tag}
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Popper>
                        <Popper
                            {...bindPopper(popupState)}
                            placement="right-start"
                            open={!menuState.isOpen && popupState.isOpen}
                            className={classes.popper}
                        >
                            <Card variant="outlined">
                                <Button
                                    className={classes.button}
                                    {...bindTrigger(menuState)}
                                    onClick={() => menuState.open(containerRef.current)}
                                >
                                    {'{{'}&middot;&middot;{'}}'}
                                </Button>
                            </Card>
                        </Popper>
                    </>
                )}

                <ReactQuill
                    ref={editorRef}
                    onChangeSelection={handleSelectionChange}
                    modules={_modules}
                    formats={formats}
                    theme="bubble"
                    defaultValue={textRef.current}
                    onChange={handleChange}
                />
            </div>
        </ClickAwayListener>
    )
}

export default React.memo(Editor)
