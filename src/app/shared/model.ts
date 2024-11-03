export interface Dive {
    number: number;
    date: string;
    location: string;
    durationMinutes: number;
    depthMeters: number
}

export interface DiveSiteStat {
    id: number;
    name: string;
    country: string;
    count: number;
}

export interface DivesByCountry {
    country: string;
    count: number;
}

export interface CountStat {
    description: string;
    count: number;
}

export interface Buddy {
    id: number,
    firstName: string,
    lastName: string;
}

export interface Tank {
    pressureStartBar: number,
    pressureEndBar: number
    sizeLiter: number
}

export interface DecoStat {
    maxDecoDepthMeter: number,
    maxDecoWaitMinutesAtDepth: number
    maxDecoWaitAtDepthMeters: number
    maxTimeToSurfaceMinutes: number
}

export interface Record extends Dive {
    description: string
    value: string
}

export interface Records {
    maxDecoDepthMeter: number,
    maxDecoDepthDive: Dive
    maxDecoWaitMinutesAtDepth: number
    maxDecoWaitAtDepthMeters: number
    maxDecoWaitDiveAtMaxDepth: Dive
    maxTimeToSurfaceMinutes: number
    maxTimeToSurfaceDive: Dive
}

export interface Equipment {
    id: number;
    name: string;
  }

export interface EquipmentStat {
    numberOfDives: number,
    diveTimeHours: number,
    diveTimeMinutes: number,
  }

export type Histogram = HistogramYearStat[] & {maxPerYear?: number, maxPerMonth?: number}

export interface HistogramYearStat {
    year: number;
    count: number;
    isMax: boolean;
    months: HistogramMonthStat[];
}

export interface HistogramMonthStat {
    yearMonth: number;
    monthName: string;
    count: number;
    isMaxOfYear: boolean;
    isMaxOfAll: boolean;
}

export type DepthStatistics = {depthMeter: number, count: number}[] & {deepestDive?: Dive}
