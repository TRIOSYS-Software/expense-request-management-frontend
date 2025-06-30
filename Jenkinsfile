pipeline {
  agent any
  stages {
    stage('build') {
      agent any
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