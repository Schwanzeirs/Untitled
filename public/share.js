const startElem = document.getElementById("startshare");
const stopElem = document.getElementById("stopshare");
const screen = document.getElementById("screen");
const captureElem = document.getElementById("captureshare");
var canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d');

var displayMediaOptions = {
    video: {
        cursor: "always",
        height: 480,
        width: 560
    },
    audio: false
};
startElem.addEventListener("click", function (event) {
    startCapture();
}, false);
stopElem.addEventListener("click", function (event) {
    stopCapture();
}, false);

async function startCapture() {
    try {
        screen.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    } catch (e) {
        console.error("Error: " + e)
    }
}

function stopCapture(event) {
    let tracks = screen.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    screen.srcObject = null;
}

function dumpOptionsInfo() {
    const videoTrack = screen.srcObject.getVideoTracks()[0];
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function checkTrack() {
    const videoTrack = screen.srcObject.getVideoTracks();
    console.log(videoTrack);
}


// captureElem.addEventListener("click", captureScreen);