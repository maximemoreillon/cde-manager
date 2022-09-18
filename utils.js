const {api} = require('./k8s')

exports.generatePodSettings = ({name}) => {


    return {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
            "name": name,
            "labels": {
                "app": name
            }
        },
        "spec": {
            "containers": [
                {
                    "name": name,
                    "image": "nginx",
                    "ports": [
                        {
                            "containerPort": 80
                        }
                    ]
                }
            ]
        }
    }
    
}

exports.generateServiceSettings = ({ name }) => {


    return {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": name
        },
        "spec": {
            "ports": [
                {
                    "port": 80,
                    // "nodePort": "${K8S_SERVICE_PORT}"
                }
            ],
            "selector": {
                "app": name
            },
            "type": "NodePort"
        }
    }
    
}