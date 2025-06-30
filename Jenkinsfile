pipeline {
  agent {
    docker {
      image 'node:22-alpine'
      args '-p 3000:3000'
    }
  }
  stages {
    stage('build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('deploy') {
      steps {
        sh 'ls -ll'
      }
    }

  }
}