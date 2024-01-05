import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useEffect, useState } from 'react';

import fireAndForget from './fire-and-forget';
import getDomain from './get-domain';
import getIsPasswordFieldActive from './get-is-password-field-active';
import { UserInterface, width, height } from './user-interface';

const useStyles = createUseStyles({
  loader: {
    display: 'flow-root',
    width,
    height,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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

  return (
    <div className={classes.loader}>
      {domain !== undefined && isPasswordFieldActive !== undefined && (
        <UserInterface
          initialDomain={domain}
          isPasswordFieldActive={isPasswordFieldActive}
        />
      )}
    </div>
  );
};

export default Loader;
