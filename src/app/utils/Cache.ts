import NodeCache from 'node-cache'

class Cache {

    private nodeCache: NodeCache
    private static instance: Cache

    private constructor() {
        // Initialize the cache with a default TTL of 3600 seconds
        this.nodeCache = new NodeCache({ stdTTL: 3600 });
    }

    public static getCacheInstance(){
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance
    }

    public static getCache(){
        let _cache = Cache.getCacheInstance()
        return _cache.nodeCache

    }
}

export default Cache;