/**
 * Script used for generating flow metadata
 * that gets written to a JS file
 */

const requestPromise = require('request-promise');
const fsp = require('fs-promise');
const argv = require('yargs').argv;

(() => {

    const ARGS = ['username', 'password', 'tenant', 'flow'];

    let envArgs = [];
    for (let key in argv) {
        if (argv.hasOwnProperty(key)) {
            envArgs.push(key)
        }
    }        

    const checkArgs = ARGS.filter(val => !envArgs.includes(val));
    if(checkArgs.length > 0) {
        console.error("ERROR - Missing the arguments: " + checkArgs.join());
        process.exit(1);
    }

    const baseUrl = argv.baseUrl || "https://flow.manywho.com";
    let authenticationToken = null;
    let tenantId = null;
    
    return requestPromise({
        method: "POST",
        uri: baseUrl + "/api/draw/1/authentication",
        body: {
            "loginUrl": baseUrl + "/plugins/manywho/api/draw/1/authentication",
            "username": argv.username,
            "password": argv.password
        },
        headers: {
            'ManyWhoTenant': 'da497693-4d02-45db-bc08-8ea16d2ccbdf'
        },
        json: true
    })
    .then((token) => {
        return requestPromise({
            method: "GET",
            uri: baseUrl + "/api/draw/1/authentication/" + argv.tenant,
            headers: {
                'authorization': token,
            }
        });
    })
    .then((token) => {
        authenticationToken = token.replace('"', '');

        return requestPromise({
            method: "GET",
            uri: baseUrl + "/api/run/1/flow?filter=substringof(developername, '" + argv.flow + "')",
            headers: {
                'ManyWhoTenant': argv.tenant
            },
            json: true
        })    
    })
    .then((flows) => {
        if(flows.length === 0) {
            console.error("ERROR - Flow does not exist");
            process.exit(1);
        }
        return requestPromise({
            method: "GET",
            uri: baseUrl + "/api/draw/1/flow/snap/" + flows[0].id.id + "/" + flows[0].id.versionId,
            headers: {
                'authorization': authenticationToken,
                'ManyWhoTenant': argv.tenant
            }
        })
    })
    .then((snapshot) => {
        return fsp.writeFile('../ui-html5/build/js/metadata.js', `var metaData = ${JSON.stringify(JSON.parse(snapshot))};\n`);
    })
    .catch((response) => {
       console.error(response.message);
       process.exit(1);
    })
})();