import { NoiseSensor, MobileNoiseSensor } from "./models/NoiseSensor.js";
import { NoiseMeasurement } from "./models/NoiseMeasurement.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";


const sensorsData = [
    { area: "Галицький",      address: "просп. Свободи",   noiselvl: 58 },
    { area: "Франківський",   address: "вул. Наукова",     noiselvl: 74 },
    { area: "Шевченківський", address: "просп. Чорновола", noiselvl: 83 },
];


const system = new MonitoringSystem();

sensorsData.forEach(data => {
    system.addSensor(NoiseSensor.fromObject(data));
});

const mobile = new MobileNoiseSensor("Личаківський", "вул. Личаківська", 62, 15);
system.addSensor(mobile);

system.sensors[0].addMeasurement(new NoiseMeasurement(61));
system.sensors[0].addMeasurement(new NoiseMeasurement(73));
system.sensors[1].addMeasurement(new NoiseMeasurement(78));
system.sensors[1].addMeasurement(new NoiseMeasurement(74));
system.sensors[2].addMeasurement(new NoiseMeasurement(89));
system.sensors[2].addMeasurement(new NoiseMeasurement(83));
mobile.addMeasurement(new NoiseMeasurement(62));

const statusLabels = {
    normal:   "Норма",
    warning:  "Попередження",
    critical: "Критичний",
};

function renderSensorCard(sensor) {
    const status = sensor.getStatus();

    const card = document.createElement("div");
    card.className = `sensor-card sensor-card--${status}`;

    const batteryInfo = sensor instanceof MobileNoiseSensor
        ? `<p class="sensor-card__battery"> ${sensor.batteryLevel}%${sensor.needsCharging() ? " — потрібна зарядка" : ""}</p>`
        : "";

    card.innerHTML = `
        <div class="sensor-card__header">
            <span class="sensor-card__id">${sensor.id}</span>
            <span class="sensor-card__status status-badge status--${status}">${statusLabels[status]}</span>
        </div>
        <div class="sensor-card__body">
            <p class="sensor-card__area">📍 ${sensor.area}</p>
            <p class="sensor-card__address">${sensor.address}</p>
            <p class="sensor-card__level"><strong>${sensor.noiselvl} дБ</strong></p>
            ${batteryInfo}
        </div>
    `;
    return card;
}

function renderSensorsSection() {
    const grid = document.getElementById("sensors-grid");
    if (!grid) return;

    grid.innerHTML = "";
    system.sensors.forEach(sensor => {
        grid.appendChild(renderSensorCard(sensor));
    });

    const avg = system.getAverageNoiseLevel();
    const avgEl = document.getElementById("avg-noise");
    if (avgEl && avg !== null) avgEl.textContent = `${avg.toFixed(1)} дБ`;

    const critEl = document.getElementById("critical-count");
    if (critEl) critEl.textContent = system.getCriticalSensors().length;
}

document.addEventListener("DOMContentLoaded", renderSensorsSection);


const sensorA = system.sensors[0];
const sensorB = system.sensors[1];

console.log("=== Експеримент з прототипом ===");
console.log("sensorA.getStatus === sensorB.getStatus:", sensorA.getStatus === sensorB.getStatus);
console.log("Object.hasOwn(sensorA, 'noiselvl'):",      Object.hasOwn(sensorA, "noiselvl"));
console.log("Object.hasOwn(sensorA, 'getStatus'):",     Object.hasOwn(sensorA, "getStatus"));

console.log("\n=== Звіт системи ===");
console.log("Усі датчики:", system.sensors.map(s => `${s.id} (${s.area}) ${s.noiselvl} дБ → ${s.getStatus()}`));
console.log("Критичні датчики:", system.getCriticalSensors().map(s => s.id));
console.log("Середній рівень шуму:", system.getAverageNoiseLevel()?.toFixed(2), "дБ");
console.log("Знайти NS-02:", system.findSensorById("NS-02"));
console.log("Датчики в Галицькому:", system.getSensorsByArea("Галицький").map(s => s.id));

console.log("\n=== Статичний метод ===");
console.log("isValidNoiseLevel(74):", NoiseSensor.isValidNoiseLevel(74));
console.log("isValidNoiseLevel(-1):", NoiseSensor.isValidNoiseLevel(-1));
console.log("isValidNoiseLevel(999):", NoiseSensor.isValidNoiseLevel(999));

console.log("\n=== MobileNoiseSensor (наслідування) ===");
console.log("mobile instanceof NoiseSensor:", mobile instanceof NoiseSensor);
console.log("mobile.needsCharging():", mobile.needsCharging());
console.log("mobile.getStatus():", mobile.getStatus());

console.log("\n=== Вимірювання (композиція) ===");
system.sensors.forEach(s => {
    console.log(`${s.id} вимірювання:`, s.measurements.map(m => m.toString()));
});
