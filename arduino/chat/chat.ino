
// Emisor/Receptor Wireless nRF24L01+

// Conectamos el emisor de la siguiente forma:
// Hardware SPI:
// MISO -> D12
// MOSI -> D11
// SCK  -> D13
// CE   -> D8
// CSN  -> D7
// Todas las entradas son Digitales
// http://arubia45.blogspot.com.es/


#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>

char *cadena;
String inputstring = "";              //cadena recibida desde el PC
boolean input_stringcomplete = false; //cadena recibida completamente desde el PC

void setup()
{
  Mirf.spi = &MirfHardwareSpi;
  // inicio de la emision
  Mirf.init();

  // Se envia un byte cada vez
  Mirf.payload = 1;

  // seleccionamos el canal
  Mirf.channel = 90;
  Mirf.config();

  // 1MHz
  Mirf.configRegister(RF_SETUP, 0x06);

  // Seleccionamos dirección
  Mirf.setTADDR((byte *)"TX_01");

  Serial.begin(57600);
  Serial.println("Iniciando ...");

}

// enviar cadena
void transmit(const char *string)
{
  byte c;

  for ( int i = 0 ; string[i] != 0x00 ; i++ )
  {
    c = string[i];
    Mirf.send(&c);
    while ( Mirf.isSending() ) ;
  }
}

// enviar una secuancia CR/LF
void transmitlf(void)
{
  byte c;

  c = '\r';
  Mirf.send(&c);
  while ( Mirf.isSending() ) ;

  c = '\n';
  Mirf.send(&c);
  while ( Mirf.isSending() ) ;
}

//Evento de recepcion de caracteres desde el PC
void serialEvent() {
  char inchar = (char)Serial.read();
  // Añadimos el caracter recibido a la cadena
  inputstring += inchar;
  // Fin de la cadena, recibido <CR>
  if (inchar == '\r') {
    input_stringcomplete = true;
  }
}


void loop()
{
  // Si se escribe algo por el puerto Serie lo envia.
  if (input_stringcomplete) {
    inputstring.toCharArray(cadena, 10);
    transmit(cadena);
    transmitlf();
    Serial.print("Yo-> ");
    Serial.println(inputstring);
    input_stringcomplete = false;
    inputstring = "";
  }

  // Esperando recepción
  byte c;

  if ( Mirf.dataReady() )
  {
    Mirf.getData(&c);
    Serial.print("El otro-> ");
    Serial.write(c);
  }

}




