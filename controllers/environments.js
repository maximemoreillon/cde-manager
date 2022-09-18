const { api } = require('../k8s')
const { namespace } = require('../config')
const { generatePodSettings, generateServiceSettings } = require('../utils')
const CDE = require('../models/environment')



exports.create_item = async (req, res, next) => {
    try {

        const user_id = res.locals.user._id

        const {username, password, name} = req.body
        const newCde = await CDE.create({ name, user_id })

        const resource_name = `cde-${newCde._id}`

        const podSettings = generatePodSettings({ name: resource_name, username, password})
        const serviceSettings = generateServiceSettings({ name: resource_name })

        await api.createNamespacedPod(namespace, podSettings)
        await api.createNamespacedService(namespace, serviceSettings)

        // Todo:  PVC

        console.log(`Created CDE ${newCde._id}`)
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

        const { body: pod } = await api.readNamespacedPod(name, namespace)
        const { body: service } = await api.readNamespacedService(name, namespace)

        res.send({ ...cde.toObject(), service, pod})

    } catch (error) {
        next(error)
    }

}

exports.delete_item = async (req, res, next) => {
    try {
        const {_id} = req.params
        const deletedCde = await CDE.findByIdAndDelete(_id)
        const name = `cde-${_id}`

        await api.deleteNamespacedPod(name, namespace)
        await api.deleteNamespacedService(name, namespace)

        console.log(`Deleted CDE ${_id}`)
        res.send(deletedCde)
    } catch (error) {
        next(error)
    }
}