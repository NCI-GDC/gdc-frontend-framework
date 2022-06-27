#!/usr/bin/env groovy
pipeline {
    agent {
  	docker { image 'docker.osdc.io/node:16-alpine3.15' }
 	}

    stages {
	stage('Checkout') {
          // Get code from github.
	steps{
             checkout scm
           }
	}

	stage("pre-commit hooks") {
	steps{
                    pipelineHelper.preCommitHooks(preCommitVersion)
           }
    }
	}
}
