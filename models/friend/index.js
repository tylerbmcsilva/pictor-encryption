const DB        = require('../database');
const Logger    = require('../logger');

/*Working*/
async function getUser({ id, friendId }) {
  try {
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      'WHERE u.id=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    const [ user ] = await DB.query(qString, [friendId, id, id]);
    return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getFriends({ id }) {
  try {
    var qString = `
      SELECT u.id, u.first_name, u.last_name FROM \`user\` u WHERE u.id IN (
        SELECT a.receiver_id as \`id\` FROM \`request\` a WHERE a.sender_id=${id} AND a.req_accepted=1 AND a.blocked=0
        UNION
        SELECT b.sender_id as \`id\` FROM \`request\` b WHERE b.receiver_id=${id} AND b.req_accepted=1 AND b.blocked=0
      );
    `;
    const users = await DB.query(qString);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getNotFriends() {
  try {
    var qString = `
      SELECT u.id, u.first_name, u.last_name FROM \`user\` u WHERE u.id NOT IN (
        SELECT r.receiver_id as \`id\`, r.req_accepted FROM \`request\` r WHERE r.sender_id=${id} AND r.blocked=0
        UNION
        SELECT r.sender_id as \`id\`, r.req_accepted FROM \`request\` r WHERE r.receiver_id=${id} AND r.blocked=0
      );
    `;

    const users = await DB.query(qString);
    return users;
  } catch (error) {
    Logger.error(error);
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


/*Working*/
async function acceptFriendRequest(receiver_id, sender_id) {
  try {
    const qString = `UPDATE \`request\` SET \`req_accepted\`=1 WHERE \`receiver_id\`=${receiver_id} AND \`sender_id\`=${sender_id}`;
    const results = await DB.query(qString);
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


/*Working*/
async function getSentRequests(id) {
  try {
    var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'JOIN '+
      '(SELECT r.receiver_id as `id`, r.date FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=0 AND r.blocked=0) as sReq ' +
      `ON sReq.id = notU.id;`;
    const users = await DB.query(qString, [id, id]);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getReceivedRequests(id) {
  try {
    var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'JOIN '+
      '(SELECT r.sender_id as `id` FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=0 AND r.blocked=0) as rReq ' +
      `ON rReq.id = notU.id;`;
    const users = await DB.query(qString, [id, id]);
    //Logger.debug(users);
    return users;
  } catch (error) {
    Logger.error(error);
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
    Logger.debug(users);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/* Working */
async function blockUser(uId, notUId) {
  try {
    // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    var qString = 'UPDATE `request` SET `blocked`=1 '  +
      'WHERE (`receiver_id`=? AND `sender_id`=?) ' +
      'OR (`receiver_id`=? AND `sender_id`=?)';
    const results = await DB.query(qString,
      [uId, notUId, notUId, uId ]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


/* Working */
async function unblockUser(uId, notUId) {
  try {
    // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    var qString = 'UPDATE `request` SET `blocked`=0 ' +
      'WHERE (`receiver_id`=? AND `sender_id`=?) ' +
      'OR (`receiver_id`=? AND `sender_id`=?)';
    const results = await DB.query(qString,
      [uId, notUId, notUId, uId ]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getAllCurrentRequests({ id }) {
  try {
    const qString = `
      SELECT u.id, u.first_name, u.last_name, r.receiver_id, r.sender_id FROM \`user\` u
      LEFT JOIN \`request\` r
        ON (
          (r.receiver_id=u.id AND r.sender_id=${id} AND r.req_accepted=0 AND r.blocked=0)
          OR
          (r.sender_id=u.id AND r.receiver_id=${id} AND r.req_accepted=0 AND r.blocked=0)
        )
    `;

    const results = await DB.query(qString);
    return results;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getAllFriendsAndRequests({ id }){
  try {
    var friends         = await getFriends({ id });
    var currentRequests = await getAllCurrentRequests({ id });

    return {
      friends,
      currentRequests
    };
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


module.exports = {
  getFriends,
  getNotFriends,
  getUser,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getReceivedRequests,
  getSentRequests,
  getAllFriendsAndRequests
}
