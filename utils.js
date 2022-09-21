const { 
    container_image, 
    container_port,
    pvc_size,
} = require('./config')

exports.generateDeploymentSettings = (options) => {

    const { name, username } = options


    return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: name,
        },
        spec: {
            replicas: 1,
                selector: {
                matchLabels: {
                        app: name
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: name
                    }
                },
                spec: {
                    containers: [
                        {
                            name: name,
                            image: container_image,
                            ports: [
                                {
                                    containerPort: container_port
                                }
                            ],
                            envFrom: [
                                {
                                    secretRef: {
                                        name: name
                                    }
                                }
                            ],
                             volumeMounts: [
                                 {
                                    mountPath: `/home/${username}/data`,
                                    // mountPath: `/config`, // For code-server
                                    name: name
                                 }
                            ]
                        }
                    ],
                     volumes: [
                        {
                            name: name,
                            persistentVolumeClaim: {
                                claimName: name,
                            }
                        }
                    ]
                }
            }
        }
    }
}


exports.generateServiceSettings = ({ name }) => {

    return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name: name
        },
        spec: {
            ports: [
                {
                    port: container_port,
                }
            ],
            selector: {
                app: name
            },
            type: 'NodePort'
        }
    }
    
}


exports.generateSecretSettings = (options) => {

    const { name, username, password } = options


    return  {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
            name: name
        },
        type: 'Opaque',
        stringData: {

            USERNAME: username,
            PASSWORD: password,

            // Code-server stuff
            PUID: '1000',
            PGID: '1000',
            TZ: 'Asia/Tokyo',
            SUDO_PASSWORD: password,

        }
    }
    
}



exports.generatePvcSettings = (options) => {

    const { name } = options


    return {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
            name: name
        },
        spec: {
            accessModes: [
                'ReadWriteMany'
            ],
            resources: {
                requests: {
                    storage: pvc_size
                }
            }
        }
    }

}