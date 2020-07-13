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
1. Run `npm run release`
2. Update CHANGELOG with details from UNRELEASED and commit with msg:
  - `chore(release): add v0.2.3 to CHANGELOG.md`
3. Run npm version with option [<newversion> | major | minor | patch | from-git | ... ]
  - `npm version patch -m "chore(release): bump to %s"`
4. Run `npm publish`
-->
<!-- ADD-NEW-CHANGELOG-ENTRY-HERE -->



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
