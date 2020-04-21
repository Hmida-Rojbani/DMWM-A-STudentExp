const bcrypt = require('bcrypt');

async function  test(){
    const salt = await bcrypt.genSalt(10);
    const hash  = await bcrypt.hash('1234',salt);
    const hash1_2  = await bcrypt.hash('1234',salt);

    console.log('salt : ',salt);
    console.log('hash : ',hash);
    console.log('hash1_2 : ',hash1_2);

    const salt2 = await bcrypt.genSalt(10);
    const hash2  = await bcrypt.hash('1234',salt2);

    console.log('salt : ',salt2);
    console.log('hash : ',hash2);

    const test = await bcrypt.compare('1234',hash2);
    console.log('test :',test);
}

test();