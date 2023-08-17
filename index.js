const oneWayRadio = document.getElementById("one-way");
const roundTripRadio = document.getElementById("round-trip");
const returnDateInput = document.getElementById("return");
const arrivialDateInput = document.getElementById("arrivial-return");
const searchForm = document.getElementById("search-form");
const fromInput = document.getElementById("ticket-from");
const toInput = document.getElementById("ticket-to");

oneWayRadio.addEventListener("change", () => {
  returnDateInput.disabled = true;
  arrivialDateInput.disabled = true;
});

roundTripRadio.addEventListener("change", () => {
  returnDateInput.disabled = false;
  arrivialDateInput.disabled = false;
});

const fromBox = document.getElementById("from-box");
const toBox = document.getElementById("to-box");

const fromResultBox = document.querySelector(".from-result");
const toResultBox = document.querySelector(".to-result");

const airportData = fetch(
  "https://64de0905825d19d9bfb1ec57.mockapi.io/flightsData/airlineData"
)
  .then((res) => res.json())
  .then((data) => {
    fromBox.onkeyup = function () {
      let input = fromBox.value.toLowerCase();
      let result = data.filter((airport) =>
        airport.from.toLowerCase().includes(input)
      );
      result = removeDuplicates(result, "from");
      display(result, "from");
    };

    toBox.onkeyup = function () {
      let input = toBox.value.toLowerCase();
      let result = data.filter((airport) =>
        airport.from.toLowerCase().includes(input)
      );
      result = removeDuplicates(result, "from");
      display(result, "to");
    };
  });

function removeDuplicates(arr, key) {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

function display(result, type) {
  const resultBox = type === "from" ? fromResultBox : toResultBox;

  const content = result.map((airport) => {
    return `<li onclick="selectInput('${type}', this)">${airport.from}</li>`;
  });

  resultBox.innerHTML = `<ul>${content.join("")}</ul>`;
}

function selectInput(type, list) {
  if (type === "from") {
    fromBox.value = list.innerHTML;
    fromResultBox.innerHTML = "";
  } else if (type === "to") {
    toBox.value = list.innerHTML;
    toResultBox.innerHTML = "";
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from submitting

  const startInput = document.getElementById("start").value;
  const returnInput = document.getElementById("return").value;
  const arrivialStartInput = document.getElementById("arrivial-start").value;
  const arrivialReturnInput = document.getElementById("arrivial-return").value;
  const ticketFromInput = document.getElementById("from-box").value;
  const ticketToInput = document.getElementById("to-box").value;

  console.log("Ticket From:", ticketFromInput);
  console.log("Ticket From:", ticketToInput);
  console.log("Start Date:", startInput);
  console.log("Return Date:", returnInput);
  console.log("Arrival Start Time:", arrivialStartInput);
  console.log("Arrival Return Time:", arrivialReturnInput);
});
