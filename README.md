<p align="center">
  <h1 align="center">DnD Editor</h1>
  <p align="center">
    <strong>Drag-and-drop email and form builder for React.</strong>
  </p>
  <p align="center">
    <code>18 block types</code> · <code>device preview</code> · <code>HTML export</code> · <code>LiquidJS templates</code>
  </p>
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
</p>

---

> **Note:** This project is archived and no longer actively maintained.

---

## What It Does

Three-pane visual editor: block menu (left), canvas (center), settings panel (right).

```
  ┌───────────────┬─────────────────────────┬───────────────────┐
  │               │                         │                   │
  │   BLOCKS      │       CANVAS            │    SETTINGS       │
  │               │                         │                   │
  │  Text         │  ┌─────────────────┐    │  Font size: 16    │
  │  Image        │  │  Heading        │    │  Color: #333      │
  │  Button       │  ├─────────────────┤    │  Alignment: left  │
  │  Divider      │  │  Image          │    │                   │
  │  Heading      │  ├─────────────────┤    │                   │
  │  TextInput    │  │  Button         │    │                   │
  │  Dropdown     │  └─────────────────┘    │                   │
  │  ...          │                         │                   │
  │               │  📱 💻 🖥️              │                   │
  │               │  Device preview         │                   │
  └───────────────┴─────────────────────────┴───────────────────┘
```

---

## Blocks

```
  CONTENT                    FORM INPUTS
  -------                    -----------
  Text                       TextInput
  Image                      MultilineInput
  Button                     NumberInput
  Divider                    DatePicker
  Heading                    Checkbox
  Paragraph                  Radio
  Spacer                     Dropdown
  List                       FileUpload
                             Address
```

---

## Features

- Drag-and-drop reordering via SortableJS
- Device-responsive preview (laptop, tablet, mobile)
- LiquidJS template engine for merge tags and dynamic content
- Conditional logic (AND/OR rules to show/hide blocks)
- Form validation with Yup schemas and Formik
- HTML export pipeline
- Extensible block system

---

## Custom Blocks

```typescript
const customBlock = {
  id: 'my-block',
  type: 'content',
  label: 'My Block',
  initialValues: { text: 'Hello' },
  settings: [
    { type: 'text', name: 'text', label: 'Content' }
  ],
  render: (values) => <div>{values.text}</div>,
  export: (values) => `<div>${values.text}</div>`
}
```

Define `id`, `type`, `label`, `render()`, `export()`, `initialValues`, and `settings[]`. The editor handles the rest.

---

## License

MIT
