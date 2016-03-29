
#define DELAY_BETWEEN_MESSAGES 10000
#include <Akeru.h>

#include <Adafruit_PN532.h>
#include <SPI.h>
#include <SoftwareSerial.h>

#define PN532_CS 10 // La pin CS peut être connectée à la sortie D9 ou D10.
Adafruit_PN532 nfc(PN532_CS);
#define NFC_DEMO_DEBUG 1

void setup()
{
#ifdef NFC_DEMO_DEBUG
    Serial.begin(9600); // Vérification liaison série.
    // Init modem
    Akeru.begin();
    Serial.println("Bonjour!");
#endif
    nfc.begin(); // Démarrage puce PN532.

    uint32_t versiondata = nfc.getFirmwareVersion();

    if (!versiondata) {
#ifdef NFC_DEMO_DEBUG // Vérification PN532.
        Serial.print("Puce PN532 absente");
#endif
        while (1)
            ;
    }
#ifdef NFC_DEMO_DEBUG // Vérification paramétrage de la puce.
    Serial.print("Puce detectee, PN5");
    Serial.println((versiondata >> 24) & 0xFF, HEX);
    Serial.print("Firmware version: ");
    Serial.print((versiondata >> 16) & 0xFF, DEC);
    Serial.print('.');
    Serial.println((versiondata >> 8) & 0xFF, DEC);
    Serial.print("Supports ");
    Serial.println(versiondata & 0xFF, HEX);

#endif
    nfc.SAMConfig(); // Configuration de la carte pour lire des tags et cartes RFID.
}

void loop()
{

    // Attente de disponiblité (envoi d'un messages toutes les 11 minutes : 140 messages par jour max)
    while (!Akeru.isReady()) {
        Serial.println("Modem en mode attente.");
        delay(2500);
    }

    Serial.println("Modem OK");

    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 }; // Buffer pour stocker l'UID NFC
    uint8_t uidLength; // Taille de l'UID (4 or 7 octets)

    bool success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        Serial.print("UID Length: ");
        Serial.print(uidLength, DEC);
        Serial.println(" bytes");

        Serial.print("UID Value: ");

        for (uint8_t i = 0; i < uidLength; i++) {
            Serial.print(" 0x");
            Serial.print((byte)uid[i], HEX);
        }
        Serial.println("");

        // Envoyer les données
        if (Akeru.send(uid, uidLength)) {
            Serial.println("Send OK");
        }
        else {
            Serial.println("Send NOK");
        }
        Serial.print("Mode attente pendant ");
        Serial.print(DELAY_BETWEEN_MESSAGES);
        Serial.println("ms.");
        delay(DELAY_BETWEEN_MESSAGES);
    }
    else {
        Serial.println("Timed out waiting for a card");
    }
}

