import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { debounce } from 'debounce';
import { useEffect, useCallback, useRef, useState } from 'react';

import Button from './button';
import Input from './input';
import fillInPassword from './fill-in-password';
import fireAndForget from './fire-and-forget';
import hashpass from './worker-client';

const debounceMilliseconds = 200;

const useStyles = createUseStyles({
  domain: {
    color: '#666666',
  },
});

const UserInterface = ({
  initialDomain,
  isPasswordFieldActive,
}: {
  initialDomain: string;
  isPasswordFieldActive: boolean;
}): React.ReactElement => {
  const classes = useStyles();
  const [domain, setDomain] = useState(initialDomain);
  const [universalPassword, setUniversalPassword] = useState('');
  const [isUniversalPasswordHidden, setIsUniversalPasswordHidden] =
    useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGeneratedPasswordHidden, setIsGeneratedPasswordHidden] =
    useState(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Start with 0 tasks in progress.
  const [updatesInProgress, setUpdatesInProgress] = useState(0);
  const [pendingCopyToClipboard, setPendingCopyToClipboard] = useState(false);
  const [pendingFillInPassword, setPendingFillInPassword] = useState(false);
  const universalPasswordRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- We need to debounce this function.
  const updateGeneratedPassword = useCallback(
    debounce((newDomain: string, newUniversalPassword: string) => {
      setUpdatesInProgress(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Increment = +1.
        (previousTasksInProgress) => previousTasksInProgress + 1,
      );
      fireAndForget(
        (async (): Promise<void> => {
          setGeneratedPassword(await hashpass(newDomain, newUniversalPassword));
          setUpdatesInProgress(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Decrement = -1.
            (previousTasksInProgress) => previousTasksInProgress - 1,
          );
        })(),
      );
    }, debounceMilliseconds),
    [],
  );

  useEffect(() => {
    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
    updateGeneratedPassword(domain, universalPassword);
  }, [updateGeneratedPassword, domain, universalPassword]);

  const onResetDomain = useCallback((): void => {
    setDomain(initialDomain);

    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, [initialDomain]);

  const onToggleUniversalPasswordHidden = useCallback((): void => {
    setIsUniversalPasswordHidden(!isUniversalPasswordHidden);

    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, [isUniversalPasswordHidden]);

  const onCopyGeneratedPasswordToClipboard = useCallback((): void => {
    updateGeneratedPassword.flush();
    setPendingCopyToClipboard(true);
  }, [updateGeneratedPassword]);

  const onToggleGeneratedPasswordHidden = useCallback((): void => {
    setIsGeneratedPasswordHidden(!isGeneratedPasswordHidden);
  }, [isGeneratedPasswordHidden]);

  const onFormSubmit = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      updateGeneratedPassword.flush();
      setPendingFillInPassword(true);
    },
    [updateGeneratedPassword],
  );

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- No tasks in progress?
  if (updatesInProgress === 0) {
    if (pendingCopyToClipboard) {
      setPendingCopyToClipboard(false);

      fireAndForget(navigator.clipboard.writeText(generatedPassword));
    }

    if (pendingFillInPassword) {
      setPendingFillInPassword(false);

      fireAndForget(
        (async (): Promise<void> => {
          await fillInPassword(generatedPassword);
          window.close();
        })(),
      );
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
      <Input
        buttons={[
          <Button
            description="Reset the domain."
            imageName="refresh"
            key="refresh"
            onClick={onResetDomain}
          />,
        ]}
        disabled={false}
        hideValue={false}
        label="Domain"
        onChange={setDomain}
        placeholder="www.example.com"
        updating={false}
        value={domain}
      />
      <Input
        buttons={[
          <Button
            description={
              isUniversalPasswordHidden
                ? 'Show the password.'
                : 'Hide the password.'
            }
            imageName={isUniversalPasswordHidden ? 'eye-off' : 'eye'}
            key="eye"
            onClick={onToggleUniversalPasswordHidden}
          />,
        ]}
        disabled={false}
        hideValue={isUniversalPasswordHidden}
        label="Universal password"
        onChange={setUniversalPassword}
        placeholder=""
        ref={universalPasswordRef}
        updating={false}
        value={universalPassword}
      />
      <Input
        buttons={[
          ...(isPasswordFieldActive
            ? [
                <Button
                  description={`Fill in the password field on ${domain} and close Hashpass.`}
                  imageName="log-in"
                  key="log-in"
                  onClick={null} // This button submits the form.
                />,
              ]
            : []),
          <Button
            description="Copy the password to the clipboard."
            imageName="clipboard-copy"
            key="clipboard-copy"
            onClick={onCopyGeneratedPasswordToClipboard}
          />,
          <Button
            description={
              isGeneratedPasswordHidden
                ? 'Show the password.'
                : 'Hide the password.'
            }
            imageName={isGeneratedPasswordHidden ? 'eye-off' : 'eye'}
            key="eye"
            onClick={onToggleGeneratedPasswordHidden}
          />,
        ]}
        disabled
        hideValue={isGeneratedPasswordHidden}
        label={
          domain.trim() === '' ? (
            'Password for this domain'
          ) : (
            <span>
              Password for <span className={classes.domain}>{domain}</span>
            </span>
          )
        }
        onChange={null}
        placeholder=""
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Any tasks in progress?
        updating={updatesInProgress !== 0}
        value={generatedPassword}
      />
    </form>
  );
};

export default UserInterface;
