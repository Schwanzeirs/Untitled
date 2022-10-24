const ShowButton = document.getElementById("comparation");
const CloseButton = document.getElementById("hidden");
const data = document.getElementById("data");

function showData() {
    data.hidden = false;
    CloseButton.disabled = false;
    ShowButton.disabled = true;
}
function closeData() {
    data.hidden = true;
    CloseButton.disabled = true;
    ShowButton.disabled = false;
}

ShowButton.addEventListener("click", showData);
CloseButton.addEventListener("click", closeData);