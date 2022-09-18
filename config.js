const dotenv = require('dotenv')

dotenv.config()

const {
    KUBECONFIG_PATH = '/kubeconfig',
    NAMESPACE = 'cde',
    CDE_IMAGE = 'moreillon/cde:20220916-1801'
} = process.env


exports.kubeconfig_path = KUBECONFIG_PATH
exports.namespace = NAMESPACE
exports.cde_image = CDE_IMAGE