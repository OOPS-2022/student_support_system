function viewPledges(callback , db){
    const sqlSelect ="select pledge_id, pledge_name, pledge_desc, pledge_type from pledges";
    db.query(sqlSelect, (error, result) => {
        if (error != null) {
            callback(error , null)
        }else{
            callback(null, result);
        }
    });
}

function viewFile(id , callback , db){
    const sqlSelect = "select pledge_link from pledges where pledge_id = ?"; //link where pledge is saved
        db.query(sqlSelect, [id], (error, result) => {
        if (error != null) {
            callback(error , null)
        }else{
            callback(null, result);
        }
    })
}

function createSignedPledge(name, desc, type, saveLink, sessions , callback , db){
    const sqlInsert ="INSERT INTO pledges (pledge_name, pledge_desc, pledge_type, pledge_link) VALUES (?,?,?,?);"; // insert into pledges table
        db.query(sqlInsert, [name, desc, type, saveLink], (err, res) => {
        if (err != null) {
            console.log(err);
            callback(err , null)
        } else {
            const sqlSelectPledge ="SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
            db.query(sqlSelectPledge, (err, result) => {
                if (err != null) {
                    console.log(err);
                    callback(err , null)
                } else {
                    let pledge_id = result[0].pledge_id;
                    const sqlInsertSesLink ="Insert into session_link (session_id, pledge_id) values (?,?)";
                    for (let j = 0; j < sessions.length; j++) {
                        db.query(sqlInsertSesLink,[sessions[j], pledge_id],(err, result) => {
                            if (err != null) {
                                callback(err , null)
                            }else{
                                callback(null, 200);
                            }
                        });
                    }
                }
            });
        }
    });
}

function createClickedPledge(name, desc, pledge_type ,sessions, callback , db){
    const sqlInsert = "INSERT INTO pledges (pledge_name, pledge_desc, pledge_type) VALUES (?,?,?);";
    db.query(sqlInsert, [name, desc, pledge_type], (error, result) => {
        if (error != null) {
            callback(error , null)
        } 
        else {
            const sqlSelectPledge ="SELECT pledge_id FROM pledges ORDER BY pledge_id DESC LIMIT 1";
            db.query(sqlSelectPledge, (err, result) => {
                if (err != null) {
                    callback(err , null)
                } 
                else {
                    let pledge_id = result[0].pledge_id;
                    const sqlInsertSesLink ="Insert into session_link (session_id, pledge_id) values (?,?)";
                    for (let j = 0; j < sessions.length; j++) {
                        db.query(sqlInsertSesLink,[sessions[j], pledge_id],(err, result) => {
                            if (err != null) {
                                callback(err , null)
                            }else{
                                callback(null, 200);
                            }
                        });
                    }
                }
            });
        }
    });
}

function pledgeType(testID , callback , db){
    sqlSelect ="SELECT pledge_type, pledge_desc FROM tests left join pledges on tests.pledge_id=pledges.pledge_id where test_id=?;";
    db.query(sqlSelect, [testID], (error, result) => {
        if (error != null) {
            callback(error , null)
        }else{
            callback(null, result[0]);
        }
    });
}


module.exports= {pledgeType,createClickedPledge, viewFile, createSignedPledge, viewPledges};
