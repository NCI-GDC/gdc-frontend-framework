#!/bin/groovy
pipeline {
  agent {
    docker { image 'docker.osdc.io/node:16-alpine3.15' }
  }
  stages {
    stage('Install') {
      steps {
      
          sh 'npm install'
        
      }
    }
    stage('Test') {
      steps {
    
          sh 'npm run test'
        
      }
    }
  }
}
