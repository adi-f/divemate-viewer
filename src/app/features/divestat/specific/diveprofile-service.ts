import { Injectable } from "@angular/core";

export enum AvaregeDeptCalculationMode {
    // Compute the full graph (including the end at the surface)
    FULL_RECORDED_DURATION='FULL_RECORDED_DURATION',
    // ignore time at the surface (also surface time in the middle of the dive)
    DONT_COUNT_SURFACE_TIME='DONT_COUNT_SURFACE_TIME',
    // truncate surface time at the end
    TRUNCATE_END_ONLY='TRUNCATE_END_ONLY'
}

@Injectable({
    providedIn: 'root'
})
export class DiveprofileService {

    computeAverageDepth(rawProfile: string, intervalSeconds: number, avaregeDeptCalculationMode: AvaregeDeptCalculationMode): {avgDepthMeters: number, diveTimeMinutes: number} {
        switch(avaregeDeptCalculationMode) {
            case AvaregeDeptCalculationMode.FULL_RECORDED_DURATION:
                return this.computeAverageDepth_FULL_RECORDED_DURATION(rawProfile, intervalSeconds);
            case AvaregeDeptCalculationMode.DONT_COUNT_SURFACE_TIME:
                return this.computeAverageDepth_DONT_COUNT_SURFACE_TIME(rawProfile, intervalSeconds);
            case AvaregeDeptCalculationMode.TRUNCATE_END_ONLY:
                return this.computeAverageDepth_TRUNCATE_END_ONLY(rawProfile, intervalSeconds);
            default:
                throw 'unknown AvaregeDeptCalculationMode: ' + avaregeDeptCalculationMode;
        }
    }


    private computeAverageDepth_FULL_RECORDED_DURATION(rawProfile: string, intervalSeconds: number): {avgDepthMeters: number, diveTimeMinutes: number} {
        let depthSumMeters = 0;
        let count = 0;
        for(const iterator = new ProfileIterator(rawProfile); iterator.hasMore(); iterator.next()) {
            const depthMeters = iterator.getDepthInMeters();
            depthSumMeters += depthMeters;
            count++;
        }
        return {
            avgDepthMeters: depthSumMeters / count,
            diveTimeMinutes: count * intervalSeconds / 60
        }
    }
 
    private computeAverageDepth_DONT_COUNT_SURFACE_TIME(rawProfile: string, intervalSeconds: number): {avgDepthMeters: number, diveTimeMinutes: number} {
        let depthSumMeters = 0;
        let count = 0;
        for(const iterator = new ProfileIterator(rawProfile); iterator.hasMore(); iterator.next()) {
            const depthMeters = iterator.getDepthInMeters();
            if(depthMeters > 0) {
                depthSumMeters += depthMeters;
                count++;
            }
        }
        return {
            avgDepthMeters: depthSumMeters / count,
            diveTimeMinutes: count * intervalSeconds / 60
        }
    }

    private computeAverageDepth_TRUNCATE_END_ONLY(rawProfile: string, intervalSeconds: number): {avgDepthMeters: number, diveTimeMinutes: number} {
        let depthSumMeters = 0;
        let count = 0;
        let countTemp = 0;
        for(const iterator = new ProfileIterator(rawProfile); iterator.hasMore(); iterator.next()) {
            const depthMeters = iterator.getDepthInMeters();
            if(depthMeters > 0) {
                depthSumMeters += depthMeters;
                count = (countTemp || count) + 1;
                countTemp = 0;
            } else {
                countTemp++
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