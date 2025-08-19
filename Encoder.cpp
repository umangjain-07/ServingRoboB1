#include "Encoder.h"

// ===== Encoder class implementation =====

Encoder::Encoder(const EncoderPins &pins) : clkPin(pins.clk), dtPin(pins.dt), counter(0), lastClkState(0) {}

void Encoder::begin() {
    pinMode(clkPin, INPUT_PULLUP);
    pinMode(dtPin, INPUT_PULLUP);
    lastClkState = digitalRead(clkPin);
}

void Encoder::update() {
    int clkState = digitalRead(clkPin);
    if (clkState != lastClkState) {
        if (digitalRead(dtPin) != clkState) counter++;  // CW
        else counter--;                                // CCW
        lastClkState = clkState;
    }
}

long Encoder::getPosition() {
    noInterrupts();
    long pos = counter;
    interrupts();
    return pos;
}

void Encoder::setPosition(long pos) {
    noInterrupts();
    counter = pos;
    interrupts();
}

void Encoder::reset() {
    setPosition(0);
}
