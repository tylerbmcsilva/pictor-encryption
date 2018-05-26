const DB        = require('../database');
const Logger    = require('../logger');

/*Working*/
async function findOneFriend(id, friendId) {
  try {
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      'WHERE u.id=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    const user = await DB.query(qString, [friendId, id, id]);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/*Working*/
async function findFriends( id ) {
  try {
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    const users = await DB.query(qString, [id, id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/*Working*/
async function findNotFriends() {
  var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id FROM `user` u '+
    'WHERE u.id!=?) as notU '+
    'WHERE notU.id NOT IN '+
    '(SELECT r.receiver_id as `id` FROM `request` r '+
    'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
    'UNION SELECT r.sender_id FROM `request` r '+
    'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
  try {
    const users = await DB.query(qString, [id, id, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/*Working*/
async function sendFriendRequest( { receiver_id, sender_id }) {
  try {
    const results = await DB.query('INSERT INTO `request` SET ?',
      {receiver_id, sender_id});
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function acceptFriendRequest(receiver_id, sender_id) {
  try {
    const results = await DB.query('UPDATE `request` SET `req_accepted`=1 WHERE `receiver_id`=? AND `sender_id`=?',
      [receiver_id, sender_id]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

/*Working*/
async function deleteFriendRequest(uId, notUId) {
  try {
    var qString = 'DELETE FROM `request` ' +
      'WHERE (`receiver_id`=? AND `sender_id`=?) ' +
      'OR (`receiver_id`=? AND `sender_id`=?)';
    const results = await DB.query(qString,[uId, notUId, notUId, uId]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getSentRequests(id) {
  try {
    var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'WHERE notU.id IN'+
      '(SELECT r.receiver_id as `id`, r.date as `date` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=0 AND r.blocked=0)';
    const users = await DB.query(qString, [id, id]);
    console.log(user);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getReceivedRequests(id) {
  try {
    var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.sender_id as `id` FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=0 AND r.blocked=0 ';
    const users = await DB.query(qString, [id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getBlockedUsers(id) {
  try {
    var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.blocked=1 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.blocked=1);';
    const users = await DB.query(qString, [id, id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function blockUser(receiver_id, sender_id) {
  try {
    // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    const results = await DB.query('UPDATE `request` SET `blocked`=1 WHERE `receiver_id`=? AND `sender_id`=?',
      [receiver_id, sender_id]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function unblockUser(receiver_id, sender_id) {
  try {
        // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    const results = await DB.query('UPDATE `request` SET `blocked`=0 WHERE `receiver_id`=? AND `sender_id`=?',
      [receiver_id, sender_id]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

module.exports = {
  findFriends,
  findNotFriends,
  findOneFriend,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getReceivedRequests,
  getSentRequests
}
