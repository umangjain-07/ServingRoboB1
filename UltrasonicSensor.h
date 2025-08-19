#ifndef ULTRASONIC_SENSOR_H
#define ULTRASONIC_SENSOR_H

#include <Arduino.h>

// Struct to hold ultrasonic sensor pins
struct UltrasonicSensorPins {
    int trig;
    int echo;
};

class UltrasonicSensor {
    int trigPin, echoPin;

public:
    UltrasonicSensor(const UltrasonicSensorPins &pins);

    void begin();
    float readCM();
    int speedLimit(int currentSpeed, float maxDistance = 100.0);
};

#endif
