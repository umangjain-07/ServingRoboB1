#ifndef JOYSTICKCONTROLLER_H
#define JOYSTICKCONTROLLER_H

#include <Arduino.h>
#include "Base.h"

struct JoystickPins {
    int xPin;
    int yPin;
    int baseX;
    int baseY;
};

class JoystickController {
    JoystickPins pins;
    Base& base;

public:
    JoystickController(const JoystickPins& jp, Base& b);
    void begin();
    void move();
    void moveWithValues(int x, int y);

private:
    int mapToSpeed(int val, int baseVal, int deadZone = 30);
};

#endif
