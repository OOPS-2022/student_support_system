const  database = require( './sqlDatabase/database.js');
const makeApp = require('./index');
const app = makeApp(database);  // !! put db  //require("./server/index"); //server\index.js

// const app = require("./index");

app.listen(3001, () => {
    console.log("running on port 3001");
  });