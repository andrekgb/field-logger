import {QSO} from "../model/db.tsx";
import moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdifExporter {
    contacts: QSO[];

    constructor(contacts: QSO[]) {
        this.contacts = contacts;
        console.log('contacts', contacts);
    }

    exportToAdif(): string {
        let adifString = "";

        for (const contact of this.contacts) {
            adifString += this.contactToAdifString(contact);
        }

        console.log('adifString', adifString);
        return adifString;
    }

    private contactToAdifString(contact: QSO): string {

        const qso_date =  moment(contact.date).format("YYYYMMDD");
        const time_on = moment(contact.date).format("HHmm");

        // Format the contact data as an ADIF record
        let str = `
<adif_ver:5>3.1.0
<call:${contact.callsign.length}>${contact.callsign}
<qso_date:${qso_date.length}>${qso_date}
<time_on:${time_on.length}>${time_on}
<band:${contact.band.length}>${contact.band}
<mode:${contact.mode.length}>${contact.mode}
<rst_sent:${contact.rstSent.length}>${contact.rstSent}
<rst_rcvd:${contact.rstReceived.length}>${contact.rstReceived}
`;
        if(contact.frequency) {
            str += `<freq:${contact.frequency.toString().length}>${contact.frequency}`;
        }

        const adifRecord = `${str}
<eor>
`;

        return adifRecord;
    }
}

