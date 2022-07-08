#!/bin/bash -x
set -o pipefail
while getopts b:n:t: option; do
	case "${option}" in
	b) BRANCH=${OPTARG} ;;
	n) BUILDNUMBER=${OPTARG} ;;
	t) SCM_TAG=${OPTARG} ;;
	*) echo "${OPTARG}" not supported! ;;
	esac
done
export DOCKER_BUILDKIT=1
export BUILDKIT_STEP_LOG_MAX_SIZE=10485760
export BUILDKIT_STEP_LOG_MAX_SPEED=1048576
BRANCH="${BRANCH-}"
SCM_TAG="${SCM_TAG-}"
BUILD_ROOT_DIR=$(pwd)
DOCKER_BUILD_OPT=""
if [[ -z "$GITLAB_CI" ]]; then
	DOCKER_BUILD_OPT="--progress plain"
else
	DOCKER_BUILD_OPT=""
fi
if [ -z "$SCM_TAG" ]; then
	CLEAN_BRANCH_NAME=${BRANCH/\//_}
	LOWERCASE_BRANCH_NAME="$(tr "[:upper:]" "[:lower:]" <<<"$CLEAN_BRANCH_NAME")"
	CURRENT_VERSION="${LOWERCASE_BRANCH_NAME}-${BUILDNUMBER}"
else
	CURRENT_VERSION="$SCM_TAG"
fi
if [ "$BRANCH" = "master" ] || [ -n "$SCM_TAG" ]; then
	# Which internal registry to push the images to.
	REGISTRY="docker.osdc.io"
	# Which external registry to push the images to, or blank to skip.
	# TODO: Should REGISTRY just be an array instead?
	EXTERNAL_REGISTRY="quay.io"
else
	REGISTRY="docker.osdc.io"
	EXTERNAL_REGISTRY=""
fi
# As what versions (i.e., "...:version") to tag the build images.
TAG_VERSIONS=("${CURRENT_VERSION}")
if [ "$BRANCH" = "master" ]; then
	TAG_VERSIONS+=("latest")
fi
# Populate the IMAGE_TAGS variable with an array listing the tags to set,
# including all versions and registries. Pass the "directory" of the image
# as an argument.
function populate_image_tags() {
	IMAGE_TAGS=()
	for TAG_VERSION in "${TAG_VERSIONS[@]}"; do
		IMAGE_TAGS+=("${REGISTRY}/ncigdc/$BRANCH:${TAG_VERSION}")
		if [ -n "$EXTERNAL_REGISTRY" ]; then
			IMAGE_TAGS+=("${EXTERNAL_REGISTRY}/ncigdc/$BRANCH:${TAG_VERSION}")
		fi
	done
}

echo "IMAGE_TAGS:"
echo $IMAGE_TAGS
echo "BRANCH"
echo $BRANCH

set -e
cd "$BUILD_ROOT_DIR"
if [ ! -f Dockerfile ]; then
	continue
fi


echo "Building Dockerfile" | ts "[INFO] %H:%M:%S"
docker build -t ncigdc/frontend/$BRANCH:$BUILDNUMBER .

if [[ -z "$GITLAB_CI" ]]; then
	echo "This is not being built on GitLab, ignoring dive." | ts "[INFO] %H:%M:%S - $directory -"
else
	dive "ncigdc/frontend/$BRANCH:$BUILDNUMBER" || true
fi

echo docker rmi "ncigdc/frontend/$BRANCH:$BUILDNUMBER"
cd ..

echo "Successfully built all containers!" | ts '[INFO] %H:%M:%S -'

cd "$BUILD_ROOT_DIR"

if [ ! -f Dockerfile ]; then
	continue
fi

echo "Pushing and cleaning up." | ts "[INFO] %H:%M:%S - $directory -"
#docker login docker.osdc.io -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD
#docker push  ncigdc/frontend/$BRANCH:$BUILDNUMBER
populate_image_tags "${directory}"
echo ${TAG}
for TAG in "${IMAGE_TAGS[@]}"; do
	 docker push ncigdc/frontend/$BRANCH:$BUILDNUMBER | ts "[PUSH] %H:%M:%S - $directory -"
	 docker rmi  ncigdc/frontend/$BRANCH:$BUILDNUMBER  | ts "[PUSH] %H:%M:%S - $directory -"
	echo "${TAG} is all set"
done
echo "All done!" | ts '[INFO] %H:%M:%S -'

