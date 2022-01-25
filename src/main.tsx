import * as React from 'react';
import * as ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import Loader from './loader';

jss.setup(preset());

jss
  .createStyleSheet({
    '@global': {
      '*, *::before, *::after': {
        boxSizing: 'border-box',
        margin: 0,
      },
      'html, body': {
        width: '352px',
      },
      body: {
        // Create a block formatting context to contain margins of descendants.
        display: 'flow-root',

        textRendering: 'optimizeLegibility',
        '-webkit-font-smoothing': 'antialiased',
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      'input, button, textarea, select': {
        font: 'inherit',
      },
    },
  })
  .attach();

ReactDOM.render(
  <React.StrictMode>
    <Loader />
  </React.StrictMode>,
  document.body.appendChild(document.createElement('div')),
);
