import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { debounce } from 'debounce';
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';

import Button from './button';
import Input from './input';
import fireAndForget from './fire-and-forget';
import hashpass from './hashpass';
import submitGeneratedPassword from './submit-generated-password';

const debounceMilliseconds = 200;

const useStyles = createUseStyles({
  domain: {
    color: '#666666',
  },
});

// Do to the way React hooks work, it is not always possible to get the latest version of the state.
// So whenever we update the generated password, we also store it in this variable so it can be
// retrieved immediately.
let synchronousGeneratedPassword = '';

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
  const universalPasswordRef = useRef<HTMLInputElement>(null);
  const updateGeneratedPassword = useMemo(
    () =>
      debounce((newDomain: string, newUniversalPassword: string) => {
        synchronousGeneratedPassword = hashpass(
          newDomain,
          newUniversalPassword,
        );
        setGeneratedPassword(synchronousGeneratedPassword);
      }, debounceMilliseconds),
    [setGeneratedPassword],
  );

  useEffect(() => {
    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
    updateGeneratedPassword(domain, universalPassword);
  }, [domain, universalPassword]);

  const onResetDomain = useCallback((): void => {
    setDomain(initialDomain);

    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, [setDomain, initialDomain]);

  const onToggleUniversalPasswordHidden = useCallback((): void => {
    setIsUniversalPasswordHidden(!isUniversalPasswordHidden);

    const inputElement = universalPasswordRef.current;

    if (inputElement !== null) {
      inputElement.focus();
    }
  }, [setIsUniversalPasswordHidden, isUniversalPasswordHidden]);

  const onCopyGeneratedPasswordToClipboard = useCallback((): void => {
    updateGeneratedPassword.flush();

    // If writing to the clipboard fails, just log the error and continue.
    fireAndForget(navigator.clipboard.writeText(synchronousGeneratedPassword));
  }, [updateGeneratedPassword, synchronousGeneratedPassword]);

  const onToggleGeneratedPasswordHidden = useCallback((): void => {
    setIsGeneratedPasswordHidden(!isGeneratedPasswordHidden);
  }, [setIsGeneratedPasswordHidden, isGeneratedPasswordHidden]);

  const onFormSubmit = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      updateGeneratedPassword.flush();

      // If filling out the password field and submitting the form fails, just log the error and
      // continue.
      fireAndForget(
        (async (): Promise<void> => {
          await submitGeneratedPassword(synchronousGeneratedPassword);
          window.close();
        })(),
      );
    },
    [updateGeneratedPassword, synchronousGeneratedPassword],
  );

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
        value={generatedPassword}
      />
    </form>
  );
};

export default UserInterface;