# Electron Prylo Application

This is a simple Electron application named Prylo, which features a login interface.

## Project Structure

```
electron-app
├── src
│   ├── main.js          # Main process of the Electron application
│   ├── renderer.js      # Renderer process for DOM manipulation
│   ├── index.html       # HTML structure of the application
│   └── style
│       └── index.css    # CSS styles for the application
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd electron-app
   ```

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