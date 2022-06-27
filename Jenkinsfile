#!/bin/groovy
pipeline {
  agent { 
  docker { image 'node:16-alpine3.15' }
 }
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
