import * as React from 'react';
import { useEffect, useState } from 'react';

import UserInterface from './user-interface';
import fireAndForget from './fire-and-forget';
import getDomain from './get-domain';
import getIsPasswordFieldActive from './get-is-password-field-active';

const Loader = (): React.ReactElement | null => {
  const [domain, setDomain] = useState<string | null>(null);
  const [isPasswordFieldActive, setIsPasswordFieldActive] =
    useState<boolean>(false);

  useEffect(() => {
    fireAndForget(
      (async (): Promise<void> => {
        setDomain((await getDomain()) ?? '');
        setIsPasswordFieldActive((await getIsPasswordFieldActive()) ?? false);
      })(),
    );
  }, []);

  return (
    <UserInterface
      initialDomain={domain}
      isPasswordFieldActive={isPasswordFieldActive}
    />
  );
};

export default Loader;
