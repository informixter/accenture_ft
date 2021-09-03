FROM php:7-fpm-buster
RUN apt-get update && apt-get install -y bash git libtool libpng-dev libpq-dev librabbitmq-dev zlib1g-dev libicu-dev libxslt-dev nano libzip-dev apt-transport-https wget
RUN docker-php-ext-install -j$(nproc) intl gd bcmath zip pdo_pgsql pgsql sockets xsl soap opcache
RUN echo 'memory_limit = 1024M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini;
RUN echo 'error_log = /proc/self/fd/1' >> /usr/local/etc/php/conf.d/docker-php-log.ini;
RUN echo 'access.log = /proc/self/fd/1' >> /usr/local/etc/php/conf.d/docker-php-log.ini;
RUN echo 'log_errors=On' >> /usr/local/etc/php/conf.d/docker-php-log.ini;
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer
RUN groupadd -g 242 app
RUN useradd -m -d /var/www/html -g 242 -u 242 -s /bin/bash app
RUN apt-get clean
RUN chown -R app:app /composer
WORKDIR /var/www/html