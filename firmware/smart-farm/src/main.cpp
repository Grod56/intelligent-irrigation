#include <Arduino.h>

// Declarations
void processInput(String message, String id);
String processIrrigation(boolean newStatus);
String processSenseData();
void outputMessage(String id, String payload);
String jsonEntry(String key, String value);
String jsonEntry(String key, float value);
String stringify(String string);

boolean isIrrigating;
int sensorPower;
int sensor;
int relay;

void setup()
{
	isIrrigating = false;
	sensorPower = 10;
	sensor = 0;
	relay = 9;
	// This first to avoid potential transient switching
	digitalWrite(relay, HIGH);
	pinMode(sensorPower, OUTPUT);
	pinMode(relay, OUTPUT);
	Serial.begin(115200);
}

void loop()
{
	if (Serial.available() > 0)
	{
		String id = Serial.readStringUntil('|');
		String input = Serial.readStringUntil('\n');
		processInput(input, id);
	}
	delay(500);
}

void processInput(String input, String id)
{
	input.trim();
	String payload;
	if (input.equalsIgnoreCase("on"))
	{
		payload = processIrrigation(true);
	}
	else if (input.equalsIgnoreCase("off"))
	{
		payload = processIrrigation(false);
	}
	else if (input.equalsIgnoreCase("sense"))
	{
		payload = processSenseData();
	}
	else
	{
		payload = stringify("The option provided is invalid");
	}
	outputMessage(id, payload);
}

String processIrrigation(boolean newStatus)
{
	if (isIrrigating != newStatus)
	{
		isIrrigating = newStatus;
		if (newStatus)
		{
			digitalWrite(relay, LOW);
			return stringify("Irrigation initiated");
		}
		else
		{
			digitalWrite(relay, HIGH);
			return stringify("Irrigation stopped");
		}
	}
	else
	{
		String status = newStatus ? "on" : "off";
		return stringify("The irrigation system is already in this state (" + status + ")");
	}
}

String processSenseData()
{
	digitalWrite(sensorPower, HIGH);
	delay(100);
	int moistureRaw = analogRead(0);
	long vmc = map(moistureRaw, 1023, 0, 0, 100);
	digitalWrite(sensorPower, LOW);
	return "{" + jsonEntry("moisture", vmc) + "}";
}

void outputMessage(String id, String payload)
{
	Serial.println("{" +
				   jsonEntry("id", stringify(id)) +
				   ", " +
				   jsonEntry("payload", payload) +
				   "}");
}

String jsonEntry(String key, String value)
{
	return stringify(key) + ": " + value;
}
String jsonEntry(String key, float value)
{
	return stringify(key) + ": " + value;
}

String stringify(String string)
{
	return "\"" + string + "\"";
}