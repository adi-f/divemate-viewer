import { Injectable } from "@angular/core";
import { DecoStat } from "src/app/shared/model";

export enum AvaregeDeptCalculationMode {
    // Compute the full graph (including the end at the surface)
    FULL_RECORDED_DURATION='FULL_RECORDED_DURATION',
    // ignore time at the surface (also surface time in the middle of the dive)
    DONT_COUNT_SURFACE_TIME='DONT_COUNT_SURFACE_TIME',
    // truncate surface time at the end (method of Divemate)
    TRUNCATE_END_ONLY='TRUNCATE_END_ONLY'
}

@Injectable({
    providedIn: 'root'
})
export class DiveprofileService {

    getMaxDeco(rawProfile4: string): DecoStat | null {
        let maxDecoDepthMeter = 0;
        let maxDecoWaitMinutesAtDepth = 0;
        let maxDecoWaitAtDepthMeters = 0;
        let maxTimeToSurfaceMinutes = 0;

        for(const iterator = new Profile4Iterator(rawProfile4); iterator.hasMore(); iterator.next()) {
            const decoInfo = iterator.getDecoInfo();
            if(decoInfo.isDeco) {
                maxDecoDepthMeter = Math.max(maxDecoDepthMeter, decoInfo.decoDepthMeter);
                maxTimeToSurfaceMinutes = Math.max(maxTimeToSurfaceMinutes, decoInfo.timeToSurfaceMinutes);

                if(maxDecoWaitMinutesAtDepth < decoInfo.decoWaitMinutes) {
                    maxDecoWaitMinutesAtDepth = decoInfo.decoWaitMinutes;
                    maxDecoWaitAtDepthMeters = decoInfo.decoDepthMeter;
                }
            }
        }

        if(maxDecoDepthMeter > 0) {
            return {
                maxDecoDepthMeter,
                maxDecoWaitMinutesAtDepth,
                maxDecoWaitAtDepthMeters,
                maxTimeToSurfaceMinutes,
            }
        } else {
            return null;
        }
    }
    
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

// see profile-format.md
class Profile4Iterator {

    private position: number = 0;

    constructor(private rawProfile4: string) {}

    next(): void {
       this.position += 9;
        
    }

    hasMore(): boolean {
        return this.position < this.rawProfile4.length;
    }

    getDecoInfo(): ZerotimeValue|DecoValue {
        const timeToSurfaceMinutes = this.getTimeToSurfaceMinutes();
        const decoWaitMinutes = this.getDecoWaitMinutes();
        const decoDepthMeter = this.getDecoDepthMeter();

        if(decoDepthMeter === 0) {
            return {
                isDeco: false,
                remainingZerotimeMinutes: decoWaitMinutes
            };
        } else {
            return {
                isDeco: true,
                timeToSurfaceMinutes,
                decoWaitMinutes,
                decoDepthMeter
            };
        }
    }

    private getTimeToSurfaceMinutes(): number {
        const minutes = this.rawProfile4.substring(this.position, this.position + 3);
        return parseInt(minutes, 10);
    }

    private getDecoWaitMinutes(): number {
        const minutes = this.rawProfile4.substring(this.position + 3, this.position + 6);
        return parseInt(minutes, 10);
    }

    private getDecoDepthMeter(): number {
        const minutes = this.rawProfile4.substring(this.position + 7, this.position + 9);
        return parseInt(minutes, 10);
    }

}

interface ZerotimeValue {
    isDeco: false;
    remainingZerotimeMinutes: number;
}

interface DecoValue {
    isDeco: true;
    timeToSurfaceMinutes: number;
    decoWaitMinutes: number;
    decoDepthMeter: number;
}