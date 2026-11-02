FROM php:7.4-apache-bullseye

# Configurar repositorios hacia archive.debian.org (Debian 11 Bullseye alcanzó su EOL)
RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until && \
    echo "deb [check-valid-until=no] http://archive.debian.org/debian/ bullseye main contrib non-free" > /etc/apt/sources.list && \
    echo "deb [check-valid-until=no] http://archive.debian.org/debian-security bullseye-security main contrib non-free" >> /etc/apt/sources.list

# Instalar dependencias del sistema, cliente postgresql y python3
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libmcrypt-dev \
    libxml2-dev \
    libzip-dev \
    postgresql-client \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Vincular python3 como el comando 'python'
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Compilar e instalar extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        gd \
        bcmath \
        zip \
        soap

# Instalar extensión mcrypt (usada por PXP para servicios REST)
RUN pecl install mcrypt-1.0.4 && docker-php-ext-enable mcrypt

# Habilitar módulos necesarios de Apache
RUN a2enmod rewrite headers

# Configurar Apache VirtualHost
COPY docker/apache-kerp.conf /etc/apache2/sites-available/apache-kerp.conf
RUN a2dissite 000-default.conf && a2ensite apache-kerp.conf

WORKDIR /var/www/html/kerp

# Script de entrada para preparar enlaces simbólicos y configuración
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
