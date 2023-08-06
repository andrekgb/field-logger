import Dexie, { Table } from 'dexie';

export enum LogbookTemplate {
    GENERIC = 'Generic',
    POTA = 'POTA',
    SOTA = 'SOTA',
    SST = 'SST',
}

export interface QSO {
    id?: number;
    logbookId: number;
    callsign: string;
    date: Date;
    frequency?: number;
    band: string;
    mode: string;
    rstSent: string;
    rstReceived: string;
    name?: string;
    qth?: string;
    comments?: string;
}

export interface Logbook {
    id?: number;
    name: string;
    callsign: string;
    template: LogbookTemplate;
    qsoCount?: number;
}

export class LogbookDatabase extends Dexie {
    logbooks: Table<Logbook, number>;
    qsos: Table<QSO, number>;
    constructor() {
        super('fieldlogger');
        this.version(1).stores({
            logbooks: '++id,name,callsign,template,qsoCount',
            qsos: '++id,logbookId,callsign,date,frequency,band,mode,rstSent,rstReceived,name,qth,comments'
        });
        this.logbooks = this.table('logbooks');
        this.qsos = this.table('qsos');
    }

    async insertLogbook(logbook: Logbook): Promise<number> {
        logbook.qsoCount = 0;
        return await this.logbooks.add(logbook);
    }

    async updateLogbook(logbook: Logbook): Promise<void> {
        await this.logbooks.put(logbook);
    }

    async deleteLogbook(id: number): Promise<void> {
        await this.logbooks.delete(id);
        await this.qsos.where('logbookId').equals(id).delete();
    }

    async insertQSO(qso: QSO): Promise<number> {
        const qsoId = await this.qsos.add(qso);
        await this.logbooks.update(qso.logbookId, {qsoCount: await this.qsos.where('logbookId').equals(qso.logbookId).count()});
        return qsoId;
    }

    async updateQSO(qso: QSO): Promise<void> {
        await this.qsos.put(qso);
    }

    async deleteQSO(id: number, logbookId: number): Promise<void> {
        await this.qsos.delete(id);
        await this.logbooks.update(logbookId, {qsoCount: await this.qsos.where('logbookId').equals(logbookId).count()});
    }
}

export const db = new LogbookDatabase();