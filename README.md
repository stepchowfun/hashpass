# Hashpass

[![Build status](https://github.com/stepchowfun/hashpass/workflows/Continuous%20integration/badge.svg?branch=main)](https://github.com/stepchowfun/hashpass/actions?query=branch%3Amain)

[Hashpass](https://chrome.google.com/webstore/detail/hashpass/gkmegkoiplibopkmieofaaeloldidnko)
is a password manager which doesn't store any passwords. Instead, it generates
passwords using a
[cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function)
based on the domain of the website you're visiting and a single password that
you memorize. With this simple scheme, you get (a) the security of having a
unique password for each website, (b) the convenience of only having to memorize
one password, (c) the freedom from having to sync your passwords across your
devices, and (d) the comfort of knowing that neither you nor any cloud provider
can lose your passwords.

![Screenshot](https://github.com/stepchowfun/hashpass/blob/main/images/screenshot3.png)

## Installation

Install Hashpass from the Chrome Web Store
([link](https://chrome.google.com/webstore/detail/hashpass/gkmegkoiplibopkmieofaaeloldidnko)).
You'll then see the Hashpass button next to your address bar or in the
extensions dropdown.

## Compatible implementations

In addition to the Chrome extension, there are a few other implementations:

- There's a compatible Android app, courtesy of
  [Erik Byström](http://blog.slackers.se/). It is available on the Google Play
  Store
  ([link](https://play.google.com/store/apps/details?id=se.slackers.hashpass)).
  The source is available [here](https://github.com/bysse/hashpass-android).
- There's a command-line program written in Go, courtesy of
  [Pablo Ovelleiro](https://github.com/binaryplease). The source is available
  [here](https://github.com/binaryplease/go-hashpass).
- There's a small Python implementation below.

## How passwords are generated

Suppose your secret key is `bananas`, and you're signing up for Facebook.
Hashpass combines the current domain name and your secret key with a `/` as
follows: `www.facebook.com/bananas`. It then computes the
[SHA-256 hash](http://en.wikipedia.org/wiki/SHA-2) of that string. Then it
hashes it again and again, `2^16` times in total. Finally, it outputs the first
96 bits of the result, encoded as 16 characters in
[Base64](http://en.wikipedia.org/wiki/Base64). In this example, the final output
is `sWwtmA9uA6X9SyXD`. This result can be reproduced using the Python script
near the bottom of this document.

## Security

If an adversary has your universal password, they have access to all of your
accounts. But if they have one of your domain-specific passwords, then only one
account is compromised.

SHA-256 is one of the most widely-used cryptographic hash functions and is
considered unbroken at the time of this writing. Than means given a hash of a
long and random string, an adversary can't recover the original string. However,
secret keys produced by humans are not typically long, nor are they perfectly
random. They often contain predictable words or phrases.

One strategy for cracking your secret key is to try hashing all English words,
for example. This is called a _dictionary attack_. An attacker might even try to
pre-compute a table of the hashes of all English words and other common
passwords. Then they could simply look up hashes in this table to crack them.
The table in this attack is called a _rainbow table_.

A determined attacker might try _all_ strings up to some length. This generally
takes longer or requires more computational power, but it's not impossible. For
example, a reasonably-equipped hacker might be able to compute a trillion hashes
per second. There are about 839 quadrillion 10-character alphanumeric keys. If
keys are only hashed once, a hacker can crack a random 10-character alphanumeric
key in a little over four days, on average.

This is called a _brute-force attack_, and it relies on an attacker being able
to compute a large number of hashes very quickly. To provide resistance against
such attacks, Hashpass applies the hashing function many times (`2^16` times, to
be exact). This makes testing a key take much longer. On average, the hacker now
takes more than 800 years to crack a random 10-character alphanumeric key.

Even with `2^16` rounds of hashing, it takes the hacker only 30 seconds to crack
a random 5-character alphanumeric key! **It is strongly advised that you pick a
key with at least 10 characters.**

## Comparison with traditional password managers

With Hashpass, an adversary with one of your generated passwords can try to
guess your secret key and gain access to all your accounts. With a traditional
password manager, those with access to your password database can try to guess
your master password. These are different threat models, but it's not
necessarily obvious which is better. For example, if no one has access to your
password database, a traditional password manager may provide better security.
If you normally sync your password database to the cloud, you might instead
chose the Hashpass model, especially if you don't trust your cloud provider. A
strong secret key is a solid defense in both models.

Since Hashpass doesn't store passwords in a database, you have no chance of
accidentally deleting them, and you don't need to sync them across multiple
devices. You also don't have to worry about me abandoning the project, or using
a computer that doesn't have Hashpass. Since Hashpass uses a well-known hash
function rather than a proprietary password database, you can always compute the
passwords yourself if Hashpass is unavailable. All of the information needed to
produce your passwords is in your head and in this document. That property is
what motivated the development of this project.

## Practical notes

- If a generated password is ever compromised, you don't need to memorize a
  whole new secret key and update all of your passwords. For that service only,
  just add an incrementing index to your secret key. Such a tiny change in your
  secret key results in a completely new password for that service. For example,
  if your key was `bananas`, just use `bananas2`. If you can't remember which
  iteration of your secret key you used for a particular service, simply try
  them all in order.

- Some websites have certain requirements on passwords, e.g., at least one
  number and one capital letter. A simple way to meet such requirements is to
  append something like `A9!` to the generated password. But then you have to
  remember that you did that, or at least you can try it whenever you're not
  sure.

- The Hashpass scheme can be used for more than just websites. For other things,
  I use this Python script:

  ```python
  #!/usr/bin/python -O
  import base64
  import getpass
  import hashlib

  domain = raw_input('Domain: ').strip().lower()
  key = getpass.getpass('Universal password: ')

  bits = domain + '/' + key
  for i in range(2 ** 16):
      bits = hashlib.sha256(bits).digest()
  password = base64.b64encode(bits)[:16]

  print('Domain-specific password: ' + password)
  ```
