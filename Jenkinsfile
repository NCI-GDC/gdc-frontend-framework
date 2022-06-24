#!groovy

//library identifier: "jenkins-lib@master"
//dockerPipeline{
//    tagSource = "semver"
    // testBranches = '(develop|master|release.*)'
//}


#!/bin/groovy
pipeline {
//  tools {
//    nodejs 'default-nodejs'
//  }
  stages {
    stage('Startup') {
      steps {
        script {
          sh 'npm install'
        }
      }
    }
    stage('Test') {
      steps {
        script {
          sh 'npm run test'
        }
      }
    }
  }
}

