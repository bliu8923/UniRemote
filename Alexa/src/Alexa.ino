// This #include statement was automatically added by the Particle IDE.
#include "DHT.h"

#define DHTPIN          D6
#define DHTTYPE         DHT22

#define DELAY           5000

#include <IRTransmitter/IRTransmitter.h>

#define IR_PIN D3
#define LED_PIN D7

DHT dht(DHTPIN, DHTTYPE);
int temperature = 0;
int humidity = 0;

// Returns temperature
int getTemperature(String args){
    return temperature;
}

// Returns humidity
int getHumidity(String args){
    return humidity;
}



// Turn on/off LEDs
unsigned int  dataon[67] = {8800,4450, 550,1600, 550,1650, 550,1650, 550,550, 550,550, 550,550, 550,550, 550,1600, 550,1650, 550,600, 500,1650, 550,550, 550,550, 550,550, 550,1650, 500,600, 500,1650, 550,1650, 550,1650, 550,550, 500,1700, 500,550, 550,550, 550,550, 550,550, 550,550, 550,550, 550,1600, 550,600, 500,1650, 550,1600, 600,1650, 550};  // NEC E1A2E817
unsigned int  dataComp[67] = {8850,4350, 600,1600, 600,1600, 600,1600, 550,550, 550,550, 550,500, 600,500, 600,1600, 600,1600, 550,550, 550,1650, 550,500, 600,500, 550,550, 550,1650, 550,550, 550,550, 550,550, 550,550, 550,1600, 550,1650, 550,550, 550,550, 550,550, 550,1650, 550,1600, 600,1600, 550,550, 550,550, 550,1650, 550,1600, 600,1600, 550};  // NEC E1A218E7
unsigned int  dataVideo[67] = {8800,4400, 550,1650, 550,1650, 550,1600, 550,550, 550,550, 550,550, 550,550, 550,1650, 550,1650, 550,500, 550,1650, 550,550, 550,550, 550,550, 550,1650, 550,550, 550,1650, 500,550, 550,550, 550,1650, 500,1700, 550,550, 500,550, 550,550, 550,550, 550,1650, 550,1650, 500,600, 550,550, 550,1650, 500,1650, 550,1650, 500};  // NEC E1A29867
unsigned int  dataSearch[67] = {8850,4350, 550,1650, 550,1650, 550,1650, 550,550, 550,500, 600,500, 550,550, 550,1650, 550,1650, 550,550, 550,1600, 600,500, 550,550, 550,550, 550,1650, 550,550, 550,550, 550,1600, 600,500, 550,1650, 550,1650, 550,550, 550,550, 550,550, 550,1600, 600,500, 550,1650, 550,550, 550,550, 550,1650, 550,1600, 600,1600, 550};  // NEC E1A258A7
IRTransmitter transmitter(IR_PIN, LED_PIN);
int controlled(String args){
    Serial.print("HI");
    int pos = args.indexOf(',');

    if(-1 == pos){
        return -1;
    }

    String strPin = args.substring(0, pos);
    String strValue = args.substring(pos + 1);
    boolean tv = false;
    Serial.println();
    Serial.print("Pin: ");
    Serial.print(strPin);
    Serial.print(" ");
    Serial.print("Value: ");
    Serial.print(strValue);
    Serial.println();

    int pin = D0;
    int value = HIGH;

    if(strPin.equalsIgnoreCase("D0")){
        pin = D0;
    }
    else if(strPin.equalsIgnoreCase("D1")){
        pin = D1;
    }
    else if(strPin.equalsIgnoreCase("D2")){
        if(strValue.equalsIgnoreCase("HIGH")){
          transmitter.Transmit(dataon, sizeof(dataon) / sizeof(dataon[0]));
          tv = true;
          Serial.println("yeee");
        }
    }
    else{
        return -2;
    }

    if(strValue.equalsIgnoreCase("HIGH")){
        value = HIGH;
    }
    else if(strValue.equalsIgnoreCase("LOW")){
        value = LOW;
    }
    else{
        return -3;
    }
    if(tv == false){
      digitalWrite(pin, value);
    }

  //  return 1;
}

void setup() {
    Serial.begin(115200);
    dht.begin();
    pinMode(D0, OUTPUT);
    pinMode(D1, OUTPUT);

    // Particle Functions
    Spark.function("gettmp", getTemperature);
    Spark.function("gethmd", getHumidity);
    Spark.function("ctrlled", controlled);
}

void loop() {
    // Get temperature and humidity
    temperature = (int)dht.readTemperature(true);
    humidity = (int)dht.readHumidity();

    Serial.println();
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println();

    delay(DELAY);
}
