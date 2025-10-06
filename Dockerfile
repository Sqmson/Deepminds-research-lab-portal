FROM php:8.2-apache

# System deps + build tools
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev libpng-dev libonig-dev libxml2-dev libssl-dev build-essential pkg-config zlib1g-dev \
  && rm -rf /var/lib/apt/lists/*

# Install PECL extension mongodb
RUN pecl install mongodb \
  && docker-php-ext-enable mongodb

# PHP extensions commonly needed
RUN docker-php-ext-install pdo pdo_mysql mbstring zip gd xml

# Enable apache rewrite
RUN a2enmod rewrite

# Set Apache docroot to frontend directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/frontend
RUN sed -ri 's!DocumentRoot /var/www/html!DocumentRoot /var/www/html/frontend!g' /etc/apache2/sites-available/*.conf \
 && sed -ri 's!<Directory /var/www/html>!<Directory /var/www/html/frontend>!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy project files
COPY . /var/www/html

# Install composer and project PHP deps
WORKDIR /var/www/html/backend
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
 && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

# Ensure uploads/data dirs exist and writable by www-data
RUN mkdir -p /var/www/html/frontend/uploads /var/www/html/frontend/data \
 && chown -R www-data:www-data /var/www/html/frontend/uploads /var/www/html/frontend/data

EXPOSE 80
CMD ["apache2-foreground"]