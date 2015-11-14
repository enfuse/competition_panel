#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

//
// Hardware configuration
// Set up nRF24L01 radio on SPI bus plus pins 9 & 10
RF24 radio(9, 10);

// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

unsigned long contador_sync = 0;
unsigned long contador = 0;

void setup(void)
{

  pinMode(10, OUTPUT);
  radio.begin();
  // optionally, increase the delay between retries & # of retries
  radio.setRetries(15, 15);

  // optionally, reduce the payload size.  seems to
  // improve reliability
  //radio.setPayloadSize(8);

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1, pipes[1]);

  //Pulsador principal
  attachInterrupt(digitalPinToInterrupt(2), actualizaConta, RISING);
}

void loop(void)
{
  if(contador != contador_sync){
    // First, stop listening so we can talk.
    radio.stopListening();
    bool ok = radio.write( &contador, sizeof(unsigned long) );
    if (ok) {
  
      // Now, continue listening
      radio.startListening();
  
      // Wait here until we get a response, or timeout (250ms)
      unsigned long started_waiting_at = millis();
      bool timeout = false;
      while ( ! radio.available() && ! timeout ) {
        if (millis() - started_waiting_at > 200 ) {
          timeout = true;
        }
      }
      // Describe the results
      if ( timeout )
      {
        //error... mal asunto
      }
      else
      {
        // Grab the response, compare, and send to debugging spew
        unsigned long got_time;
        radio.read( &got_time, sizeof(unsigned long) );
        if (got_time == contador) {
          contador_sync = got_time;
        }
      }
    }
  }
}

void actualizaConta() {
  static unsigned long last_interrupt_time = 0;
  unsigned long interrupt_time = millis();
  // If interrupts come faster than 200ms, assume it's a bounce and ignore
  if (interrupt_time - last_interrupt_time > 100)
  {
    contador++;
  }
  last_interrupt_time = interrupt_time;
}
