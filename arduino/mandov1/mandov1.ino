#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

//
// Hardware configuration
// Set up nRF24L01 radio on SPI bus plus pins 9 & 10 
RF24 radio(9,10);

// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

void setup(void)
{

 pinMode(10, OUTPUT); 
  Serial.begin(9600);

  radio.begin();

  // optionally, increase the delay between retries & # of retries
  radio.setRetries(15,15);

  // optionally, reduce the payload size.  seems to
  // improve reliability
  //radio.setPayloadSize(8);

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1,pipes[1]);
}

void loop(void)
{

    // First, stop listening so we can talk.
    radio.stopListening();

    // Take the time, and send it.  This will block until complete
    //unsigned long time = millis();
    unsigned long time = 88888;
    Serial.print("Enviando  ");
    Serial.println(time);
    bool ok = radio.write( &time, sizeof(unsigned long) );

    if (ok){
      Serial.println("ok...");}
    else{
      Serial.println("failed");}

    // Now, continue listening
    radio.startListening();

    // Wait here until we get a response, or timeout (250ms)
    unsigned long started_waiting_at = millis();
    bool timeout = false;
    while ( ! radio.available() && ! timeout ){
      if (millis() - started_waiting_at > 200 ){timeout = true;}   
    }
    // Describe the results
    if ( timeout )
    {
      Serial.println("Failed, response timed out");
    }
    else
    {
      // Grab the response, compare, and send to debugging spew
      unsigned long got_time;
      radio.read( &got_time, sizeof(unsigned long) );

      // Spew it
      Serial.print("Respuesta = ");
      Serial.println(got_time);
    }

    // Try again 1s later
    delay(500);

}
