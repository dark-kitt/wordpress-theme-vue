# WordPress - Vue.js
Project: [Part 1](https://github.com/dark-kitt/wordpress-boilerplate/tree/main), [Part 2](https://github.com/dark-kitt/wordpress-theme-configuration), [**Part 3**](https://github.com/dark-kitt/wordpress-theme-vue)

---

## Introduction

This is an example Vue project, based on [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) and [**Part 2**](https://github.com/dark-kitt/wordpress-theme-configuration) of the WordPress Boilerplate, which can be used to create a custom WordPress theme.

You can work with the WordPress backend system in two different ways. The first way would be to separate both systems from each other so that you have a headless backend with an unattached front-end system. The second way would be to use both systems together for an "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)" so that you are still able to use the PHP files from WordPress and hydrate dynamic Vue components inside of your DOM structure.

In my case, I used the second option and configured all the necessary stuff to make it usable for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)", but it's easy to modify the project to handle the first way and separate both systems. Just install the "[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)", and a template engine like [Handlebars](https://handlebarsjs.com/) to render the output, afterwards, it's just necessary to modify the Webpack configuration.

### Requirements

* [Yarn: ^1.*](https://yarnpkg.com/)

Install all necessary packages.
```shell
yarn
```

For development mode
```shell
yarn dev
```

For production mode
```shell
yarn prod
```

As described before I create only the output for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)", which means that you only see the JS, the CSS, and the necessary assets files inside of the (`/www`) output directory. So, the output must be included with PHP, e.g. by WordPress with [**wp_enqueue_script**](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).

---

# Getting started!

I guess the best way to get the idea behind is to set up an example project together. The following example is based on a macOS system, but it could be possible, with some troubleshooting, that it will also work on Windows.

As always, let's create a folder and change the directory.
```shell
mkdir example && cd example
```
## Set up the environment

Keep it simple as it is. Go to [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) of the WordPress Boilerplate and download the project as ZIP, open and copy the composer.json file into your project root directory (`/example`). In the next step we need a local server. Let's take my [**Docker**](https://github.com/dark-kitt/docker-php-apache-mysql) example project as base and we will modify it together.

If you have a GitHub account and want to fetch each file by **curl**, you can use the following snippet.
```shell
curl --header "PRIVATE-TOKEN: <your_github_access_token>" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
```

Or save your private access token in a curl header file, e.g. *`~/.curl/github`* and include your specific header into your command.
```text
# ~/.curl/github
PRIVATE-TOKEN: <github_access_token>
```

#### composer.json
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
```

#### compose.yml
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/docker-php-apache-mysql/main/compose.yml" > compose.yml
```

#### Dockerfile
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/docker-php-apache-mysql/main/Dockerfile" > Dockerfile
```

#### vhosts.conf
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/docker-php-apache-mysql/main/vhosts.conf" > vhosts.conf
```

Afterwards, your folder/file structure should look like this.
```text
/example
├── compose.yml
├── composer.json
├── Dockerfile
├── vhosts.conf
```

### Composer
Let's continue. If you have an ACF Pro key, please add it manually inside of the **composer.json** file and call **`composer update`**. Otherwise we will remove ACF Pro and getting forward. Let's keep it quickly and remove ACF Pro. To do so, call the follwing command.
```shell
composer config --unset repositories.advanced-custom-fields/advanced-custom-fields-pro && composer remove advanced-custom-fields/advanced-custom-fields-pro
```

Now your folder/file structure should like this.
```text
/example
├── .env
├── compose.yml
├── composer.json
├── composer.lock
├── Dockerfile
├── /vendor
├── ├── /...
├── vhosts.conf
├── /web
├── ├── /...
```

### Docker

Edit the following lines inside of the Docker files.

**compose.yml**
Just edit line [11].
```yml
# from
volumes:
  - .:/var/www/html
# to
volumes:
  - .:/var/www/html/web
```

**Dockerfile**
Copy and paste the next lines into your Dockerfile.
```Dockerfile
# Use an official PHP runtime
FROM php:8.2-apache
# Install necessary packages
RUN apt-get update && apt-get install -y \
  vim \
  iputils-ping \
  libzip-dev \
  zip \
  libpng-dev \
  libicu-dev \
  libmagickwand-dev
RUN pecl install imagick
# Install any extensions you need
RUN docker-php-ext-install mysqli pdo pdo_mysql zip gd exif intl
# Enable any extensions you need
RUN docker-php-ext-enable imagick
# Set the working directory to /var/www/html
WORKDIR /var/www/html
# Copy the required source code in the container at /var/www/html
COPY --chown=www-data:www-data --chmod=755 ./web ./web
COPY --chown=root:root --chmod=755 ./vendor ./vendor
COPY --chown=root:root --chmod=755 ./.env ./.env
# --- APACHE | set up ---
# Enable APACHE modules
RUN a2enmod rewrite && a2enmod ssl && a2enmod socache_shmcb
# Copy new vhosts config file into the root dir
COPY --chown=root:root --chmod=711 ./vhosts.conf ./vhosts.conf
# Insert custom vhosts file
RUN echo "Include /var/www/html/vhosts.conf" >> /etc/apache2/sites-available/vhosts.conf
# Disable old default config file
RUN a2dissite 000-default.conf
# Enable new config file
RUN a2ensite vhosts.conf
# Docker PHP-APACHE container logs => docker logs wp-webserver
# Set the 'ServerName' directive globally to suppress this message
# NOTE: https://stackoverflow.com/questions/48868357/docker-php-apache-container-set-the-servername-directive-globally
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
# Describe which ports your application is listening on
EXPOSE 80
# Get the Xdebug extension
RUN pecl install xdebug \
  # Enable the installed Xdebug
  && docker-php-ext-enable xdebug
```

**vhosts.conf**
Edit line [7] and [8].
```shell
# from
/var/www/html/api
# to
/var/www/html/web
```

Edit line [23] and [24].
```shell
# from
/var/www/html
# to
/var/www/html/web/app/themes/wordpress
```

Now we need to deny the the access to the `/var/www/html/web/app/themes/wordpress/config` directory. There are two ways to do it. First you can add a .htaccess file, which includes ` Deny from all` inside of the directory. The second way is to add the following lines inside the VirtualHost's to your Apache **vhosts.conf** file.
```shell
<VirtualHost *:80>
  ServerName api.example.kitt
...
  # deny the access for the theme config files (.env)
  <Directory  /var/www/html/web/app/themes/wordpress/config>
    Order deny,allow
    Deny from all
  </Directory>
...
</VirtualHost>
```
And
```shell
<VirtualHost *:80>
  ServerName example.kitt
...
  # deny the access for the theme config files (.env)
  <Directory  /var/www/html/web/app/themes/wordpress/config>
    Order deny,allow
    Deny from all
  </Directory>
...
</VirtualHost>
```

... coming soon