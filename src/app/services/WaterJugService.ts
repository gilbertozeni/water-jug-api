import { injectable } from 'inversify';
import Logger from '../utils/Logger';
import Cache from '../utils/Cache';
import { Bucket } from '../models/Bucket';
import { Actions } from '../models/Actions';
import { Step } from '../models/Step';

@injectable()
class WaterJugService {

    private readonly logger = Logger.getLogger();
    private readonly cache = Cache.getCache();
    
    public async solve(x_capacity: number, y_capacity: number, z_amount_wanted: number): Promise<Step[]> {
        // X should be smaller than Y, if not swap them
        if(x_capacity > y_capacity) {
            let t = x_capacity;
            x_capacity = y_capacity;
            y_capacity = t;
        }

        if(!this.validateInput(x_capacity, y_capacity, z_amount_wanted)) {
            this.logger.error('The amount wanted is not possible to achieve.', { x_capacity, y_capacity, z_amount_wanted });
            return Promise.reject('The amount wanted is not possible to achieve');
        }

        // Create the two buckets
        const x_bucket = new Bucket(x_capacity);
        const y_bucket = new Bucket(y_capacity);

        let steps_first = this.solveChallenge(x_bucket, y_bucket, z_amount_wanted);
        let steps_second = this.solveChallenge(y_bucket, x_bucket, z_amount_wanted);
        
        if(steps_first.length < steps_second.length) {
            this.logger.info('The first solution has less steps' );
            return Promise.resolve(steps_first);
        } else {
            this.logger.info('The second solution has less steps');
            return Promise.resolve(steps_second);
        }
    }

    // Check if the amount wanted is possible to achieve
    private validateInput(x_capacity: number, y_capacity: number, z_amount_wanted: number): boolean {
        if(z_amount_wanted > y_capacity) {
            this.logger.info('The amount wanted is greater than the capacity of the greatest bucket.', { x_capacity, y_capacity, z_amount_wanted });
            return false;
        }

        const gcd = this.findGcd(x_capacity, y_capacity);
        if(z_amount_wanted % gcd !== 0) {
            this.logger.info('The amount wanted is not divisible by the greatest common divisor of the two buckets.', { x_capacity, y_capacity, z_amount_wanted });
            return false;
        }

        return true;
    }


    private solveChallenge(from: Bucket, to: Bucket, amount_wanted: number): Step[] {
        const cached = this.getFromCache(from.capacity, to.capacity, amount_wanted);
        if(cached) {
            return cached;
        }

        const steps = [];

        from.fill();
        steps.push({ bucketX: from.currentVolume, bucketY: to.currentVolume, action: Actions.FILL });
        
        while(from.currentVolume !== amount_wanted && to.currentVolume !== amount_wanted) {
            let temp = Math.min(from.currentVolume, to.capacity - to.currentVolume);

            to.receiveTransfer(temp);
            from.transfer(temp);
            steps.push({ bucketX: from.currentVolume, bucketY: to.currentVolume, action: Actions.TRANSFER });

            if(from.currentVolume === amount_wanted || to.currentVolume === amount_wanted) {
                break;
            }

            if(from.isEmpty()) {
                from.fill();
                steps.push({ bucketX: from.currentVolume, bucketY: to.currentVolume, action: Actions.FILL });
            }
            
            if(to.isFull()) {
                to.empty();
                steps.push({ bucketX: from.currentVolume, bucketY: to.currentVolume, action: Actions.EMPTY });
            }
        }
        this.saveToCache(from.capacity, to.capacity, amount_wanted, steps);
        return steps;
    }

    //auxiliary function to find the greatest common divisor
    private findGcd(a: number, b: number): number {
        if (b === 0) {
            return a;
        }
        return this.findGcd(b, a % b);
    }

    private getFromCache(x_capacity: number, y_capacity: number, z_amount_wanted: number): Step[] | undefined {
        const key = `${x_capacity}-${y_capacity}-${z_amount_wanted}`;
        if(this.cache.has(key)) {
            this.logger.info('Cache hit for key: ', {key});
            return this.cache.get(key);
        }
        return;
    }

    private saveToCache(x_capacity: number, y_capacity: number, z_amount_wanted: number, steps: Step[]): void {
        const key = `${x_capacity}-${y_capacity}-${z_amount_wanted}`;
        this.cache.set(key, steps);
    }
}

export default WaterJugService;