"""Construit le site Gard Ô D+ dans le dossier _site/.

Contenus : content/*.yml (modifiables dans Pages CMS)
Mise en page : templates/*.html (Jinja2)
Lancer : python build.py
"""
import re
import shutil
from pathlib import Path

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup, escape

RACINE = Path(__file__).parent
SORTIE = RACINE / "_site"

PAGES = [
    # (fichier de sortie, gabarit, fichier de contenu, titre du menu, titre de page, description)
    ("index.html", "index.html", "accueil.yml", "Accueil", "",
     "Gard Ô D+, l'association qui organise des trails et des randos dans le Gard rhodanien. Premier rendez-vous : Trail de Saint-Nazaire, 2027."),
    ("le-trail.html", "le-trail.html", "trail.yml", "Le trail", "Le trail",
     "Trail de Saint-Nazaire : 8 km, 15 km et rando. Première édition en 2027."),
    ("infos-pratiques.html", "infos-pratiques.html", "infos.yml", "Infos pratiques", "Infos pratiques",
     "Inscriptions, accès, règlement et questions fréquentes du Trail de Saint-Nazaire."),
    ("asso.html", "asso.html", "asso.yml", "L'asso", "L'asso",
     "Qui sont les associés et les bénévoles de Gard Ô D+."),
    ("contact.html", "contact.html", "contact.yml", "Contact", "Contact",
     "Écrire à Gard Ô D+ ou devenir bénévole."),
    ("mentions-legales.html", "mentions-legales.html", "mentions.yml", None, "Mentions légales",
     "Mentions légales du site de Gard Ô D+."),
]

MOTS_A_VENIR = ("bientôt", "à venir")


def lire(nom):
    with open(RACINE / "content" / nom, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def md(texte):
    return Markup(markdown.markdown(str(texte or "")))


def md_inline(texte):
    html = markdown.markdown(str(texte or ""))
    return Markup(re.sub(r"^<p>(.*)</p>$", r"\1", html, flags=re.S))


def chips(texte):
    """Affiche « bientôt » / « à venir » en pastille grise."""
    html = str(escape(str(texte or "")))
    for mot in MOTS_A_VENIR:
        html = re.sub(r"(?<!\w)" + re.escape(mot) + r"(?!\w)", f'<span class="chip">{mot}</span>', html)
    return Markup(html)


def dplus(texte):
    """Met « D+ » en orange dans un grand titre."""
    return Markup(str(escape(str(texte or ""))).replace("D+", '<span class="orange">D+</span>'))


def montagne():
    chemin = (RACINE / "assets" / "img" / "montagne.svg").read_text(encoding="utf-8")
    d = re.search(r'<path d="(M701[^"]+)" fill="#0F2D24"', chemin).group(1)
    return Markup(
        '<svg class="heros__montagne" viewBox="40 15 680 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">'
        f'<path d="{d}"/></svg>'
    )


def construire():
    if SORTIE.exists():
        shutil.rmtree(SORTIE)
    SORTIE.mkdir()

    env = Environment(
        loader=FileSystemLoader(RACINE / "templates"),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters.update(md=md, md_inline=md_inline, chips=chips, dplus=dplus)

    site = lire("site.yml")
    technique = lire("technique.yml")
    navigation = [{"id": sortie, "lien": sortie, "titre": menu} for sortie, _, _, menu, _, _ in PAGES if menu]
    svg_montagne = montagne()

    for sortie, gabarit, contenu, _, titre, description in PAGES:
        html = env.get_template(gabarit).render(
            site=site,
            technique=technique,
            p=lire(contenu),
            navigation=navigation,
            page_id=sortie,
            page_titre=titre,
            description=description,
            montagne=svg_montagne,
        )
        (SORTIE / sortie).write_text(html, encoding="utf-8")

    shutil.copytree(RACINE / "assets", SORTIE / "assets")
    for fichier in ("CNAME", ".nojekyll", "404.html"):
        if (RACINE / fichier).exists():
            shutil.copy(RACINE / fichier, SORTIE / fichier)
    (SORTIE / ".nojekyll").touch()
    print(f"Site construit : {len(PAGES)} pages dans {SORTIE}")


if __name__ == "__main__":
    construire()
