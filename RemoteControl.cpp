#include "RemoteControl.h"

RemoteControl::RemoteControl(const RemotePins& pins) {
    chPins[0] = pins.ch1;
    chPins[1] = pins.ch2;
    chPins[2] = pins.ch3;
    chPins[3] = pins.ch4;
    chPins[4] = pins.ch5;
    chPins[5] = pins.ch6;

    for (int i = 0; i < 6; ++i) {
        rawCh[i] = 0UL;
        ch[i] = 0.0;
        lastReadMillis[i] = 0UL;
    }
}

void RemoteControl::begin() {
    for (int i = 0; i < 6; i++) {
        pinMode(chPins[i], INPUT);
    }
}

void RemoteControl::read() {
    unsigned long now = millis();
    for (int i = 0; i < 6; i++) {
        unsigned long val = pulseIn(chPins[i], HIGH, PULSE_TIMEOUT_US);
        rawCh[i] = val;
        lastReadMillis[i] = now;

        if (val == 0UL) ch[i] = 0.0;
        else {
            if (val < 800UL) val = 800UL;
            if (val > 2500UL) val = 2500UL;
            ch[i] = static_cast<double>(val);
        }
    }

    speed = mapSpeed(ch[4]);
    follow = (ch[2] > CH_NEUTRAL_HIGH);
}

double RemoteControl::getChannel(int channel) {
    if (channel >= 1 && channel <= 6) return ch[channel - 1];
    return 0;
}

void RemoteControl::getAllChannel() {
    for (int i = 1; i <= 6; i++) {
        Serial.print(":");
        Serial.print(getChannel(i));
    }
    Serial.println("");
}

bool RemoteControl::checkConnection() {
    unsigned long now = millis();
    if ((now - lastReadMillis[5]) > FRESHNESS_MS) {
        unsigned long val = pulseIn(chPins[5], HIGH, PULSE_TIMEOUT_US);
        rawCh[5] = val;
        lastReadMillis[5] = now;
        ch[5] = (val == 0UL) ? 0.0 : static_cast<double>((val < 800UL) ? 800UL : (val > 2500UL ? 2500UL : val));
    }

    if (ch[5] > CH_NEUTRAL_HIGH && ch[5] < CH_MAX_RAW) {
        if (!isConnected) Serial.println("Remote Connected");
        isConnected = true;
    } else isConnected = false;

    return isConnected;
}

void RemoteControl::handleControl(Base& base, StepperMotor& stepper) {
    read();

    double ch1 = ch[0];
    double ch2 = ch[1];
    double ch4 = ch[3];

    // Base motor control
    if (ch1 == 0 && ch2 == 0) base.stop();
    else if (ch1 > CH_NEUTRAL_HIGH && ch2 > CH_NEUTRAL_HIGH && ch1 < CH_MAX_RAW && ch2 < CH_MAX_RAW) base.forward(speed);
    else if (ch1 > CH_NEUTRAL_HIGH && ch2 < CH_NEUTRAL_LOW && ch1 < CH_MAX_RAW && ch2 < CH_MAX_RAW) base.turnRight(speed);
    else if (ch1 < CH_NEUTRAL_LOW && ch2 > CH_NEUTRAL_HIGH && ch1 < CH_MAX_RAW && ch2 < CH_MAX_RAW) base.turnLeft(speed);
    else if (ch1 < CH_NEUTRAL_LOW && ch2 < CH_NEUTRAL_LOW && ch1 < CH_MAX_RAW && ch2 < CH_MAX_RAW) base.backward(speed);
    else base.stop();

    // Stepper motor control
    if (ch4 == 0) return;
    else if (ch4 > CH_NEUTRAL_HIGH && ch4 < CH_MAX_RAW) stepper.moveLeft(100);
    else if (ch4 < CH_NEUTRAL_LOW && ch4 < CH_MAX_RAW) stepper.moveRight(100);
}

int RemoteControl::mapSpeed(double raw) {
    return constrain(((raw - RAW_MIN_REF) / 1000.0) * 255.0, 0, 255);
}
