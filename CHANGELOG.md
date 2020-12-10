# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/ledokku/ledokku/compare/v0.4.0...v0.5.0) (2020-12-10)

### Features

- **client:** add restart app functionality ([#238](https://github.com/ledokku/ledokku/issues/238)) ([f5ab08b](https://github.com/ledokku/ledokku/commit/f5ab08be7e411f92324a70855c7d65a5f797e651))
- **client:** app domain managment ([#252](https://github.com/ledokku/ledokku/issues/252)) ([143607e](https://github.com/ledokku/ledokku/commit/143607e05c2942ffccb6b6a24f51950e388e92ae))
- **client, server:** rebuild app functionality ([#254](https://github.com/ledokku/ledokku/issues/254)) ([c13cf43](https://github.com/ledokku/ledokku/commit/c13cf43e3173bb21d31c9ea6c42e3673bd268aba))

### Bug Fixes

- fix websocket connection failing when using https ([#256](https://github.com/ledokku/ledokku/issues/256)) ([b0dfcf8](https://github.com/ledokku/ledokku/commit/b0dfcf8ce47081f98993fd8a2343ef9cade675aa))

### Miscellaneous Chores

- **docs:** update the prisma migration part in contribution doc ([#253](https://github.com/ledokku/ledokku/issues/253)) ([d96bcc3](https://github.com/ledokku/ledokku/commit/d96bcc3b7a86934189ca4f08644d56935bbad868))
- **server:** fix apps and databases query condition ([#251](https://github.com/ledokku/ledokku/issues/251)) ([cfaf576](https://github.com/ledokku/ledokku/commit/cfaf5764f33ff5afcf6dbe87df48a4912e266b36))
- **server:** target node 12 for server compilation ([#249](https://github.com/ledokku/ledokku/issues/249)) ([3f6e810](https://github.com/ledokku/ledokku/commit/3f6e81023260aeb666309dfb8d097cc9a763bff9))
- upgrade taiwind to v2 and polish styles ([#247](https://github.com/ledokku/ledokku/issues/247)) ([12d3b4a](https://github.com/ledokku/ledokku/commit/12d3b4a789de8730d31607a25bc2edc710bfe6cc))
- upgrade yup to 0.31 ([#250](https://github.com/ledokku/ledokku/issues/250)) ([408ead1](https://github.com/ledokku/ledokku/commit/408ead1e21433187292d9b588393bf3f5b667205))
- **client:** add modal to delete port ([#240](https://github.com/ledokku/ledokku/issues/240)) ([ef58a37](https://github.com/ledokku/ledokku/commit/ef58a3785579f1b4bdd9744b151cc1361d10b793))
- **client:** upgrade to react 17 ([#217](https://github.com/ledokku/ledokku/issues/217)) ([5c39f04](https://github.com/ledokku/ledokku/commit/5c39f04d221f0ca8f0005fcae57b6e0eb341514d))

## [0.4.0](https://github.com/ledokku/ledokku/compare/v0.3.3...v0.4.0) (2020-11-10)

### For new Ledokku users

Ledokku from now on will run on port 80, instead of 4000.

### For existing Ledokku users

If you want to have same port behaviour as decribed ☝️ , you will need to run these commands :

```sh
dokku proxy:ports-add ledokku http:80:4000
dokku proxy:ports-remove ledokku http:4000:4000
```

### Features

- **client:** pre populate db name on creation ([#235](https://github.com/ledokku/ledokku/issues/235)) ([65c8c0c](https://github.com/ledokku/ledokku/commit/65c8c0c98dc5e7ce425e434ea0d57e1ed16a3fd3))
- add app port mapping management ([#231](https://github.com/ledokku/ledokku/issues/231)) ([ad4dd4e](https://github.com/ledokku/ledokku/commit/ad4dd4ea7f8fc13bfc7c82319c0ed43826c94e94))
- allow to install custom ledokku version via bootstrap script ([#229](https://github.com/ledokku/ledokku/issues/229)) ([7088aee](https://github.com/ledokku/ledokku/commit/7088aeed19476cd00c6cd05b2cd9048183f8068d))
- configure number of users allowed per server ([#233](https://github.com/ledokku/ledokku/issues/233)) ([57e199b](https://github.com/ledokku/ledokku/commit/57e199b5a77cb2f4ad48abbd8494fe1bb8a9a754))
- ledokku listen on port 80 instead of 4000 on production ([#230](https://github.com/ledokku/ledokku/issues/230)) ([e0424a7](https://github.com/ledokku/ledokku/commit/e0424a7676064a38bf639873abdd8828f6f0934d))

### Miscellaneous Chores

- **client:** switch port condition to false ([#236](https://github.com/ledokku/ledokku/issues/236)) ([2a8caab](https://github.com/ledokku/ledokku/commit/2a8caab44595d583ae210634cefed4ae4fb81a55))

### [0.3.3](https://github.com/ledokku/ledokku/compare/v0.3.1...v0.3.3) (2020-10-29)

### Bug Fixes

- fix publish script missing release prefix ([#225](https://github.com/ledokku/ledokku/issues/225)) ([6d987c5](https://github.com/ledokku/ledokku/commit/6d987c5ecf99f097dc94c593fff58aef4c386ea2))

### [0.3.2](https://github.com/ledokku/ledokku/compare/v0.3.1...v0.3.2) (2020-10-27)

### Features

- **docs:** add documentation for uninstalling Ledokku ([#216](https://github.com/ledokku/ledokku/issues/216)) ([1557db8](https://github.com/ledokku/ledokku/commit/1557db8ff4b32af8ee3f07d87fecb69daa9e1147))

### Bug Fixes

- **readme:** fix typo in the readme title ([#222](https://github.com/ledokku/ledokku/issues/222)) ([337121b](https://github.com/ledokku/ledokku/commit/337121b83ff615811de6abcb7c74806feb5a230c))
- **server:** fix max listeners exceeded warning ([#212](https://github.com/ledokku/ledokku/issues/212)) ([1fc5b7b](https://github.com/ledokku/ledokku/commit/1fc5b7b6aa06294b74e8b32e0fe32154f202bd0d))

### Documentation

- create "how to upgrade" guide ([#210](https://github.com/ledokku/ledokku/issues/210)) ([903dd08](https://github.com/ledokku/ledokku/commit/903dd081ba55af8a826f11a185d1a3d702610721))
- create configuration guide ([#211](https://github.com/ledokku/ledokku/issues/211)) ([dfbda1b](https://github.com/ledokku/ledokku/commit/dfbda1b69cb91810a8bca60caa902d05485dd0f9))

### Miscellaneous Chores

- **client:** switch dropdown from react-select to headless UI ([#215](https://github.com/ledokku/ledokku/issues/215)) ([2eaae4d](https://github.com/ledokku/ledokku/commit/2eaae4d79a24a7b385e17a90957bba1fae54ad82))
- **client:** update app env var UI ([#218](https://github.com/ledokku/ledokku/issues/218)) ([3edc363](https://github.com/ledokku/ledokku/commit/3edc363bf6874fe09c0c2652deb05a13c85c71b4))
- **client:** update UI for db/app link and unlink logs ([#221](https://github.com/ledokku/ledokku/issues/221)) ([0e1558e](https://github.com/ledokku/ledokku/commit/0e1558e8624309b6125b58f87f87c42bad3b6ec2))
- add changelog link to release description ([#209](https://github.com/ledokku/ledokku/issues/209)) ([95622b1](https://github.com/ledokku/ledokku/commit/95622b1212886d8ce122ef427ae1653a06e7fd3c))
- **website:** add twitter card image for website ([#208](https://github.com/ledokku/ledokku/issues/208)) ([b34f8e8](https://github.com/ledokku/ledokku/commit/b34f8e8efce661e064ef86b36fd14a10f30bae6c))

### [0.3.1](https://github.com/ledokku/ledokku/compare/v0.3.0...v0.3.1) (2020-10-22)

### Features

- **bootstrap:** add rule that allows access port 4000 ([#205](https://github.com/ledokku/ledokku/issues/205)) ([6bf87a3](https://github.com/ledokku/ledokku/commit/6bf87a39469a405166ac51179eaacb6ffd774f8f))

### Documentation

- fix installation link version ([#204](https://github.com/ledokku/ledokku/issues/204)) ([17bc375](https://github.com/ledokku/ledokku/commit/17bc375367a1ec4e9932097df891a6c93c208b64))

## [0.3.0](https://github.com/ledokku/ledokku/compare/v0.2.1...v0.3.0) (2020-10-21)

### Features

- create interactive bootstrap script to install ledokku ([#175](https://github.com/ledokku/ledokku/issues/175)) ([51e24ec](https://github.com/ledokku/ledokku/commit/51e24ec0b50ffd18a64a3645e4a8732e7ec4a603))
- **client:** add db creation option to link db select ([#201](https://github.com/ledokku/ledokku/issues/201)) ([07c6518](https://github.com/ledokku/ledokku/commit/07c65180205c8787707aa5521ca3823b10206828))
- **server:** recreate link and unlink functions in dokku lib ([#200](https://github.com/ledokku/ledokku/issues/200)) ([f7d417f](https://github.com/ledokku/ledokku/commit/f7d417f5b07a1184e9259b4bb599e54b023a3a35))

### Miscellaneous Chores

- add changelog to website ([#202](https://github.com/ledokku/ledokku/issues/202)) ([25e76c9](https://github.com/ledokku/ledokku/commit/25e76c92c448a8c20caeb832acfc615ba0ddf30e))
- **docs:** add link to getting started guide to README ([#194](https://github.com/ledokku/ledokku/issues/194)) ([b24ff75](https://github.com/ledokku/ledokku/commit/b24ff759cd3a74709d8751a4b51b723c1c0ddc44))

## 0.2.1 (2020-10-19)

### Bug Fixes

- upgrade prisma to 2.9.0 to fix SIGABRT issue ([#189](https://github.com/ledokku/ledokku/issues/189)) ([ce54a0d](https://github.com/ledokku/ledokku/commit/ce54a0d3a501514c686cec8c23c5d8b8ff1ce11b))

## 0.2.0 (2020-10-18)

### Features

- **client:** improve database info view ([#185](https://github.com/ledokku/ledokku/issues/185)) ([5eb088e](https://github.com/ledokku/ledokku/commit/5eb088e9c8215ea1c756dc890478dc36527661db))
- show real time logs on db creation ([#172](https://github.com/ledokku/ledokku/issues/172)) ([81ee614](https://github.com/ledokku/ledokku/commit/81ee6143334724f38eec3ecc7bb2682f2d7cfe54))
- **server:** add extra validation for subscription connection ([#180](https://github.com/ledokku/ledokku/issues/180)) ([6789f21](https://github.com/ledokku/ledokku/commit/6789f21e6515f37a6eb679a2a1a9fac70aa3f5e7))
- add ws auth ([#177](https://github.com/ledokku/ledokku/issues/177)) ([0ad5ff7](https://github.com/ledokku/ledokku/commit/0ad5ff702acdc2bedea372ae305cfb8a04fc3643))

### Bug Fixes

- exclude ledokku when synchronising apps and dbs ([#178](https://github.com/ledokku/ledokku/issues/178)) ([efb92a0](https://github.com/ledokku/ledokku/commit/efb92a021ef546911bf52fe967e9757b5220fb6f))

### Miscellaneous Chores

- add name validation on db/app creation ([#183](https://github.com/ledokku/ledokku/issues/183)) ([599fbed](https://github.com/ledokku/ledokku/commit/599fbed20072efbb86597abb577e412c18261a28))
- upgrade dependencies ([#179](https://github.com/ledokku/ledokku/issues/179)) ([270beb8](https://github.com/ledokku/ledokku/commit/270beb82e644681f96d52693429be4609d4f2552))

## 0.1.0 (2020-10-06)

### Features

- synchronise ledokku with existing dokku server ([#169](https://github.com/ledokku/ledokku/issues/169)) ([8167987](https://github.com/ledokku/ledokku/commit/816798750dddf081b4b8f53a152431c5ecbd193f))
- use accessible dropdown for the top right profile menu ([#171](https://github.com/ledokku/ledokku/issues/171)) ([2754bff](https://github.com/ledokku/ledokku/commit/2754bff1d4515688af928518cbbde163f4beea05))

### Documentation

- point to the dokku documentation to deploy an app ([#163](https://github.com/ledokku/ledokku/issues/163)) ([566e751](https://github.com/ledokku/ledokku/commit/566e751185e3f0a9bc4e6872deb066a0c2802fb4))

### Miscellaneous Chores

- update website text, pics and github readme ([#164](https://github.com/ledokku/ledokku/issues/164)) ([b65b5b6](https://github.com/ledokku/ledokku/commit/b65b5b6b9b8e2da8ef9098866d5124fb3bd7fea0))

## 0.0.3 (2020-10-05)

### Features

- **client:** database form validation ([#159](https://github.com/ledokku/ledokku/issues/159)) ([df67002](https://github.com/ledokku/ledokku/commit/df67002b1434cf2f34ceb0e368ef8246224bbbe6))

### Bug Fixes

- fix app view logs when there is an error ([#158](https://github.com/ledokku/ledokku/issues/158)) ([83f90c0](https://github.com/ledokku/ledokku/commit/83f90c06e816da10ef2a1c540905515ed067d9ea))

### Documentation

- add command to create release ([#152](https://github.com/ledokku/ledokku/issues/152)) ([afc4ce2](https://github.com/ledokku/ledokku/commit/afc4ce207df64ef4c28c58c07c26da9da5bf29e7))
- add fathom ([#160](https://github.com/ledokku/ledokku/issues/160)) ([1427e7a](https://github.com/ledokku/ledokku/commit/1427e7a9de5f0619e33d77caea7eaf9f45ea3e92))
- update to dokku v0.21.4 ([#153](https://github.com/ledokku/ledokku/issues/153)) ([d99ef3a](https://github.com/ledokku/ledokku/commit/d99ef3a54795d8822e458298ab8105f9e8b61faa))

### Miscellaneous Chores

- auto generate changelog when creating a new release ([#161](https://github.com/ledokku/ledokku/issues/161)) ([4ae7b90](https://github.com/ledokku/ledokku/commit/4ae7b90bee2d2fa4c555a202884c53d91ebf885e))
