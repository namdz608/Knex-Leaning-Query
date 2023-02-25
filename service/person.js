const knex = require('../db/db')

class PersonService {
  //POST Person
  createPerson = async (data) => {
    const [id] = await knex('person').insert({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name
    }).returning('id')

    return id
  }

  //GET LIST
  getAllPerson = async (filter, sort) => {
    let persons = {}
    let obj = Object.keys(filter)
    let paginate = 0;
    if (!sort) {
      sort = {}
      sort.id = "desc"
    }

    if (filter.filter === undefined) {
      console.log('abc');
    }

    //DATA PER PAGE
    if (filter.filter) {
      if (filter.filter.page) {
        let abc = parseInt(filter.filter.page)
        if (abc >= 1) {
          paginate = (abc - 1) * 3
        }
      }
    }
    let number = await knex.select('*').from('person')
    if (obj.length === 0) {
      let data = await knex.select('*').from('person').limit(3).offset(1)
        .orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      persons = {
        data: data,
        pagination: {
          page: 1,
          totalPage: Math.round(number.length / 3)
        }
      }
    }
    else {
      let data = await knex('person')
        .where((qb) => {
          if (filter.filter !== undefined && filter.filter.more !== undefined) {
            Object.keys(filter.filter.more).forEach(value => {
              Object.values(filter.filter.more).forEach(element => {
                qb.where(value, '>', element)
              })
            })
          }
          if (filter.filter !== undefined && filter.filter.less !== undefined) {
            Object.keys(filter.filter.less).forEach(value => {
              Object.values(filter.filter.less).forEach(element => {
                qb.where(value, '<', element)
              })
            })
          }
          if (filter.email) {
            qb.where('email', 'ilike', `%${filter.email}%`);
          }

          if (filter.first_name) {
            qb.where('first_name', 'ilike', `%${filter.first_name}%`);
          }

          if (filter.search) { //SEARCH QUERY
            let text = filter.search.toLowerCase()
            qb.whereRaw(`LOWER(first_name) LIKE ?`, [`%${text}%`])
              .orWhereRaw(`LOWER(last_name) LIKE ?`, [`%${text}%`])
              .orWhereRaw(`LOWER(email) LIKE ?`, [`%${text}%`])
          }
        }).limit(3).offset(paginate).orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`);
      let count = await knex('person')
        .where((qb) => {
          if (filter.email) {
            qb.where('email', 'like', `%${filter.email}%`);
          }

          if (filter.first_name) {
            qb.where('first_name', 'like', `%${filter.first_name}%`);
          }

          if (filter.search) {
            let text = filter.search.toLowerCase()
            qb.whereRaw(`LOWER(first_name) LIKE ?`, [`%${text}%`]).orWhereRaw(`LOWER(last_name) LIKE ?`, [`%${text}%`])
              .orWhereRaw(`LOWER(email) LIKE ?`, [`%${text}%`])
          }
        });
      let totalPage = Math.ceil(count.length / 3)
      if (totalPage <= 0) {
        totalPage = 1
      }
      persons = {
        data: data,
        pagination: {
          totalPage: totalPage,
          page: paginate / 3 + 1
        }
      }
    }
    return persons;
  }
}

module.exports = new PersonService()