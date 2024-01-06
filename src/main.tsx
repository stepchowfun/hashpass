import * as React from 'react';
import jss from 'jss';
import preset from 'jss-preset-default';
import { createRoot } from 'react-dom/client';
import { createUseStyles } from 'react-jss';

import Loader from './loader';

const chromeExtensionProtocol = 'chrome-extension:';
const chromeExtensionUrl =
  'https://chromewebstore.google.com/detail/hashpass/' +
  'gkmegkoiplibopkmieofaaeloldidnko';
const githubUrl = 'https://github.com/stepchowfun/hashpass';

jss.setup(preset());

jss
  .createStyleSheet({
    '@global': {
      '*, *::before, *::after': {
        boxSizing: 'border-box',
        margin: 0,
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

const useStyles = createUseStyles({
  extensionContainer: {
    margin: '16px',
  },
  websiteContainer: {
    width: 'min-content',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  h1: {
    fontSize: '32px',
    color: '#222222',
  },
  icon: {
    position: 'relative',
    top: '8px',
    left: '-2px',
    width: '38px',
    height: '38px',
    border: '0px',
    padding: '0px',
  },
  p: {
    marginTop: '16px',
    lineHeight: '16px',
    fontSize: '12px',
    color: '#666666',
  },
  a: {
    color: '#0d82d8',
    fontWeight: '600',
    '&:hover': {
      color: '#d8690d',
    },
    '&:active': {
      color: '#666666',
    },
  },
});

const Main = (): React.ReactElement => {
  const classes = useStyles();

  if (window.location.protocol === chromeExtensionProtocol) {
    return (
      <div className={classes.extensionContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={classes.websiteContainer}>
      <h1 className={classes.h1}>
        <img className={classes.icon} src="images/icon.svg" /> Hashpass
      </h1>
      <div>
        <Loader />
      </div>
      <p className={classes.p}>
        Get the Chrome extension{' '}
        <a className={classes.a} href={chromeExtensionUrl}>
          {' '}
          here
        </a>
        . You can learn about Hashpass and browse its source code{' '}
        <a className={classes.a} href={githubUrl}>
          {' '}
          here
        </a>
        . This website collects no user data and makes no API calls.
      </p>
    </div>
  );
};

createRoot(document.body.appendChild(document.createElement('div'))).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
