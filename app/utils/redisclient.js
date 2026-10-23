class RedisClient {
  constructor(redisClient) {
    if (!redisClient) {
      throw new TypeError('redisClient is required');
    }

    this.client = redisClient;
  }

  getConn() {
    return this.client;
  }

  async getValue(key) {
    try {
      const value = await this.client.get(key);
      return { err: 0, reply: value, data: value };
    } catch (err) {
      return { err: err, reply: undefined, data: undefined };
    }
  }

  async setValue(key, value, expire) {
    try {
      const options = Number.isFinite(Number(expire)) && Number(expire) > 0
        ? { EX: Number(expire) }
        : undefined;
      const reply = options
        ? await this.client.set(key, value, options)
        : await this.client.set(key, value);

      return { err: 0, reply: reply };
    } catch (err) {
      return { err: err, reply: undefined };
    }
  }

  async setExpire(key, expire) {
    try {
      const reply = await this.client.expire(key, expire);
      return { err: 0, reply: reply };
    } catch (err) {
      return { err: err, reply: undefined };
    }
  }

  async testredis() {
    return this.setValue('testnode', '12345667');
  }

  async allkeys() {
    return this.allkeysAsync();
  }

  async allkeysAsync() {
    try {
      const keys = await this.client.keys('*');
      return { err: 0, reply: keys };
    } catch (err) {
      return { err: err, reply: undefined };
    }
  }

  async getkeys(key) {
    try {
      const keys = await this.client.keys(key);
      return { err: 0, reply: keys };
    } catch (err) {
      return { err: err, reply: undefined };
    }
  }

  async delkey(key) {
    try {
      const reply = await this.client.del(key);
      return { err: 0, reply: reply };
    } catch (err) {
      return { err: err, reply: undefined };
    }
  }

  async close() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}

module.exports = RedisClient;
