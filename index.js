const axios = require('axios');
const fs = require('fs');

const api_key = "fe9b9120-d4aa-11ed-943d-4d6b88580c2d";
const country_code = "AU";
const url_getstatebycountrycode = "https://app.zipcodebase.com/api/v1/country/province?country=" + country_code + "&apikey=" + api_key;
const url_getpostalcodesbystate = "https://app.zipcodebase.com/api/v1/code/state?country=" + country_code + "&apikey=" + api_key + "&state_name=";
let postal_code = [];

const get_state = async() => {
    const state_response = await axios.get(url_getstatebycountrycode);
    const state = state_response.data.results;
    console.log(state);
    for(let i = 0; i < state.length; i ++){
        let state_name = state[i];
        state_name = state_name.replaceAll(" ", "%20");
        try{
            const code_response = await axios.get(url_getpostalcodesbystate + state_name);
            postal_code = postal_code.concat(code_response.data.results);
            console.log(state_name + " : " + code_response.data.results.length);
        }catch{
            console.log(state_name + " : Error");
            continue;
        }
    }
    fs.writeFile('./' + country_code + '_postalcodes.txt', postal_code.toString(), err => {
        if (err) {
          console.error(err);
        }
        console.log("Finished");
    });
}
get_state();
