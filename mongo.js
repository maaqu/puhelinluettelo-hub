const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

if (process.argv.length == 2) {
  Person
  .find({})
  .then(result => {
    console.log("puhelinluettelo:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length == 4) {

  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
    id: Number((Math.random()*10000000).toFixed(0))
  })

  person
  .save()
  .then(response => {
    console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
    mongoose.connection.close()
  })
}
