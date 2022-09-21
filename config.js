const dotenv = require('dotenv')

dotenv.config()

const {
    KUBECONFIG_PATH = '/kubeconfig',
    NAMESPACE = 'cde',
    CONTAINER_IMAGE = 'moreillon/cde:20220916-1801',
    CONTAINER_PORT = 22,
    PVC_SIZE = '10Gi',
} = process.env


exports.kubeconfig_path = KUBECONFIG_PATH
exports.namespace = NAMESPACE
exports.container_image = CONTAINER_IMAGE
exports.pvc_size = PVC_SIZE
exports.container_port = Number(CONTAINER_PORT)