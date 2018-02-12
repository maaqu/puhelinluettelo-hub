const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  },
]

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/api/persons', (req, res) => {
  Person
  .find({}, {__v: 0})
  .then(persons => {
    res.json(persons.map(formatPerson))
  })
  .catch(error => {
    console.log(error)
    response.status(404).end()
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(formatPerson(person))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(savedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  const date = Date()
  const info = `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${date}</pt>`
  res.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
