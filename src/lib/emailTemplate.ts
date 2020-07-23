export default `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
     <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
        
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-size: 100%;
          font-weight: normal;
        }
        
        ul {
          list-style: none;
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
        
        *, *::before, *::after {
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
        }
        
        td,
        th {
          padding: 0;
        }
        
        td:not([align]),
        th:not([align]) {
          text-align: left;
        }
    </style>
      {{head}}
    </head>
    <body>
        {{body}}
        {{footer}}
    </body>
    </html>
`
