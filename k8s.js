const k8s = require('@kubernetes/client-node')
const { kubeconfig_path } = require('./config')

const kc = new k8s.KubeConfig()
kc.loadFromFile(kubeconfig_path)

const api = kc.makeApiClient(k8s.CoreV1Api)
const appsApi = kc.makeApiClient(k8s.AppsV1Api)


exports.api = api
exports.appsApi = appsApi