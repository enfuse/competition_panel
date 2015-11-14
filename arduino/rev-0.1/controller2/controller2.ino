#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

//
// Hardware configuration
// Set up nRF24L01 radio on SPI bus plus pins 9 & 10
RF24 radio(9, 10);

// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[4] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL, 0xF0F0F0F0C3LL, 0xF0F0F0F0B4LL};

short int data[3];
bool pressed = false;
unsigned long contador_sync = 0;
unsigned long contador = 0;
unsigned long deviceid = 20000;
//Logn press
int current; //Current state of the button (LOW is pressed b/c i'm using the pullup resistors
int count;   // How long the button was held (secs)
byte previous = HIGH;
unsigned long firstTime;   // how long since the button was first pressed 


void setup(void)
{
  Serial.begin(9600);
  pinMode(10, OUTPUT);
  radio.begin();
  // optionally, increase the delay between retries & # of retries
  radio.setRetries(15, 15);

  // optionally, reduce the payload size.  seems to
  // improve reliability
  radio.setPayloadSize(8);
  radio.setPALevel(RF24_PA_HIGH);
  
  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1, pipes[1]);

  //Pulsador principal
  attachInterrupt(digitalPinToInterrupt(2), actualizaConta, RISING);
}

void loop(void)
{
  current = digitalRead(2);
  if (current == HIGH && previous == LOW && millis()- firstTime > 200){    
    firstTime = millis();
  }
  if (current == HIGH && millis() - firstTime > 1500){    
    contador = contador - 1;
    firstTime = millis();
  }
  
  previous = current;
  
  if(contador != contador_sync){
    // First, stop listening so we can talk.
    radio.stopListening();
    unsigned long msg = deviceid + contador;
    bool ok = radio.write( &msg, sizeof(unsigned long) );
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
        unsigned long msg;
        radio.read( &msg, sizeof(unsigned long) );
        Serial.println(deviceid + msg);
        if (msg == deviceid + contador) {
          contador_sync = msg - deviceid;
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
