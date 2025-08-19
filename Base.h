#ifndef BASE_H
#define BASE_H

#include <Arduino.h>
#include "Motor.h"

// Struct to hold left/right motor pins
struct BasePins {
    int leftPWM, leftDIR;
    int rightPWM, rightDIR;
};

class Base {
    Motor &left;
    Motor &right;

public:
    Base(Motor &l, Motor &r);

    void begin();
    void forward(int speed);
    void backward(int speed);
    void turnLeft(int speed);
    void turnRight(int speed);
    void stop();
};

#endif
