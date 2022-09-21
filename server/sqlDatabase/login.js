function Login(email , password, callback , db){
    const sqlLgget = "Select user_id, role from users where email = ? and password = ?";
    db.query(sqlLgget, [email, password], (err, result) => {
    if (!result?.[0]) {
      //if there is no result
      callback(null , null)
    } else {
      callback(null , result); //send through data to store in session storage
    }
  });
  // return "error"
}

function FetchRole(email , callback , db){
  const sqlLgget = "Select user_id, role from users where email = ?";

  db.query(sqlLgget, [email], (err, result) => {

  if (!result?.[0]) {
    //if there is no result
    callback(null , null)
  } else {
    callback(null , result); //send through data to store in session storage
  }
});
// return "error"
}

module.exports= {Login, FetchRole};
