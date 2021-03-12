const request = require('request');

const fetchMyIP = (callback) => {
  
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    
    if (error !== null) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const parsedIp = JSON.parse(body);
      callback(null, parsedIp.ip);
    }

  });

};

const fetchCoordsByIP = (ip, callback) => {
  
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {

    if (error !== null) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      const parsedCoords = JSON.parse(body);
      let data = {};
      data.latitude = parsedCoords.latitude;
      data.longitude = parsedCoords.longitude;
      return callback(null, data);
    }

  });

};


const fetchISSFlyOverTimes = (coords, callback) => {

  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    
    if (error !== null) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      const parsedResponse = JSON.parse(body);
      let data = {};
      data.response = parsedResponse.response;
      return callback(null, data);
    }

  });

};

const nextISSTimesForMyLocation = (callback) => {

  fetchMyIP((error, ip) => {

    if (error) {
      callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
        
      if (error) {
        callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, passTimes) => {

        if (error) {
          callback(error, null);
        }
            
        callback(null, passTimes);
      });
        
    });
    
  });
};

module.exports = {

  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation

};