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
	  script{
//             docker.image('docker.osdc.io/node:16-alpine3.15').inside {
               // Some of the pre-commit hooks are installed via an ssh github url.
               sshagent(credentials: ['githubkey']) {
		 sh "npm -v"
		 sh "python -m ensurepip --upgrade"
                 sh "pip install pre-commit==1.21"
                 sh "pre-commit run -a"
               }
//            }
          }
         }
       }
 }
}
