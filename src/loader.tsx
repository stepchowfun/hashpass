import * as React from 'react';
import { useEffect, useState } from 'react';

import Message from './message';
import UserInterface from './user-interface';
import fireAndForget from './fire-and-forget';
import getDomain from './get-domain';
import getIsPasswordFieldActive from './get-is-password-field-active';

const Loader = (): React.ReactElement => {
  const [domain, setDomain] = useState<string | null | undefined>(undefined);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState<
    boolean | null | undefined
  >(undefined);

  useEffect(() => {
    // This promise is supposed to be infallible, since these functions return `null` to signal
    // errors. So we don't have any special logic for displaying exceptions in the user interface.
    fireAndForget(
      (async (): Promise<void> => {
        setDomain(await getDomain());
        setIsPasswordFieldActive(await getIsPasswordFieldActive());
      })(),
    );
  }, []);

  if (domain === null || isPasswordFieldActive === null) {
    return (
      <Message isError>
        Hashpass is blocked on this page. Try again on another website.
      </Message>
    );
  }

  if (domain === undefined || isPasswordFieldActive === undefined) {
    return <Message isError={false}>Loading…</Message>;
  }

  return (
    <UserInterface
      initialDomain={domain}
      isPasswordFieldActive={isPasswordFieldActive}
    />
  );
};

export default Loader;
