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
chmod +x ./ledokku-bootstrap.sh

# Generate CHANGELOG.md
yarn standard-version --release-as ${NEW_VERSION}

# Update the website changelog page with the new release
cat <<EOT > website/docs/changelog.md
---
id: changelog
title: Changelog
hide_title: true
---
EOT
cat CHANGELOG.md >> website/docs/changelog.md

# Use prettier to normalise the changed files
yarn prettier

# git commit
RELEASE_COMMIT_MESSAGE="chore: publish v${NEW_VERSION}"
git checkout -b "release/v${NEW_VERSION}"
git add "./CHANGELOG.md"
git add "./ledokku-bootstrap.sh"
git add "./server/package.json"
git add "./client/package.json"
git add "./website/docs/installation.md"
git add "./website/docs/advanced/manual-installation.mdx"
git add "./website/docs/changelog.md"
git commit -m "${RELEASE_COMMIT_MESSAGE}"
git push --set-upstream origin "release/v${NEW_VERSION}"

# Create a new release pull request
gh pr create --title "${RELEASE_COMMIT_MESSAGE}" --body ""
