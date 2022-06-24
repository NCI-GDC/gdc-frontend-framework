#!/bin/groovy
pipeline {
  agent {
    docker { image 'docker.osdc.io/node:14' }
  }
  stages {
    stage('Install') {
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
