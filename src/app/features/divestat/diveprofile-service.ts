import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DivestatService {
 
    computeAverageDepth(rawProfile: string, intervalSeconds: number): {avgDepthMeters: number, diveTimeMinutes: number} {
        let depthSumMeters = 0;
        let count = 0;
        for(const iterator = new ProfileIterator(rawProfile); iterator.hasMore(); iterator.next()) {
            const depthMeters = iterator.getDepthInMeters();
            if(depthMeters > 0) { // don't count at the surface
                depthSumMeters += depthMeters;
                count++;
            }
        }
        return {
            avgDepthMeters: depthSumMeters / count,
            diveTimeMinutes: count * intervalSeconds / 60
        }
    }
}

// see profile-format.md
class ProfileIterator {

    private position: number = 0;

    constructor(private rawProfile: string) {}

    next(): void {
       this.position += 12;
        
    }

    hasMore(): boolean {
        return this.position < this.rawProfile.length;
    }

    getDepthInMeters(): number {
        const decimeters = this.rawProfile.substring(this.position, this.position + 4);
        return parseInt(decimeters, 10) / 10;
    }
}