const { cde_image } = require('./config')

exports.generatePodSettings = (options) => {

    const { name, username, password} = options
    return {
        apiVersion: "v1",
        kind: "Pod",
        metadata: {
            name: name,
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

exports.generateServiceSettings = ({ name }) => {

    return {
        apiVersion: "v1",
        kind: "Service",
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
            type: "NodePort"
        }
    }
    
}