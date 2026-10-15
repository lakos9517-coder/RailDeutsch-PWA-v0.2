# RailDeutsch PWA v0.2 — iPhone + Windows

Ez a **böngészőben működő, főképernyőre telepíthető** RailDeutsch prototípus. Nem natív iOS alkalmazás és nem App Store kiadás.

## Tartalom
- 10 lecke és 30 kérdés mindkét országválasztásban (többségében azonos tananyag, néhány országonként eltérő feladat).
- A kérdések, válaszok és magyarázatok egymástól független német/magyar kapcsolója.
- Helyben mentett beállítások, országonkénti legjobb eredmények, XP; újrajátszás nem termel végtelen XP-t.
- Mobilképernyőre optimalizált felület, offline gyorsítótárazás első online megnyitás után.
- Nincs még belépés, vásárlás, hanganyag vagy pszichológiai felkészítő; ezek későbbi fejlesztések.

## Windows: kipróbálás helyben
1. Bontsd ki a ZIP-et egy mappába.
2. Ha telepítve van Python, a mappában nyiss PowerShellt, majd futtasd: `py -m http.server 8000` (vagy `python -m http.server 8000`).
3. PC-n nyisd meg: http://localhost:8000
4. Ne dupla kattintással nyisd meg az index.html-t: a leckék betöltéséhez webszerver kell.

## Ingyenes feltöltés GitHub Pages-re, majd iPhone-telepítés
1. Jelentkezz be https://github.com oldalon, hozz létre egy **public** repositoryt `raildeutsch-pwa` néven (a GitHub Pages a felületet publikussá teszi; ne tegyél fel titkos adatokat).
2. **Add file → Upload files**: töltsd fel a ZIP **kibontott** tartalmát a repository gyökerébe; Commit changes.
3. **Settings → Pages → Build and deployment**: Source = `Deploy from a branch`, Branch = `main`, Folder = `/ (root)` → Save.
4. A GitHub Pages címed jellemzően: `https://FELHASZNALONEV.github.io/raildeutsch-pwa/`; a Pages beállításokban találsz rá pontos linket.
5. iPhone-on nyisd meg a címet **Safariban**; Megosztás → **Hozzáadás a Főképernyőhöz** → Hozzáadás. A RailDeutsch ikon önálló webappként indul.
6. Offline használathoz először online nyisd meg; az aktuális verzió fájljai gyorsítótárba kerülnek. Első indításkor és frissítés után internet szükséges lehet.

## Fontos korlátok
- A haladás a telefon saját böngészőjében / webapp-tárhelyén tárolódik. Adattörléssel vagy új telefon esetén elveszhet; nincs felhőszinkron.
- Webes főképernyő-appként telepíthető, **nem .ipa és nem natív iPhone alkalmazás**. Későbbi natív iOS kiadáshoz macOS/Xcode + aláírás vagy megfelelő felhős buildszolgáltatás szükséges.
- A tananyag oktatási demó, nem hivatalos vasúti előírás. Valós vasútüzemi döntésekhez nem használható.
