const { Router } = require('express')

const {
    get_pods,
    get_pod,
    create_pod,
    delete_pod
} = require('../controllers/pods.js')


const router = Router()


router.route('/')
    .get(get_pods)
    .post(create_pod)

router.route('/:_id')
    .get(get_pod)
    .delete(delete_pod)




module.exports = router
