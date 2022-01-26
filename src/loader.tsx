import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useEffect, useState } from 'react';

import UserInterface from './user-interface';
import fireAndForget from './fire-and-forget';
import getDomain from './get-domain';
import getIsPasswordFieldActive from './get-is-password-field-active';

const width = '320px';
const height = '256px';

const useStyles = createUseStyles({
  loading: {
    width,
    height,
  },
});

const Loader = (): React.ReactElement => {
  const classes = useStyles();
  const [domain, setDomain] = useState<string | null | undefined>(undefined);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState<
    boolean | null | undefined
  >(undefined);

  useEffect(() => {
    // These functions return `null` to signal errors rather than throwing exceptions, and we're
    // okay with these values being `null`. So we don't have any special logic here for reporting
    // exceptions in the user interface.
    fireAndForget(
      (async (): Promise<void> => {
        setDomain(await getDomain());
        setIsPasswordFieldActive(await getIsPasswordFieldActive());
      })(),
    );
  }, []);

  if (domain === undefined || isPasswordFieldActive === undefined) {
    return <div className={classes.loading} />;
  }

  return (
    <UserInterface
      initialDomain={domain}
      isPasswordFieldActive={isPasswordFieldActive}
    />
  );
};

export default Loader;
