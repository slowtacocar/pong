pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          securityContext:
            runAsUser: 0
          serviceAccountName: jenkins-agent
          containers:
          - name: docker
            image: docker:27.2-dind
            volumeMounts:
            - name: cert-volume
              mountPath: /etc/ssl/certs
              readOnly: true
            securityContext:
              privileged: true
          - name: kubectl
            image: bitnami/kubectl:1.27
            command:
            - cat
            tty: true
          volumes:
          - name: cert-volume
            hostPath:
              path: /etc/ssl/certs
              type: Directory
        '''
    }
  }

  environment {
    HARBOR = credentials('harbor')
  }

  stages {
    stage('Build') {
      steps {
        container('docker') {
          sh 'docker login cme-harbor.int.bobbygeorge.dev -u $HARBOR_USR -p $HARBOR_PSW'
          sh 'docker build -t pong --cache-to type=inline --cache-from type=registry,ref=cme-harbor.int.bobbygeorge.dev/pong/pong:$GIT_BRANCH --cache-from type=registry,ref=cme-harbor.int.bobbygeorge.dev/pong/pong:latest .'
          sh '! [ "$GIT_BRANCH" = "master" ] || docker tag pong cme-harbor.int.bobbygeorge.dev/pong/pong:latest'
          sh 'docker tag pong cme-harbor.int.bobbygeorge.dev/pong/pong:$GIT_BRANCH'
          sh 'docker tag pong cme-harbor.int.bobbygeorge.dev/pong/pong:$GIT_COMMIT'
          sh 'docker push -a cme-harbor.int.bobbygeorge.dev/pong/pong'
        }
      }
    }

    stage('Deploy Preview') {
      when {
        not {
          branch 'master'
        }
      }
      steps {
        container('kubectl') {
          sh 'TAG=$GIT_COMMIT NAMESPACE=pong-$(echo "$GIT_BRANCH" | tr \'[:upper:]\' \'[:lower:]\' | sed \'s/[^a-z0-9.-]//g\') DOMAIN=$(echo "$GIT_BRANCH" | tr \'[:upper:]\' \'[:lower:]\' | sed \'s/[^a-z0-9.-]//g\').pong.bobbygeorge.dev envsubst \'$TAG:$NAMESPACE:$DOMAIN\' < kubernetes.yaml | kubectl apply -f -'
        }
      }
    }
    stage('Deploy Prod') {
      when {
        branch 'master'
      }
      steps {
        container('kubectl') {
          sh 'TAG=$GIT_COMMIT NAMESPACE=pong DOMAIN=pong.bobbygeorge.dev envsubst \'$TAG:$NAMESPACE:$DOMAIN\' < kubernetes.yaml | kubectl apply -f -'
        }
      }
    }
  }
}
