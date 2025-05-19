   # PLYRO


This is a simple baseline inventory management system that I took on to replace an outdated system that is currently being used at the company I am working at, I plan on taking on this project fully as it is great practice with database infrastructure and html/javascript/css.

## Project Structure

```
electron-app
├── src
│   ├── main.js                   # Main process of the Electron application
│   ├── renderer.js               # Renderer process for DOM manipulation
│   ├── preload.js                # Preload scripts
│   ├── user.json                 # User credential information
│   ├── cycle-counts.html         # HTML structure of the cycle counts page -Not Operational
│   ├── display-inv.html          # HTML structure of the Inventory Management page
│   ├── index.html                # HTML structure of the Login page
│   ├── main-menu.html            # HTML structure of the Main Menu (dashboard) page
│   ├── point-of-sale.html        # HTML structure of the Point of Sale page - Not Operational
│   ├── purchase-order.html       # HTML structure of the Purchase Orders page - Not Operational
│   ├──template.html              # HTML structure of the Template page - Not Operational
│   └── style
│       ├── cycle-counts.css       # CSS styles for the cycle counts page
│       ├── display-inv.css        # CSS styles for the Inventory Management Screen
│       ├── index.css              # CSS styles for the login page
│       ├── main-menu.css          # CSS styles for the main menu (dashboard) page
│       ├── point-of-sale.css      # CSS styles for the Point of Sale page
│       ├── purchase-orders.css    # CSS styles for the Purchase Orders page
│       ├── template-view.css      # CSS styles for the template view page
│       └── template.css           # CSS styles for the template page
│
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Setup Instructions

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

## Usage

Upon running the application, a window will open displaying the login interface. Users can enter their credentials and submit the form.

## License

This project is licensed under the MIT License.
