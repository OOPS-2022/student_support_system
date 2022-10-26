const  database = require( './sqlDatabase/database.js');
const makeApp = require('./index');
const app = makeApp(database);  // !! put db  //require("./server/index"); //server\index.js
// const Bree =require("bree");

// const bree= new Bree({
//   jobs: [{
//     name: 'sendReminder',
//     cron: '0 8 * * *', //0th minute of 8th hour everyday every month
//     worker: {
//       workerData: {
//         description: "This will send a daily reminder to remind students of their schedules"
//       }
//     }
//   }]
// })

// bree.start();

// const app = require("./index");

app.listen(3001, () => {
    console.log("running on port 3001");
  });