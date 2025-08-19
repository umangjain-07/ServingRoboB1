#include "Base.h"

Base::Base(Motor &l, Motor &r) : left(l), right(r) {}

void Base::begin() {
    left.begin();
    right.begin();
}

void Base::forward(int speed) {
    Serial.print("Motor: forward @"); Serial.println(speed);
    left.forward(speed);
    right.backward(speed);
}

void Base::backward(int speed) {
    Serial.print("Motor: backward @"); Serial.println(speed);
    left.backward(speed);
    right.forward(speed);
}

void Base::turnLeft(int speed) {
    Serial.print("Motor: left @"); Serial.println(speed);
    left.backward(speed + 15);
    right.backward(speed + 15);
}

void Base::turnRight(int speed) {
    Serial.print("Motor: right @"); Serial.println(speed);
    left.forward(speed + 15);
    right.forward(speed + 15);
}

void Base::stop() {
    Serial.println("Motor: stop");
    left.stop();
    right.stop();
}
