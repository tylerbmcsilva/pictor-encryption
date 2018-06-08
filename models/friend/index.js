const DB        = require('../database');
const Logger    = require('../logger');
const User      = require('../user');

/*Working*/
async function getUser({ id, friendId }) {
  try {
    const user        = await User.getOne({ id: friendId });
    const areFriends  = await usersAreFriends({ id, friendId });

    if(areFriends) {
      return user;
    } else {
      let { json_block, ...notFriendsUser } = user;
      return notFriendsUser;
    }
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function usersAreFriends({ id, friendId }) {
  const queryString = `
  SELECT r.id FROM \`request\` r
    WHERE (
      r.sender_id=${id}
      AND r.receiver_id=${friendId}
      AND r.req_accepted=1
      AND r.blocked=0
    ) OR (
      r.sender_id=${friendId}
      AND r.receiver_id=${id}
      AND r.req_accepted=1
      AND r.blocked=0
    );
  `;

  const [ req ] = await DB.query(queryString);

  return req ? true: false;
}


function normalize( user, posts, friends ) {
  return {
    id:     user.id,
    basic:  {
      name:   {
        first:  user.first_name,
        last:   user.last_name
      },
      email:    user.email,
      location: user.location
    },
    encrypted:  user.json_block ? JSON.parse(user.json_block) : '',
    posts:      user.json_block ? posts : '',
    friends:    user.json_block ? friends : ''
  }
}


/*Working*/
async function getFriends({ id }) {
  try {
    var queryString = `
      SELECT u.id, u.first_name, u.last_name FROM \`user\` u WHERE u.id IN (
        SELECT a.receiver_id as \`id\` FROM \`request\` a WHERE a.sender_id=${id} AND a.req_accepted=1 AND a.blocked=0
        UNION
        SELECT b.sender_id as \`id\` FROM \`request\` b WHERE b.receiver_id=${id} AND b.req_accepted=1 AND b.blocked=0
      );
    `;
    const users = await DB.query(queryString);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getNotFriends() {
  try {
    var queryString = `
      SELECT u.id, u.first_name, u.last_name FROM \`user\` u WHERE u.id NOT IN (
        SELECT r.receiver_id as \`id\`, r.req_accepted FROM \`request\` r WHERE r.sender_id=${id} AND r.blocked=0
        UNION
        SELECT r.sender_id as \`id\`, r.req_accepted FROM \`request\` r WHERE r.receiver_id=${id} AND r.blocked=0
      );
    `;

    const users = await DB.query(queryString);
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
    const queryString = `UPDATE \`request\` SET \`req_accepted\`=1 WHERE \`receiver_id\`=${receiver_id} AND \`sender_id\`=${sender_id}`;
    const results = await DB.query(queryString);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function deleteFriendRequest(uId, notUId) {
  try {
    var queryString = 'DELETE FROM `request` ' +
      'WHERE (`receiver_id`=? AND `sender_id`=?) ' +
      'OR (`receiver_id`=? AND `sender_id`=?)';
    const results = await DB.query(queryString,[uId, notUId, notUId, uId]);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getSentRequests(id) {
  try {
    var queryString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'JOIN '+
      '(SELECT r.receiver_id as `id`, r.date FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=0 AND r.blocked=0) as sReq ' +
      `ON sReq.id = notU.id;`;
    const users = await DB.query(queryString, [id, id]);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


/*Working*/
async function getReceivedRequests(id) {
  try {
    var queryString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id, u.location FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'JOIN '+
      '(SELECT r.sender_id as `id` FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=0 AND r.blocked=0) as rReq ' +
      `ON rReq.id = notU.id;`;
    const users = await DB.query(queryString, [id, id]);
    //Logger.debug(users);
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

/*Working*/
async function getBlockedUsers({ id }) {
  try {
    var queryString = `SELECT *
      FROM
        (SELECT u.first_name, u.last_name, u.id, u.location FROM \`user\` u WHERE u.id!=${id}) as notU
      WHERE notU.id IN
        (SELECT b.blockee_id as \`id\` FROM \`blocked\` b WHERE b.blocker_id=${id})`;
    const users = await DB.query(queryString);
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
    var queryString = 'INSERT INTO `request` SET `receiver_id`=?, `sender_id`=?, `blocked`=1 ' +
        'ON DUPLICATE KEY UPDATE `blocked`=1';
    const results = await DB.query(queryString, [uId, notUId]);
    const auxResults = await blockUserAux(uId, notUId);
    return auxResults;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function blockUserAux(uId, notUId) {
  try {
    // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    console.log(uId);
    console.log(notUId);
    var queryString = 'INSERT INTO `blocked` SET `blocker_id`=?, `blockee_id`=? ';
    const results = await DB.query(queryString, [uId, notUId]);
    Logger.error(uId);
    Logger.error(notUId);
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
    var queryString = 'DELETE FROM `request` ' +
      'WHERE (`receiver_id`=? AND `sender_id`=?) ' +
      'OR (`receiver_id`=? AND `sender_id`=?)';
    const results = await DB.query(queryString,
      [uId, notUId, notUId, uId ]);
    const auxResults = await unblockUserAux(uId, notUId);
    return auxResults;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function unblockUserAux(uId, notUId) {
  try {
    // needs to be changed to reflect situations where ids are swapped (see delete friend request query)
    var queryString = 'DELETE FROM `blocked` WHERE `blocker_id`=? AND `blockee_id`=? ';
    const results = await DB.query(queryString,[ uId, notUId ]);
    return results;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function getAllCurrentRequests({ id }) {
  try {
    const queryString = `
      SELECT u.id, u.first_name, u.last_name, r.receiver_id, r.sender_id FROM \`user\` u
      LEFT JOIN \`request\` r
        ON (
          (r.receiver_id=u.id AND r.sender_id=${id} AND r.req_accepted=0 AND r.blocked=0)
          OR
          (r.sender_id=u.id AND r.receiver_id=${id} AND r.req_accepted=0 AND r.blocked=0)
        )
    `;

    const results = await DB.query(queryString);
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
  getAllFriendsAndRequests,
  normalize
}
