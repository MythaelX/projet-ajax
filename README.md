# Projet AJAX - MythaelX

Ce projet démontre l'utilisation d'AJAX (Asynchronous JavaScript and XML) pour réaliser des appels asynchrones côté client dans une application web. Il permet de récupérer des données sans avoir à recharger toute la page, améliorant ainsi l'expérience utilisateur.

## Fonctionnalités

- **Requêtes asynchrones** : Envoi de requêtes HTTP sans rafraîchir la page.
- **Mise à jour dynamique de la page** : Le contenu de la page est mis à jour sans avoir à recharger entièrement.
- **Interaction avec une API** : Exemple de récupération et d'affichage de données provenant d'une API.
- **Support JSON** : Le projet travaille avec des données JSON pour une meilleure gestion des informations.

## Prérequis

Avant de pouvoir exécuter ce projet, vous devez avoir les éléments suivants installés sur votre machine :

- Un navigateur web moderne (Chrome, Firefox, Safari, etc.)
- Un éditeur de texte (ex. VSCode, Sublime Text)

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone https://github.com/MythaelX/projet-ajax.git
    ```

2. Ouvrez le fichier `index.html` dans votre navigateur pour visualiser le projet en action.

## Utilisation

1. Après avoir cloné le projet, ouvrez le fichier `index.html` dans un navigateur.
2. Interagissez avec l'interface qui va effectuer des appels AJAX pour récupérer des données dynamiquement.
3. Le projet utilise **JavaScript** pour manipuler les requêtes et afficher les résultats sans recharger la page.

## Exemple de code

Voici un exemple d'appel AJAX dans ce projet :

```javascript
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        // Affichez les données dans le DOM
    }
};
xhr.send();
