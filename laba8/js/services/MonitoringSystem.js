import { NoiseSensor } from "../models/NoiseSensor.js";

export class MonitoringSystem {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        if (!(sensor instanceof NoiseSensor)) {
            return "Not a sensor object!";
        }
        const exists = this.sensors.some(s => s.id === sensor.id);
        if (exists) {
            throw new Error(`Датчик ${sensor.id} вже існує`);
        }
        this.sensors.push(sensor);
    }

    findSensorById(id) {
        return this.sensors.find(s => s.id === id) ?? null;
    }

    getSensorsByArea(area) {
        return this.sensors.filter(s => s.area === area);
    }

    getCriticalSensors() {
        return this.sensors.filter(s => s.getStatus() === "critical");
    }

    getAverageNoiseLevel() {
        if (this.sensors.length === 0) return null;
        const sum = this.sensors.reduce((acc, s) => acc + s.noiselvl, 0);
        return sum / this.sensors.length;
    }
}
