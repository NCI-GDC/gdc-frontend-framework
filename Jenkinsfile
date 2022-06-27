#!groovy
import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

/**
* Pipeline for building and testing GDC dockerized services.
*
*/

def call(body) {
    def config = [:]
    body.resolveStrategy = Closure.DELEGATE_FIRST
    body.delegate = config
    body()
    def helmDeploy = config.helmDeploy ?: false
    // When we have more k8s we can remove this flag.
    def enableHelm = false
    def testBranches = config.testBranches ?: "(develop|master|release.*|feat.*|fix.*|hotfix.*)"
    def remoteRegistry = (env.BRANCH_NAME == "master") ? "containers.osdc.io" : "dev-containers.osdc.io"
    def repo = env.JOB_NAME.tokenize('/') as String[]
    repo = repo.length < 2 ? env.JOB_NAME : repo[repo.length - 2]
    // Default to setuptools for calculateTags.
    def tagSource = config.tagSource ?: "setuptools"
    def preCommitVersion = config.preCommitVersion ?: "1.21"

    // Cancel any previous builds running for current job
    pipelineHelper.cancelPreviousRunningBuilds()

    node {
        // Encapsulate everything in try catch finally
        try {
            // cleanup everything before running anything.
            deleteDir()
            // Passing in https_proxy for all steps.
            withEnv(['https_proxy=http://cloud-proxy:3128', ]) {
                stage('Checkout'){
                    // Get code from github.
                    checkout scm
                }
                // Validate SEMVER of latest tag.
                stage('Validate SEMVER') {
                    // Don't run this step if it is a PR.
                    if (!(env.CHANGE_ID)) {
                        pipelineHelper.loadScriptFromLibrary("calculateTags.sh")
                        sh "./calculateTags.sh --env $tagSource"
                    }
                    else {
                        Utils.markStageSkippedForConditional(STAGE_NAME)
                    }
                }
                stage("pre-commit hooks") {
                    pipelineHelper.preCommitHooks(preCommitVersion)
                }
                stage('Run tests') {
                    // Our tests are super slow at times. We pass an argument to this pipeline with a regex of branches we want tests to run.
                    // Will always run on Pull Requests
                    if (env.BRANCH_NAME ==~ ~/${testBranches}/ || env.CHANGE_ID) {
                        pipelineHelper.loadScriptFromLibrary("wait-for-it.sh")
                        try {
                            sshagent (credentials: ['githubkey']) {
                                sh 'echo $SSH_AUTH_SOCK'
                                sh 'docker-compose -f docker-compose-ci.yaml up --exit-code-from app'
                                sh 'docker-compose -f docker-compose-ci.yaml down -v  --remove-orphans'
                            }
                        }
                        catch(e) {
                            // Make sure to teardown the docker-compose even on failures.
                            sh 'docker-compose -f docker-compose-ci.yaml down -v  --remove-orphans'
                            throw(e)
                        }
                    }
                    else {
                        // Mark stage as skipped.
                        Utils.markStageSkippedForConditional(STAGE_NAME)
                    }
                }
                stage('Build Docker Image') {
                    if (env.CHANGE_ID) {
                        // if it is a pull request we don't want to build docker image.
                         Utils.markStageSkippedForConditional(STAGE_NAME)
                    }
                    else  {
                        pipelineHelper.loadScriptFromLibrary("pip.conf")
                        GIT_TAG = sh (
                                    script: "./calculateTags.sh --env $tagSource",
                                    returnStdout: true
                                ).trim()
                        echo "Building docker image ${repo}:${GIT_TAG}"

                        if(fileExists('docker-build-jenkins.sh')) {
                            // Use docker-build-jenkins.sh if it exists or use default docker build.
                            withEnv(["REGISTRY=${remoteRegistry}", "REPO=${repo}", "GIT_TAG=${GIT_TAG}"] ) {
                                sshagent (credentials: ['githubkey']) {
                                    sh "bash ./docker-build-jenkins.sh"
                                }
                            }
                        }
                        else {
                            def customImage = docker.build("${remoteRegistry}/ncigdc/${repo}:${GIT_TAG}", ". --build-arg http_proxy=http://cloud-proxy:3128 --build-arg https_proxy=http://cloud-proxy:3128")
                            /* Push the container to the custom Registry */
                            customImage.push()

                            pipelineHelper.loadScriptFromLibrary("calculateTags.sh")
                            formattedBranchName = sh(
                                script: './calculateTags.sh --env branch',
                                returnStdout: true
                            )
                            // Push a custom tag of the branch name
                            customImage.push("${formattedBranchName}")

                            // Get any tags pointing at HEAD and push them as docker tags
                            TAGS = sh(returnStdout: true, script: "git tag --contains").trim()
                            TAGS.eachLine {
                                customImage.push("${it}")
                            }
                        }
                    }
                }
                // Hide this behind a feature flag until we do more k8s.
                stage('Helm') {
                    if (env.CHANGE_ID || !enableHelm) {
                        // if it is a pull request we want to skip this step.
                         Utils.markStageSkippedForConditional(STAGE_NAME)
                    }
                    else {
                        // Build helm artifact if helm directory exists in repo.
                        if(fileExists('helm')) {
                            def APPNAME = env.JOB_NAME.tokenize('/') as String[]
                            APPNAME = APPNAME.length < 2 ? env.JOB_NAME : APPNAME[APPNAME.length - 2]
                            pipelineHelper.loadScriptFromLibrary("calculateTags.sh")
                            GIT_TAG = sh (
                                        script: "./calculateTags.sh --env $tagSource",
                                        returnStdout: true
                                    ).trim()
                            if(fileExists('helm-jenkins.sh')) {
                                withKubeConfig([
                                    credentialsId: 'Kubeconfig'
                                ]) {
                                    withCredentials([string(credentialsId: 'twine_username', variable: 'HELM_USER'), string(credentialsId: 'twine_password', variable: 'HELM_PASS')]) {
                                        withEnv(["GIT_TAG=${GIT_TAG}"] ) {
                                            sh "bash ./helm-jenkins.sh"
                                        }
                                    }
                                }
                            }
                            else {
                                withCredentials([string(credentialsId: 'twine_username', variable: 'HELM_USER'), string(credentialsId: 'twine_password', variable: 'HELM_PASS')]) {
                                     withKubeConfig([
                                    credentialsId: 'Kubeconfig'
                                    ]) {
                                        withEnv(["GIT_TAG=${GIT_TAG}", "APPNAME=${APPNAME}"] ) {
                                            sh '''
                                            helm package ./helm --version "${GIT_TAG}" --app-version "${GIT_TAG}" -d helm
                                            file=$(ls helm/*.tgz)
                                            helm upgrade --install --atomic "$APPNAME" "$file" --version "$GIT_TAG" --wait --timeout 10m0s
                                            echo "Pushing helm chart to nexus"
                                            curl -f -u "$HELM_USER":'$HELM_PASS" https://nexus.osdc.io/repository/gdc-helm-snapshot/ --upload-file "$file"
                                            '''
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            Utils.markStageSkippedForConditional(STAGE_NAME)
                        }
                    }
                }
            }
        }
        catch(e) {
            pipelineHelper.handleError(e)
        }
        finally {
            stage('Post') {
                pipelineHelper.artifacts()
                if (env.CHANGE_ID) {
                    // if it is a pull request we want to skip this step.
                     Utils.markStageSkippedForConditional(STAGE_NAME)
                }
                else if(fileExists('docker-build-jenkins.sh')) {
                        echo "Bypassing docker resources cleanup step"
                }
                else {
                    pipelineHelper.loadScriptFromLibrary("dockerCleanup.sh")
                    // Clean up the generated GIT_TAG
                    sh (script: "./dockerCleanup.sh $remoteRegistry $repo $GIT_TAG")
                    // Clean up the docker tag marked as the branch name
                    sh (script: "./dockerCleanup.sh $remoteRegistry $repo $formattedBranchName")
                    // Clean up any tags related to the specific commit
                    TAGS.eachLine {
                        sh (script: "./dockerCleanup.sh $remoteRegistry $repo ${it}")
                    }
                    sh 'docker system prune -f --volumes'
                }
                pipelineHelper.teardown(currentBuild.result)
            }
        }
    }
}
