const form = document.getElementById("bmi-form");
const height = document.getElementById("height");
const weight = document.getElementById("weight");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const h = parseInt(height.value);
    const w = parseInt(weight.value);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        result.innerHTML = "Please enter valid height and weight.";
        return;
    }

    const bmi = (w / ((h * h) / 10000)).toFixed(2);
    result.innerHTML = "Your BMI is <strong>" + bmi + "</strong>";
});
