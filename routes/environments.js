const { Router } = require('express')

const {
    get_items,
    get_item,
    create_item,
    delete_item
} = require('../controllers/environments.js')


const router = Router()


router.route('/')
    .post(create_item)
    .get(get_items)

router.route('/:_id')
    .get(get_item)
    .delete(delete_item)




module.exports = router
