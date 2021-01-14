export default `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style type="text/css">
                html,
                body,
                p,
                ol,
                ul,
                li,
                dl,
                dt,
                dd,
                blockquote,
                figure,
                fieldset,
                legend,
                textarea,
                pre,
                iframe,
                hr,
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    margin: 0;
                    padding: 0;
                }
    
                p,
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    counter-reset: list-0 list-1 list-2 list-3 list-4 list-5 list-6
                        list-7 list-8 list-9;
                    font-size: 100%;
                    font-weight: normal;
                }
    
                ul {
                    list-style: none;
                }
    
                ol {
                    padding-left: 1.5em;
                }
    
                li {
                    list-style-type: none;
                    padding-left: 1.5em;
                    position: relative;
                }
    
                li > .ql-ui:before {
                    display: inline-block;
                    margin-left: -1.5em;
                    margin-right: 0.3em;
                    text-align: right;
                    white-space: nowrap;
                    width: 1.2em;
                }
    
                li[data-list='checked'] > .ql-ui,
                li[data-list='unchecked'] > .ql-ui {
                    color: #777;
                }
    
                li[data-list='bullet'] > .ql-ui:before {
                    content: '\\2022';
                }
    
                li[data-list='checked'] > .ql-ui:before {
                    content: '\\2611';
                }
    
                li[data-list='unchecked'] > .ql-ui:before {
                    content: '\\2610';
                }
    
                li[data-list='ordered'] {
                    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7
                        list-8 list-9;
                    counter-increment: list-0;
                }
    
                li[data-list='ordered'] > .ql-ui:before {
                    content: counter(list-0, decimal) '. ';
                }
    
                button,
                input,
                select,
                textarea {
                    margin: 0;
                }
    
                html {
                    box-sizing: border-box;
                }
    
                *,
                *::before,
                *::after {
                    box-sizing: inherit;
                }
    
                img,
                video {
                    height: auto;
                    max-width: 100%;
                }
    
                iframe {
                    border: 0;
                }
    
                table {
                    border-collapse: collapse;
                    border-spacing: 0;
                    table-layout: fixed;
                    width: auto;
                }
    
                td:not([align]),
                th:not([align]) {
                    text-align: left;
                }
    
                table td, table th {
                    outline: none;
                    border: none;
                    padding: 2px 5px;
                }
    
                .ql-align-center {
                    text-align: center;
                }
    
                .ql-align-justify {
                    text-align: justify;
                }
    
                .ql-align-right {
                    text-align: right;
                }
    
                .ql-ui {
                    position: absolute;
                }
    
                .ql-blank::before {
                    color: rgba(0, 0, 0, 0.6);
                    content: attr(data-placeholder);
                    font-style: italic;
                    left: 15px;
                    pointer-events: none;
                    position: absolute;
                    right: 15px;
                }
            </style>
            {{head}}
        </head>
    
        <body>
            {{body}}
        </body>
    </html>

`
