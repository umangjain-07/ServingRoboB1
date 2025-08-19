#ifndef REMOTECONTROL_H
#define REMOTECONTROL_H

#include <Arduino.h>
#include "Base.h"
#include "StepperMotor.h"

// Struct to hold the 6 channel pin numbers
struct RemotePins {
    int ch1, ch2, ch3, ch4, ch5, ch6;
};

class RemoteControl {
    unsigned long rawCh[6];
    double ch[6];
    unsigned long lastReadMillis[6];
    int chPins[6];

public:
    int speed = 0;
    bool follow = false;
    bool isConnected = false;

    static constexpr unsigned long PULSE_TIMEOUT_US = 25000UL;
    static constexpr unsigned long FRESHNESS_MS = 50UL;

    static constexpr int CH_NEUTRAL_LOW = 1460;
    static constexpr int CH_NEUTRAL_HIGH = 1530;
    static constexpr int CH_MAX_RAW = 2000;
    static constexpr int RAW_MIN_REF = 990;

    RemoteControl(const RemotePins& pins);

    void begin();
    void read();
    double getChannel(int channel);
    void getAllChannel();
    bool checkConnection();
    void handleControl(Base& base, StepperMotor& stepper);

private:
    int mapSpeed(double raw);
};

#endif
