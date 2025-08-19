#include "Motor.h"

Motor::Motor(const MotorPins &pins) : pwmPin(pins.pwm), dirPin(pins.dir) {}

void Motor::begin() {
    pinMode(pwmPin, OUTPUT);
    pinMode(dirPin, OUTPUT);
}

void Motor::forward(int speed) {
    digitalWrite(dirPin, HIGH);
    analogWrite(pwmPin, constrain(speed, 0, 255));
}

void Motor::backward(int speed) {
    digitalWrite(dirPin, LOW);
    analogWrite(pwmPin, constrain(speed, 0, 255));
}

void Motor::stop() {
    analogWrite(pwmPin, 0);
}
