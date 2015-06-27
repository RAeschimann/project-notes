# project-notes

Allgemeine Informationen zur CAS-FEE Projektaufgabe 1

Um die Grundlagen bewerten zu können, sind grössere „Frameworks" wie Bootstrap nicht erlaubt.
Ältere Browser müssen nicht unterstützt werden. Flex-Layout darf verwendet werden.
Das erste Projekt sollte keine Single Page Application sein. Wird aber nicht explizit „verboten"

Abgabe des Projektes bis 28 Juni.

Folgende Kriterien bilden die Basis für die Endabgabe (leichte Änderungen noch möglich):

Funktionsumfang
- Editieren und erfassen von Notizen
- Sortieren von Notizen
- Filtern von „abgeschlossenen" Notizen
- Abspeichern der Daten auf dem Server
- Wechseln des Styles

Dazu auch
- Besonders nützliche Zusatz-„Features"
- JavaScript Qualität
- Kein Copy & Paste Code
- „this" richtig verwendet
- Keine globalen Variablen
- jQuery Best Practices verwendet.
- Kein JavaScript im HTML
- Besonders schöne Konstrukte
- Besonders schlechte Konstrukte
- HTML / CSS Qualität
- Keine (wenige) Inline Styles verwendet
- Übersichtliche CSS-Files
- Komplexität des HTML Layouts
- Verwenden einer Template Engine zum Erstellen der *dynamischen" Daten
 
Sonstiges
- Projektstruktur
- JavaScript Errors


## Aufsetzen

(lokale git- und node-Installation werden vorausgesetzt)

```bash
# Repo klonen
git clone https://github.com/RAeschimann/project-notes.git

# In Verzeichnis wechseln
cd project-notes

# NPM-Dependencies installieren (in package.json definiert)
npm i
```

## Webserver starten

```bash
node index.js
```

In einem Browser [1] unter http://localhost:3000 erreichbar.


[1] Das Projekt ist nur für Chrome oder Opera optimiert, da zur Zeit nur diese Browser das HTML5 input-Feld vom Typ "date" unterstützen