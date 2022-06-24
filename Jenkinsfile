#!/bin/groovy
pipeline {
  agent {
    docker { image 'docker.osdc.io/node:14' }
  }
  stages {
    stage('Install') {
      steps {
        script {
		sh '''
			sudo chown -R 1100:1100 "/.npm"
  			npm config set proxy http://cloud-proxy:3128
  			npm config set https-proxy http://cloud-proxy:3128
  			npm install
		   '''
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
