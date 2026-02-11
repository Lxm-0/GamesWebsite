import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'dist', 'src', 'Games.html');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace references to ../public/ with ../
    // This assumes the file is in dist/src/ and assets are in dist/
    const newContent = content.replace(/"\.\.\/public\//g, '"../');

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed paths in dist/src/Games.html');
} else {
    console.log('dist/src/Games.html not found, skipping fix.');
}

// Fix for dist/Teams.html (which is in root of dist)
const teamsPath = path.join(__dirname, 'dist', 'Teams.html');
if (fs.existsSync(teamsPath)) {
    let content = fs.readFileSync(teamsPath, 'utf8');
    // Teams.html probably uses "public/" so replacing with "" might work if public is flattened to root?
    // Let's check where public goes. Vite copies public to root.
    // So "public/headerIcons/..." becomes "headerIcons/...".
    // Replacing "public/" with "".
    const newContent = content.replace(/public\//g, '');
    fs.writeFileSync(teamsPath, newContent, 'utf8');
    console.log('Fixed paths in dist/Teams.html');
}
