export interface Dive {
    number: number;
    date: string;
    location: string;
    durationMinutes: number;
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