#ifndef IRARRAY_H
#define IRARRAY_H

#include <Arduino.h>
#include "Base.h"

// Struct for IR array pins
struct IRArrayPins {
    const int* sensorPins;  // pointer to an array of pin numbers
    int count;              // number of sensors
    int powerPin;           // optional power pin (-1 if unused)
};

class IRArray {
    const int* pins;
    int numSensors;
    int powerPin;
    int* analogValues;
    int* digitalValues;
    const int BLACK_THRESHOLD = 500;

public:
    IRArray(const IRArrayPins& pinConfig);
    ~IRArray();

    void begin();
    void readAnalog();
    void readDigital();
    const int* getDigitalValues() const;
    void debugDigital();
};

class LineFollower {
    IRArray& ir;
    Base& base;

public:
    LineFollower(IRArray& sensorArray, Base& b);
    void followLine(int speed);
};

#endif
