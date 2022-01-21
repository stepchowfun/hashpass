import hashpass from './hashpass';

test('returns the correct result for empty inputs', () => {
  expect(hashpass('', '')).toBe('QLVrEfcwJgNzLdCK');
});

test('returns the correct result for an example domain and password', () => {
  expect(hashpass('www.example.com', 'password')).toBe('iOHMvVHFSjclBQgu');
});

test('strips whitespace from the domain', () => {
  expect(hashpass('www.example.com', 'password')).toBe('iOHMvVHFSjclBQgu');
  expect(hashpass(' www.example.com ', 'password')).toBe('iOHMvVHFSjclBQgu');
});

test('does not strip whitespace from the password', () => {
  expect(hashpass('www.example.com', 'password')).toBe('iOHMvVHFSjclBQgu');
  expect(hashpass('www.example.com', ' password ')).not.toBe(
    'iOHMvVHFSjclBQgu',
  );
});

test('is case-insensitive for domains', () => {
  expect(hashpass('www.example.com', 'password')).toBe('iOHMvVHFSjclBQgu');
  expect(hashpass('Www.Example.Com', 'password')).toBe('iOHMvVHFSjclBQgu');
});

test('is case-sensitive for passwords', () => {
  expect(hashpass('www.example.com', 'password')).toBe('iOHMvVHFSjclBQgu');
  expect(hashpass('www.example.com', 'Password')).not.toBe('iOHMvVHFSjclBQgu');
});
