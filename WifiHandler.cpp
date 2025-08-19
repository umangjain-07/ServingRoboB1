// #include "WiFiHandler.h"

// WiFiHandler::WiFiHandler(const WiFiConfig& cfg) : config(cfg) {}

// void WiFiHandler::connect() {
//     Serial.print("Connecting to WiFi: ");
//     Serial.println(config.ssid);
//     WiFi.begin(config.ssid, config.password);

//     while (WiFi.status() != WL_CONNECTED) {
//         delay(1000);
//         Serial.print(".");
//     }

//     Serial.println("\nWiFi connected!");
//     Serial.print("IP Address: ");
//     Serial.println(WiFi.localIP());

//     udp.begin(config.port);
//     Serial.print("Listening on UDP port ");
//     Serial.println(config.port);
// }

// bool WiFiHandler::isConnected() {
//     return WiFi.status() == WL_CONNECTED;
// }

// String WiFiHandler::receivePacket() {
//     int packetSize = udp.parsePacket();
//     if (packetSize > 0) {
//         int len = udp.read(packetBuffer, sizeof(packetBuffer) - 1);
//         if (len > 0) packetBuffer[len] = '\0';
//         return String(packetBuffer);
//     }
//     return "";
// }

// bool WiFiHandler::parseJoystickCommand(String command, int& x, int& y) {
//     if (command.startsWith("/joystick")) {
//         int xIndex = command.indexOf("x=");
//         int yIndex = command.indexOf("y=");
//         if (xIndex != -1 && yIndex != -1) {
//             int xStart = xIndex + 2;
//             int xEnd = min(xStart + 4, command.length());
//             x = command.substring(xStart, xEnd).toInt();

//             int yStart = yIndex + 2;
//             int yEnd = min(yStart + 4, command.length());
//             y = command.substring(yStart, yEnd).toInt();

//             return true;
//         }
//     }
//     return false;
// }
