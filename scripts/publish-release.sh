# Cleanup
git checkout master
git pull
git fetch --all --tags

# Get the latest tag
LATEST_RELEASE=$(git describe --tags `git rev-list --tags --max-count=1`)

gh release create ${LATEST_RELEASE} --title "${LATEST_RELEASE}" --notes "Take a look at the [changelog](https://www.ledokku.com/docs/changelog) to see what's new in this version ✨."
