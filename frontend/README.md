<div align="center" >
	<img height="125px" src="https://gitlab.com/dhbw-se/se-tinf23b6/g3-dashify/gitlab-profile/-/raw/main/assets/frontend.svg"  alt=""/> 
	<h1>Frontend</h1>
	<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/line.png"  alt=""/>
</div>

Das Frontend ist ein modernes Next.js-Projekt, das stark auf Komponenten, Module und TypeScript setzt. Diese Struktur sorgt für sauberen, erweiterbaren Code und eine klare Trennung der verschiedenen Anwendungsbereiche.

---

## **Projektstruktur**

### **Wichtige Dateien und Konfigurationen**

- **Dockerfile**  
  Definiert, wie das Frontend als Docker-Image gebaut wird. Enthält die Basis-Images, Build-Anweisungen und Umgebungsvariablen für den Container.

- **README.md**  
  Grundlegende Dokumentation für das Frontend, inklusive Setup, Entwicklungsanweisungen und Befehlen zum Starten des Projekts.

- **components.json**  
  Möglicherweise Metadaten oder Konfigurationsdateien für wiederverwendbare Komponenten.

- **next-env.d.ts**  
  Automatisch generierte TypeScript-Datei für Next.js, die die Umgebung definiert.

- **next.config.mjs**  
  Hauptkonfigurationsdatei für Next.js. Hier können Einstellungen wie Routing, Bildoptimierung und Umgebungsvariablen definiert werden.

- **postcss.config.mjs**  
  Konfiguriert PostCSS, oft in Verbindung mit Tailwind CSS oder anderen CSS-Frameworks verwendet.

- **prettier.config.js**  
  Konfiguriert den Code-Formatter Prettier, um den Code-Stil im gesamten Projekt konsistent zu halten.

- **tsconfig.json**  
  TypeScript-Konfigurationsdatei, die Typanpassungen und Compiler-Optionen festlegt.

---

### **Quellcode und Komponenten**

- **src/**  
  Der Hauptordner für den Quellcode. Hier wird die eigentliche Anwendung entwickelt. Typische Unterordner sind:

    - **components/**  
      Enthält alle wiederverwendbaren UI-Komponenten. Diese sind modular organisiert, um die Wartbarkeit zu verbessern.

    - **components/pages/**  
      Seiten-spezifische Komponenten, z.B. für Dashboards, Einstellungen oder Widgets.

    - **components/pages/settings/**  
      Hier werden die Einstellungskomponenten definiert. Neue Einstellungen können hier hinzugefügt werden.

    - **components/pages/widgets/**  
      Hier werden die Widgets definiert. Widgets sind spezialisierte Komponenten, die in Dashboards verwendet werden.

---

## **Neue Einstellungen hinzufügen**

### **Neues Setting erstellen**

1. **Neue Setting-Datei erstellen:**  
   Lege eine neue Datei in **`components/pages/settings`** an, z.B. **`example.tsx`**:

```tsx
// components/pages/settings/example.tsx

import { type SettingsMenu } from "..";
import { LuBug } from "react-icons/lu";
import MyNewSettingsComponent from "./MyNewSettingsComponent";

export const example: SettingsMenu = {
    id: "example",
    label: "Example",
    icon: <LuBug size={16} />,
    title: "Example Settings",
    description: "Customize your example settings.",
    sections: [
        {
            id: "example-section",
            title: "New Setting",
            description: "Description for your new setting.",
            component: <MyNewSettingsComponent />,
        },
    ],
};
```

2. **Neues Setting registrieren:**  
   Füge die neue Setting-Datei in der **`index.ts`** hinzu:

```tsx
// components/pages/settings/index.ts

import { SettingsMenu } from "..";
import { example } from "./example";
import { otherSetting } from "./otherSetting"; // Beispiel für ein anderes Setting

export const settingsMenus: SettingsMenu[] = [
    example,
    otherSetting,
    // Weitere Settings hier hinzufügen
];
```

---

## **Neues Widget hinzufügen**

### **Widget-Verzeichnis anlegen**

1. **Neuen Widget-Ordner erstellen:**  
   Lege in **`components/pages/widgets`** einen neuen Ordner an, z.B. **`example`**:

```
components/pages/widgets/example/
├── index.tsx
├── small.tsx
├── medium.tsx
└── large.tsx
```

2. **Widget-Komponenten erstellen:**  
   Lege die verschiedenen Größenkomponenten an, z.B. **small.tsx**:

```tsx
// components/pages/widgets/example/small.tsx

import React from "react";

const ExampleSmall: React.FC = () => {
    return <div>Example Small Widget</div>;
};

export default ExampleSmall;
```

3. **Widget-Definition hinzufügen:**  
   Definiere die Widgets in der **`index.tsx`**:

```tsx
// components/pages/widgets/example/index.tsx

import { WidgetCategory } from "@/types/dashboard";
import { LuBug } from "react-icons/lu";
import ExampleSmall from "./small";
import ExampleMedium from "./medium";
import ExampleLarge from "./large";

export const exampleWidgets: WidgetCategory = {
    type: "EXAMPLE",
    title: "Example",
    icon: <LuBug />,
    color: "#00A0FF",
    widgets: [
        {
            title: "Small Example Widget",
            description: "A small example widget",
            w: 1,
            h: 1,
            component: <ExampleSmall />,
        },
        {
            title: "Medium Example Widget",
            description: "A medium example widget",
            w: 2,
            h: 1,
            component: <ExampleMedium />,
        },
        {
            title: "Large Example Widget",
            description: "A large example widget",
            w: 2,
            h: 2,
            component: <ExampleLarge />,
        },
    ],
};
```

4. **Widget-Kategorie hinzufügen:**  
   Füge die neue Widget-Kategorie in der **`index.ts`** hinzu:

```tsx
// components/pages/widgets/index.ts

import { WidgetCategory } from "@/types/dashboard";
import { exampleWidgets } from "./example";
import { otherWidgets } from "./other";

export const widgetCategories: WidgetCategory[] = [
    exampleWidgets,
    otherWidgets,
    // Weitere Widgets hier hinzufügen
];
```

### Session-Management

Für die Verwaltung der aktuellen Benutzersitzung wird der `useSession`-Hook verwendet. Dieser Hook stellt wichtige Sitzungsdaten und Funktionen zur Verfügung und muss innerhalb eines `AuthContextProvider` verwendet werden.

#### Verwendung des Hooks

```tsx
import { useSession } from "@/hooks/use-session";

function MyComponent() {
    const session = useSession();

    console.log(session.user);   // Zugriff auf den aktuellen Benutzer
    console.log(session.status); // Status der aktuellen Sitzung ("authenticated", "unauthenticated", "loading")
    
    // Benutzerprofil aktualisieren
    const updateProfile = () => {
        session.update({
            username: "NewUsername",
            email: "newemail@example.com",
        });
    };

    return (
        <div>
            <h1>Welcome, {session.user?.username}</h1>
            <button onClick={updateProfile}>Update Profile</button>
        </div>
    );
}
```
#### Verfügbare Eigenschaften und Methoden

- **`session.user`**  
  Enthält die aktuellen Benutzerdaten (z.B. Benutzername, E-Mail).

- **`session.status`**  
  Der Status der Sitzung, kann folgende Werte annehmen:
    - `"loading"` – Sitzung wird geladen
    - `"authenticated"` – Benutzer ist eingeloggt
    - `"unauthenticated"` – Benutzer ist nicht eingeloggt

- **`session.update(data: UserUpdateRequest)`**  
  Aktualisiert die Benutzerdaten auf dem Server und lädt die Sitzung neu.

#### Hinweise zur Implementierung

- Der Hook verwendet intern den `AuthContext`, um den Sitzungsstatus und die Benutzerdaten zu verwalten.
- Ein automatisches Revalidieren der Sitzung findet bei jeder Aktualisierung der Benutzerdaten statt.
- Achte darauf, dass der `AuthContextProvider` in der Komponenten-Hierarchie über jedem Aufruf von `useSession` liegt.


---

### **Testen und Anpassen**

Stelle sicher, dass dein neues Widget in der Dashboard-Oberfläche erscheint und korrekt skaliert.

---
