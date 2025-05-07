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
  
  // First, group files by base name to detect duplicates
  const groupedFiles = {};
  
  files.forEach(file => {
    const extension = path.extname(file).toLowerCase();
    
    if (validExtensions.includes(extension)) {
      const fileName = path.basename(file, extension);
      const baseName = fileName.toLowerCase().trim().replace(/[^a-z0-9_+-]/g, '-');
      
      if (!groupedFiles[baseName]) {
        groupedFiles[baseName] = [];
      }
      
      groupedFiles[baseName].push({
        fullFile: file,
        extension: extension
      });
    }
  });
  
  // Now create the config using the grouping information
  for (const [baseName, fileList] of Object.entries(groupedFiles)) {
    // If there's only one file with this base name, use the base name as key
    // Otherwise use "basename-extension" format for all files with this base name
    if (fileList.length === 1) {
      const file = fileList[0];
      config[baseName] = {
        "image": `emotes/img/${file.fullFile}`
      };
    } else {
      fileList.forEach(file => {
        const extensionSuffix = file.extension.replace('.', '');
        const key = `${baseName}-${extensionSuffix}`;
        
        config[key] = {
          "image": `emotes/img/${file.fullFile}`
        };
      });
    }
  }
  
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
