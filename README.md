# BYTE/DEPT® TypeGuards
## (AKA ByteGuards)

![](https://img.shields.io/badge/Coverage-88%25-83A603.svg?prefix=$statements$)

This is a library for having typeguards at runtime boundaries, in addition to the native TS compile time checking. The purpose of this is to provide more information when variables fail type-guards, but also to ensure that when data comes back from an API, DB call etc, that it is of the type that we expect. This adds some overhead at run-time, but with the benefit of providing complete type security.

We have found it to be superior to other libraries such as io-ts and Spicery, and ts-runtime which runs in Babel, as there is a clearer indicator of what is going on, as well as verbose messages if you want them. In addition, with the use of GitHub CoPilot, we have found the 'manual' generation of TypeGuards quick and easy.

It was inspired by [this article](https://web.archive.org/web/20190204094636/https://lorefnon.tech/2018/03/25/typescript-and-validations-at-runtime-boundaries/), written back in 2018.

## License
Distributed under the MIT License. See LICENSE.txt for more information.
