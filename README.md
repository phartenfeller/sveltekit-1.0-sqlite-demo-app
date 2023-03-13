# Svelte Kit 1.0 + SQLite Demo App

Code from following YouTube tutorials: 
  - [SvelteKit 1.0 with SQLite Tutorial](https://youtu.be/iO4VUbQ6ua4)
  - [Authentication and Authorization in SvelteKit 1 with SQLite](https://youtu.be/XRa-b5E7x8w)
  - [Build and run SvelteKit Apps with Docker](https://youtu.be/LwzoWuHjOWk)
  - [AG-Grid in SvelteKit for Spreadsheet like data editing](https://youtu.be/VfFKEiMAloc)
  - [Installable SvelteKit App with Web App Manifest](https://youtu.be/ywXXOvfKoYg)
  - [Lazy Loading for slowly loading pages in SvelteKit](https://youtu.be/7Kl4sKez1bs)
  - [Upload, Store and Retrieve Images in SvelteKit (with SQLite)](https://youtu.be/OLg6RwESnSo)
  - [Generate a PDF with pdfmake (from SvelteKit)](https://youtu.be/gS1wlOdRLAk)
  - [Interactive Tables in SvelteKit with TanStack Table](https://youtu.be/-Zuo3UWjjI8)
  - [Export Table to XLSX and CSV with exceljs](https://youtu.be/xzdgUm2Ccbk)

Full Playlist: [SvelteKit](https://www.youtube.com/playlist?list=PLIyDDWd5rhaYwAiXQyonufcZgc_xOMtId)

## Run locally

- Install with yarn or npm `yarn install` or `npm install`
  - You might need to delete `supportedArchitectures` in the `.yarnrc.yml` file if you are not on an M1 Mac
- Start with `yarn dev` or `npm run dev`
- Username and Password for login is `philipp`

## Docker

Build Container:

```sh
docker build -t sveltekit-sqlite-img .
```

Run Container:

```sh
docker run -d -p 3000:3000 \
  --mount type=bind,source="$(pwd)"/data/,target=/app/data/ \
  --rm --name sveltekit-sqlite \
  sveltekit-sqlite-img
```
