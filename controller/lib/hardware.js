import { SerialPort, ReadlineParser } from "serialport";

export class Hardware {
	constructor(serialPath, serialBaudRate) {
		const parser = new ReadlineParser({ delimiter: "\n" });
		const serialPort = new SerialPort({
			path: serialPath,
			baudRate: serialBaudRate,
		});
		serialPort.on("open", () => {
			console.log("Hardware is ready");
		});
		serialPort.pipe(parser);
		this._parser = parser;
		this._serialPort = serialPort;
	}

	async irrigate() {
		const { payload } = await this._communicate("on");
		console.log(payload);
		// Blocks unless I manually return a resolve for some reason
		return Promise.resolve();
	}

	async stopIrrigating() {
		const { payload } = await this._communicate("off");
		console.log(payload);
		return Promise.resolve();
	}

	async sense() {
		const { payload } = await this._communicate("sense");
		return payload;
	}

	async shutdown() {
		await this.stopIrrigating();
		this._serialPort.end();
		this._serialPort.close();
	}

	async _communicate(message) {
		return new Promise(resolve => {
			this._parser.once("data", serialData => {
				const json = JSON.parse(serialData);
				resolve(json);
			});
			this._serialPort.write(`${message}\n`);
			this._serialPort.drain();
		});
	}
}
