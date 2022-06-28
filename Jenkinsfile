#!/usr/bin/env groovy
pipeline {
    agent {
  	docker { image 'huzaifabajwa/py3node8:alpine-1.0' }
 	}

    stages {
	withEnv(['https_proxy=http://cloud-proxy:3128', ]) {
	 stage('Checkout') {
          // Get code from github.
	  steps{
             checkout scm
          }
	 }
	

	stage("pre-commit hooks") {
	 steps{
	  script{

               // Some of the pre-commit hooks are installed via an ssh github url.
                 sshagent(credentials: ['githubkey']) {
//		 sh "apk add --no-cache python3"
//		 sh "python -m ensurepip --upgrade"
                 sh "pip install pre-commit==1.21"
                 sh "pre-commit run -a"
               }
            }
          }
         }
  }     
 }
}
