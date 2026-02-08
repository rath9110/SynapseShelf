# Synapse Shelf - Icon Generation Instructions

The extension icons could not be automatically generated due to service availability.

## Option 1: Use Online SVG to PNG Converter
1. Open `icons/icon-template.svg` in a browser
2. Use an online tool like:
   - https://cloudconvert.com/svg-to-png
   - https://svgtopng.com/
3. Convert to PNG at these sizes:
   - 16x16px → save as `icon16.png`
   - 48x48px → save as `icon48.png`
   - 128x128px → save as `icon128.png`
4. Place all three PNG files in the `icons/` directory

## Option 2: Use a Graphics Editor
1. Open `icons/icon-template.svg` in:
   - Inkscape (free)
   - Adobe Illustrator
   - Figma
2. Export at 16px, 48px, and 128px sizes
3. Save as PNG files in the `icons/` directory

## Option 3: Temporary Placeholder
The extension will still load without icons, but for now you can use any placeholder PNG images named:
- `icon16.png`
- `icon48.png`
- `icon128.png`

Place them in the `icons/` directory and the extension will work perfectly!
