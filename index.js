"use strict";

{
  const package_version = require('./package.json').version;
  const request_source = `Pocketwatch.js Node.js Client Library version: ${package_version}`;
  const version = 'v1';
  const origin = 'https://api.pocketwatch.xyz';
  const fetch = require('node-fetch');
  const timer = {
   create, 
   "delete": del
  };
  const key = {
    refresh
  };
  const subscription = {
    cancel
  };
  const pocketwatch = {
    authorize, timer, key, subscription
  };

  let apiKey;

  module.exports = pocketwatch;

  function authorize(key) {
    apiKey = key;
    guardAuthorized();
  }

  async function create({
      name:name="",interval,intervalCount,duration,
      durationCount,url,body:body="",
      method:method="GET",
      contentType:contentType = 'application/json'} = {}) {
    guardAuthorized();
    const apimethod = "POST"; 
    const headers = { 
      'Content-Type': 'application/json'
    };
    const apiurl = `${origin}/${version}/timer/new`;
    const apibody = {
      request_source,
      apiKey,
      name,
      interval_unit_type: interval,
      interval_unit_count: intervalCount,
      duration_unit_type: duration,
      duration_unit_count: durationCount,
      url,
      method,
      body,
      contentType
    };
    const resp = await fetch(apiurl, {headers,method:apimethod,body:JSON.stringify(apibody)});
    const json_resp = await resp.json();
    return json_resp;
  }

  async function del(keyName) {
    guardAuthorized();
    const url = `${origin}/${version}/delete/timer`;
    const method = "POST"; 
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      apiKey,
      keyName
    };
    const resp = await fetch(url, {headers,method,body:JSON.stringify(body)});
    const json_resp = await resp.json();
    return json_resp;
  }

  async function refresh() {
    guardAuthorized();
    const url = `${origin}/${version}/key/refresh`;
    const method = "POST"; 
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      apiKey
    };
    const resp = await fetch(url, {headers,method,body:JSON.stringify(body)});
    const json_resp = await resp.json();
    return json_resp;
  }

  async function cancel() {
    guardAuthorized();
    const url = `${origin}/${version}/subscription/cancel`;
    const method = "POST"; 
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      apiKey
    };
    const resp = await fetch(url, {headers,method,body:JSON.stringify(body)})
    const json_resp = await resp.json();
    return json_resp;
  }

  function guardAuthorized() {
    if ( ! apiKey ) {
      throw new TypeError(`
        Please call .authorize(apiKey) 
        with a valid API key to set your API key before using the API.
        Read the docs at:
        https://dosyago-corp.github.io/pocketwatch-api/
        `);
    }
  }
}
