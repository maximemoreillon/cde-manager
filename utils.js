const { 
    container_image, 
    container_port,
    container_volume_mount_path,
    pvc_size,
} = require('./config')

exports.generateDeploymentSettings = (options) => {

    const { 
        name, 
        username, 
        user_id,
    } = options


    return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: name,
            labels: {
                user_id: user_id
            }
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
                                    containerPort: Number(container_port)
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
                                    mountPath: container_volume_mount_path.replace('$username', username),
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


exports.generateServiceSettings = (options) => {

    const { name, user_id } = options

    return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name: name,
            labels: {
                user_id: user_id
            }
        },
        spec: {
            ports: [
                {
                    name: 'primary',
                    port: Number(container_port),
                },
                // {
                //     name: 'dev',
                //     port: 8080,
                // },
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