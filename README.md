# RA9 - Dashboard d'E-commerce

Aquest és un projecte de Dashboard d'E-commerce que consumeix dades de la Fake Store API. 
Tal com es requeria per avaluar l'ús d'algorismes i funcions natives de Node.js/JavaScript, **aquest projecte funciona exclusivament amb emmagatzematge en memòria (RAM)**. No requereix la instal·lació ni configuració de cap base de dades externa (ni MongoDB ni MySQL).

## 🚀 Com instanciar i executar el projecte (Pas a pas)

Segueix aquests passos per fer funcionar el projecte al teu entorn local:

### 1. Instal·lació de dependències
Obre el teu terminal a la carpeta arrel del projecte i executa:
\`\`\`bash
npm install
\`\`\`
*(Això instal·larà `express`, `ejs`, `axios` i la resta de dependències necessàries. Mongoose ha estat eliminat).*

### 2. Engegar el servidor
A la mateixa terminal, executa:
\`\`\`bash
npm start
\`\`\`
*(O alternativament `node app.js`). El servidor s'aixecarà al port 3000.*

### 3. Sincronitzar les dades (Molt Important)
Com que l'emmagatzematge és en memòria RAM, **la base de dades comença buida**. 
Abans de poder veure el dashboard, has de carregar les dades de l'API externa a la memòria del servidor.
1. Obre el teu navegador.
2. Vés a la següent URL: **http://localhost:3000/sync**
3. Veuràs un missatge JSON confirmant que els productes s'han desat correctament en memòria.

### 4. Veure el Dashboard
Un cop sincronitzat, ja pots navegar a la vista principal:
* **http://localhost:3000/dashboard**
* Aquí veuràs les dades processades i representades visualment mitjançant Chart.js.

### 5. Consultar l'API de BI (Business Intelligence)
Pots consultar directament l'endpoint que calcula les estadístiques (total de productes, preu mitjà i agrupació per categories) a:
* **http://localhost:3000/api/stats**

---

## 🛠️ Detalls Tècnics de la Implementació

* **Emmagatzematge:** S'utilitza un objecte global (`data/store.js`) per mantenir l'estat dels productes mentre el procés de Node.js estigui actiu. Si s'atura el servidor, les dades es perden.
* **Agregacions de dades:** Les estadístiques de l'endpoint `/api/stats` es calculen fent ús exclusiu de mètodes natius de JavaScript (`.reduce()`, `.forEach()`, `.map()`, `.sort()`), demostrant el domini d'algorismes sense dependre de frameworks d'agregació de bases de dades.
* **Arquitectura:** S'aplica el principi DRY amb l'ús de middlewares (com el `logger`) i *partials* d'EJS per a les vistes.