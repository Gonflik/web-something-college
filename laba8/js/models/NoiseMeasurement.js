export class NoiseMeasurement {
    constructor(value, measuredAt = new Date()) {
        this.value = value;
        this.measuredAt = measuredAt;
    }

    isValid(minValid, maxValid) {
        return Number.isFinite(this.value)
            && this.value >= minValid
            && this.value <= maxValid;
    }

    toString() {
        const time = this.measuredAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
        return `${this.value} dB о ${time}`;
    }
}
