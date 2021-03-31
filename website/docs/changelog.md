---
id: changelog
title: Changelog
hide_title: true
---

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.6.1](https://github.com/ledokku/ledokku/compare/v0.6.0...v0.6.1) (2021-03-29)

### Bug Fixes

- **docs:** fix settings image, fix typos in oauth app ([#317](https://github.com/ledokku/ledokku/issues/317)) ([35d4ab2](https://github.com/ledokku/ledokku/commit/35d4ab2c887f736557a2d161cc4b3359ac4adf65))
- **docs:** update command for destroying redis instance ([#320](https://github.com/ledokku/ledokku/issues/320)) ([8b38504](https://github.com/ledokku/ledokku/commit/8b3850409e0e7ef435af14d624182326c184a4d3))

### Documentation

- add security section ([#327](https://github.com/ledokku/ledokku/issues/327)) ([4eda409](https://github.com/ledokku/ledokku/commit/4eda409129e02d226ab7f50adf7d66b0d820e3cd))

### Miscellaneous Chores

- **client:** fix how config is loaded ([#326](https://github.com/ledokku/ledokku/issues/326)) ([9d39b69](https://github.com/ledokku/ledokku/commit/9d39b6912d6e9633b86b3fad55ec4b7cf877c686))
- in dev mode automatically setup smee proxy ([#323](https://github.com/ledokku/ledokku/issues/323)) ([359b856](https://github.com/ledokku/ledokku/commit/359b856dbd044b571a5c13711e111e38959a2f48))
- **client:** fix create db link ([#315](https://github.com/ledokku/ledokku/issues/315)) ([4a12cd2](https://github.com/ledokku/ledokku/commit/4a12cd2bbb120a5cdfee82f92ad50f68fee8af90))
- **docs:** update dokku w in getting-started guide ([#318](https://github.com/ledokku/ledokku/issues/318)) ([a879354](https://github.com/ledokku/ledokku/commit/a8793541acbebc85eba175787acfc8af28ed1bef))

## [0.6.0](https://github.com/ledokku/ledokku/compare/v0.5.1...v0.6.0) (2021-03-21)

### Features

- **website:** add blog to website ([#309](https://github.com/ledokku/ledokku/issues/309)) ([58ce37f](https://github.com/ledokku/ledokku/commit/58ce37fd945f4b213ae8a833ae296af15b0cdba2))
- app header redesign ([#311](https://github.com/ledokku/ledokku/issues/311)) ([68aef78](https://github.com/ledokku/ledokku/commit/68aef78f94d83cb4f6f3ce3de1e207295132dc57))
- **client,server:** deploy directly from public git repo ([#265](https://github.com/ledokku/ledokku/issues/265)) ([8c69aad](https://github.com/ledokku/ledokku/commit/8c69aad89eaf9e1152bd439cd5aaa4dabd880c1c)), closes [#293](https://github.com/ledokku/ledokku/issues/293)
- add anonymous telemetry data via fathom ([#307](https://github.com/ledokku/ledokku/issues/307)) ([fa66eda](https://github.com/ledokku/ledokku/commit/fa66eda458089f86b2d2fadf0b05a3d1ba598d4c))
- **website:** add discord link ([#305](https://github.com/ledokku/ledokku/issues/305)) ([cce1486](https://github.com/ledokku/ledokku/commit/cce1486ac92a11fa9c17e741bab6ff9e29b42f14))
- database header redesign ([#296](https://github.com/ledokku/ledokku/issues/296)) ([19e6e02](https://github.com/ledokku/ledokku/commit/19e6e0272b0805e030937470af38c16596881ce0))
- disable outline style for non keyboard users ([#299](https://github.com/ledokku/ledokku/issues/299)) ([c327433](https://github.com/ledokku/ledokku/commit/c32743325a8cfdc02794e1290d15d54a9e89f75e))
- improve header style ([#294](https://github.com/ledokku/ledokku/issues/294)) ([e00b258](https://github.com/ledokku/ledokku/commit/e00b25809bc745df0dbea91c227f288e31d57114))

### Bug Fixes

- force `DOKKU_SSH_HOST` to ipv4 during installation ([#291](https://github.com/ledokku/ledokku/issues/291)) ([d75d67b](https://github.com/ledokku/ledokku/commit/d75d67b0b3f34687dcb6a6465113427ce38825d2))
- **client:** fix create app and database button ([#281](https://github.com/ledokku/ledokku/issues/281)) ([f1d51ad](https://github.com/ledokku/ledokku/commit/f1d51adb4e6d686cdc988b69b37c9cf844857035))
- fix setup ssh view layout ([#276](https://github.com/ledokku/ledokku/issues/276)) ([818f6ce](https://github.com/ledokku/ledokku/commit/818f6ce22de0d267c9e93ba1f41962aceb7ede7a))

### Code Refactoring

- cleanup dashboard db list ([#301](https://github.com/ledokku/ledokku/issues/301)) ([f031eea](https://github.com/ledokku/ledokku/commit/f031eeaa3c892d7789dcff27c0ef317abf1c79b4))

### Miscellaneous Chores

- **client:** fix minor issues ([#312](https://github.com/ledokku/ledokku/issues/312)) ([afee3c3](https://github.com/ledokku/ledokku/commit/afee3c3bf938b10b9d829e88c1a3e281b97b1e1a))
- **client:** migrate app logs view to chakra ([#288](https://github.com/ledokku/ledokku/issues/288)) ([4cec905](https://github.com/ledokku/ledokku/commit/4cec905d180f79b7ab15c4b55d37acdbb07d5bad))
- **client:** migrate database logs view to chakra ([#304](https://github.com/ledokku/ledokku/issues/304)) ([403be67](https://github.com/ledokku/ledokku/commit/403be6782921fd5db293deb5e654a22073264671))
- **client:** migrate proxy ports view to chakra ([#289](https://github.com/ledokku/ledokku/issues/289)) ([5e284e0](https://github.com/ledokku/ledokku/commit/5e284e09baba8a692f13ee2bb2581ccdaf52fdcf))
- **client:** migrate settings view to chakra ([#290](https://github.com/ledokku/ledokku/issues/290)) ([11c2347](https://github.com/ledokku/ledokku/commit/11c2347b6756e3b5c83dbacef490f28974b8e198))
- **client:** migrate toast messages to chakra UI ([#283](https://github.com/ledokku/ledokku/issues/283)) ([e7394da](https://github.com/ledokku/ledokku/commit/e7394da0635542f8ba34a72fd1896500d9d8bc6c))
- **docs:** update dokku version ([#303](https://github.com/ledokku/ledokku/issues/303)) ([f44e981](https://github.com/ledokku/ledokku/commit/f44e98127b9463e11ef2285b07dd7d994f2949a4))
- **server:** add ssh.dispose to queues ([#306](https://github.com/ledokku/ledokku/issues/306)) ([021403d](https://github.com/ledokku/ledokku/commit/021403db97bbd2f0c27e943c74571acb81e95ae6))
- **server:** fix additional feedbacks ([#308](https://github.com/ledokku/ledokku/issues/308)) ([bf4f291](https://github.com/ledokku/ledokku/commit/bf4f291de87f649466d5102b8becdf3b0cb04b6a))
- **website:** minor-blog-update ([#313](https://github.com/ledokku/ledokku/issues/313)) ([a7155bf](https://github.com/ledokku/ledokku/commit/a7155bf9bda7f5377554cf74e19d7003ce9e3bf4))
- create shared app nav component ([#297](https://github.com/ledokku/ledokku/issues/297)) ([78fcdb5](https://github.com/ledokku/ledokku/commit/78fcdb53f4a33287ce2b454e1dc0d7fa26f47691))
- create shared home nav component ([#298](https://github.com/ledokku/ledokku/issues/298)) ([0a52c6b](https://github.com/ledokku/ledokku/commit/0a52c6b8e1e94305391d0fafd3ab631bbb814218))
- set no-unused-vars eslint rule to error ([#287](https://github.com/ledokku/ledokku/issues/287)) ([4303c01](https://github.com/ledokku/ledokku/commit/4303c01b75670eb7381ce98ee31f934cb69b0fc9))
- **installation:** une new dokku git:from-image command ([#286](https://github.com/ledokku/ledokku/issues/286)) ([c3ebc69](https://github.com/ledokku/ledokku/commit/c3ebc692112020d5f1b64672d8d79625d66965f8))
- **website:** update dokku version ([#280](https://github.com/ledokku/ledokku/issues/280)) ([dbe8888](https://github.com/ledokku/ledokku/commit/dbe8888ec3d4df71c49c6bdbfed64dc373818a15))
- migrate create database view to chakra ([#278](https://github.com/ledokku/ledokku/issues/278)) ([107c0c5](https://github.com/ledokku/ledokku/commit/107c0c52c11cb1d9f870328a2e270a1fcd5fb02c))
- upgrade deps ([#277](https://github.com/ledokku/ledokku/issues/277)) ([72c0236](https://github.com/ledokku/ledokku/commit/72c023669b2a3c4c81bd06acc87f48222dab0a4f))

### [0.5.1](https://github.com/ledokku/ledokku/compare/v0.5.0...v0.5.1) (2021-02-26)

### Features

- add debug logs for the setup query ([#274](https://github.com/ledokku/ledokku/issues/274)) ([26667cc](https://github.com/ledokku/ledokku/commit/26667cc229e448970483d095d783c8fc94c1b9e6))
- setup and use chakra-ui ([#262](https://github.com/ledokku/ledokku/issues/262)) ([38044e0](https://github.com/ledokku/ledokku/commit/38044e03ea6b21f4826ada4e635329bcd67f2922))

### Miscellaneous Chores

- **client:** partly migrate app views to chakra ([#269](https://github.com/ledokku/ledokku/issues/269)) ([77fd046](https://github.com/ledokku/ledokku/commit/77fd046cb2a715900b1eb64da102e29269fc7337))
- **docs:** update dokku version and clean github screenshot ([#260](https://github.com/ledokku/ledokku/issues/260)) ([2e47906](https://github.com/ledokku/ledokku/commit/2e47906e44f82db3a8d3477f1dbba50ea72b30fc))
- **docs:** update version and links ([#272](https://github.com/ledokku/ledokku/issues/272)) ([aa1758a](https://github.com/ledokku/ledokku/commit/aa1758a277d238820cbd38f04de7aca07e4716ee))
- **server:** comment out appbuild related part ([#264](https://github.com/ledokku/ledokku/issues/264)) ([c8ff68f](https://github.com/ledokku/ledokku/commit/c8ff68f3a359edc19b9a96776e6833f8d4c61d00))

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
