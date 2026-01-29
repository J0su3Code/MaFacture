facture-generator/
├── index.html                      # Point d'entrée HTML
├── package.json                    # Dépendances npm
├── vite.config.js                  # Configuration Vite
│
└── src/
    ├── main.jsx                    # Point d'entrée React
    ├── App.jsx                     # Routes et providers
    │
    ├── config/
    │   └── firebase.js             # Configuration Firebase (auth + db)
    │
    ├── context/
    │   ├── AuthContext.jsx         # Gestion authentification + userData
    │   └── ThemeContext.jsx        # Thèmes, langues, format papier
    │
    ├── locales/
    │   ├── fr.js                   # Traductions françaises
    │   └── en.js                   # Traductions anglaises
    │
    ├── utils/
    │   └── formatters.js           # Fonctions utilitaires (formatAmount, formatDate, etc.)
    │
    ├── styles/
    │   ├── globals.css             # Styles globaux, variables CSS, reset
    │   └── themes.css              # Variables de thèmes couleurs
    │
    ├── components/
    │   │
    │   ├── ui/                     # Composants réutilisables
    │   │   ├── Button.jsx          # Bouton avec variantes
    │   │   ├── Input.jsx           # Input, Textarea, Select
    │   │   ├── Input.css
    │   │   ├── Modal.jsx           # Modal/Dialog
    │   │   ├── Modal.css
    │   │   └── Icons.jsx           # Icônes SVG custom
    │   │
    │   ├── auth/                   # Authentification
    │   │   ├── Login.jsx           # Page de connexion
    │   │   ├── Register.jsx        # Page d'inscription
    │   │   └── Auth.css            # Styles auth
    │   │
    │   ├── layout/                 # Structure de page
    │   │   ├── Layout.jsx          # Layout principal avec Outlet
    │   │   ├── Layout.css
    │   │   ├── Header.jsx          # Header avec user info
    │   │   ├── Header.css
    │   │   ├── Sidebar.jsx         # Navigation latérale
    │   │   └── Sidebar.css
    │   │
    │   ├── dashboard/              # Pages principales
    │   │   ├── Dashboard.jsx       # Tableau de bord avec stats
    │   │   ├── Dashboard.css
    │   │   ├── InvoiceList.jsx     # Liste des factures
    │   │   ├── InvoiceList.css
    │   │   ├── ClientList.jsx      # Liste des clients
    │   │   └── ClientList.css
    │   │
    │   ├── invoice/                # Gestion des factures
    │   │   ├── InvoiceForm.jsx     # Formulaire création/édition
    │   │   ├── InvoiceForm.css
    │   │   ├── InvoicePreview.jsx  # Aperçu avec sélecteur de template
    │   │   ├── InvoicePreview.css
    │   │   ├── ItemRow.jsx         # Ligne d'article dans le formulaire
    │   │   ├── ItemRow.css
    │   │   ├── ImageUploader.jsx   # Upload d'images (base64)
    │   │   ├── ImageUploader.css
    │   │   ├── TemplateSelector.jsx # Sélecteur de template + couleur
    │   │   ├── TemplateSelector.css
    │   │   │
    │   │   └── templates/          # Templates de facture (PDF)
    │   │       ├── index.js        # Export de tous les templates
    │   │       ├── TemplateCorporate.jsx   # Style corporate avec blocs
    │   │       ├── TemplateCorporate.css
    │   │       ├── TemplateModern.jsx      # Style moderne épuré
    │   │       ├── TemplateModern.css
    │   │       ├── TemplateClassic.jsx     # Style classique avec bordures
    │   │       ├── TemplateClassic.css
    │   │       ├── TemplateBold.jsx        # Style bold géométrique
    │   │       └── TemplateBold.css
    │   │
    │   └── settings/               # Paramètres
    │       ├── Settings.jsx        # Page paramètres (onglets)
    │       ├── Settings.css
    │       ├── CompanySettings.jsx # Infos entreprise + logo
    │       ├── CompanySettings.css
    │       ├── ThemeSelector.jsx   # Choix du thème couleur
    │       ├── ThemeSelector.css
    │       ├── PaperSettings.jsx   # Choix format papier
    │       └── PaperSettings.css