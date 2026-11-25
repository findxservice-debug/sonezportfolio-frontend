import React, { useState } from 'react';

// Devicon (official tech logos) - https://devicon.dev
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

// icon_key (database එකේ) -> devicon folder/file name
const ICON_MAP = {
  html5: 'html5/html5-original.svg',
  html: 'html5/html5-original.svg',
  css3: 'css3/css3-original.svg',
  css: 'css3/css3-original.svg',
  javascript: 'javascript/javascript-original.svg',
  js: 'javascript/javascript-original.svg',
  typescript: 'typescript/typescript-original.svg',
  react: 'react/react-original.svg',
  nextjs: 'nextjs/nextjs-original.svg',
  tailwindcss: 'tailwindcss/tailwindcss-original.svg',
  nodejs: 'nodejs/nodejs-original.svg',
  node: 'nodejs/nodejs-original.svg',
  express: 'express/express-original.svg',
  python: 'python/python-original.svg',
  php: 'php/php-original.svg',
  java: 'java/java-original.svg',
  mysql: 'mysql/mysql-original.svg',
  postgresql: 'postgresql/postgresql-original.svg',
  postgres: 'postgresql/postgresql-original.svg',
  mongodb: 'mongodb/mongodb-original.svg',
  mongo: 'mongodb/mongodb-original.svg',
  sqlite: 'sqlite/sqlite-original.svg',
  firebase: 'firebase/firebase-plain.svg',
  git: 'git/git-original.svg',
  github: 'github/github-original.svg',
  vscode: 'vscode/vscode-original.svg',
  'visual studio code': 'vscode/vscode-original.svg',
  figma: 'figma/figma-original.svg',
  docker: 'docker/docker-original.svg',
  vite: 'vitejs/vitejs-original.svg',
  photoshop: 'photoshop/photoshop-original.svg',
  illustrator: 'illustrator/illustrator-original.svg',
  premierepro: 'premierepro/premierepro-original.svg',
  aftereffects: 'aftereffects/aftereffects-original.svg',
};

export default function TechIcon({ iconKey, className = 'w-8 h-8' }) {
  const [failed, setFailed] = useState(false);
  const key = (iconKey || '').toLowerCase().trim();

  // Map එකේ නැති key එකක් නම් devicon naming pattern එක try කරනවා
  const path = ICON_MAP[key] || `${key}/${key}-original.svg`;

  if (!key || failed) {
    return (
      <div
        className={`${className} rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs uppercase`}
      >
        {key.substring(0, 3) || '?'}
      </div>
    );
  }

  return (
    <img
      src={`${DEVICON_BASE}/${path}`}
      alt={iconKey}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={`${className} object-contain`}
    />
  );
}