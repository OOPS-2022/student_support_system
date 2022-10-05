
function addCheckList(callback, db){
    const sqlGetId ="SELECT check_id FROM checklist ORDER BY check_id DESC LIMIT 1"; //get last  created checklist id
    db.query(sqlGetId, (err, result) => {
        callback(null, result[0]);
        console.log(err);
    // console.log(result[0])
    });
}

function addCheckListQuestion(checklist_id, session_id, question_details, callback ,db){
    const sqlGetId ="SELECT question_number FROM checklist WHERE check_id = ? AND session_id = ? ORDER BY question_number DESC LIMIT 1"; //get last  created checklist id
    db.query(sqlGetId, [checklist_id, session_id], (err, result) => {
        // console.log(result);
        let question_num;
        if (result.length == 0) {
            question_num = 1;
        } 
        else {
            question_num = result[0].question_number + 1;
        }

        const sqlInsert ="Insert into checklist (check_id, question_number, question_details, session_id) values (?, ?, ?, ?)";
        db.query(sqlInsert, [checklist_id, question_num, question_details, session_id], (err, result) => {
            if (err != null) {
                callback(err, null)
            }else{
                callback(null, 200)
            }
            }
        );
    });
}

function allCheckListQuestions(session_id, checklist_id, callback , db){
    const sqlGetId ="SELECT * FROM checklist WHERE session_id = ? AND check_id = ?";
    db.query(sqlGetId, [session_id, checklist_id], (err, result) => {
      callback(null,result);
    });
}

function CheckLists(callback, db){
    const sqlSelect ="select check_id, question_number, question_details,session_id from checkList";
    db.query(sqlSelect, (error, result) => {
        callback(null,result);
    });
}

function updateCheckListQuestion(question_details, checklist_id, question_num, session_id, callback , db){
    const sqlUpdate ="Update checklist set question_details = ? where check_id = ? AND question_number= ? AND session_id = ?";
    db.query(sqlUpdate, [question_details, checklist_id, question_num, session_id], (err, result) => {
        if (err != null) {
            callback(err, null)
        }else{
            callback(null, 200);
        }
      }
    );
}

function deleteCheckListQuestion(checklist_id, question_num, session_id, callback , db){
    const sqlSelect ="Delete from checklist where check_id = ? AND question_number= ? AND session_id = ?";
    db.query(sqlSelect, [checklist_id, question_num, session_id], (err, result) => {
        if (err == null) {
          console.log("deleted");
          callback(null,200);
        }
      }
    );
}

function viewCheck_id(session_id, callback , db){
    const sqlSelect ="select distinct check_id from checklist WHERE session_id = ?";
    db.query(sqlSelect, [session_id], (error, result) => {
        callback(null,result);
    });
}

function getChecklistAns(callback , db){
    const sqlQuerry ="select users.name, users.surname, users.organization_nr, filledchecklist.checklist_id, filledchecklist.stu_id, filledchecklist.question_number, filledchecklist.checked, checklist.session_id from filledchecklist, checklist, users where filledchecklist.checklist_id = checklist.check_id and checklist.question_number = filledchecklist.question_number and users.user_id=filledchecklist.stu_id order by session_id, stu_id;";
    
    db.query(sqlQuerry, (error, result) => {
        callback(null,result);
    });
}

function studentChecklistAnswers(checkID, studentID,questions, answers, callback , db){
    const sqlInsert="Insert into filledchecklist (checklist_id, stu_id, question_number, checked) values (?,?,?,?)";
    
    for (let i=0; i<questions.length;i++){
      db.query(sqlInsert, [checkID, studentID,questions[i], answers[i]], (err,result)=>{
        if (err!=null){
            callback(err, null)
        }
      })
      callback(null,200);
    }
}

function checklistForSession(sessionId , callback , db){
    const sqlSelect='SELECT * from checklist where session_id=?';
    db.query(sqlSelect, [sessionId], (err,result)=>{
      if (err!=null){
        callback(err, null)
      }
      else{
        callback(null,result);
      }
    })
}

module.exports= {checklistForSession, studentChecklistAnswers, getChecklistAns,viewCheck_id,deleteCheckListQuestion, updateCheckListQuestion,CheckLists,allCheckListQuestions,addCheckList,addCheckListQuestion};
