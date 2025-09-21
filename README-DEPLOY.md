# 🚀 Деплой Dubai Property Helper на VPS

## 📋 Подготовка VPS

### 1. Подключение к VPS

```bash
ssh root@your-vps-ip
```

### 2. Создание пользователя (если нужно)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

## 🔧 Установка на VPS

### 1. Клонирование проекта

```bash
git clone https://github.com/your-username/dubai-property-helper.git
cd dubai-property-helper
```

### 2. Запуск скрипта деплоя

```bash
chmod +x deploy.sh
./deploy.sh
```

## ⚙️ Настройка домена

### 1. DNS настройки

В панели управления доменом добавьте A-записи:

```
dubai-property-helper.ru → IP_VPS
www.dubai-property-helper.ru → IP_VPS
```

### 2. Проверка DNS

```bash
nslookup dubai-property-helper.ru
```

## 🔒 SSL сертификат

Скрипт автоматически получит SSL сертификат от Let's Encrypt.

## 📊 Управление

### Просмотр статуса

```bash
docker-compose ps
```

### Просмотр логов

```bash
docker-compose logs -f
```

### Перезапуск

```bash
docker-compose restart
```

### Обновление

```bash
git pull
docker-compose build --no-cache
docker-compose up -d
```

## 🛠️ Ручная настройка (если скрипт не работает)

### 1. Установка Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Установка Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 4. Установка Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5. Запуск приложения

```bash
docker-compose up -d
```

### 6. Настройка Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/dubai-property-helper
sudo ln -s /etc/nginx/sites-available/dubai-property-helper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL сертификат

```bash
sudo certbot --nginx -d dubai-property-helper.ru -d www.dubai-property-helper.ru
```

## 🔍 Проверка работы

1. Откройте https://dubai-property-helper.ru
2. Заполните форму
3. Проверьте создание сделки в amoCRM

## 📞 Поддержка

При проблемах проверьте:

- Логи: `docker-compose logs -f`
- Статус: `docker-compose ps`
- Nginx: `sudo systemctl status nginx`
- SSL: `sudo certbot certificates`
