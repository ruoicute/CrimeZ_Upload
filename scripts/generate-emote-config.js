const fs = require('fs');
const path = require('path');

// Directory containing image files
const imageDir = path.join(__dirname, '../emotes/img');
// Output config file
const configFile = path.join(__dirname, '../emotes/emote_config.json');

// Valid image extensions
const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];

// Function to scan directory and create config
function generateEmoteConfig() {
  const config = {};
  
  // Read all files in the directory
  const files = fs.readdirSync(imageDir);
  
  files.forEach(file => {
    const extension = path.extname(file).toLowerCase();
    
    // Check if it's an image file
    if (validExtensions.includes(extension)) {
      const fileName = path.basename(file, extension);
      const relativePath = `emotes/img/${file}`;
      
      // Add to config
      config[fileName] = {
        "image": relativePath
      };
    }
  });
  
  // Write config to file
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');
  console.log('Emote configuration updated successfully.');
}

// Execute
try {
  generateEmoteConfig();
} catch (error) {
  console.error('Error generating emote config:', error);
  process.exit(1);
}
