let count = 0;

const h2 = document.querySelector("#count");
const increment = document.querySelector("#increment");
const decrement = document.querySelector("#decrement");

increment.addEventListener("click", function () {
    count++;
    h2.innerHTML = count;
});

decrement.addEventListener("click", function () {
    count--;
    h2.innerHTML = count;
});
