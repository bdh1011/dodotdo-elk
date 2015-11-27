var crypto = require('crypto');
function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
module.exports = function (id, license) {
  let hash = sha256(`${license.status}${license.uid}${license.type}${license.expiry_date_in_millis}${id}`);
  return hash === license.hkey;
};
