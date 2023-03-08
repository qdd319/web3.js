# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- EXAMPLE

## [1.0.0]

### Added

- I've added feature XY (#1000)

### Changed

- I've cleaned up XY (#1000)

### Deprecated

- I've deprecated XY (#1000)

### Removed

- I've removed XY (#1000)

### Fixed

- I've fixed XY (#1000)

### Security

- I've improved the security in XY (#1000)

-->

## [4.0.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `main` and `files` entries in `package.json` changed to `lib/` directory from `dist/` (#5739)
-   Refactor to use common SocketProvider class (#5683)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

## [Unreleased]

### Added

-   Added named export for `WebSocketProvider` (#5771)
-   The getter of `SocketConnection` in `WebSocketProvider` (inherited from `SocketProvider`) returns isomorphic `WebSocket` (#5891)
