#!/usr/bin/env groovy
pipeline {
    agent {
  	docker { image 'docker.osdc.io/node:16-alpine3.15' }
 	}

    stages {
	withEnv(['https_proxy=http://cloud-proxy:3128', ]) {
	 stage('Checkout') {
          // Get code from github.
	  steps{
             checkout scm
          }
	 }
	}

	stage("pre-commit hooks") {
	steps{
              docker.image('docker.osdc.io/ncigdc/jenkins-agent:1.4.0').inside {
        // Some of the pre-commit hooks are installed via an ssh github url.
        sshagent(credentials: ['githubkey']) {
            sh "pip install pre-commit==1.21"
            sh "pre-commit run -a"
        }
    }
   }
  }
 }
}
