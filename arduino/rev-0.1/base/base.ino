#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "Keyboard.h"

// Hardware configuration
//Set up nRF24L01 radio on SPI bus plus pins 9 & 10 
//RF24 (cepin, cspin) 
RF24 radio(8, 9);

//
// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[4] = {0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL, 0xF0F0F0F0C3LL, 0xF0F0F0F0B4LL};

unsigned long mandoACounter_sync = 0;
unsigned long mandoBCounter_sync = 0;
unsigned long mandoACounter_target = 0;
unsigned long mandoBCounter_target = 0;


void setup(void) {
    Keyboard.begin();
    pinMode(10, OUTPUT);
    Serial.begin(9600);
    // Setup and configure rf radio
    radio.begin();
    // optionally, increase the delay between retries & # of retries
    radio.setRetries(15, 15);
    // optionally, reduce the payload size.  seems to
    // improve reliability
    radio.setPayloadSize(8);
    radio.setPALevel(RF24_PA_HIGH);
    // Start listening
    radio.startListening();
    radio.openWritingPipe(pipes[1]);
    radio.openReadingPipe(1, pipes[0]);
    //radio.openWritingPipe(pipes[4]);
    radio.openReadingPipe(2, pipes[3]);
}

void loop(void) {
    // if there is data ready
   if ( radio.available() )
    {
      // Dump the payloads until we've gotten everything
      unsigned long msg;
      bool done = false;
      while (!done)
      {
         // Fetch the payload, and see if this was the last one.
         done = radio.read( &msg, sizeof(unsigned long) );        
         // Delay just a little bit to let the other unit
         // make the transition to receiver
         delay(20);
      }

      // First, stop listening so we can talk
      radio.stopListening();
      Serial.println(msg);
      // Send the final one back.
      radio.write( &msg, sizeof(unsigned long) );
      
      if(msg > 20000){
        mandoBCounter_target = msg - 20000;
        if(mandoBCounter_target < 0) mandoBCounter_target = 0;
      }
      if(msg < 20000){
        mandoACounter_target = msg;
        if(mandoACounter_target < 0) mandoACounter_target = 0;
      }

      // Now, resume listening so we catch the next packets.
      radio.startListening();
    }
    
    if(mandoBCounter_target > mandoBCounter_sync){
      sumaMandoB();
      mandoBCounter_sync++;
    }else
    if(mandoBCounter_target < mandoBCounter_sync){
      restaMandoB();
      mandoBCounter_sync--;
    }

    if(mandoACounter_target > mandoACounter_sync){
      sumaMandoA();
      mandoACounter_sync++;
    }else
    if(mandoACounter_target < mandoACounter_sync){
      restaMandoA();
      mandoACounter_sync--;
    }
    
    sumaMandoA();
    restaMandoA();
    sumaMandoB();
    restaMandoB();
}

void sumaMandoA(){
  Keyboard.press(KEY_RIGHT_ARROW);
  delay(5);
  Keyboard.release(KEY_RIGHT_ARROW);

}

void sumaMandoB(){
  Keyboard.press(KEY_LEFT_ARROW);
  delay(5);
  Keyboard.release(KEY_LEFT_ARROW);
}

void restaMandoA(){
  Keyboard.press(KEY_DOWN_ARROW);
  delay(5);
  Keyboard.release(KEY_DOWN_ARROW);

}

void restaMandoB(){
  Keyboard.press(KEY_UP_ARROW);
  delay(5);
  Keyboard.release(KEY_UP_ARROW);
}




