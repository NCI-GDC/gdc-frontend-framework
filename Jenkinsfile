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
//        sshagent(credentials: ['githubkey']) {
//          sh "pip install pre-commit==${preCommitVersion}"
            sh "pre-commit run -a"
       
        
     
    }
   }
  }
 }
}
