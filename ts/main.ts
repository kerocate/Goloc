eruda.init({
  container: document.querySelector('my-console'),
  useShadowDom: false,
});

let watcherID: number | null = null;
// let divConsole = document.querySelector('#console');
// function(message, source, lineno, colno, error) {
//   divConsole.innerHTML += 1;
//   divConsole.innerHTML += "["+window.Date().slice(16,24)+"] " + message +" | "+source+" | "+lineno+":"+colno+"<br>";
// }
let newGemDot = document.querySelector('#newGemDot');
let southGatDot = document.querySelector('#southGatDot');
let map = document.querySelector('#map');
let myDot = document.querySelector('#myDot');
let rmRate = 1.1400682183346926;
let baselat = newGemDot.getAttribute("data-lat");
let baselot = newGemDot.getAttribute("data-lot");
let basetop = 1915;
let baseleft = 1656;
let sgtop = 2215;
let sgleft = 748;
let sglat = southGatDot.getAttribute("data-lat");
let sglot = southGatDot.getAttribute("data-lot");
let EARTH_RADIUS = 6378137;
let myquaternion = [];
let thisLeft = 0;
let thisTop = 0;


// // 初始化方向传感器
// const OrientationSensoroptions = { frequency: 60, referenceFrame: 'device' };
// const sensor = new AbsoluteOrientationSensor(OrientationSensoroptions);
// Promise.all([navigator.permissions.query({ name: "accelerometer" }),
// navigator.permissions.query({ name: "magnetometer" }),
// navigator.permissions.query({ name: "gyroscope" }),
// navigator.permissions.query({ name: "geolocation" })])
//   .then(results => {
//     if (results.every(result => result.state === "granted")) {
//       sensor.start();
//     } else {
//       console.log("No permissions to use AbsoluteOrientationSensor.");
//     }
//   });
// sensor.addEventListener('reading', () => {
//   // model is a Three.js object instantiated elsewhere.
//   // model.quaternion.fromArray(sensor.quaternion).inverse();
//   let q = sensor.quaternion;
//   /*
//   q[0] = w; q[1] = x; q[2] = y; q[3] = z;
//   */
//   // let Psi = Math.atan2(2*(q[0]*q[3]+q[1]*q[2]),1-2*(Math.pow(q[2],2)+Math.pow(q[3],2)));
//   // let Theta = Math.asin(2*(q[0]*q[2]+q[3]*q[1]));
//   let Phi = Number((Math.atan2(2 * (q[0] * q[1] + q[3] * q[2]), 1 - 2 * (Math.pow(q[1], 2) + Math.pow(q[2], 2)))).toFixed(5));
//   // console.log(sensor.quaternion);
//   let endPhi = Number((Phi * 180 / 3.14159).toFixed(5));
//   map.style.transformOrigin = (thisLeft + 28) + "px " + (thisTop + 29.55) + "px";
//   // map.style.transformOrigin = thisLeft+"px "+thisTop+"px";
//   map.style.transform = "rotate(" + endPhi + "deg)";
//   // console.log(endPhi);
// });
// sensor.addEventListener('error', error => {
//   if (event.error.name == 'NotReadableError') {
//     console.log("Sensor is not available.");
//   }
// });
// sensor.start();
function isSafari() {
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}
function isFirefox(){
  return /Firefox/.test(navigator.userAgent);
}
if ("geolocation" in navigator) {
  console.log("support geolocation!");
} else {
  console.log("not support geolocation!");
}

let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;
  console.log("");
  console.log('你的位置 :');
  console.log('纬度 : ' + crd.latitude);
  console.log('经度 : ' + crd.longitude);
  console.log('误差 : ±' + crd.accuracy + ' 米.');
}

function error(err) {
  console.log('ERROR(' + err.code + '): ' + err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);
navigator.geolocation.watchPosition((pos) => {
  let crd = pos.coords;
  // console.log("");
  // console.log('你的位置 :');
  // console.log('纬度 : ' + crd.latitude);
  // console.log('经度 : ' + crd.longitude);
  // console.log('误差 : ±' + crd.accuracy + ' 米.');
  let laDistance = GetDistance(baselat, baselot, crd.latitude, baselot);
  let lnDistance = GetDistance(baselat, baselot, baselat, crd.longitude);
  // let laDistance = getLineDistance(baselat,baselot,crd.latitude,baselot);
  // let lnDistance = getLineDistance(baselat,baselot,baselat,crd.longitude);
  let lnDirection = Math.sign((crd.longitude - baselot));
  let laDirection = Math.sign((crd.latitude - baselat));
  
  thisLeft = basetop + (lnDistance * lnDirection * rmRate - 260);
  thisTop = baseleft - (laDistance * laDirection * rmRate - 250);
  myDot.style.left = thisLeft + "px";
  myDot.style.top = thisTop + "px";
}, error, options);
// startWatch();



function rad(d) {
  return d * Math.PI / 180.0;
}

function GetDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  let radLat1 = rad(lat1);
  let radLat2 = rad(lat2);
  let a = radLat1 - radLat2;
  let b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = Number(s.toFixed(5));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  s = Number(s.toFixed(5));
  return s;
}

function styleDistance(left1: number, top1: number, left2: number, top2: number) {
  return Math.sqrt(Math.pow((left1 - left2), 2) + Math.pow((top1 - top2), 2));
}

function getLineDistance(lat1:number, lng1:number, lat2:number, lng2:number) {
  let radLat1 = rad(lat1);
  let radLat2 = rad(lat2);
  let radlng1 = rad(lng1);
  let radlng2 = rad(lng2);
  let a = radLat2 - radLat1;
  return Math.sqrt(2 * Math.pow(EARTH_RADIUS, 2) *
    (1 - Math.cos(radlng1) * Math.cos(radlng2) * Math.cos(a) - Math.sin(radlng1) * Math.sin(radlng2)));
}

function reTry() {
  navigator.geolocation.watchPosition((pos) => {
    let crd = pos.coords;
    let laDistance = GetDistance(baselat, baselot, crd.latitude, baselot);
    let lnDistance = GetDistance(baselat, baselot, baselat, crd.longitude);
    // let laDistance = getLineDistance(baselat,baselot,crd.latitude,baselot);
    // let lnDistance = getLineDistance(baselat,baselot,baselat,crd.longitude);
    let lnDirection = Math.sign(crd.longitude - baselot);
    let laDirection = Math.sign(crd.latitude - baselat);
    let thisLeft = basetop + (lnDistance * lnDirection * rmRate - 260);
    let thisTop = baseleft - (laDistance * laDirection * rmRate - 250);
    myDot.style.left = thisLeft + "px";
    myDot.style.top = thisTop + "px";
  }, error, options);
}
// deviceorientationabsolute
if("ondeviceorientationabsolute" in window){
  console.log(1);
  
  window.addEventListener("deviceorientationabsolute", function(event) {
    // console.log(event);
    // alpha: rotation around z-axis
    let rotateDegrees = event.alpha;
    // gamma: left to right
    let leftToRight = event.gamma;
    // beta: front back motion
    let frontToBack = event.beta;
    rotateDegrees = Number(rotateDegrees.toFixed(4));
    // console.log(rotateDegrees);
    map.style.transformOrigin = (thisLeft + 28) + "px " + (thisTop + 29.55) + "px";
    map.style.transform = "rotate(" + rotateDegrees + "deg)";
    
  });
}else if (isSafari()) {
  console.log(2);
  window.addEventListener("deviceorientation", function(event) {
    let rotateDegrees = event.webkitCompassHeading;
    console.log(event);
    let leftToRight = event.gamma;
    let frontToBack = event.beta;
    rotateDegrees = Number(rotateDegrees.toFixed(4));
    // console.log(rotateDegrees);
    map.style.transformOrigin = (thisLeft + 28) + "px " + (thisTop + 29.55) + "px";
    map.style.transform = "rotate(" + rotateDegrees + "deg)";
  })
}else{
  if (!window.ondeviceorientation) {
    console.log(3);
      console.log("设备不支持指南功能！");
  }else{
    console.log(4);
    window.addEventListener("deviceorientation", function(event) {
      let rotateDegrees = event.alpha;
      let leftToRight = event.gamma;
      let frontToBack = event.beta;
      rotateDegrees = Number(rotateDegrees.toFixed(4));
      // console.log(rotateDegrees);
      map.style.transformOrigin = (thisLeft + 28) + "px " + (thisTop + 29.55) + "px";
      map.style.transform = "rotate(" + rotateDegrees + "deg)";
    });
  }
}

// console.log(GetDistance(baselat,baselot,sglat,sglot));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop)/GetDistance(baselat,baselot,sglat,sglot));
// console.log(styleDistance(baseleft,basetop,sgleft,sgtop)/getLineDistance(baselat,baselot,sglat,sglot));