pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/TRIOSYS-Software/expense-request-management-frontend', branch: 'features')
        echo 'hello world'
      }
    }

    stage('build') {
      steps {
        sh 'ls -ll'
      }
    }

  }
}