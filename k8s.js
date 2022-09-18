const k8s = require('@kubernetes/client-node')
const { kubeconfig_path } = require('./config')
const kc = new k8s.KubeConfig()
kc.loadFromFile(kubeconfig_path)

const api = kc.makeApiClient(k8s.CoreV1Api)

exports.api = api