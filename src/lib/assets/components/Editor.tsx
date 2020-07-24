import {
    Button,
    Card,
    CardContent,
    ClickAwayListener,
    List,
    ListItem,
    MenuItem,
    MenuList,
    Popper,
    Theme
} from '@material-ui/core'
import { CodeOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { bindHover, bindPopper, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { nanoid } from 'nanoid'
import Quill, { StringMap, Sources } from 'quill'
import React from 'react'
import ReactQuill, { Range, UnprivilegedEditor } from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import './Editor.scss'
import { smartyTags } from '../../utils'

const defaultModules: StringMap = {
    toolbar: [
        [
            'bold',
            'italic',
            'underline',
            'strike',
            { list: 'ordered' },
            { list: 'bullet' },
            'link',
            'clean'
        ]
    ]
}

const defaultFormats: string[] = ['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link']

interface Props {
    modules?: StringMap
    formats?: string[]
    value?: string
    onChange?: (text: string) => void
}

const useStyles = makeStyles(({}: Theme) => ({
    button: {
        minWidth: 0
    }
}))

const Editor: React.FC<Props> = ({
    value,
    onChange,
    formats = defaultFormats,
    modules = defaultModules
}) => {
    const classes = useStyles()

    const containerRef = React.useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
    const editorRef = React.useRef<ReactQuill>() as React.RefObject<ReactQuill>
    const cursorRef = React.useRef(0)
    const textRef = React.useRef(value ?? '')

    const popupState = usePopupState({
        popupId: nanoid(),
        variant: 'popper'
    })
    const menuState = usePopupState({
        popupId: nanoid(),
        variant: 'popper'
    })

    React.useEffect(() => {
        if (value !== textRef.current) {
            onChange?.(textRef.current)
        }
    }, [textRef.current])
    const handleSelectionChange = (selection: Range) => {
        if (selection) {
            cursorRef.current = selection.index
        }
    }
    const handleChange = (newValue: string) => {
        textRef.current = newValue
    }
    const handleTagInsert = (tag: string) => {
        menuState.close()
        const quillRef = editorRef.current?.getEditor()
        if (quillRef) {
            quillRef.insertText(cursorRef.current ?? 0, `${tag} `)
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
                <Popper {...bindPopper(menuState)} placement="right-start">
                    <Card variant="outlined">
                        <List dense>
                            {smartyTags.map((tag, i) => (
                                <ListItem button key={i} onClick={() => handleTagInsert(tag)}>
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
                >
                    <Card variant="outlined">
                        <Button
                            className={classes.button}
                            {...bindTrigger(menuState)}
                            onClick={() => menuState.open(containerRef.current)}
                        >
                            <CodeOutlined fontSize="small" />
                        </Button>
                    </Card>
                </Popper>
                <ReactQuill
                    ref={editorRef}
                    onChangeSelection={handleSelectionChange}
                    modules={modules}
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
