const { Op } = require('sequelize')
let instance

DB.getInstance = function () {
  if (instance == null) {
    instance = new DB()
  }
  return instance
}

function DB() {}

//get the list
DB.prototype._get = async (
  model,
  option = {},
  projection = {},
  selection = [],
  includes = [],
  group = [],
  having = '',
  distinct = false,
  col = '',
  subquery = true,
  deletedAt = true,
) => {
  try {
    let query = { where: { deletedAt: null } }
    if (!deletedAt) query = {}
    if (!subquery) query['subquery'] = false

    let perpage = 10

    if (selection.length > 0) query['attributes'] = selection
    if (group.length > 0) query['group'] = group
    if (having) query['having'] = having

    query['where'] = whereClause(projection, query)

    if (option.page_number) {
      if (option.records_per_page) perpage = option.records_per_page
      query['limit'] = perpage
      query['offset'] = perpage * (option.page_number - 1)
    }
    if (distinct) query['distinct'] = true
    if (col) query['col'] = col

    if (includes.length > 0) query['include'] = includes

    if (option.sort) query['order'] = option.sort
    else if (group.length == 0) query['order'] = [['updatedAt', 'DESC']]
    console.log(query)
    return await model.findAndCountAll(query)
  } catch (error) {
    throw error
  }
}

//insert in bulk or single
DB.prototype._add = async (model, data) => {
  try {
    if (Array.isArray(data)) return await model.bulkCreate(data)
    else return await model.create(data)
  } catch (error) {
    if (error['errors'] && error['errors'][0]) {
      throw error['errors'][0]['message']
    } else {
      throw error
    }
  }
}

//Update
DB.prototype._update = async (model, data, projection = {}) => {
  try {
    let query = !!Object.keys(projection).length
      ? { where: whereClause(projection) }
      : {}

    await model.update(data, query).then((newItem) => {
      return newItem
    })
  } catch (error) {
    if (error['errors'] && error['errors'][0]) {
      throw error['errors'][0]['message']
    } else {
      throw error
    }
  }
}

//Search with count
DB.prototype._findByCount = async (
  model,
  projection = {},
  selection = [],
  includes = [],
  limit = 0,
) => {
  try {
    let query = {}
    query['where'] = whereClause(projection, query)
    if (selection.length > 0) {
      query['attributes'] = selection
    }
    if (limit != 0) query['limit'] = parseInt(limit)
    if (includes.length > 0) query['include'] = includes
    return await model.findAll(query)
  } catch (error) {
    console.log(error)
    throw error
  }
}

//Serach
DB.prototype._find = async (
  model,
  projection = {},
  selection = [],
  includes = [],
) => {
  try {
    let query = { where: { deletedAt: null } }
    query['where'] = whereClause(projection, query)
    if (selection.length > 0) {
      query['attributes'] = selection
    }
    if (includes.length > 0) query['include'] = includes
    return await model.findOne(query)
  } catch (error) {
    console.log(error)
    throw error
  }
}

//get count
DB.prototype._count = async (model, projection = {}) => {
  try {
    let query = { where: { deletedAt: null } }
    query['where'] = whereClause(projection, query)
    return await model.count(query)
  } catch (error) {
    console.log(error)
    throw error
  }
}

//create or update single
DB.prototype._createOrUpdate = async (model, projection = {}, newItem) => {
  try {
    let query = { where: { deletedAt: null } }
    query['where'] = whereClause(projection, query)

    return await model.findOne(query).then((foundItem) => {
      if (!foundItem) {
        return model.create(newItem).then((item) => {
          return item
        })
      }
      return model.update(newItem, query).then((newItem) => {
        return newItem
      })
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

//Delete with Where condition
DB.prototype.delete = async (model, projection = {}) => {
  try {
    let query = !!Object.keys(projection).length ? whereClause(projection) : {}
    await model.update({ deletedAt: new Date() }, { where: query })
  } catch (error) {
    console.log(error)
    throw error
  }
}

const whereClause = (projection, query = {}) => {
  let q = { ...query['where'] }
  if (!!Object.keys(projection).length) {
    for (let [key, value] of Object.entries(projection)) {
      if (Array.isArray(value) && !!Object.keys(value).length) {
        if (key == 'and') q[Op.and] = value
        if (key == 'or') q[Op.or] = value
      } else q[key] = value
    }
  }
  return q
}

module.exports = DB