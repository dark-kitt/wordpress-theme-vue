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

Keep it simple as it is. Go to [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) of the WordPress Boilerplate and download the project as ZIP, open and copy the composer.json file into your project root directory (`/example`). If you have a GitHub account and want to fetch the file by **curl**, you can use the following snippet.

#### composer.json
```shell
curl --header "PRIVATE-TOKEN: <your_github_access_token>" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
```

Or save your private access token in a curl header file, e.g. *`~/.curl/github`* and include your specific header into your command.
```text
# ~/.curl/github
PRIVATE-TOKEN: <github_access_token>
```
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
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
├── composer.json
├── composer.lock
├── /vendor
├── ├── /...
├── /web
├── ├── /...
```

### Docker

In the next step we need a local server. Let's work with [Docker](https://www.docker.com/products/docker-desktop/). If you don't have Docker you can download it [here](https://www.docker.com/products/docker-desktop/). We only need 3 files to set up Docker for this project. Please, copy and paste the follwing data and create each file in the root directory of our new project.

#### compose.yml
```yml
version: "3.9"
services:
  webserver:
    container_name: wp-webserver
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 80:80
    volumes:
      - ./web:/var/www/html/web
    depends_on:
      - mysql-db
    environment:
      XDEBUG_CONFIG: remote_host=host.docker.internal

  mysql-db:
    container_name: wp-mysql
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ro_password
      MYSQL_DATABASE: db_test
      MYSQL_USER: db_user
      MYSQL_PASSWORD: db_password
    ports:
      - "3306:3306"
```

#### Dockerfile
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

#### vhosts.conf
```xml
<VirtualHost *:80>
  ServerName api.example.kitt
  ServerAlias www.api.example.kitt
  ServerAdmin webmaster@localhost

  DocumentRoot /var/www/html/web
  <Directory /var/www/html/web>
    Options Indexes FollowSymlinks
    AllowOverride All
    Require all granted
  </Directory>

  # deny the access for the theme config files (.env)
  <Directory  /var/www/html/web/app/themes/example/config>
    Order deny,allow
    Deny from all
  </Directory>

  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

<VirtualHost *:80>
  ServerName example.kitt
  ServerAlias www.example.kitt
  ServerAdmin webmaster@localhost

  DocumentRoot /var/www/html/web/app/themes/example
  <Directory /var/www/html/web/app/themes/example>
    Options Indexes FollowSymlinks
    AllowOverride All
    Require all granted
  </Directory>

  # deny the access for the theme config files (.env)
  <Directory  /var/www/html/web/app/themes/example/config>
    Order deny,allow
    Deny from all
  </Directory>

  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

As you can see we deny the access for the `./web/app/themes/example/config` directory. This is important because we need a secret area to configure our project. But, there is also another way to do it. If you don't prefere to extend your Apache `vhosts.conf` file, you can also add a `.htaccess` file, which includes `Deny from all`, inside of the `./web/app/themes/example/config` directory.

⚠️ **Start: Necessary local configuration to resolve the custom domain.**\
Next we need to add our local domain to our local hosts file to resolve the custom domain in our browser. For this you need to add the localhost IP (`127.0.0.1`) to your `/etc/hosts` file on your machine.

Enter your machine password and open the hosts file.
```shell
sudo vim /etc/hosts
```

Add, at the end of the file, the following line.
```shell
# docker
127.0.0.1       example.kitt api.example.kitt
```
⚠️ **End: Necessary local configuration to resolve the custom domain.**

Afterwards, your folder/file structure should look like this.
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

### MySQL

Before we can go ahead and configure the backend system, it is necessary to set the permissions for our database user. Open your (downloaded) Docker application and run `docker compose up` in your terminal.
```shell
docker compose up
```
After all necessary packages are installed and the containers are running, connect to the MySQL container.
```shell
docker exec -it wp-mysql bash
```
Log in as root user. The password is defined in the **compose.yml** file, in our case it is `ro_password`.
```shell
mysql -u root -p
```
Now, set the privileges for the `db_user`.
```shell
GRANT ALL PRIVILEGES ON *.* TO 'db_user'@'%' WITH GRANT OPTION;
```
Flush the privileges.
```shell
FLUSH PRIVILEGES;
```
Logout.
```shell
quit
```

## Configure WordPress

Finally we can start to configure WordPress and dive into the interesting part to start working with our new custom WordPress theme. But before we start and try to access the `api.example.kitt` domain to open the backend system, we will go one step back. This means stop the running container with `ctrl + C`.

After the conatiners are stopped we need to set up the `.env` file. Update the follwing values.
```shell
DB_HOST="wp-mysql"
...
DB_NAME="wp_test"
DB_USER="db_user"
DB_PASSWORD="db_password"
...
WP_HOME="http://example.kitt"
ENV_SITEURL="http://api.example.kitt"
...
JWT_AUTH_CORS_ENABLE=true
```

If you already have any mail account which is usable for PHPMailer you can also set up the following values.
```shell
SMTP_HOST="smtp.domain.com"
SMTP_AUTH=true
SMTP_PORT=587
SMTP_SECURE="tls"
SMTP_USERNAME="your@username.com"
SMTP_PASSWORD="password"
SMTP_FROM="your@username.com"
SMTP_FROMNAME="WordPress"
```

Now, it is necessary to rebuild the containers.
```shell
docker compose build
```
Afterwards, we will run the new containers.
```shell
docker compose up
```

⚠️ **Keep in mind, every time you edit your environment, you need to rebuild your containers.** ⚠️

Let's try to access our configured backend system. Open your browser and enter the following domain.
```shell
api.example.kitt
```
You should see a mask from WordPress where you have to enter your first values of your custom backend system. We will enter the following data.
```shell
Site Title => example.kitt
Username => admin
Password => admin
Confirm use of weak password => check
Your Email => your@email.com
Search engine visibility => check
```
Press the button **`Install WordPress`**! And login as admin. Before we start to configure the theme, we need to adjust two things. First of all activate your new custom theme, you'll find it under `Appearence`. The second thing is to create a **REST-API user**. Go to `Users` and create a user with the credentials of our `.env` file. In this case it is important to set the **`Username === REST_USER`** and the **`Password === admin`**. Don't forget to set the **`Role === REST API User`**.

## The Front-End



... coming soon