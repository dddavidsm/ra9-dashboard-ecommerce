# RA9 - Projecte: Dashboard d'E-commerce amb BI

Aquest projecte és una aplicació web híbrida desenvolupada per complir amb els resultats d'aprenentatge del mòdul d'Entorns Servidor (RA9). 

## Tecnologies utilitzades (CA2)
* **Backend:** Node.js amb el framework Express.js per la seva naturalesa asíncrona i rapidesa.
* **Frontend:** EJS (Embedded JavaScript) com a motor de plantilles per generar HTML dinàmic des del servidor, combinat amb Chart.js per a la visualització de dades.
* **Base de Dades:** MongoDB (amb Mongoose) per la seva flexibilitat en l'emmagatzematge de documents JSON i el seu potent framework d'agregació.
* **Integracions:** Axios per consumir APIs externes.

## Funcionalitats Principals
1. **Sincronització de Dades (`/sync`):** Consumeix la "Fake Store API" i emmagatzema els productes en una base de dades MongoDB local (CA3, CA4).
2. **Business Intelligence (`/api/stats`):** Endpoint REST propi que executa agregacions complexes (pipeline de MongoDB) per extreure insights com el preu mitjà i la quantitat per categoria (CA6, CA7).
3. **Visualització (`/dashboard`):** Panell de control que renderitza els insights en gràfics mitjançant Chart.js (CA7).

## Instruccions d'Instal·lació i Execució (Setup)
1. Clona aquest repositori:
   \`git clone <url-del-teu-repositori>\`
2. Instal·la les dependències:
   \`npm install\`
3. Configura les variables d'entorn creant un fitxer \`.env\` a l'arrel amb:
   \`PORT=3000\`
   \`MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db\` *(o la teva URL de MongoDB)*
4. Assegura't de tenir el servei de MongoDB actiu.
5. Inicia l'aplicació:
   \`npm start\` (o \`node app.js\`)

## Guia d'Ús
1. Obre el navegador i visita `http://localhost:3000/sync` per poblar la base de dades per primera vegada.
2. Visita `http://localhost:3000/dashboard` per veure els resultats gràfics.
3. Executa `npm test` a la consola per passar les proves unitàries amb Jest i Supertest.