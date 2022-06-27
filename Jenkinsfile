#!/bin/groovy

pipeline {
  agent { 
  docker { image 'node:16-alpine3.15' }
 }
library identifier: "jenkins-lib@master"
dockerPipeline{
    // temporary disable tests on feat branch to test Docker builds
    // testBranches = '(develop|master|release.*)'
}
}
