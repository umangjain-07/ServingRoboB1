#include "UltrasonicSensor.h"

UltrasonicSensor::UltrasonicSensor(const UltrasonicSensorPins &pins)
    : trigPin(pins.trig), echoPin(pins.echo) {}

void UltrasonicSensor::begin() {
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

float UltrasonicSensor::readCM() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    float distance = duration * 0.034 / 2;

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    return distance;
}

int UltrasonicSensor::speedLimit(int currentSpeed, float maxDistance) {
    float d = readCM();
    if (d < maxDistance) {
        return currentSpeed * (d / maxDistance);
    }
    return currentSpeed;
}
