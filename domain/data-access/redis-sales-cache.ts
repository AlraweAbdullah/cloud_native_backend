import { createClient } from "redis";

interface RedisProxyInterface<T> {
    set: (key: string, value: T, options?: {}) => Promise<string>,
    get: (key: string) => Promise<T | null>,
    quit: () => Promise<string>,
    isOpen: boolean,
    isReady: boolean,
    connect: () => Promise<unknown>,
}

export class SalesCache {
    private static instance: SalesCache;

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
        return cacheConnection;

    }

    static async getInstance() {
        if (!this.instance) {
            const cacheConnection = await this.createClient();
            this.instance = new SalesCache(cacheConnection);
        } else {
            if (!this.instance.cacheClient.isOpen || !this.instance.cacheClient.isReady) {
                try {
                    await this.instance.cacheClient.connect();
                } catch (error) {
                    console.error(error);
                    this.instance = new SalesCache(await this.createClient());
                }
            }
        }
        return this.instance;
    }

    async quit() {
        await this.cacheClient.quit();
    }
    async cacheSales(username: string, SalesId: string, productDetails: string) {
        // Include the username and Sales ID in the cache key
        const cacheKey = `${username}_${SalesId}`;
        await this.cacheClient.set(cacheKey, productDetails, { EX: 10 }); // Adjust the expiration time as needed
    }

    async getCachedSales(username: string, SalesId: string): Promise<string | null> {
        // Include the username and Sales ID in the cache key
        const cacheKey = `${username}_${SalesId}`;
        return await this.cacheClient.get(cacheKey);
    }
}
