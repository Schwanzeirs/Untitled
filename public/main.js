const form = document.getElementById("room-name-form");
const container = document.getElementById("video-container");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const disconnect = document.getElementById("disconnect");
const validation = document.getElementById("data-validation-form");
const comparation = document.getElementById("comparation")
const close = document.getElementById("hidden")
const ktp = document.getElementById("no-ktp");
const kk = document.getElementById("no-kk");
const nama = document.getElementById("nama");
const alamat = document.getElementById("alamat");
const penjamin = document.getElementById("penjamin");
const telepon = document.getElementById("hp");
const form_message = document.getElementById("data-message-form")
const body_message = document.getElementById("message")
const d = new Date()
var x = document.getElementById("result-location");
let checkChecked = [];
let datas = [];
let msg = [];

const startRoom = async (event) => {
    // prevent a page reload when a user submits the form
    event.preventDefault();
    // hide the join form
    form.style.visibility = "hidden";
    disconnect.hidden = false;
    validation.hidden = false;
    // retrieve the room name
    const userName = userInput.value;
    const password = passwordInput.value;
    const surveyor = "Admin";
    const roomName = password + surveyor;
    console.log("Room Name : ", roomName);
    console.log("User Name : ", userName);

    // fetch an Access Token from the join-room route
    const response = await fetch("/join-room", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: roomName }),
    });
    console.log("Response : ",response);
    const { token } = await response.json();

    // join the video room with the token
    const room = await joinVideoRoom(roomName, token);
    console.log("Authentication token : ", token);

    // render the local and remote participants' video and audio tracks
    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);
    console.log(room);

    // handle cleanup when a participant disconnects
    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => room.disconnect());
    window.addEventListener("beforeunload", () => room.disconnect());

    //get location
    getLocation()
};

const handleConnectedParticipant = (participant) => {
    // create a div for this participant's tracks
    const participantDiv = document.createElement("div");
    participantDiv.setAttribute("id", participant.identity);
    const name = document.createElement("p");
    name.append(document.createTextNode(userInput.value));
    container.appendChild(participantDiv);
    container.append(name)

    // iterate through the participant's published tracks and
    // call `handleTrackPublication` on them
    console.log("participant: ", participant);
    participant.tracks.forEach((trackPublication) => {
        console.log("trackPublication: ", trackPublication);
        handleTrackPublication(trackPublication, participant);
    });

    // listen for any new track publications
    participant.on("trackPublished", handleTrackPublication);
    disconnect.addEventListener("click", function () {
        handleDisconnectedParticipant(participant)
    })
};

const handleTrackPublication = (trackPublication, participant) => {
    function displayTrack(track) {
        // append this track to the participant's div and render it on the page
        const participantDiv = document.getElementById(participant.identity);
        // track.attach creates an HTMLVideoElement or HTMLAudioElement
        // (depending on the type of track) and adds the video or audio stream
        participantDiv.append(track.attach());
    }

    // check if the trackPublication contains a `track` attribute. If it does,
    // we are subscribed to this track. If not, we are not subscribed.
    if (trackPublication.track) {
        displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
};

const handleDisconnectedParticipant = (participant) => {
    // stop listening for this participant
    participant.removeAllListeners();
    // remove this participant's div from the page
    const participantDiv = document.getElementById(participant.identity);
    participantDiv.remove();
    disconnect.hidden = true;
    validation.hidden = true;
    form.style.visibility = "visible";
    comparation.hidden = false;
    close.hidden = false;
    checkChecked = [];
    let check = document.getElementsByName("data");
    for (var i = 0; i < check.length; i++) {
        if(check[i].checked == true) {
            checkChecked.push(check[i].value)
        }else{
            checkChecked.push("Data tidak sesuai")
        }
    }
    const ktp = checkChecked[0];
    const kk = checkChecked[1];
    const nama = checkChecked[2];
    const alamat = checkChecked[3];
    let deta = {
        ktp,
        kk,
        nama,
        alamat,
    }
    datas.push(deta)
    renderData()
    console.log(datas);
};

const submitData = (event) => {
    event.preventDefault();
    const data_penjamin = penjamin.value
    const hp = telepon.value
    let pt = {
        data_penjamin,
        hp
    }
    datas.push(pt);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const long = position.coords.longitude
    const lat = position.coords.latitude
    let coord = {
        long,
        lat
    }
    datas.push(coord)
    console.log(position);
}

const renderData = () => {
    const container = document.getElementById("data")

    container.innerHTML = ""

    container.innerHTML += `
    <div id="data">
    <p>No KTP : ${datas[2].ktp}</p>
    <p>No KK : ${datas[2].kk}</p>
    <p>Nama Lengkap : ${datas[2].nama}</p>
    <p>Alamat : ${datas[2].alamat}</p>
    <p>Nama Penjamin : ${datas[1].data_penjamin}</p>
    <p>Nomor Telepon Penjamin : ${datas[1].hp}</p>
    <p>Latitude : ${datas[0].lat}</p>
    <p>Longitude : ${datas[0].long}</p>
    </div>
    `
}

const joinVideoRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name
    const room = await Twilio.Video.connect(token, {
        room: roomName,
    });
    return room;
};

const sendMessage = (event) => {
    event.preventDefault();
    let date = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    const setMsg = body_message.value
    const dataMessage = {
        setMsg,
        date,
        month,
        year,
        hour,
        minute,
        second
    }
    msg.push(dataMessage)
    body_message.value = null;
    renderMessage();
    console.log(msg);
}

const renderMessage = () => {
    const container = document.getElementById("chat-container")

    container.innerHTML = ""

    for (let i = 0; i <msg.length; i++) {
        container.innerHTML += `
        <div class="buble-chat" id="buble-chat">
            <p class="body-msg pn" id="body-msg">User 1 : ${msg[i].setMsg}</p>
            <p class="time-msg pn" id="time-msg">${msg[i].date}-${msg[i].month + 1}-${msg[i].year} ${msg[i].hour}:${msg[i].minute}</p>
        </div>
        `
    }
}

form.addEventListener("submit", startRoom);
validation.addEventListener("submit", submitData);
form_message.addEventListener("submit", sendMessage);
