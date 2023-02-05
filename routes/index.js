const express=require('express')
const personCOntroller=require('../controllers/person')

const router=express.Router();
router.post('/person',personCOntroller.createPerson)
router.get('/person/list',personCOntroller.getAllPerson)

module.exports=router