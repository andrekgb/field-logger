import Dexie, { Table } from 'dexie';

export enum LogbookTemplate {
    GENERIC = 'Generic',
    POTA = 'POTA',
    SOTA = 'SOTA',
    SST = 'SST',
};

// https://www.adif.org/100/adif_100.htm
// https://df3cb.com/ftdxrc/documentation/references/adif.php
export interface LogbookEntry {
    id?: number;
    logbookId: number;
    STATION_CALLSIGN: string;
    QSO_DATE: string;
    TIME_ON: string;
    CALL: string;
    BAND: string;
    MODE: string;
    RST_SENT: string;
    RST_RCVD: string;
    NAME?: string;
    QTH?: string;
    COMMENTS?: string;
    SRX?: string;
    STX?: string;
    STATE?: string;
    TX_PWR?: string;
    FREQ?: number;
    COMMENT?: string;
}

export interface Logbook {
    id?: number;
    name: string;
    callsign: string;
    template: LogbookTemplate;
}

export class LogbookDatabase extends Dexie {

    logbooks: Table<Logbook>;
    contacts: Table<LogbookEntry>;
    constructor() {
        super('logbookDatabase');
        this.version(1).stores({
            logbooks: '++id,name,callsign,template',
            contacts: '++id,logbookId,STATION_CALLSIGN,QSO_DATE,TIME_ON,CALL,BAND,MODE,RST_SENT,RST_RCVD,NAME,QTH,COMMENTS,SRX,STX,STATE,TX_PWR,FREQ,COMMENT'
        });
        this.logbooks = this.table('logbooks');
        this.contacts = this.table('contacts');
    }
}

export const db = new LogbookDatabase();