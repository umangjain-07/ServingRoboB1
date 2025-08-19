#include "JoystickController.h"

JoystickController::JoystickController(const JoystickPins& jp, Base& b)
    : pins(jp), base(b) {}

void JoystickController::begin() {
    pinMode(pins.xPin, INPUT);
    pinMode(pins.yPin, INPUT);
}

int JoystickController::mapToSpeed(int val, int baseVal, int deadZone) {
    if (abs(val - baseVal) <= deadZone) return 0;
    if (val > baseVal) {
        int range = 1023 - (baseVal + deadZone);
        return ((val - baseVal - deadZone) * 220) / range;
    } else {
        int range = baseVal - deadZone;
        return -((baseVal - deadZone - val) * 220) / range;
    }
}

void JoystickController::move() {
    int joyX = analogRead(pins.xPin);
    int joyY = analogRead(pins.yPin);

    int mappedX = mapToSpeed(joyX, pins.baseX);
    int mappedY = mapToSpeed(joyY, pins.baseY);

    int absX = abs(mappedX);
    int absY = abs(mappedY);
    const int DEAD_THRESH = 40;

    if (absX < DEAD_THRESH && absY < DEAD_THRESH) {
        base.stop();
        return;
    }

    if (absY > absX) {
        if (mappedY > 0) base.backward(absY);
        else base.forward(absY);
    } else {
        if (mappedX > 0) base.turnRight(absX);
        else base.turnLeft(absX);
    }
}

void JoystickController::moveWithValues(int x, int y) {
    int mappedX = mapToSpeed(x, pins.baseX, 0);
    int mappedY = mapToSpeed(y, pins.baseY, 0);

    int absX = abs(mappedX);
    int absY = abs(mappedY);
    const int DEAD_THRESH = 40;

    if (absX < DEAD_THRESH && absY < DEAD_THRESH) {
        base.stop();
        return;
    }

    if (absY > absX) {
        if (mappedY > 0) base.backward(absY);
        else base.forward(absY);
    } else {
        if (mappedX > 0) base.turnRight(absX);
        else base.turnLeft(absX);
    }
}
