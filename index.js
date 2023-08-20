const flightSearchForm = document.getElementById("flight-search-form");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
const departureDateInput = document.getElementById("departure-date");
const returnDateInput = document.getElementById("return-date");
const oneWayCheckbox = document.getElementById("one-way");
const resultsContainer = document.getElementById("results");

const loadingRing = document.querySelector(".ring");
const loadingSpan = loadingRing.querySelector("span");
const loadingSpinner = document.getElementById("loading-spinner");
const departureResultBox = document.querySelector(".departure-box");
const arrivalResultBox = document.querySelector(".arrival-box");

const today = new Date().toISOString().split("T")[0];
departureDateInput.min = today;
returnDateInput.min = today;

const url =
  "https://64de0905825d19d9bfb1ec57.mockapi.io/flightsData/spaceShips";

//Fetch API Data
async function fetchApiData() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }

    const data = await response.json();

    if (data.length === 0) {
      resultsContainer.innerHTML = "No flights available.";
    }

    return data;
  } catch (error) {
    console.error("Error fetching API data:", error);
    return [];
  }
}

// One way ticket button handler
oneWayCheckbox.addEventListener("change", () => {
  returnDateInput.disabled = !returnDateInput.disabled;
  returnDateInput.value = ""; // Clear the return date value when disabling
});

// Using the fetched data to filter and display airport suggestions
const airportDataPromise = fetchApiData();

airportDataPromise.then((data) => {
  departureInput.onkeyup = function () {
    let input = departureInput.value.toLowerCase();
    let result = data.filter((airport) =>
      airport.from.toLowerCase().includes(input)
    );
    result = removeDuplicates(result, "from");
    display(result, "from");
  };

  arrivalInput.onkeyup = function () {
    let input = arrivalInput.value.toLowerCase();
    let result = data.filter((airport) =>
      airport.to.toLowerCase().includes(input)
    );
    result = removeDuplicates(result, "to");
    display(result, "to");
  };
});

loadingRing.style.display = "none";
flightSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loadingRing.style.display = "block";
  const departure = departureInput.value;
  const arrival = arrivalInput.value;
  const departureDate = departureDateInput.value;
  const returnDate = returnDateInput.value;

  // Fetch API data
  const apiData = await fetchApiData();

  // Filter flights based on user input
  const matchingFlights = apiData.filter((flight) => {
    // Convert departure and arrival times to ISO date strings
    const formattedDepartureDate = new Date(flight.departureTime * 1000)
      .toISOString()
      .slice(0, 10);
    const formattedArrivalDate = new Date(flight.arrivalTime * 1000)
      .toISOString()
      .slice(0, 10);

    return (
      flight.from === departure &&
      flight.to === arrival &&
      formattedDepartureDate === departureDate &&
      (returnDateInput.disabled || formattedArrivalDate === returnDate)
    );
  });
  // Bu değişken, mevcut sıralama kriterini takip etmek için kullanılacak
  let currentSortKey = null;

  // Sıralama butonlarına tıklanınca sıralamayı değiştiren fonksiyon
  function handleSortClick(sortKey) {
    // Eğer tıklanan buton zaten mevcut sıralama kriteriyse, sıralama yönünü değiştir
    if (sortKey === currentSortKey) {
      matchingFlights.reverse();
    } else {
      // Değilse, yeni sıralama yapılacak
      currentSortKey = sortKey;
      switch (sortKey) {
        case "departureTime":
          matchingFlights.sort((a, b) => a.departureTime - b.departureTime);
          break;
        case "arrivalTime":
          matchingFlights.sort((a, b) => a.arrivalTime - b.arrivalTime);
          break;
        case "flightDuration":
          matchingFlights.sort((a, b) => a.flightDuration - b.flightDuration);
          break;
        case "price":
          matchingFlights.sort((a, b) => a.price - b.price);
          break;
        default:
          break;
      }
    }
  }
  // Sorting button event listeners
  const sortButtons = document.querySelectorAll(".sort-button");
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortKey = button.dataset.sortKey;
      handleSortClick(sortKey);
      // Sonucu görüntüle
      displayFlights();
    });

    displayFlights();
  });

  // Display Flights function
  function displayFlights() {
    resultsContainer.innerHTML = "";
    if (matchingFlights.length > 0) {
      matchingFlights.forEach((flight) => {
        const flightInfo = `
        <div class="flights-info">
          <p>Departure Airport: ${flight.from}</p>
          <p>Arrival Airport: ${flight.to}</p>
          <p>Departure Time: ${departureDate}</p>
          <p>Return Departure Time: ${new Date(flight.arrivalTime * 1000)
            .toISOString()
            .slice(0, 10)}</p>
          <p>Price: ${flight.price}</p>
          <p>Flight Duration: ${flight.flightDuration} hour</p>
        </div>
      `;

        resultsContainer.innerHTML += flightInfo;
      });
    } else {
      resultsContainer.innerHTML = "There is no flights.";
    }
  }
  // Hide the loading spinner after displaying the flights or if no flights are found
  loadingRing.style.display = "none";
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
  const resultBox = type === "from" ? departureResultBox : arrivalResultBox;

  const content = result.map((airport) => {
    return `<li onclick="selectInput('${type}', this)">${
      type === "from" ? airport.from : airport.to
    }</li>`;
  });

  resultBox.innerHTML = `<ul>${content.join("")}</ul>`;
}

function selectInput(type, list) {
  if (type === "from") {
    departureInput.value = list.innerHTML;
    departureResultBox.innerHTML = "";
  } else if (type === "to") {
    arrivalInput.value = list.innerHTML;
    arrivalResultBox.innerHTML = "";
  }
}
