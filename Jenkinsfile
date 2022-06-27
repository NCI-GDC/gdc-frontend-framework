#!/bin/groovy
pipeline {
  agent {
    docker { image 'docker.osdc.io/node:16-alpine3.15' }
  }
  stages {
	stage('Checkout') {
       // Get code from github.
          checkout scm
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
  }
}

