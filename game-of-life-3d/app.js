const express = require('express')
const app = express()
const path = require('path')

// manually adding in three to our path
app.use(express.static(__dirname + '/src'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

app.listen(3000, () =>
  console.log('Visit http://127.0.0.1:3000')
);