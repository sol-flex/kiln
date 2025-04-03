const kiln_api = ""
const host = "https://api.testnet.kiln.fi/v1"
import fs from 'fs';  // Import the fs module

// Need to
// -get 50 Kiln validators
// -get 50 non-Kiln validators
// Each cluster should have one withdrawal credential, this means that
//I'm not really sure how to find one address which has 50 validators that are Kiln and 50 validators that are not-Kiln
// You can compare this Kiln depositor address: 0x7fF0B7D8b99E4cD685355A786B6ad5287B6552C1 with the one that's non-Kiln


import { Kiln } from '@kilnfi/sdk';
import axios from 'axios'

const getStakes = async (currPage) => {

    let current_page = currPage

    let stakes = [];

    const params = {
        wallets: '0x195104dD1d3648141f42B85Fa4Fef6F9879825aa',
        // "withdrawal_credentials": "0x91CcA1b774350232391d337213C0dE544DF1Ed75",
        page_size: '100',
        current_page: current_page,
        // scope: "kiln",
        filter_states: "active_exiting",
        include_eigenlayer: "false"
    };

    while(params.current_page < 10) {
        const res = await axios.get(`${host}/eth/stakes`, {
            headers: {
                'Authorization': `Bearer ${kiln_api}`
            },
            params: params
        })
    
        // console.log(res.data)

        stakes = stakes.concat(res.data.data)
        console.log("Current page: ", params.current_page)
        console.log("Next page: ", res.data.pagination.next_page)
        params.current_page = res.data.pagination.next_page

    }

    // console.log(stakes)
    const kilnStakes = stakes.filter(validator => {

        const activatedBefore = new Date("2024-09-15T22:52:48Z");
        const exitedAfter = new Date("2024-12-15T22:52:48Z")

        return new Date(validator.activated_epoch) <= activatedBefore && new Date(validator.exited_at) >= exitedAfter

    })
    
    // console.log(kilnStakes)
    const fiftyValidators = kilnStakes.slice(0, 50);
    let commaSeparatedString = ""

    for(const validator of fiftyValidators) {
        commaSeparatedString = commaSeparatedString + validator.validator_address + ","
    }
    console.log(fiftyValidators)
    console.log(commaSeparatedString)

    fs.writeFileSync('nonKilnValidators.json', JSON.stringify(fiftyValidators, null, 2), 'utf-8');
    return fiftyValidators;

}

getStakes(1);