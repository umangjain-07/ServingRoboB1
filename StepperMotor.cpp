#include "StepperMotor.h"

StepperMotor::StepperMotor(const StepperMotorPins &pins, int pulse) 
    : stepPin(pins.step), dirPin(pins.dir), enablePin(pins.enable), pulseDelay(pulse) {}

void StepperMotor::begin() {
    pinMode(stepPin, OUTPUT);
    pinMode(dirPin, OUTPUT);
    pinMode(enablePin, OUTPUT);
    digitalWrite(enablePin, LOW); // enable driver
}

void StepperMotor::moveRight(int steps) {
    Serial.print("Stepper Right @"); Serial.println(steps);
    digitalWrite(dirPin, HIGH);
    delayMicroseconds(10);
    for (int i = 0; i < steps; i++) runPulse();
}

void StepperMotor::moveLeft(int steps) {
    Serial.print("Stepper Left @"); Serial.println(steps);
    digitalWrite(dirPin, LOW);
    delayMicroseconds(10);
    for (int i = 0; i < steps; i++) runPulse();
}

void StepperMotor::runPulse() {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(pulseDelay);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(pulseDelay);
}
