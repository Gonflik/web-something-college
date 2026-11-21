import { NoiseMeasurement } from "./NoiseMeasurement.js";

export const NOISE_LIMITS = Object.freeze({
    normalMax: 55,
    warningMax: 70,
    minValid: 30,
    maxValid: 130,
});

export class NoiseSensor {
    static NextId = 1;

    constructor(area, address, noiselvl) {
        this.id = `NS-${String(NoiseSensor.NextId++).padStart(2, "0")}`;
        this.area = area;
        this.address = address;
        this.noiselvl = noiselvl;
        this.measurements = [];
    }

    getStatus() {
        if (this.noiselvl <= NOISE_LIMITS.normalMax) return "normal";
        if (this.noiselvl <= NOISE_LIMITS.warningMax) return "warning";
        return "critical";
    }

    updateNoiseLevel(value) {
        if (!NoiseSensor.isValidNoiseLevel(value)) {
            return "Ti daun tupoi";
        }
        this.noiselvl = value;
    }

    addMeasurement(measurement) {
        if (!(measurement instanceof NoiseMeasurement)) {
            throw new Error("Очікується об'єкт NoiseMeasurement");
        }
        this.measurements.push(measurement);
        this.noiselvl = measurement.value;
    }

    static isValidNoiseLevel(value) {
        return Number.isFinite(value)
            && value >= NOISE_LIMITS.minValid
            && value <= NOISE_LIMITS.maxValid;
    }

    static fromObject(data) {
        if (!data.area || !data.address || data.noiselvl == null) {
            throw new Error("Неповні дані для створення NoiseSensor");
        }
        return new NoiseSensor(data.area, data.address, data.noiselvl);
    }
}

// --- Inheritance demo ---
export class MobileNoiseSensor extends NoiseSensor {
    constructor(area, address, noiselvl, batteryLevel) {
        super(area, address, noiselvl);
        this.batteryLevel = batteryLevel;
    }

    needsCharging() {
        return this.batteryLevel < 20;
    }
}
