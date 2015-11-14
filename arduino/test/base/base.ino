#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "Keyboard.h"

// Hardware configuration
//Set up nRF24L01 radio on SPI bus plus pins 9 & 10 
//RF24 (cepin, cspin) 
RF24 radio(8,9);

//
// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };
  unsigned long mando1 = 0;
void setup(void)
{
  Keyboard.begin();
 pinMode(10, OUTPUT); 
  Serial.begin(9600);

  // Setup and configure rf radio
  radio.begin();
  // optionally, increase the delay between retries & # of retries
  radio.setRetries(15,15);
  // optionally, reduce the payload size.  seems to
  // improve reliability
  //radio.setPayloadSize(8);

  // Start listening
  radio.startListening();
  radio.openWritingPipe(pipes[1]);
  radio.openReadingPipe(1,pipes[0]);
}

void loop(void)
{

    // if there is data ready
    if ( radio.available() )
    {
      // Dump the payloads until we've gotten everything
      unsigned long got_time;
      bool done = false;
      while (!done)
      {
        // Fetch the payload, and see if this was the last one.
        done = radio.read( &got_time, sizeof(unsigned long) );
        
         // Delay just a little bit to let the other unit
         // make the transition to receiver
         delay(20);
      }

      // First, stop listening so we can talk
      radio.stopListening();

      // Send the final one back.
      radio.write( &got_time, sizeof(unsigned long) );

      if(got_time> mando1){
        Keyboard.press(KEY_RIGHT_ARROW);
        delay(5);
        Keyboard.release(KEY_RIGHT_ARROW);
      }

      // Now, resume listening so we catch the next packets.
      radio.startListening();
    }
}
