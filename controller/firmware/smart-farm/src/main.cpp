#include <Arduino.h>

// Declarations
void processInput(String message);
void processIrrigation(boolean newStatus);
void sendSenseData();
void outputMessage(String type, String payload);
String jsonEntry(String key, String value);
String jsonEntry(String key, float value);
String stringify(String string);

boolean isIrrigating;
int sensor;
int relay;
int sensorPower;

void setup()
{
  isIrrigating = false;
  sensor = 0;
  sensorPower = 10;
  relay = 9;
  // This first to avoid potential transient switching
  digitalWrite(relay, HIGH);
  pinMode(sensorPower, OUTPUT);
  pinMode(relay, OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  if (Serial.available() > 0)
  {
    String input = Serial.readStringUntil('\n');
    processInput(input);
  }
  delay(500);
}

void processInput(String input)
{
  input.trim();
  if (input.equalsIgnoreCase("on"))
  {
    processIrrigation(true);
  }
  else if (input.equalsIgnoreCase("off"))
  {
    processIrrigation(false);
  }
  else if (input.equalsIgnoreCase("sense"))
  {
    sendSenseData();
  }
  else
  {
    outputMessage("error", stringify("The option provided is invalid"));
  }
}

void processIrrigation(boolean newStatus)
{
  if (isIrrigating != newStatus)
  {
    if (newStatus)
    {
      digitalWrite(relay, LOW);
      outputMessage("info", stringify("Irrigation initiated"));
    }
    else
    {
      digitalWrite(relay, HIGH);
      outputMessage("info", stringify("Irrigation stopped"));
    }
    isIrrigating = newStatus;
  }
  else
  {
    String state = newStatus ? "on" : "off";
    outputMessage("info", stringify("The irrigation system is already in this state (" + state + ")"));
  }
}

void sendSenseData()
{
  digitalWrite(sensorPower, HIGH);
  delay(100);
  int moistureRaw = analogRead(0);
  long vmc = map(moistureRaw, 1023, 0, 0, 100);
  outputMessage("sense",
                "{" +
                    jsonEntry("moisture", vmc) +
                    "}");
  digitalWrite(sensorPower, LOW);
}

void outputMessage(String type, String payload)
{
  Serial.println(
      "{" +
      jsonEntry("type", stringify(type)) +
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