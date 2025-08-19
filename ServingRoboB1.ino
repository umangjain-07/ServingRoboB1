#include <Arduino.h>

// Core components
#include "Motor.h"
#include "Base.h"
#include "StepperMotor.h"
// #include "Encoder.h"
// #include "UltrasonicSensor.h"
// #include "IRSensor.h"
// #include "LineFollower3.h"
#include "RemoteControl.h"
// #include "IRArray.h"
// #include "LineFollower.h"
// #include "WiFiHandler.h"
// #include "JoystickController.h"

//===== PIN OBJECTS =====
MotorPins leftPins  = {9, 8}; //pwm dir
MotorPins rightPins = {10, 11}; //pwm dir
StepperMotorPins stepperPins = {30, 31, 32}; //step dir enable
RemotePins remotePins = {2, 3, 4, 5, 6, 7}; //ch1-ch6
// UltrasonicSensorPins frontUltraPins = {12,13}; //trig echo



// ===== HELPER FUNCTIONS =====

// void quickForward(int sp)   { 
//   sp = abs(sp);
//   Serial.print("Motor: forward @"); Serial.println(sp);
//   digitalWrite(leftPins.dir, HIGH);
//   digitalWrite(rightPins.dir, LOW);
//   analogWrite(leftPins.pwm, sp);
//   analogWrite(rightPins.pwm, sp);
//  }
// void quickBackward(int sp)  { 
//   sp = abs(sp);
//   Serial.print("Motor: backward @"); Serial.println(sp);
//     digitalWrite(leftPins.dir, LOW);
//   digitalWrite(rightPins.dir, HIGH);
//   analogWrite(leftPins.pwm, sp);
//   analogWrite(rightPins.pwm, sp);
//  }
// void quickLeft(int sp)      {  
//   sp = abs(sp); 
//   Serial.print("Motor: left @"); Serial.println(sp);
//   digitalWrite(leftPins.dir, LOW);
//   digitalWrite(rightPins.dir, LOW);
//   analogWrite(leftPins.pwm, sp);
//   analogWrite(rightPins.pwm, sp);
//    }
// void quickRight(int sp)     { 
//   sp = abs(sp);
//   Serial.print("Motor: right @"); Serial.println(sp);
//   digitalWrite(leftPins.dir, HIGH);
//   digitalWrite(rightPins.dir, HIGH);
//   analogWrite(leftPins.pwm, sp);
//   analogWrite(rightPins.pwm, sp);
//  }
// void quickStop()             {   
//   Serial.println("Motor: stop");
//   analogWrite(leftPins.pwm, 0);
//   analogWrite(rightPins.pwm, 0);
// }


//===== OBJECT DECLARATIONS =====
Motor leftMotor(leftPins);
Motor rightMotor(rightPins);
StepperMotor stepper(stepperPins);
Base base(leftMotor, rightMotor);
RemoteControl remote(remotePins);
// UltrasonicSensor frontUltra(frontUltraPins);



//===== MAIN SETUP =====
void setup() {
    Serial.begin(19200);
    stepper.begin();
    base.begin();
    remote.begin();
    Serial.println("Robot initialization complete");
}

//===== MAIN LOOP =====
void loop() {
    // int speed = 32;

    remote.checkConnection();
    if(remote.isConnected){
        remote.handleControl(base, stepper); 
    }








    // Optional line follower:
    // if(remote.follow){
    //     follower.followLine(speed);
    // }

    // Optional ultrasonic obstacle avoidance:
    // if(ultra.readCM() < 30){
    //     base.stop();
    // } else {
    //     follower.followLine(speed);
    // }

    // Optional WiFi joystick:
    /*
    String wifiCommand = wifi.receivePacket();
    if(wifiCommand.length() > 0){
        int x, y;
        if(wifi.parseJoystickCommand(wifiCommand,x,y)){
            joystick.moveWithValues(x,y);
        }
    }
    */

    // Optional physical joystick:
    // joystick.move();
}
