# Intelligence-Artificielle-pour-le-Web

Description du projet

Ce projet est une page web qui permet à l’utilisateur de dessiner sur un canvas, puis une IA essaye de deviner ce que l’utilisateur a dessiné.
C’est une petite application interactive qui montre comment on peut intégrer un modèle d’IA dans une page web simple.
Lien de la vidéo https://youtu.be/qyoAbE3AbXM



Fonctionnalités

L’utilisateur peut dessiner avec la souris (sur ordinateur) ou avec son doigt (sur mobile).

Deux boutons sont disponibles :

« Deviner » : l’IA analyse le dessin et affiche le résultat avec un pourcentage de confiance.

« Effacer » : pour remettre la zone de dessin à zéro.

Le résultat est affiché directement dans la page.

Technologies utilisées

HTML, CSS et JavaScript pour la structure et l’interactivité.

TensorFlow.js pour charger et exécuter le modèle directement dans le navigateur.

Un modèle QuickDraw converti en TensorFlow.js, qui a été entraîné sur des milliers de dessins du jeu QuickDraw de Google.

Démarche réalisée

Au début, j’ai essayé d’utiliser la librairie ml5.js et son modèle DoodleNet. Mais j’ai rencontré une erreur « d is not a function » qui empêchait le projet de fonctionner.
Pour contourner ce problème, j’ai décidé de changer de méthode et de passer directement par TensorFlow.js. J’ai téléchargé un modèle QuickDraw déjà converti, puis je l’ai chargé avec tf.loadLayersModel.
Ensuite, j’ai ajouté un traitement sur l’image dessinée : réduction en 28x28 pixels, passage en noir et blanc, normalisation, pour que le modèle puisse faire ses prédictions.
Enfin, j’ai associé chaque prédiction à une liste de labels afin d’afficher un résultat compréhensible par l’utilisateur.

Accès au projet

Le projet est disponible en ligne à cette adresse :
https://terranovax.github.io/01-Intelligence-Artificielle-pour-le-Web/

Mode d’emploi

Ouvrir la page web.

Dessiner un objet dans la zone prévue.

Cliquer sur « Deviner » pour voir la prédiction du modèle.

Si besoin, cliquer sur « Effacer » pour recommencer.

Exemple

Si je dessine un chat, le modèle va par exemple afficher :
« Je pense que tu as dessiné : cat (confiance 82%) ».
