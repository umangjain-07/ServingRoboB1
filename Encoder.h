#ifndef ENCODER_H
#define ENCODER_H

#include <Arduino.h>
// Encoder pins struct
struct EncoderPins {
    int clk;
    int dt;
};

// Encoder class
class Encoder {
  int clkPin, dtPin;
  volatile long counter;      
  volatile int lastClkState;

public:
  Encoder(const EncoderPins &pins);

  void begin();
  void update();
  long getPosition();
  void setPosition(long pos);
  void reset();
};



#endif
