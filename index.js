#! /usr/local/bin/node

const N26 = require('n26')

const myAccount = new N26('username', 'password')
  .then(account => account.transactions(/*{text: 'searchstring'}*/)
  .then(transactions => {
    console.log(transactions)
  }))
