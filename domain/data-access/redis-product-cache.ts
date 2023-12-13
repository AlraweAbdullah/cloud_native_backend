import { createClient } from "redis";

interface RedisProxyInterface<T> {
  set: (key: string, value: T, options?: {}) => Promise<string>,
  get: (key: string) => Promise<T | null>,
  quit: () => Promise<string>,
  isOpen: boolean,
  isReady: boolean,
  connect: () => Promise<unknown>,
}

export class ProductCache {
  private static instance: ProductCache;

  private readonly cacheClient: RedisProxyInterface<string>; // Assuming value is serialized as a string

  private constructor(redisClient: RedisProxyInterface<string>) {
    if (!redisClient) {
      throw new Error("A Redis client is required.");
    }
    this.cacheClient = redisClient;
  }

  private static async createClient(): Promise<RedisProxyInterface<string>> {
    const cacheHostName = process.env.REDIS_HOST_NAME;
    const cachePassword = process.env.REDIS_ACCESS_KEY;
    const cachePort = process.env.REDIS_PORT;

    if (!cacheHostName) throw Error("REDIS_HOST_NAME is empty");
    if (!cachePassword) throw Error("REDIS_ACCESS_KEY is empty");

    const cacheConnection = createClient({
      url: `rediss://${cacheHostName}:${cachePort}`,
      password: cachePassword,
    });

    await cacheConnection.connect();
    return {
      set: (key: string, value: string, options?: {}) => cacheConnection.set(key, value, options),
      get: (key: string) => cacheConnection.get(key),
      quit: () => cacheConnection.quit(),
      isOpen: cacheConnection.isOpen,
      isReady: cacheConnection.isReady,
      connect: () => cacheConnection.connect(),
    };
  }

  static async getInstance() {
    if (!this.instance) {
      const cacheConnection = await this.createClient();
      this.instance = new ProductCache(cacheConnection);
    } else {
      if (!this.instance.cacheClient.isOpen || !this.instance.cacheClient.isReady) {
        try {
          await this.instance.cacheClient.connect();
        } catch (error) {
          console.error(error);
          this.instance = new ProductCache(await this.createClient());
        }
      }
    }
    return this.instance;
  }

  async quit() {
    await this.cacheClient.quit();
  }

  async cacheProduct(username: string, productId: string, productDetails: string) {
    // Include the username in the cache key
    const cacheKey = `${username}_${productId}`;
    await this.cacheClient.set(cacheKey, productDetails, { EX: 600 }); // Adjust the expiration time as needed
  }

  async getCachedProduct(username: string, productId: string): Promise<string | null> {
    // Include the username in the cache key
    const cacheKey = `${username}_${productId}`;
    return await this.cacheClient.get(cacheKey);
  }
}
