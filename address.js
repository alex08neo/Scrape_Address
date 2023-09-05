const axios = require('axios');
const fs = require('fs');
const writeXlsxFile = require('write-excel-file/node')
const HEADER_ROW = [
    {
      value: 'Address',
      fontWeight: 'bold'
    },
    {
      value: 'Postal code',
      fontWeight: 'bold'
    },
]

let data = [];
data.push(HEADER_ROW);
const country = "SG";
const access_key = "34dc45b986d65d01d7ce4f304cd77bd9";
let url = "http://api.positionstack.com/v1/forward?access_key=" + access_key + "&country=" + country + "&query=";

const get_address = async() => {
    const charset = "abcdefghijklmnopqrstuvwxuzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for(let i = 10; i < charset.length; i ++){
        for(let j = 0; j < charset.length; j ++)
            for(let k = 0; k < charset.length; k ++){
                try{
                    let addresses = [];
                    const address_response = await axios.get(url + charset[i] + charset[j] + charset[k]);
                    address_response.data.data.map(e => {if(e.postal_code != null && e.number != null && e.street != null){addresses.push([{value:e.number + " " + e.street + ", Singapore"}, {value:e.postal_code}])}});
                    if(addresses.length > 0){
                        data = data.concat(addresses);
                        await writeXlsxFile(data, {
                            filePath: './file.xlsx'
                        }).catch(err => console.log(err));
                    }
                    console.log(charset[i] + charset[j] + charset[k] + " : " + data.length)
                }catch{
                    continue;
                }
            }
    }
}
get_address();
