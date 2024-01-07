In der Spale `Profil`:
* 12er-Blöcke
* die ersten 4 Ziffern geben die Tiefe in Dezimeter an
* `033800000000` bedeutet 33.8m

In der Spalte `Profil2`
* 11er Blöcke
* die ersten beiden Ziffern geben die Temparatur in °C an
* die 8. Ziffer gibt die Flaschennummer an (Gaswechsel)
* `16000002000` bedeutet 16°C, Flasche Nr.2

In der Spalte `Profil4`
* 9er Blöcke
* Die ersten drei Ziffer gibt bei Nullzeit die verbleibende Nullzeit in Minuten an (max=99?)
  * Bei Deko geben sie die verbleibende Time to Surface an
* Die darauf folgenden drei Ziffer gibt bei Nullzeit die verbleibende Nullzeit in Minuten an (max=99?)
  * Bei Deko geben sie die zu verbleibende Zeit auf der Stopp-Tiefe in Minuten an
* Die letzten 3 (oder 2?) Ziffern geben die Deko-Stopp Tiefe in Metern an
* `019019000` bedeutet: Noch 19min Nullzeit
* `015001012` bedeuet: TTS 15min, 1min Stopp auf 12m


Die Spalte `ProfileInt` ist der Intervall in Sekunden (10 = 10-Sekunden-Schritte)