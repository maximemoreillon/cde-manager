const dotenv = require('dotenv')

dotenv.config()

const {
    KUBECONFIG_PATH = '/kubeconfig',
    NAMESPACE = 'cde',
    CONTAINER_IMAGE = 'moreillon/cde:20220916-1801',
    CONTAINER_PORT = 22,
    CONTAINER_VOLUME_MOUNT_PATH = '/mnt/data',
    PVC_SIZE = '10Gi',
} = process.env


exports.kubeconfig_path = KUBECONFIG_PATH
exports.namespace = NAMESPACE
exports.container_image = CONTAINER_IMAGE
exports.pvc_size = PVC_SIZE
exports.container_volume_mount_path = CONTAINER_VOLUME_MOUNT_PATH
exports.container_port = CONTAINER_PORT