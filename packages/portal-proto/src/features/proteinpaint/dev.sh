#!/bin/bash

# This script helps ProteinPaint devs test client code updates intended for the GFF repo.
# Run from the gdc-frontend-framework project root folder:
#  ./packages/portal-proto/src/features/proteinpaint/dev.sh [unlink]
#

# The source of the pp client dist bundles must be irrelevant to the GFF dev process,
# as long as the node_modules files are hard copies, or at least not symlinked above the project root.
# It can be from the npm registry with the unlink positional argument
if [[ "$1" == "unlink" ]]; then
	# to test the published client package before submitting a PR with an updated pp-client version
	# this also updates the package-lock
	rm -rf node_modules/@sjcrh/proteinpaint-client
	npm install @sjcrh/proteinpaint-client --save --save-exact --workspace=packages/portal-proto
else
	# PP devs should run the command below in the PP repo to generate dynamically rebundled PP client code for use in GFF:
	# `BUNDLE_OUTDIR=</abs/path/to>/gdc-frontend-framework/node_modules/@sjcrh/proteinpaint-client/dist npm run dev -w proteinpaint/client`
	echo "--- dev PP client bundle emitted to gff/node_modules/@sjcrh/proteinpaint-client/dist ---"
fi

# run the following command in a separate tab
# local-ssl-proxy --config ssl-proxy.json --cert localhost.pem --key localhost-key.pem
# then from the gff dir
PROTEINPAINT_API=https://localhost.gdc.cancer.gov:3011 PORT=3001 npm run dev
