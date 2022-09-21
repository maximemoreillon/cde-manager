const { api, appsApi } = require('../k8s')
const { namespace } = require('../config')
const { 
    generateServiceSettings, 
    generateDeploymentSettings,
    generateSecretSettings,
    generatePvcSettings
} = require('../utils')
const CDE = require('../models/environment')



exports.create_item = async (req, res, next) => {
    try {

        const user_id = res.locals.user._id

        const {username, password, name} = req.body
        const newCde = await CDE.create({ name, user_id })

        const resource_name = `cde-${newCde._id}`

        const k8sResourceOptions = { name: resource_name, username, password }

        const secretSettings = generateSecretSettings(k8sResourceOptions)
        const pvcSettings = generatePvcSettings(k8sResourceOptions)
        const deploymentSettings = generateDeploymentSettings(k8sResourceOptions)
        const serviceSettings = generateServiceSettings(k8sResourceOptions)

        console.log(deploymentSettings.spec.template.spec.containers[0])
        
        await api.createNamespacedSecret(namespace, secretSettings)
        console.log(`Secret ${resource_name} created`)
        await api.createNamespacedPersistentVolumeClaim(namespace, pvcSettings)
        console.log(`PVC ${resource_name} created`)
        await appsApi.createNamespacedDeployment(namespace, deploymentSettings)
        console.log(`Deployment ${resource_name} created`)
        await api.createNamespacedService(namespace, serviceSettings)
        console.log(`Service ${resource_name} created`)

        res.send(newCde)
    } catch (error) {
        next(error)
    }
}

exports.get_items = async (req, res, next) => {
    try {

        const user_id = res.locals.user._id

        const cdes = await CDE.find({ user_id })

        res.send(cdes)
    } catch (error) {
        next(error)
    }

}

exports.get_item = async (req, res, next) => {
    try {
        const { _id } = req.params
        const cde = await CDE.findById(_id)
        const name = `cde-${_id}`

        
        const { body: deployment } = await appsApi.readNamespacedDeployment(name, namespace)
        const { body: service } = await api.readNamespacedService(name, namespace)

        res.send({ ...cde.toObject(), service, deployment })

    } catch (error) {
        next(error)
    }

}

exports.delete_item = async (req, res, next) => {
    try {
        const {_id} = req.params
        const deletedCde = await CDE.findByIdAndDelete(_id)
        const name = `cde-${_id}`

        await appsApi.deleteNamespacedDeployment(name, namespace)
        await api.deleteNamespacedService(name, namespace)
        await api.deleteNamespacedSecret(name, namespace)
        await api.deleteNamespacedPersistentVolumeClaim(name, namespace)


        console.log(`Deleted CDE ${_id}`)
        res.send(deletedCde)
    } catch (error) {
        next(error)
    }
}