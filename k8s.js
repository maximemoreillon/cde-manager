const k8s = require('@kubernetes/client-node')

const kc = new k8s.KubeConfig()
kc.loadFromFile('./kubeconfig')

const api = kc.makeApiClient(k8s.CoreV1Api)

exports.api = api