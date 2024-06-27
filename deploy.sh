#!/bin/bash

cd /home/juvhost1/sport-reserve.juvhost.com

wget https://github.com/Jadiael1/front-sport-reserve/archive/refs/heads/main.zip


unzip ./main.zip -d /home/juvhost1/sport-reserve.juvhost.com

rm -f /home/juvhost1/sport-reserve.juvhost.com/main.zip

mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/* /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.editorconfig /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.eslintrc.json /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.gitignore /home/juvhost1/sport-reserve.juvhost.com/
mv /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main/.prettierrc /home/juvhost1/sport-reserve.juvhost.com/

rm -rf /home/juvhost1/sport-reserve.juvhost.com/front-sport-reserve-main

/usr/bin/npm install

/usr/bin/npm run build

find . -mindepth 1 -path /home/juvhost1/sport-reserve.juvhost.com/dist -prune -o -exec rm -rf {} +

mv /home/juvhost1/sport-reserve.juvhost.com/dist/* /home/juvhost1/sport-reserve.juvhost.com/

rm -rf /home/juvhost1/sport-reserve.juvhost.com/dist


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
