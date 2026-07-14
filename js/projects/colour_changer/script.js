const body = document.body;
const buttons = document.querySelectorAll(".color-btn");

buttons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        body.style.backgroundColor = e.target.id;
    });
});
