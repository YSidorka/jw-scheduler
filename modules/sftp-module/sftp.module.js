const SFTPClient = require('ssh2-sftp-client');

async function _connectSFTP({ host, port, username, privateKey }) {
  try {
    const config = { host, port, username, privateKey };

    const client = new SFTPClient();
    await client.connect(config);
    console.log('SFTP connected...');
    return client;
  } catch (err) {
    console.log('Error connectSFTP:', err);
    return null;
  }
}

async function _closeSFTP(client) {
  try {
    await client.end();
    console.log('SFTP connection closed');
    // eslint-disable-next-line no-param-reassign
    client = null;
  } catch (err) {
    console.log('Error closeSFTP:', err);
  }
}

async function copyFileFromSFTP({ host, port, username, privateKey, pathIn, pathOut }) {
  let client;
  try {
    const sftpOptions = {
      host,
      port,
      username,
      privateKey
    };

    client = await _connectSFTP(sftpOptions);

    const isExists = await client.exists(pathIn);
    if (!isExists) throw new Error(`Unavailable path: ${pathIn}`);

    await client.fastGet(pathIn, pathOut);
    await _closeSFTP(client);
    return true;
  } catch (err) {
    console.log('Error copyFilefromSFTP:', err.message);
    await _closeSFTP(client);
    return false;
  }
}

module.exports = {
  copyFileFromSFTP
};
