#ifndef STEPPER_MOTOR_H
#define STEPPER_MOTOR_H

#include <Arduino.h>

// Struct to hold stepper motor pins
struct StepperMotorPins {
    int step;
    int dir;
    int enable;
};

class StepperMotor {
    int stepPin, dirPin, enablePin;
    int pulseDelay;

public:
    // Constructor using pin struct, optional pulse delay
    StepperMotor(const StepperMotorPins &pins, int pulse = 156);

    void begin();
    void moveRight(int steps);
    void moveLeft(int steps);

private:
    void runPulse();
};

#endif
