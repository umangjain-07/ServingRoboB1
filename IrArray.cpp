#include "IRArray.h"
#include <Arduino.h>

// ----- IRArray -----
IRArray::IRArray(const IRArrayPins& pinConfig)
    : pins(pinConfig.sensorPins), numSensors(pinConfig.count), powerPin(pinConfig.powerPin) {
    analogValues = new int[numSensors];
    digitalValues = new int[numSensors];
}

IRArray::~IRArray() {
    delete[] analogValues;
    delete[] digitalValues;
}

void IRArray::begin() {
    if (powerPin >= 0) {
        pinMode(powerPin, OUTPUT);
        digitalWrite(powerPin, HIGH);  // power on IR sensors
    }

    for (int i = 0; i < numSensors; ++i) {
        pinMode(pins[i], INPUT);
    }
}

void IRArray::readAnalog() {
    for (int i = 0; i < numSensors; ++i) {
        analogValues[i] = analogRead(pins[i]);
        digitalValues[i] = (analogValues[i] < BLACK_THRESHOLD) ? 1 : 0;
    }
}

void IRArray::readDigital() {
    for (int i = 0; i < numSensors; ++i) {
        digitalValues[i] = digitalRead(pins[i]);
    }
}

const int* IRArray::getDigitalValues() const {
    return digitalValues;
}

void IRArray::debugDigital() {
    Serial.print("IR: ");
    for (int i = 0; i < numSensors; ++i) {
        Serial.print(digitalValues[i]);
        if (i < numSensors - 1) Serial.print(", ");
    }
    Serial.println();
}

// ----- LineFollower -----
LineFollower::LineFollower(IRArray& sensorArray, Base& b) : ir(sensorArray), base(b) {}

void LineFollower::followLine(int speed) {
    ir.readDigital();
    const int* d = ir.getDigitalValues();

    // Support for any size array, but here we use first 8 sensors
    int s[8] = {0};
    for (int i = 0; i < 8 && i < ir.getDigitalValues()[0]; i++) s[i] = d[i];

    int right_array = 4 * s[0] + 2 * s[1] + s[2];
    int mid_array   = 3 * s[3] + 3 * s[4];
    int left_array  = s[5] + 2 * s[6] + 4 * s[7];

    if (mid_array + left_array + right_array == 0) {
        Serial.print("All equal 0 ");
        base.stop();
    } else if (right_array == 7 && left_array == 7) {
        Serial.print("Decision-fork ");
        base.stop();
    } else if (right_array == 7) {
        Serial.print("All right ");
        base.turnRight(speed + 30);
    } else if (left_array == 7) {
        Serial.print("All left ");
        base.turnLeft(speed + 30);
    } else if (right_array >= mid_array && mid_array != 0) {
        Serial.print("Right better ");
        base.turnRight(speed - 15 + 2 * right_array);
    } else if (left_array >= mid_array && mid_array != 0) {
        Serial.print("Left better ");
        base.turnLeft(speed - 15 + 2 * left_array);
    } else if (mid_array > 0) {
        Serial.print("base forward ");
        base.forward(speed);
    } else {
        Serial.print("Default ");
        base.stop();
    }
}
