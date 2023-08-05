import Dexie, { Table } from 'dexie';

export enum LogbookTemplate {
    GENERIC = 'Generic',
    POTA = 'POTA',
    SOTA = 'SOTA',
    SST = 'SST',
};


export interface Logbook {
    id?: number;
    name: string;
    callsign: string;
    template: LogbookTemplate;
}

export class LogbookDatabase extends Dexie {

    logbooks: Table<Logbook>;
    constructor() {
        super('logbookDatabase');
        this.version(1).stores({
            logbooks: '++id,name,callsign,template'
        });
        this.logbooks = this.table('logbooks');
    }
}

export const db = new LogbookDatabase();