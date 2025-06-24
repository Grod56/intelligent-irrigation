import { SerialPort, ReadlineParser } from "serialport";
import { EventEmitter } from "node:events";

export class Hardware {
	constructor(serialPath, serialBaudRate) {
		const parser = new ReadlineParser({ delimiter: "\n" });
		const serialPort = new SerialPort({
			path: serialPath,
			baudRate: serialBaudRate,
		});
		const eventOrders = new EventEmitter();
		serialPort.on("open", () => {
			serialPort.flush();
			serialPort.pipe(parser);
			console.log("Hardware is ready");
		});
		parser.on("data", serialData => {
			const { id, payload } = JSON.parse(serialData);
			eventOrders.emit(id, payload);
		});
		this._eventOrders = eventOrders;
		this._orderNo = 0;
		this._writable = true;
		this._parser = parser;
		this._serialPort = serialPort;
	}

	async irrigate() {
		const response = await this._communicate("on");
		console.log(response);
		return response;
	}

	async stopIrrigating() {
		const response = await this._communicate("off");
		console.log(response);
		return response;
	}

	async sense() {
		return this._communicate("sense");
	}

	async shutdown() {
		await this.stopIrrigating();
		this._serialPort.end();
		this._serialPort.close();
	}

	async _communicate(message) {
		const orderNo = String(this._orderNo++);
		const promise = new Promise(resolve => {
			this._eventOrders.once(orderNo, payload => {
				resolve(payload);
			});
		});
		while (!this._writable) {
			await sleep(0.1);
		}
		this._writable = false;
		this._serialPort.write(`${orderNo}|${message}\n`);
		this._serialPort.drain(() => (this._writable = true));
		return promise;
	}
}
