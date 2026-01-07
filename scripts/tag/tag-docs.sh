VERSION=$(jq -r '.version' package.json) && \
git tag -a docs-$VERSION -m "prepare $VERSION"