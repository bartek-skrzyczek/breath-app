# Instalacja #

```bash
npm install
```
Instaluje wszystkie zależności backendowe na podstawie packange.json
Więcej informacji: https://docs.npmjs.com/

```bash
bower install
```
Instaluje wszystkie zależności frontowe na podstawie pliku bower.json. 
Więcej informacji: http://bower.io/#getting-started

```bash
grunt prepare
```
Przygotowuje ustawienia cordovy do platform mobilnych


# Taski grantowe #

Więcej informacji: http://gruntjs.com/getting-started

```bash
grunt watch
```
Sprwadza zmiany w katalogu /app/style i jeżeli jakieś się pojawiły przelicza na nowo style generując plik style.css

```bash
grunt build
```
1. Kompiluje sass w trybie produkcyjnym (skompresowane i zminifikowane)
2. Łączy pliki JS i następnie je minifikuje
3. Wycina wszystkie komentarze z js'a
4. Przygotowuje nowy katalog _dist do którego wrzuca przygotowane pliki
5. w _dist znajduje się wersja produkcyjna

```bash
grunt jshint
```
Przeprowadza analizę kodu i raportuje naruszenia zdefiniowanych reguł.

```bash
grunt serve
```
Uruchamia serwer www frontu aplikacji na porcie 8080 ustawia watch'a i livereload

```bash
grunt cordova-build
```
Buduje aplikacje w trybie dla cordovy

```bash
grunt cordova-run-android
```
Buduje aplikacje w trybie dla cordovy i wysyła ją przez usb na urządzenie mobilne
