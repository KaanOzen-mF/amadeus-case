const oneWayRadio = document.getElementById("one-way");
const roundTripRadio = document.getElementById("round-trip");
const returnDateInput = document.getElementById("return");
const arrivialDateInput = document.getElementById("arrivial-return");

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

fetch("https://64de0905825d19d9bfb1ec57.mockapi.io/flightsData/airlineData")
  .then((res) => res.json())
  .then((airlineData) => {
    const searchAndUpdateFrom = () => {
      const fromValue = fromInput.value.toLowerCase();
      const searchResults = airlineData.filter((ticket) =>
        ticket.from.toLowerCase().includes(fromValue)
      );
      console.log(searchResults);
    };
    const searchAndUpdateTo = () => {
      const toValue = toInput.value.toLowerCase();
      const searchResults = airlineData.filter((ticket) =>
        ticket.from.toLowerCase().includes(toValue)
      );
      console.log(searchResults);
    };

    fromInput.addEventListener("input", searchAndUpdateFrom);
    toInput.addEventListener("input", searchAndUpdateTo);
  });

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from submitting

  const startInput = document.getElementById("start").value;
  const returnInput = document.getElementById("return").value;
  const arrivialStartInput = document.getElementById("arrivial-start").value;
  const arrivialReturnInput = document.getElementById("arrivial-return").value;
  const ticketFromInput = document.getElementById("ticket-from").value;
  const ticketToInput = document.getElementById("ticket-to").value;

  console.log("Ticket From:", ticketFromInput);
  console.log("Ticket From:", ticketToInput);
  console.log("Start Date:", startInput);
  console.log("Return Date:", returnInput);
  console.log("Arrival Start Time:", arrivialStartInput);
  console.log("Arrival Return Time:", arrivialReturnInput);
});
