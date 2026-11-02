# site

Site web de l'association Gard Ô D+.

## Modifier un texte (sans code)
Se connecter à Pages CMS (https://app.pagescms.org) avec son compte GitHub, ouvrir le dépôt `gardodplus/site`, choisir la page, modifier les champs, enregistrer. Le site se met à jour tout seul en une à deux minutes.

Pour une info pas encore fixée, écrire « bientôt » ou « à venir » : elle s'affiche en pastille grise.
N'ajouter un bénévole sur la page L'asso qu'avec son accord écrit.

## Organisation des fichiers
- `content/` : les textes de chaque page (fichiers YAML, modifiés via Pages CMS)
- `templates/` : la mise en page (HTML + Jinja2)
- `assets/` : styles, logos, script du menu mobile
- `build.py` : assemble contenus et mise en page dans `_site/`
- `.github/workflows/publier.yml` : construit et publie sur GitHub Pages à chaque modification de `main`
- `.pages.yml` : les champs proposés dans Pages CMS

## Construire en local
```
pip install -r requirements.txt
python build.py
```
Les polices Barlow sont téléchargées par la publication automatique (dossier `assets/fonts/`, non versionné).
