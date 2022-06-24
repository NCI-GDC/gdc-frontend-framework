#!/bin/groovy
pipeline {
  agent {
    docker { image 'docker.osdc.io/node:14' }
  }
  stages {
    stage('Install') {
      steps {
        script {
		sh 'npm config set proxy http://cloud-proxy:3128'
		sh 'pm config set https-proxy http://cloud-proxy:3128'
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
