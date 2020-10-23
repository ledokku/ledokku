# Cleanup
git checkout master
git pull
git fetch --all --tags

# Get the latest version
LATEST_RELEASE=$(jq -r ".version" server/package.json)

gh release create ${LATEST_RELEASE} --title "${LATEST_RELEASE}" --notes "Take a look at the [changelog](https://www.ledokku.com/docs/changelog) to see what's new in this version ✨."
