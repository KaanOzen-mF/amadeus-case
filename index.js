const flightSearchForm = document.getElementById("flight-search-form");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
const departureDateInput = document.getElementById("departure-date");
const returnDateInput = document.getElementById("return-date");
const oneWayCheckbox = document.getElementById("one-way");
const resultsContainer = document.getElementById("results");

const departureResultBox = document.querySelector(".departure-box");
const arrivalResultBox = document.querySelector(".arrival-box");

// Function to fetch API data
async function fetchApiData() {
  try {
    const response = await fetch(
      "https://64de0905825d19d9bfb1ec57.mockapi.io/flightsData/airlineData"
    );
    const data = await response.json();
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

const airportData = fetch(
  "https://64de0905825d19d9bfb1ec57.mockapi.io/flightsData/airlineData"
)
  .then((res) => res.json())
  .then((data) => {
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

flightSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
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

  // Sıralama butonlarına tıklanma olaylarına dinleyici ekleme
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

  // Uçuşları görüntülemek için fonksiyon
  function displayFlights() {
    resultsContainer.innerHTML = "";
    if (matchingFlights.length > 0) {
      matchingFlights.forEach((flight) => {
        const flightInfo = `
        <div class="flights-info">
          <p>Kalkış: ${flight.from}</p>
          <p>Varış: ${flight.to}</p>
          <p>Kalkış Tarihi: ${departureDate}</p>
          <p>Varış Tarihi: ${new Date(flight.arrivalTime * 1000)
            .toISOString()
            .slice(0, 10)}</p>
          <p>Fiyat: ${flight.price}</p>
          <!-- EKLEME: Uçuş süresi -->
          <p>Uçuş Süresi: ${flight.flightDuration} saat</p>
        </div>
      `;
        resultsContainer.innerHTML += flightInfo;
      });
    } else {
      resultsContainer.innerHTML = "Uygun uçuş bulunamadı.";
    }
  }
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
