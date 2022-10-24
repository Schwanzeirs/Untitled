const startButton = document.getElementById('start-video-button');
const stopButton = document.getElementById('stop-video-button');
const box = document.getElementById('video-div');

async function startVideo() {
    startVideoUI();
    const track = await Twilio.Video.createLocalVideoTrack();
    box.append(track.attach());
    stopButton.addEventListener("click", function () {
      stopVideo(track);
    });
  }
  function stopVideo(track) {
    track.stop();
    endVideoUI();
  }
  function startVideoUI() {
    startButton.disabled = true;
    stopButton.disabled = false;
    box.innerHTML = "";
  }
  function endVideoUI() {
    startButton.disabled = false;
    stopButton.disabled = true;
    box.innerHTML = "";
  }
  startButton.addEventListener("click", startVideo);