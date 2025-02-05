export class PRNG {
    constructor(seed) {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.state = 1; // Default nonzero state
        this.initialize(seed);
    }
    async initialize(seed) {
        this.state = typeof (seed) === 'number' ? seed : await this.sha256ToSeed(seed);
    }
    async sha256ToSeed(seed) {
        const encoder = new TextEncoder();
        const data = encoder.encode(seed);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // Convert first 4 bytes of SHA-256 hash to a 32-bit integer
        return ((hashArray[0] << 24) |
            (hashArray[1] << 16) |
            (hashArray[2] << 8) |
            hashArray[3]) >>> 0; // Ensure it's unsigned
    }
    next() {
        this.state |= 0;
        this.state = (this.state + 0x6D2B79F5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
