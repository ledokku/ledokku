# Maintainers Guide

> This guide is intended for maintainers

## Creating a new release

1. From the root of the repository run `./scripts/create-new-release.sh NEW_VERSION` (eg: `./scripts/create-new-release.sh 0.1.3`)
2. Merge the pull request
3. From the root of the repository run `./scripts/publish-release.sh`
