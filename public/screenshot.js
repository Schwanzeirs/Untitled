const take = document.getElementById("screenshot")
const ss_result = document.getElementById("screenshot-result")

function takeshot() {
    let div = document.getElementById("chat-container");
    html2canvas(div).then(
        function (canvas) {
            document.getElementById("screenshot-result")
            .appendChild(canvas);
        }
    )
}

function screeshot() {
    html2canvas(document.body).then((canvas) => {
        let a = document.createElement("a");
        a.download = "ss.png";
        a.href = canvas.toDataURL("image.png", 1);
        a.click();
    })
}

take.addEventListener("click", screeshot);