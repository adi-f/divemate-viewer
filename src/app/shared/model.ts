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