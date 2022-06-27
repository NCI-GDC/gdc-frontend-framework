#!/bin/groovy
library identifier: "jenkins-lib@master"
pipeline {
  agent { 
  docker { image 'node:16-alpine3.15' }
 }
dockerPipeline{
    // temporary disable tests on feat branch to test Docker builds
    // testBranches = '(develop|master|release.*)'
}
}
