#! /usr/local/bin/node

const N26 = require('n26')
const fs = require('fs')

const auth = JSON.parse(fs.readFileSync('./auth.json', 'utf8'))

const myAccount = new N26(auth.username, auth.password)
  .then(account => account.transactions() // {text: 'searchstring'}
  .then(transactions => {
    transactions = transactions.slice(0,6)
    let items = transactions.map(trans => {
      return {
        'title': `${trans.amount}€ ${trans.merchantName}`,
        'subtitle': `${trans.createdTS}`
      }
    })
    console.log(JSON.stringify(toAlfred(items)))
  }))

function toAlfred(items) {
  return {
    'items': items
  }
}
