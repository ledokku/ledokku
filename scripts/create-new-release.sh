NEW_VERSION=${1}

# Check that version is semver
if [[ ${NEW_VERSION} =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    versionShort=${BASH_REMATCH[0]}
else
    echo "Something is wrong with the new version"
    exit 1
fi

# Get the current package.json version so it can be replaced
CURRENT_PACKAGE_VERSION=$(jq -r ".version" server/package.json)

# Replace old version with new version
jq --arg version ${NEW_VERSION} '.version = $version' server/package.json > "tmp.txt" && mv "tmp.txt" server/package.json
jq --arg version ${NEW_VERSION} '.version = $version' client/package.json > "tmp.txt" && mv "tmp.txt" client/package.json
sed "s|${CURRENT_PACKAGE_VERSION}|${NEW_VERSION}|g" website/docs/installation.md > "tmp.txt" && mv "tmp.txt" website/docs/installation.md
sed "s|${CURRENT_PACKAGE_VERSION}|${NEW_VERSION}|g" website/docs/advanced/manual-installation.mdx > "tmp.txt" && mv "tmp.txt" website/docs/advanced/manual-installation.mdx
sed "s|${CURRENT_PACKAGE_VERSION}|${NEW_VERSION}|g" ledokku-bootstrap.sh > "tmp.txt" && mv "tmp.txt" ledokku-bootstrap.sh

# Generate CHANGELOG.md
yarn conventional-changelog -p conventionalcommits -n ./conventional-changelog.config.json -i CHANGELOG.md -s
# We append the header in the changelog file manually as there is no git tag yet
echo "## $NEW_VERSION ($(date +%Y-%m-%d)) $(cat CHANGELOG.md)" > CHANGELOG.md
yarn prettier --write './CHANGELOG.md'

# git commit
RELEASE_COMMIT_MESSAGE="chore: publish v${NEW_VERSION}"
git checkout -b "release/v${NEW_VERSION}"
git add "./CHANGELOG.md"
git add "./server/package.json"
git add "./client/package.json"
git add "./website/docs/installation.mdx"
git commit -m "${RELEASE_COMMIT_MESSAGE}"
git push --set-upstream origin "release/v${NEW_VERSION}"

# Create a new release pull request
gh pr create --title "${RELEASE_COMMIT_MESSAGE}" --body ""
