const DtcSdk = require('dtc-node-sdk');
const crypto = require('crypto');
const config = require('../config/config');
const logger = require('../config/logger');

const {
  blockchain: { fullNodeHost, solidityNodeHost, eventServerHost },
} = config;
const MAX_TIME_OUT = 10;
const users = require('../static/users.json');

async function sleep(ms) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
      clearTimeout(timeout);
    }, ms);
  });
}

const autoGenTxBot = {
  active: false,
  async start() {
    try {
      if (!this.active) {
        this.active = true;
        logger.info(`[BOT] Auto-gen Txs >> Start`);
        await this.checkConnection();
        await Promise.all(users.slice(0, 10).map((user, i) => this.autoGenTxs(user, i, Math.floor(Math.random() * 10))));
      }
    } catch (error) {
      logger.error(`[BOT] Start >> Error: ${error}`);
    }
  },
  stop() {
    if (this.active) {
      logger.info(`[BOT] Auto-gen Txs >> Stop`);
      this.active = false;
    }
  },
  destroy() {
    // burn all coin
    // empty users.json []
  },

  async autoGenTxs(user, i, ranIdx) {
    if (this.active) {
      if (ranIdx !== i) {
        const from = users[ranIdx];
        const to = users[users.length - 1 - ranIdx];
        const amount = Math.floor(Math.random() * 1e3) || 132;
        const sdk = new DtcSdk(fullNodeHost, solidityNodeHost, eventServerHost, from.privateKey);
        try {
          await sdk.dtc.sendTransaction(to.address, amount, {});
          // const receipt = await sdk.dtc.sendTransaction(to.address, amount, {});
          // console.log(`Transfer ${amount} from ${from.address} to ${to.address} successfully :>> `, receipt);
          await sleep((Math.random() * 3 + 3) * 1e3);
          await this.autoGenTxs(user, i, Math.floor(Math.random() * 10));
        } catch (error) {
          logger.error(`[BOT] Transfer ${amount} from ${from.address} to ${to.address} >> Error: ${error}`);
        }
      } else {
        await this.autoGenTxs(user, i, Math.floor(Math.random() * 10));
      }
    }
  },
  async checkConnection() {
    try {
      logger.info(`[BOT] Auto-gen Txs >> Check Connection`);
      let times = 0;
      const check = async () => {
        if (times < MAX_TIME_OUT) {
          const connection = await new DtcSdk(
            fullNodeHost,
            solidityNodeHost,
            eventServerHost,
            crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')
          ).isConnected();
          if (!connection) {
            throw new Error('Can not initialize connection');
          }
          if (!connection.fullNode) {
            await sleep(3 * 1000);
            times += 1;
            await check();
          }
        } else {
          throw new Error('Can not connect to blockchain');
        }
      };
      await check();
    } catch (error) {
      logger.error(`[BOT] Check Blockchain Connection >> Error: ${error}`);
    }
  },
};

module.exports = autoGenTxBot;
