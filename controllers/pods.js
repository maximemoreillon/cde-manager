const { api } = require('../k8s')
const { namespace } = require('../config')
const { generatePodSettings, generateServiceSettings } = require('../utils')
const CDE = require('../models/cde')



exports.create_pod = async (req, res, next) => {
    try {
        const properties = req.body
        const newCde = await CDE.create(properties)

        const name = `cde-${newCde._id}`

        const podSettings = generatePodSettings({ name })
        const serviceSettings = generateServiceSettings({ name })

        await api.createNamespacedPod(namespace, podSettings)
        await api.createNamespacedService(namespace, serviceSettings)

        // Todo:  PVC

        console.log(`Created Pod ${newCde._id}`)
        res.send(newCde)
    } catch (error) {
        next(error)
    }
}

exports.get_pods = async (req, res, next) => {
    try {
        const cdes = await CDE.find({})

        res.send(cdes)
    } catch (error) {
        next(error)
    }

}

exports.get_pod = async (req, res, next) => {
    try {
        const { _id } = req.params
        const cde = await CDE.findById(_id)
        const name = `cde-${_id}`

        const { body: pod } = await api.readNamespacedPod(name, namespace)
        const { body: service } = await api.readNamespacedService(name, namespace)
        res.send({...cde, service, pod})
    } catch (error) {
        next(error)
    }

}

exports.delete_pod = async (req, res, next) => {
    try {
        const {_id} = req.params
        const deletedCde = await CDE.findByIdAndDelete(_id)
        const name = `cde-${_id}`

        await api.deleteNamespacedPod(name, namespace)
        await api.deleteNamespacedService(name, namespace)

        console.log(`Deleted Pod ${_id}`)
        res.send(deletedCde)
    } catch (error) {
        next(error)
    }
}