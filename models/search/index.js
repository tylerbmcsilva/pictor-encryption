const DB = require('../database');
const metaphone = require('metaphone');

async function searchFriends( id , sounds_like) {
  try {
    const full = "%"+sounds_like+"%"
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      "WHERE u.id!=? AND sounds_like like ?) as notU "+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    console.log(qString);
    const users = await DB.query(qString, [id, full, id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function searchNotFriends(id, sounds_like) {
  const full = "%"+sounds_like+"%"
  console.log(full); 
  var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id FROM `user` u '+
    "WHERE u.id!=? AND sounds_like like '?') as notU "+
    'WHERE notU.id NOT IN '+
    '(SELECT r.receiver_id as `id` FROM `request` r '+
    'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
    'UNION SELECT r.sender_id FROM `request` r '+
    'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
  try {
    const users = await DB.query(qString, [id, full, id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


function updateSounds(){
  //get everyone elses not reviewed by user
  DB.query("SELECT * FROM user", function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }

    for (var i in rows) {
      var name = rows[i].first_name + " " + rows[i].last_name;
      var sounds_like = metaphone(name);
      DB.query("UPDATE `user` SET `sounds_like`=? WHERE id=?", [sounds_like, rows[i].id])
    }
});
}


module.exports = {
  searchFriends,
  searchNotFriends,
  updateSounds
}
