import { Injectable } from "@angular/core";
import { DiveProfile, SqlService } from "src/app/shared/data/sql-service.service";
import { AvaregeDeptCalculationMode, DiveprofileService } from "./diveprofile-service";
import { Tank } from "src/app/shared/model";



@Injectable({
    providedIn: 'root'
})
export class AmvService {

    constructor(private sqlService: SqlService, private diveprofileService: DiveprofileService){}

    async calcutateAvarageAmvOverAllDives(avaregeDeptCalculationMode: AvaregeDeptCalculationMode): Promise<number> {
        const idsOfDivesToCalculateAmv: number[] = await this.sqlService.readAllDivesWithProfileAndTanks();
        let sumOfConsumedGasLitersAtSurface = 0;
        let totalDiveTimeMinutes = 0;

        for(const id of idsOfDivesToCalculateAmv) {
            const [profile, tanks] = await Promise.all([this.sqlService.readDiveProfile(id), this.sqlService.readTanksOfDive(id)]);
            const {avgDepthMeters, diveTimeMinutes} = this.diveprofileService.computeAverageDepth(profile.rawProfile, profile.intervalSeconds, avaregeDeptCalculationMode)
            const avgAbsolutePressuerBar = avgDepthMeters / 10 + 1;
            const consumedGasLiters = this.computeConsumedGasLiters(tanks);

            sumOfConsumedGasLitersAtSurface += consumedGasLiters / avgAbsolutePressuerBar;
            totalDiveTimeMinutes += diveTimeMinutes;

            // console.debug(`id=${id}, consumedGasLiters = ${consumedGasLiters}, avgDepthMeters=${avgDepthMeters}, diveTimeMinutes=${diveTimeMinutes}`)
        }
        
        return sumOfConsumedGasLitersAtSurface / totalDiveTimeMinutes;
    }

    private computeConsumedGasLiters(tanks: Tank[]): number {
        return tanks
            .map(tank => (tank.pressureStartBar - tank.pressureEndBar) * tank.sizeLiter)
            .reduce((a, b,) => a + b);
    }

}
