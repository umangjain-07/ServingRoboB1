#ifndef MOTOR_H
#define MOTOR_H

#include <Arduino.h>

// Struct to hold motor pins
struct MotorPins {
    int pwm;
    int dir;
};

class Motor {
  int pwmPin, dirPin;

public:
  // Constructor using pin struct
  Motor(const MotorPins &pins);

  void begin();
  void forward(int speed);
  void backward(int speed);
  void stop();
};

#endif
