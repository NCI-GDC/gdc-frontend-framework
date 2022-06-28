#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    stage('Checkout') {
          // Get code from github.
	  steps{
             checkout scm
          }
        }
    stage ('Pre commithooks') {
      steps{
       script {
        docker.image('docker.osdc.io/ncigdc/jenkins-agent:1.4.0').inside {
        // Some of the pre-commit hooks are installed via an ssh github url.
        sshagent(credentials: ['githubkey']) {
            sh "pip install pre-commit==${preCommitVersion}"
            sh "pre-commit run -a"
      }  
     }
    }
   }
  }
 }
}
