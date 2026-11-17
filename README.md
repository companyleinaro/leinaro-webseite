# Leinaro – Website v3

Neue Fassung der Leinaro-Website (Stand 17.11.2026). Aufbau, Effekte und Seitenstil folgen der Demo **T002-marketingagentur-kopfsprung**. Inhalte, Rechtstexte, Kontaktdaten und Formular stammen unverändert aus **v2** bzw. aus `../Webseite_Leinaro_v2/PROJECT-NOTES.md`. Die Version v2 bleibt unverändert daneben bestehen.

## Lokal ansehen

Ordner in VS Code öffnen und `index.html` mit **Live Server** starten.

## Was neu ist gegenüber v2

- **Startseite als Scroll-Story:** vier Vollbild-Szenen, die beim Scrollen stehen bleiben und überblenden. Dazu große Headlines unten links, Pfeil-Navigation mit Zähler und Fortschrittsbalken. Danach folgen Vorteile, Leistungsliste, Projekte, Ablauf, FAQ, Kontakt-Band und Footer mit großem Logo.
- **Unterseiten:** Vollbild-Kopf mit Bild und großer Überschrift im gleichen Stil, darunter helle und dunkle Abschnitte im Wechsel.
- **Navigation:** Dropdown bei „Leistungen“ (Klick, Touch und Tastatur), am Handy Vollbild-Menü mit Untermenü.
- **Farben:** Pink #F34F7E, Lime #C8DF70, Dunkel #17191C, Hellgrau #F3F4F6 und Weiß, so wie vom Inhaber für die Website festgelegt.
- **Logo:** Original-SVG unverändert. Auf dunklem Grund steht es auf einer weißen Fläche.
- **Schrift:** Poppins, lokal eingebunden. Laufweite nie negativ, laut Typo-Prüfung keine sich berührenden Buchstaben (LEINARO-STANDARD 9a).
- **Preise:** werden auf Wunsch des Inhabers nicht angezeigt. Die Pakete sind beschrieben, ein Angebot gibt es nach dem Gespräch.

## Unverändert übernommen

- Impressum und Datenschutz (Texte 1:1, Stand 6. bzw. 9. November 2026)
- Kontaktformular über Web3Forms (gleicher Access Key, Versand per JavaScript, Bestätigung auf der Seite)
- Datenschutzhinweis ohne Cookies (Speicherschlüssel `leinaro-privacy-notice-v2`, „Datenschutz-Einstellungen“ im Footer)
- `vercel.json` (Weiterleitungen, Sicherheits-Header inkl. Content-Security-Policy)
- Schriften, Favicons, Webmanifest, Social-Vorschaubild, Bilder in `images/optimized/`

## Struktur

- `index.html` – Startseite
- `ueber-uns.html`, `leistungen.html`, `webdesign.html`, `seo.html`, `domain-hosting.html`, `betreuung.html`
- `referenzen.html`, `hairdesign-barbara-leitner.html`
- `faq.html`, `kontakt.html`, `impressum.html`, `datenschutz.html`, `404.html`
- `css/style.css` – eine Datei, Abschnitte 1–11 laut ABOUT-ME
- `js/script.js` – eine Datei. Sie wird im `<head>` ohne `defer` geladen, damit die Scroll-Story ohne Inline-Skript (CSP) sofort bereit ist.
- `images/BILD-PROMPTS.md` – Prompts für die neuen Szenenbilder

## Offen

- **Bilder:** Alle Hero-Bilder stammen jetzt aus der neuen Bildserie und sind 4-fach hochskaliert (siehe unten). Offen ist nur noch das Social-Vorschaubild `leinaro-social-1200x630.jpg` (unverändert aus v2).

## Änderungen 17.11.2026 (Runde 3, Bildschärfe)

- Alle Hero-Bilder und die vier Leistungsbilder mit imgupscaler.com 4-fach vergrößert (Hero-Bilder 6688 × 3764 px). Die Originale liegen außerhalb des Website-Ordners in `../Bilder-Originale-v3/`, damit sie nicht mit veröffentlicht werden.
- WebP-Varianten neu erzeugt: Hero-Bilder in 640 / 1024 / 1600 / 2400 / 3200 px, Leistungsbilder in 480 / 800 / 1200 / 1600 / 2400 / 3200 px. Handys und 4K-Bildschirme laden die 3200er-Variante (je nach Bild etwa 120–300 KB).
- Neue Hero-Bilder für Über mich (Holzatelier), Leistungen (Steinsäulen mit pinkem Würfel), Projekte (Bilderrahmen) und 404 (Wegweiser). Der Bildausschnitt am Handy (`--fx-m`) ist je Bild auf das Hauptmotiv eingestellt.
- Wartung & Betreuung: Hero-Bild ist jetzt wie bei den anderen Leistungsseiten das Leistungsbild `startseite-support` (helles Bild, daher `page-hero--bright`). Das Leuchtturm-Bild `hero-betreuung` wird derzeit nicht verwendet, bleibt aber als Reserve erhalten.
- Die alten v2-Dateien `creative-workbench`, `leistung-webdesign-entwicklung` und `faq-frage-stellen` in `images/optimized/` werden nicht mehr verwendet und können gelöscht werden.

## Änderungen 17.11.2026 (Runde 2)

- Neue Szenenbilder 1–4 eingebaut. Die Überblendung folgt dem Scrollen mit leichter Trägheit und läuft dadurch auch bei Mausrad-Sprüngen flüssig. Alle Szenenbilder werden vorab dekodiert.
- Bildschärfe: Kein Hochskalieren mehr per `scale()`. `sizes` berücksichtigt den Zuschnitt (`object-fit: cover`), damit Handys und hochauflösende Bildschirme die große Variante laden.
- Überschriften trennen nie mitten im Wort. `js/script.js` (Abschnitt 2a) verkleinert zu lange Wörter automatisch und hält Hero-Überschriften unterhalb der Navigation.
- Leistungs-Dropdown neu: vier Kacheln mit Icon und Kurztext und dazu „Alle Leistungen im Überblick“.
- Navigation blendet beim Runterscrollen aus und beim Hochscrollen wieder ein.
- Leistungsseiten: Hero-Bild ist jeweils das Leistungsbild (Betreuung: neues Leuchtturm-Motiv). Dazu ein Laufband mit Schlagworten und je eine animierte Illustration (Browser-Entwurf, Suchergebnis, Domain–Hosting–SSL, Website-Check).
- Schlüsselwörter gezielt hervorgehoben (`.hl` = Lime-Marker, `.accent` = Pink).
- Öffnungszeiten überall entfernt (Footer-Spalte „Erreichbarkeit“ und Kontaktseite).
- Instagram- und Facebook-Links färben sich beim Darüberfahren in den Markenfarben.
- `neuburger-metalltechnik.html` und `danke.html` aus v2 wurden nicht übernommen. Die Neuburger-Seite wird laut `vercel.json` ohnehin auf die Projektseite umgeleitet, und `danke.html` wurde nirgends verlinkt.
- Vor dem Livegang: in Safari, Firefox und auf echten Handys prüfen und einmal eine echte Testanfrage über das Formular senden.

## Veröffentlichen

Wie bisher über GitHub und Vercel. Den Inhalt dieses Ordners anstelle von v2 als Website-Root verwenden. Eine Build-Konfiguration ist nicht nötig.
