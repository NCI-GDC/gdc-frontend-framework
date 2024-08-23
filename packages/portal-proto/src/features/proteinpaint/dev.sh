#!/bin/bash

# run from the gdc-frontend-framework project root folder
# ./packages/portal-proto/src/features/proteinpaint/dev.sh
# assumes that the proteinpaint folder is a sibling dir of gff
if [[ "$1" == "unlink" ]]; then
	# to test the published client package before submitting a PR with an updated pp-client version
	npm unlink ../proteinpaint/client
else
	# to test the local PP client code
	npm link ../proteinpaint/client
	# An issue with npm link and workspaces: the non-linked @sjcrh/proteinpaint-client package
	# may be moved to portal-proto/node_modules, creating 2 separate modules of the same package,
	# must ensure only the linked module is used for bundling so delete
	rm -rf packages/portal-proto/node_modules/@sjcrh
	# also not able to do a simpler
	# `cd packages/portal-proto && npm link path/to/proteinpaint/client`,
	# where the linked module would be in portal-proto/node_modules instead of the
	# other way around
fi

# sometimes the nextjs bundle cache are stale after npm link
rm -rf packages/portal-proto/.next

# run the following tab in a separate tab
# local-ssl-proxy --config ssl-proxy.json --cert localhost.pem --key localhost-key.pem
# then from the gff dir
PROTEINPAINT_API=https://localhost.gdc.cancer.gov:3011 PORT=3001 npm run dev
