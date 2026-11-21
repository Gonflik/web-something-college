interface Sensor {
  id: string;
  name: string;
  district: string;
  noiseLevel: number;
  status: "active" | "inactive";
}

const API_URL = "https://6b01cdb81c637a569e5361d2.mockapi.io/api/v1/sensors";

function renderSensors(sensors: Sensor[]): void {
  const container = document.querySelector<HTMLDivElement>("#sensors-ts-list");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  sensors.forEach((sensor) => {
    const card = document.createElement("article");
    card.classList.add("sensor-card", `sensor-card--${sensor.status}`);

    card.innerHTML = `
      <h3>${sensor.name}</h3>
      <p>Район: ${sensor.district}</p>
      <p>Рівень шуму: ${sensor.noiseLevel} дБ</p>
      <p>Статус: ${sensor.status}</p>
    `;

    container.append(card);
  });
}

async function loadSensors(): Promise<void> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const sensors: Sensor[] = await response.json();
    renderSensors(sensors);
  } catch (error) {
    console.error("Не вдалося завантажити сенсори:", error);

    const container = document.querySelector<HTMLDivElement>("#sensors-ts-list");
    if (container) {
      container.innerHTML = "<p>Не вдалося завантажити дані.</p>";
    }
  }
}

loadSensors();