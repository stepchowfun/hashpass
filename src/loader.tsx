// oxlint-disable react/jsx-filename-extension react/react-in-jsx-scope -- Hashpass uses TSX files and React's automatic JSX runtime.
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import UserInterface from './user-interface.tsx';
import fireAndForget from './fire-and-forget.ts';
import getDomain from './get-domain.ts';
import getIsPasswordFieldActive from './get-is-password-field-active.ts';

const Loader = (): ReactElement | null => {
  const [domain, setDomain] = useState<string | null>(null);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState<boolean>(false);

  useEffect(() => {
    fireAndForget(
      (async (): Promise<void> => {
        setDomain((await getDomain()) ?? '');
        setIsPasswordFieldActive((await getIsPasswordFieldActive()) ?? false);
      })(),
    );
  }, []);

  return <UserInterface initialDomain={domain} isPasswordFieldActive={isPasswordFieldActive} />;
};

export default Loader;
