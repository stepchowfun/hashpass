# Hashpass

[Hashpass](https://chrome.google.com/webstore/detail/hashpass/gkmegkoiplibopkmieofaaeloldidnko) is a Chrome extension designed to make passwords less painful. It generates a unique password for every website you use, and you only have to memorize a single secret key.

Hashpass is deterministic, meaning that it will always generate the same password for any given site and secret key. It uses a well-known formula to generate the passwords, so you could even compute them yourself.

A key feature of Hashpass is that it's stateless. Hashpass never writes to the file system or makes network requests. There is no password database.

## Installation

Install Hashpass from the Chrome App Store ([link](https://chrome.google.com/webstore/detail/hashpass/gkmegkoiplibopkmieofaaeloldidnko)). You will then see the Hashpass button next to your address bar.

There is also a compatible Android app, courtesy of [Erik Byström](http://blog.slackers.se/). It is available on the Google Play Store ([link](https://play.google.com/store/apps/details?id=se.slackers.hashpass)). The source is available [here](https://github.com/bysse/hashpass-android).

## A quick tour

Click the Hashpass button and this will pop up:

![Screenshot](https://raw.githubusercontent.com/boyers/hashpass/master/screenshot1.png)

Hashpass generates a password based on your key and the current domain. Usually you will want to select a password field first. Then Hashpass doesn't show the generated password, giving you the option to fill in the field instead:

![Screenshot](https://raw.githubusercontent.com/boyers/hashpass/master/screenshot2.png)

## How passwords are generated

Suppose your secret key is `bananas`, and you're signing up for Facebook. Hashpass combines the current domain name and your secret key with a `/` as follows: `www.facebook.com/bananas`. It then computes the [SHA-256 hash](http://en.wikipedia.org/wiki/SHA-2) of that string. Then it hashes it again and again, `2^16` times in total. Finally, it outputs the first 96 bits of the result, encoded as 16 characters in [Base64](http://en.wikipedia.org/wiki/Base64). In this example, the final output is `sWwtmA9uA6X9SyXD`. We can verify this result using Python:

    import hashlib, base64
    bits = 'www.facebook.com/bananas'
    for i in range(2 ** 16):
      bits = hashlib.sha256(bits).digest()
    print(base64.b64encode(bits)[:16]) # prints sWwtmA9uA6X9SyXD

## Security

If an adversary has your secret key, they have access to all of your accounts. Hashpass never reveals your secret key. But we must make sure that an adversary can't determine it from the generated passwords.

SHA-256 is one of the most widely-used cryptographic hash functions, and is considered unbroken at the time of this writing. This means that given a hash of a long and random string, an adversary can't recover that original string. However, secret keys produced by humans are not typically long, nor are they perfectly random. They often contain predictable words or phrases.

One strategy for cracking your secret key is to try hashing all English words, for example. This is called a *dictionary attack*. An attacker might even try to pre-compute the hashes of all English words and other common passwords. Then they could simple look up hashes in this hash table to crack them. The table in this attack is called a *rainbow table*.

A common defense against these attacks is to add random bits to your key. This is called a *salt*, and it ensures you don't use the same key as anyone else. Most security software will automatically add a salt to your key and store it. **Since Hashpass doesn't store anything, it cannot add a salt for you. It is up to you to pick a key with enough [entropy](http://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength) to defend against dictionary attacks.** Longer is better. More random is better. Don't use a single word. Definitely don't use `bananas`. Hashpass doesn't limit the size of your secret key—take advantage of this.

A determined attacker might try *all* strings up to some length. This generally takes longer or requires more computational power, but it's not impossible. For example, a reasonably-equipped hacker might be able to compute a trillion hashes per second. There are about 839 quadrillion 10-character alphanumeric keys. If keys are only hashed once, a hacker can crack a random 10-character alphanumeric key in a little over four days, on average.

This is called a *brute-force attack*, and it relies on an attacker being able to compute a large number of hashes very quickly. To provide resistance against such attacks, Hashpass applies the hashing function many times (`2^16` times, to be exact). This makes testing a key take much longer. On average, our hacker now takes more than 800 years to crack a random 10-character alphanumeric key.

Even with `2^16` rounds of hashing, it takes our hacker only 30 seconds to crack a random 5-character alphanumeric key! **It is strongly advised that you pick a key with at least 10 characters.**

## Comparison with traditional password managers

With Hashpass, an adversary with one of your generated passwords can try to guess your secret key and gain access to all your accounts. With a traditional password manager, those with access to your password database can try to guess your master password. These are very different threat models, but it is not obvious which is better. For example, if no one has access to your password database, a traditional password manager provides the better security model. If you normally sync your password database to the cloud, you might instead chose the Hashpass model, especially if you don't trust your cloud provider. A strong secret key is a solid defense in both models.

Since Hashpass doesn't store passwords in a database, you have no chance of accidentally deleting them, and you don't need to sync them across multiple devices. You also don't have to worry about me abandoning the project, or using a computer that doesn't have Hashpass. Since Hashpass uses a well-known hash function rather than a proprietary password database, you can always compute the passwords yourself if Hashpass is unavailable. All of the information needed to produce your passwords is in your head. That property is what motivated the development of this project.

## Practical notes

- If a generated password is ever compromised, you don't need to memorize a whole new secret key and update all of your passwords. For that service only, just add an incrementing index to your secret key. Such a tiny change in your secret key results in a completely new password for that service. For example, if your key was `bananas`, just use `bananas2`. If you can't remember which iteration of your secret key you used for a particular service, simply try them all in order.

- Some websites have certain requirements on passwords, e.g., at least one number and one capital letter. A simple way to meet such requirements is to append something like `A9!` to the generated password (and remember you did that).

- You don't have to use the same key for every service. But the point of Hashpass is that you can, provided your key is strong enough.

- As with any good security software, Hashpass is open-source ([Github](https://github.com/boyers/hashpass)). It uses the [Stanford Javascript Crypto Library](http://bitwiseshiftleft.github.io/sjcl/) to compute SHA-256.

## License

Copyright (c) 2015 Stephan Boyer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
