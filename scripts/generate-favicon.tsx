import React from 'react';
import { renderToString } from 'react-dom/server';
import Avatar from 'boring-avatars';
import fs from 'fs';

const colors = ["#2563EB", "#111827", "#4F46E5", "#DBEAFE", "#60A5FA"]; // Theme: Blue-600, Gray-900, Indigo-600, Blue-100, Blue-400

const svgString = renderToString(React.createElement(Avatar, {
  size: 120,
  variant: "bauhaus",
  colors: colors
}));

fs.writeFileSync('src/app/icon.svg', svgString);
fs.writeFileSync('public/icon.svg', svgString);
console.log('Successfully generated icon.svg');
