// Jan 1st 1970 00:00:00 am 
// javascript is stored in miliseconds

const moment = require('moment');

// let date = moment().lang('pt');
// date.add(12, 'years').subtract(6,'months');
// console.log(date.format('Do MMM YYYY'));

let date = moment().lang('pt');
console.log(date.format('hh:mm a'));