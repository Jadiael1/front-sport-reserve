#!/bin/bash

# Navegar até o diretório de destino
cd /home/juvhost1/sport-reserve.juvhost.com

# Remover todos os arquivos e pastas, exceto .htaccess
rm -rf /home/juvhost1/sport-reserve.juvhost.com/*

# Remover o arquivo .htaccess existente
rm -f /home/juvhost1/sport-reserve.juvhost.com/.htaccess

# Baixar o novo código
wget https://github.com/Jadiael1/front-sport-reserve/archive/refs/heads/main.zip

# Descompactar o novo código
unzip ./main.zip -d /home/juvhost1/sport-reserve.juvhost.com

# Remover o arquivo zip
rm -f /home/juvhost1/sport-reserve.juvhost.com/main.zip

# Mover os arquivos para o diretório de destino
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/* /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.editorconfig /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.eslintrc.json /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.gitignore /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.prettierrc /home/juvhost1/sport-reserve.juvhost.com/

# Remover a pasta descompactada
rm -rf /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main

# Instalar as dependências e criar o build
/usr/bin/npm install
/usr/bin/npm run build

# Limpar o diretório, exceto o dist
find . -mindepth 1 -path ./dist -prune -o -exec rm -rf {} +

# Mover os arquivos do dist para o diretório de destino
mv /home/juvhost1/sport-reserve.juvhost.com/dist/* /home/juvhost1/sport-reserve.juvhost.com/

# Remover o diretório dist
rm -rf /home/juvhost1/sport-reserve.juvhost.com/dist

# Criar o arquivo .htaccess
HTACCESS_CONTENT='<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redireciona tudo para index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>'

echo "$HTACCESS_CONTENT" > "/home/juvhost1/sport-reserve.juvhost.com/.htaccess"
