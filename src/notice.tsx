import * as React from 'react';
import { createUseStyles } from 'react-jss';

const width = '320px';

const useStyles = createUseStyles({
  notice: {
    width,
    margin: '16px',
    fontSize: '16px',
    lineHeight: '1.45',
    color: (isError: boolean) => (isError ? '#cd2f2f' : '#222222'),
  },
});

const Notice = ({
  isError,
  children,
}: {
  isError: boolean;
  children: React.ReactNode;
}): React.ReactElement => {
  const classes = useStyles(isError);

  return <div className={classes.notice}>{children}</div>;
};

export default Notice;
