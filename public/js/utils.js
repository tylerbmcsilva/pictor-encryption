// Source for utils: https://github.com/engelke/fluent2016/blob/master/Solutions/4/util.js



// Various tools to convert string formats to and from
// byte arrays (that is, Uint8Array), since the Web Crypto
// API likes byte arrays, and web pages like strings.
function byteArrayToHexString(byteArray) {
    var hexString = '';
    var nextHexByte;
    for (var i=0; i<byteArray.byteLength; i++) {
        nextHexByte = byteArray[i].toString(16);    // Integer to base 16
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;        // Otherwise 10 becomes just a instead of 0a
        }
        hexString += nextHexByte;
    }
    return hexString;
}


function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }
    var numBytes = hexString.length / 2;
    var byteArray = new Uint8Array(numBytes);
    for (var i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}


function byteArrayToBase64(byteArray){
    var binaryString = "";
    for (var i=0; i<byteArray.byteLength; i++){
        binaryString += String.fromCharCode(byteArray[i]);
    }
    var base64String = window.btoa(binaryString);
    return base64String;
}


function base64ToByteArray(base64String){
    var binaryString = window.atob(base64String);
    var byteArray = new Uint8Array(binaryString.length);
    for (var i=0; i<binaryString.length; i++){
        byteArray[i] += binaryString.charCodeAt(i);
    }
    return byteArray;
}


function byteArrayToString(byteArray){
    if ("TextDecoder" in window) {
        decoder = new window.TextDecoder;
        return decoder.decode(byteArray);
    }

    // Otherwise, fall back to 7-bit ASCII only
    var result = "";
    for (var i=0; i<byteArray.byteLength; i++){
        result += String.fromCharCode(byteArray[i])
    }
    return result;
}


function stringToByteArray(s){
    if ("TextEncoder" in window) {
       encoder = new window.TextEncoder;
       return encoder.encode(s);
    }

    // Otherwise, fall back to 7-bit ASCII only
    var result = new Uint8Array(s.length);
    for (var i=0; i<s.length; i++){
        result[i] = s.charCodeAt(i);
    }
    return result;
}


function showePreloader() {
  let plw = document.getElementById('preloader-wrapper');
  plw.style.opacity = 1;
  plw.style.zIndex = 9999;
}


function hidePreloader(d) {
  let plw = document.getElementById('preloader-wrapper');
  plw.style.opacity = 0;
  plw.style.zIndex = -1;
}


function getDataFromUrl(url) {
  return axios.get(url)
    .catch( function (error) {
      throw error;
    });
}


function postDataToUrl(url, data) {
  return axios.post(url, data)
    .catch(function(error) {
      throw error;
    });
}


function putDataToUrl(url, data) {
  return axios.put(url, data)
    .catch(function(error) {
      throw error;
    });
}



function deleteFromUrl(url, data) {
  return axios.delete(url)
    .catch(function(error) {
      throw error;
    });
}
