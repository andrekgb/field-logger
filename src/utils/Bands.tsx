export const bands = [
    {
        name: '160 Meters',
        frequencyStart: 1.8,
        frequencyEnd: 2.0,
        value: '160m',
    },
    {
        name: '80 Meters',
        frequencyStart: 3.5,
        frequencyEnd: 4.0,
        value: '80m',
    },
    {
        name: '60 Meters',
        frequencyStart: 5.0,
        frequencyEnd: 5.4,
        value: '60m',
    },
    {
        name: '40 Meters',
        frequencyStart: 7.0,
        frequencyEnd: 7.3,
        value: '40m',
    },
    {
        name: '30 Meters',
        frequencyStart: 10.1,
        frequencyEnd: 10.15,
        value: '30m',
    },
    {
        name: '20 Meters',
        frequencyStart: 14.0,
        frequencyEnd: 14.35,
        value: '20m',
    },
    {
        name: '17 Meters',
        frequencyStart: 18.068,
        frequencyEnd: 18.168,
        value: '17m',
    },
    {
        name: '15 Meters',
        frequencyStart: 21.0,
        frequencyEnd: 21.45,
        value: '15m',
    },
    {
        name: '12 Meters',
        frequencyStart: 24.89,
        frequencyEnd: 24.99,
        value: '12m',
    },
    {
        name: '10 Meters',
        frequencyStart: 28.0,
        frequencyEnd: 29.7,
        value: '10m',
    },
    {
        name: '6 Meters',
        frequencyStart: 50.0,
        frequencyEnd: 54.0,
        value: '6m',
    }
];


export const findBandByFrequency = (frequency: number) => {
    const band = bands.find((b) => frequency >= b.frequencyStart && frequency <= b.frequencyEnd);
    return band ? band : null;
}
