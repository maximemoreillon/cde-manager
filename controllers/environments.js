const { api, appsApi } = require('../k8s')
const { namespace } = require('../config')
const { v4: uuidv4 } = require('uuid')

const { 
    generateServiceSettings, 
    generateDeploymentSettings,
    generateSecretSettings,
    generatePvcSettings
} = require('../utils')



exports.create_item = async (req, res, next) => {
    try {

        const user_id = res.locals.user._id

        const resource_name = `cde-${ uuidv4() }`

        const { username, password } = req.body


        const k8sResourceOptions = { name: resource_name, username, password, user_id }

        // Generate JSON version of the manifests
        const secretSettings = generateSecretSettings(k8sResourceOptions)
        const pvcSettings = generatePvcSettings(k8sResourceOptions)
        const deploymentSettings = generateDeploymentSettings(k8sResourceOptions)
        const serviceSettings = generateServiceSettings(k8sResourceOptions)

        
        await api.createNamespacedSecret(namespace, secretSettings)
        await api.createNamespacedPersistentVolumeClaim(namespace, pvcSettings)
        await appsApi.createNamespacedDeployment(namespace, deploymentSettings)
        await api.createNamespacedService(namespace, serviceSettings)

        res.send({ _id: resource_name })

    } catch (error) {
        next(error)
    }
}

exports.get_items = async (req, res, next) => {
    try {


        const {_id: user_id, isAdmin} = res.locals.user

        const labelSelector = isAdmin ? undefined : `user_id=${user_id}`

        const { body: {items}} = await appsApi.listNamespacedDeployment(namespace, undefined, undefined, undefined, undefined, labelSelector)

        res.send(items)

        // res.send(cdes)
    } catch (error) {
        next(error)
    }

}

exports.get_item = async (req, res, next) => {
    try {
        const { _id: name} = req.params
        
        const { body: deployment } = await appsApi.readNamespacedDeployment(name, namespace)
        const { body: service } = await api.readNamespacedService(name, namespace)

        res.send({ service, deployment })

    } catch (error) {
        next(error)
    }

}

exports.delete_item = async (req, res, next) => {
    try {
        const { _id: name } = req.params

        await appsApi.deleteNamespacedDeployment(name, namespace)
        await api.deleteNamespacedService(name, namespace)
        await api.deleteNamespacedSecret(name, namespace)
        await api.deleteNamespacedPersistentVolumeClaim(name, namespace)


        res.send(req.params)
    } catch (error) {
        next(error)
    }
}