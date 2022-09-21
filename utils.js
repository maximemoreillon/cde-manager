const { cde_image } = require('./config')

exports.generateDeploymentSettings = (options) => {

    const { name, username, password } = options


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
                            image: cde_image,
                            ports: [
                                {
                                    containerPort: 22
                                }
                            ],
                            // TODO: envFrom secret
                            env: [
                                {
                                    name: 'USERNAME',
                                    value: username,
                                },
                                {
                                    name: 'PASSWORD',
                                    value: password,
                                },
                            ]
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
                    port: 22,
                }
            ],
            selector: {
                app: name
            },
            type: 'NodePort'
        }
    }
    
}