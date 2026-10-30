const fs = require("fs");
const crypto = require("crypto");

exports.encode_file = function (filePath) {  
  const encryptKey = global.KEY_DATA['DATA_ENCRYPT_KEY'];
  const plain = Buffer.from(fs.readFileSync(filePath), 'utf8');
  const padded = Buffer.concat([plain, Buffer.alloc((16 - (plain.length % 16)) % 16)]);
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(encryptKey, 'utf8'), null);
  cipher.setAutoPadding(false);
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final()]);
  fs.writeFileSync(filePath + ".enc", encrypted);
};

exports.encode_string = function (plainText) {
  
  const encryptKey = global.KEY_DATA['DATA_ENCRYPT_KEY'];
  const plain = Buffer.from(plainText, 'utf8');
  const padded = Buffer.concat([plain, Buffer.alloc((16 - (plain.length % 16)) % 16)]);
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(encryptKey, 'utf8'), null);
  cipher.setAutoPadding(false);
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final()]);
  return encrypted;
};


exports.decode_json = function (encrypted) {
  const encryptKey = global.KEY_DATA['DATA_ENCRYPT_KEY'];
  const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(encryptKey, 'utf8'), null);
  decipher.setAutoPadding(false);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  let end = decrypted.length;
  while (end > 0 && decrypted[end - 1] === 0) end--;
  return JSON.parse(decrypted.subarray(0, end).toString('utf8'));
};