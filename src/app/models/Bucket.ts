export class Bucket {
    name: string;
    capacity: number;
    currentVolume: number = 0;

    constructor(capacity: number, name: string) {
        this.name = name;
        this.capacity = capacity;   
    }

    fill(): void {
        this.currentVolume = this.capacity;
    }

    empty(): void {
        this.currentVolume = 0;
    }

    receiveTransfer(volumeReceived: number): void {
        this.currentVolume += volumeReceived;
        if(this.currentVolume > this.capacity) {
            this.currentVolume = this.capacity;
        }
    }

    transfer(volume: number): void {
        this.currentVolume -= volume;
        if(this.currentVolume < 0) {
            this.currentVolume = 0;
        }
    }

    isFull(): boolean {
        return this.currentVolume === this.capacity;
    }   

    isEmpty(): boolean {
        return this.currentVolume === 0;
    }   
    
}