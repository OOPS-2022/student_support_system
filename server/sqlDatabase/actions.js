function myActions(userID, callback,db){
    const sqlSelect ='select * from actions where student_id=? and seen="false";';
    db.query(sqlSelect, [userID], (err, result) => {
      if (err != null) {
        console.log(err);
        callback(err, null);
      } 
      else {
        callback(null, result);
      }
    });
}

function viewAction(actionId, callback , db){
    const sqlUpdate = "Update actions set seen='true' where action_id=?";
    db.query(sqlUpdate, [actionId], (err, result) => {
      if (err != null) {
        console.log(err)
        callback(err, null);
      }
      callback(null, result);
    })
}

module.exports= {myActions, viewAction};
