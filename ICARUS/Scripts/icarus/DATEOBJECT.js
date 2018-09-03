﻿class DATEOBJECT {
    constructor() {

    }

    /**
     * This should be a class...  But anyways,
     * Generates a generic Date object for print
     * @param {Date} dateObj A Javascript Date object
     * @returns {Object} A broken down set of date values that should actually be a class
     */
    getDateObject(dateObj) {
        //console.log('getDateObject');
        // splits the string to array ie: ["2014-05-10", "22:00:00.000Z"]
        let d = dateObj.toISOString().split('T');

        // Splits the date ie: ['2014','05','10']
        let dd = d[0].split('-');

        // Splits the time ie: ['22','00','00.000Z']
        let t = d[1].split(':');
        let tt = t[2].split('.');

        return {
            'date': d[0],
            'year': dd[0],
            'month': dd[1],
            'day': dd[2],
            'time': t[0] + ':' + t[1] + ':' + tt[0],
            'hour': t[0],
            'minute': t[1],
            'second': tt[0],
            'millisecond': tt[1].replace('Z', '')
        };
    }

}