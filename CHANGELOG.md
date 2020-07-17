# Changelog

All notable changes to this project will be documented in this file.

**Tags**

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation

<!--
Release flow:
1. Run `npm run unreleased`
2. Update CHANGELOG with details from UNRELEASED and commit with msg:
  - `chore(release): add v0.2.6 to CHANGELOG.md`
3. Run npm version with option [<newversion> | major | minor | patch | from-git | ... ]
  - `npm version patch -m "chore(release): bump to v%s"`
4. Run `npm publish`
-->
<!-- ADD-NEW-CHANGELOG-ENTRY-HERE -->



## [0.2.6](https://github.com/sebnitu/scroll-stash/compare/v0.2.5...v0.2.6) (2020-07-17)

### Features

* add the alignment option ([2d65f4b](https://github.com/sebnitu/scroll-stash/commit/2d65f4b))

### Refactor

* Refactor show anchor functionality (#41) ([7071ac1](https://github.com/sebnitu/scroll-stash/commit/7071ac1)), closes [#41](https://github.com/sebnitu/scroll-stash/issues/41)
  * move the anchor query logic into it's own method ([4563c1a](https://github.com/sebnitu/scroll-stash/commit/4563c1a))
  * remove redundant conditionals around showAnchor calls ([12da5a2](https://github.com/sebnitu/scroll-stash/commit/12da5a2))
  * move posTop and posBot into their own get methods ([b9e0fa5](https://github.com/sebnitu/scroll-stash/commit/b9e0fa5))
  * move the nearest position logic into its own get method ([feea05c](https://github.com/sebnitu/scroll-stash/commit/feea05c))
  * clean up custom event dispatch ([33356b6](https://github.com/sebnitu/scroll-stash/commit/33356b6))

### Documentation

* update readme content order ([8c85687](https://github.com/sebnitu/scroll-stash/commit/8c85687))



## [0.2.5](https://github.com/sebnitu/scroll-stash/compare/v0.2.4...v0.2.5) (2020-07-15)

### Bug Fixes

* anchor event no longer incorrectly fire when anchors are in view ([1e4d9ba](https://github.com/sebnitu/scroll-stash/commit/1e4d9ba))

### Refactor

* use shorthand to add top bot adjust ([40fe158](https://github.com/sebnitu/scroll-stash/commit/40fe158))

### Tests

* Improve test coverage (#40) ([5642648](https://github.com/sebnitu/scroll-stash/commit/5642648)), closes [#40](https://github.com/sebnitu/scroll-stash/issues/40)



## [0.2.4](https://github.com/sebnitu/scroll-stash/compare/v0.2.3...v0.2.4) (2020-07-14)

### Bug Fixes

* fixed conditional logic on data anchor ([9837c83](https://github.com/sebnitu/scroll-stash/commit/9837c83))



## [0.2.3](https://github.com/sebnitu/scroll-stash/compare/v0.2.2...v0.2.3) (2020-07-13)

### Chore

* add release flow to changelog and update version scripts ([4160d51](https://github.com/sebnitu/scroll-stash/commit/4160d51))

### Documentation

* add coverage badge to readme ([dbda049](https://github.com/sebnitu/scroll-stash/commit/dbda049))



## [0.2.2](https://github.com/sebnitu/scroll-stash/compare/v0.2.1...v0.2.2) (2020-07-13)

### Tests

* add a few unit tests via jsdom env (#35) ([7db0b3e](https://github.com/sebnitu/scroll-stash/commit/7db0b3e)), closes [#35](https://github.com/sebnitu/scroll-stash/issues/35)
* update test script ([6c669de](https://github.com/sebnitu/scroll-stash/commit/6c669de))



## [0.2.1](https://github.com/sebnitu/scroll-stash/compare/v0.2.0...v0.2.1) (2020-07-04)

### Tests

* Add headless browser testing ([#19](https://github.com/sebnitu/scroll-stash/pull/19)) ([c96ac3c](https://github.com/sebnitu/scroll-stash/commit/c96ac3c7f0b41ab8fb42fb785243cb65eee43047))



## [0.2.0](https://github.com/sebnitu/scroll-stash/compare/v0.1.2...v0.2.0) (2020-06-22)

### Features

* add custom events for saved, applied and anchor ([ba34a8c](https://github.com/sebnitu/scroll-stash/commit/ba34a8c5dc759b9d3580995a9cbf883dfa462607))



## [0.1.2](https://github.com/sebnitu/scroll-stash/compare/v0.1.0...v0.1.2) (2020-06-21)

### Bug Fixes

* show active top and bottom element padding ([a4f76ec](https://github.com/sebnitu/scroll-stash/commit/a4f76ec3c26f0db3ad8f253b05e0f1147d77a095))

### Features

* add optional stash-anchor data attr for manually overriding anchor ([c1dc586](https://github.com/sebnitu/scroll-stash/commit/c1dc5860713232d517bbf5dea734f8653c940176))
* add support for multiple scroll-stash elements ([8c82b37](https://github.com/sebnitu/scroll-stash/commit/8c82b37e16409e7422a9b677211225b39c493fd7))



## [0.1.1](https://github.com/sebnitu/scroll-stash/compare/v0.1.0...v0.1.1) (2020-06-21)

### Features

* add support for multiple scroll-stash elements ([8c82b37](https://github.com/sebnitu/scroll-stash/commit/8c82b37e16409e7422a9b677211225b39c493fd7))

### Refactor

* refactor the show active functionality ([50b46d5](https://github.com/sebnitu/scroll-stash/commit/50b46d5d89196754d64b80b6d25e29a9a6615f6f))



## [0.1.0](https://github.com/sebnitu/scroll-stash/compare/v0.1.0) (2020-06-17)

### Features

* first commit: ported over the initial prototype from [Vrembem](https://vrembem.com) docs ([ee64dcf](https://github.com/sebnitu/scroll-stash/commit/ee64dcfee8a37060fb644cba31115418473bad59))
