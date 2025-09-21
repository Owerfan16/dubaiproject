#!/bin/bash

# Скрипт для деплоя на VPS
echo "🚀 Начинаем деплой Dubai Property Helper..."

# Обновляем систему
echo "📦 Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
echo "🐳 Устанавливаем Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Устанавливаем Docker Compose
echo "🔧 Устанавливаем Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Устанавливаем Nginx
echo "🌐 Устанавливаем Nginx..."
sudo apt install nginx -y

# Устанавливаем Certbot для SSL
echo "🔒 Устанавливаем Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Создаем директорию для проекта
echo "📁 Создаем директорию проекта..."
sudo mkdir -p /var/www/dubai-property-helper
sudo chown $USER:$USER /var/www/dubai-property-helper

# Копируем файлы проекта
echo "📋 Копируем файлы проекта..."
cp -r . /var/www/dubai-property-helper/
cd /var/www/dubai-property-helper

# Создаем .env файл
echo "⚙️ Создаем .env файл..."
cat > .env << EOF
NODE_ENV=production
AMOCRM_DOMAIN=gproleague
AMOCRM_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImEwYTEwYmQwMzk5ZWFiYmRmNDVjZmEzZmNlZjYzNmQ1MGI5MTNhOGE4YmYyMmI1MWI0NTU0NDNhODQ1MWQ1ZTg0N2U0ZDE4NDRkYThkOThiIn0.eyJhdWQiOiIwMTY2ZmVmMy03MDEzLTRmZjQtOTZiOC1kYmRiMzZkYWMwOWUiLCJqdGkiOiJhMGExMGJkMDM5OWVhYmJkZjQ1Y2ZhM2ZjZWY2MzZkNTBiOTEzYThhOGJmMjJiNTFiNDU1NDQzYTg0NTFkNWU4NDdlNGQxODQ0ZGE4ZDk4YiIsImlhdCI6MTc1ODQzMzc1NywibmJmIjoxNzU4NDMzNzU3LCJleHAiOjE4OTM0NTYwMDAsInN1YiI6IjEyOTg2NDM4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyNjY1MjU0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiZmE0ODc0MGEtYTNkOS00NTc3LTlkZWQtNmZjYTMyOGM5Mjk4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.Y48tD1Q1h8ExG-XCiexY_bsI0PQvHDafSmDNfysgfesISeDI-JJBbtkoL3rkBcpXS1XoTQb-CNRXN_pslloYYB7zdC6_3z8OVv2THq0GANut8O98mbh-phz8B1eBRtrcLTz6wiIBevbhkTQsH9Fnsg_2TZSlUW6ZT-BK-OVUQCW91yvbkaNSll_n439GtEXlkIa5yoyxkFXfO3c5U1kXfvadujw4oLre-hBw9qVufjU0oxOrsqF5WI159ClDKpHB44aCGekZ5do4aGVzPTuuVVc8byPhdV0tqEKaCx2PX8h50UyCJNr-KP36JlGcxfEFZuCVrMVfR2qIYEnz6ZQy3w
AMOCRM_PIPELINE_ID=10110086
EOF

# Собираем и запускаем контейнер
echo "🔨 Собираем и запускаем контейнер..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Настраиваем Nginx
echo "🌐 Настраиваем Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/dubai-property-helper
sudo ln -sf /etc/nginx/sites-available/dubai-property-helper /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Получаем SSL сертификат
echo "🔒 Получаем SSL сертификат..."
sudo certbot --nginx -d dubai-property-helper.ru -d www.dubai-property-helper.ru --non-interactive --agree-tos --email admin@dubai-property-helper.ru

# Настраиваем автообновление сертификата
echo "🔄 Настраиваем автообновление сертификата..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Настраиваем автозапуск
echo "🚀 Настраиваем автозапуск..."
sudo systemctl enable nginx
sudo systemctl enable docker

echo "✅ Деплой завершен!"
echo "🌐 Сайт доступен по адресу: https://dubai-property-helper.ru"
echo "📊 Статус контейнера: docker-compose ps"
echo "📝 Логи: docker-compose logs -f"
