#!/bin/bash

# This script is meant for local development of GFF with a proteinpaint repo.
# Run from the gdc-frontend-framework project root folder
# ./packages/portal-proto/src/features/proteinpaint/dev.sh
# assumes that the proteinpaint folder is a sibling dir of gff

if [[ "$1" == "unlink" ]]; then
	# to test the published client package before submitting a PR with an updated pp-client version.
	# Clear any local-dev vars inherited from the shell so next.config.js does NOT apply the
	# local client override — unlink mode must resolve the published package.
	unset PP_CLIENT_DIST NEXT_CONFIG_OVERRIDES

	npm uninstall @sjcrh/proteinpaint-client --save --workspace=packages/portal-proto
	npm install @sjcrh/proteinpaint-client --save --save-exact --workspace=packages/portal-proto

	# sometimes the nextjs bundle cache is stale after changing the client package
	rm -rf packages/portal-proto/.next

	# run the following in a separate tab
	# local-ssl-proxy --config ssl-proxy.json --cert localhost.pem --key localhost-key.pem
	# then from the gff dir
	PROTEINPAINT_API=https://localhost.gdc.cancer.gov:3011 PORT=3001 npm run dev
else
	# to test the local PP client code:
	# 1. build the client in watch mode from the sjpp repo which has proteinpaint as a submodule:
	#    cd ../../sjpp && npm run dev
	# 2. ppNextConfig.mjs (run below) prints a NEXT_CONFIG_OVERRIDES JSON object that
	#    next.config.js spreads: `turbopack` points Turbopack at the local client dist,
	#    and `env`/`connectSrc` supply PROTEINPAINT_API and allow its host in the CSP
	#    (see next.config.js). No npm link or manual `cp -r dist ...` into node_modules is
	#    needed. A browser refresh after a client rebuild is usually enough to pick up changes.
	# PP_CLIENT_DIST may point at the client repo root, its dist dir, or app.js itself.
	# Resolve to an absolute path (via a subshell) so it is unaffected by the cwd
	# that `lerna run dev` uses for the next process.
	if ! PP_CLIENT_DIST="$(cd ../proteinpaint/client && pwd -P)"; then
		echo "error: ../proteinpaint/client not found (expected sibling of this repo)" >&2
		exit 1
	fi
	export PP_CLIENT_DIST

	# sometimes the nextjs bundle cache is stale after switching the client source
	rm -rf packages/portal-proto/.next

	SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

	# run the following in a separate tab
	# local-ssl-proxy --config ssl-proxy.json --cert localhost.pem --key localhost-key.pem
	# then from the gff dir
	PROTEINPAINT_API=https://localhost.gdc.cancer.gov:3011 NEXT_CONFIG_OVERRIDES="$("$SCRIPT_DIR/ppNextConfig.mjs")" \
		PORT=3001 npm run dev
fi
