const PersonService = require('../service/person')

class PersonController {
    createPerson = async (req, res) => {
        try {
            const id = PersonService.createPerson(req.body)
            res.status(201).json(id)
        } catch (e) {
            print(e)
        }
    }

    getAllPerson = async (req, res) => {
        try {
            const filter = req.query;
            const persons = await PersonService.getAllPerson(filter)
            res.status(200).json(persons)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new PersonController();