pipeline {
    agent any
    environment {
        IMAGE_NAME = "nova-admin-frontend:latest"
        CONTAINER_NAME = "nova-admin-frontend"
        HOST_PORT = "10082"
        CONTAINER_PORT = "10082"
    }
    stages {
        stage('拉取代码') {
            steps {
                checkout scm
            }
        }
        stage('构建 Docker 镜像') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }
        stage('重启容器') {
            steps {
                sh """
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} --restart=always ${IMAGE_NAME}
                """
            }
        }
    }
}