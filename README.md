# WordPress - Vue.js
Project: [Part 1](https://github.com/dark-kitt/wordpress-boilerplate/tree/main), [Part 2](https://github.com/dark-kitt/wordpress-theme-configuration), [**Part 3**](https://github.com/dark-kitt/wordpress-theme-vue)

---

## Introduction

This is an example Vue project, based on [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) and [**Part 2**](https://github.com/dark-kitt/wordpress-theme-configuration) of the WordPress Boilerplate, which can be used to create a custom WordPress theme.

You can work with the WordPress backend system in two different ways. The first way would be to separate both systems from each other so that you have a headless backend with an unattached front-end system. The second way would be to use both systems together for an "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)" so that you are still able to use the PHP files from WordPress and hydrate dynamic Vue components inside of your DOM structure.

In my case, I used the second option and configured all the necessary stuff to make it usable for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)", but it's easy to modify the project to handle the first way and separate both systems. Just install the "[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)", and a template engine like [Handlebars](https://handlebarsjs.com/) to render the output. Afterward, it's just necessary to modify the Webpack configuration.

### Requirements

* [Yarn: ^1.*](https://yarnpkg.com/)

Install all necessary packages.
```shell
yarn
```

For development mode.
```shell
yarn dev
```

For production mode.
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

Keep it simple as it is. Go to [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) of the WordPress Boilerplate download the project as ZIP, and open and copy-paste the composer.json file into your project root directory (`/example`). If you have a GitHub account and want to fetch the file by **curl** you can use the following snippet.

#### composer.json
```shell
curl --header "PRIVATE-TOKEN: <your_github_access_token>" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
```

Or save your private access token in a curl header file, e.g. `~/.curl/github`, and include your specific header in your command.
```text
# ~/.curl/github
PRIVATE-TOKEN: <github_access_token>
```
```shell
curl -H @"$HOME/.curl/github" "https://raw.githubusercontent.com/dark-kitt/wordpress-boilerplate/main/composer.json" > composer.json
```

### Composer
Let's continue. If you have an ACF Pro key, please add it manually inside of the **composer.json** file [25] and call **`composer update`**. Otherwise, we will remove ACF Pro and get forward. Let's keep it quickly and remove ACF Pro. To do so, call the following command.
```shell
composer config --unset repositories.advanced-custom-fields/advanced-custom-fields-pro && composer remove advanced-custom-fields/advanced-custom-fields-pro
```

Now, your folder/file structure should be like this.
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

In the next step, we need a local server. Let's work with [Docker](https://www.docker.com/products/docker-desktop/). If you don't have Docker you can download it [here](https://www.docker.com/products/docker-desktop/). We only need 3 files to set up Docker for this project. Please, copy and paste the following snippets and create each file in the root directory (`/example`) of our new project.

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

As you can see we deny the access for the `./web/app/themes/example/config` directory. This is important because we need a save area to configure our project in the front-end directory. But there is also another way to do it. If you don't prefer to extend your Apache `vhosts.conf` file, you can also add a `.htaccess` file that includes `Deny from all` inside of the `./web/app/themes/example/config` directory.

⚠️ **Necessary local configuration to resolve the custom domain.**

Next, we need to add our local domain to our local hosts file to resolve the custom domain in our browser. For this, you need to add the localhost IP (`127.0.0.1`) to your `/etc/hosts` file on your machine.

Enter your machine password and open the hosts file.
```shell
sudo vim /etc/hosts
```

Add, at the end of the file, the following line.
```shell
# docker
127.0.0.1       example.kitt api.example.kitt
```

Afterward, your folder/file structure should look like this.
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

Before we can go ahead and configure the backend system, it is necessary to set the permissions for our database user. Open/Start your (downloaded) Docker application and call `docker compose up` in a terminal window.
```shell
docker compose up
```
After all necessary packages are installed and the containers are running, open a new terminal window and connect to the MySQL container.
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

Cancel the connection to the MySQL container by pressing `ctrl + P` and `ctrl + Q`. Close the new terminal window so that we have only one window again, where the containers are running.

## Configure WordPress

Finally, we can start to configure the WordPress backend system and dive into the interesting part to start working with our new custom WordPress theme. But before we start and try to access the `api.example.kitt` domain to open the backend system, we will go one step back. This means stopping the running containers with ctrl + C inside of the terminal window.

After the containers are stopped we need to set up the `.env` file. Please update the following values.

#### .env
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

If you already have an email account that is usable for PHPMailer you can also set up the following values.
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

Now, it is necessary to rebuild the containers. Call the following command.
```shell
docker compose build
```
Afterward, we will run the new containers.
```shell
docker compose up
```

⚠️ **Keep in mind, that every time you edit your environment, you need to rebuild your containers.** ⚠️

Let's try to access our configured backend system. Open your browser and enter the following domain.
```shell
api.example.kitt
```
You should see a mask from WordPress where you have to enter the first values of your custom backend system. We will enter the following data.
```shell
Site Title => example.kitt
Username => admin
Password => admin
Confirm use of weak password => check
Your Email => your@email.com
Search engine visibility => check
```
Press the button **`Install WordPress`**! And login as admin. Before we start to configure the theme, we need to adjust two things. First of all, activate your new custom theme, you'll find it under `Appearance`. The second thing is to create a **REST-API user**. Go to `Users` and create a user with the credentials of our `.env` file. In this case, it is important to set the **`Username === REST_USER`**, the **`Password === admin`**, and the **`Role === REST API User`**.

## The Front-End

Let's dive into the front-end directory `./web/app/themes/example` and configure the last part for WordPress. I'll take some parts of the snippets from the `example.functions.php` file to handle some configurations. Please add the following lines below inside of the `functions.php` file.

#### functions.php / theme configuration
```PHP
/** debug */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

global $wpdb,
  $wp_rewrite,
  $pagenow;

$kitt_instance = KiTT\ThemeSetUp::get_instance();
$kitt_instance->set_up_theme(
  $wpdb,
  /** reqiured */
  $wp_rewrite,
  /** reqiured */
  $pagenow,
  /** reqiured */
  [
    'set_up' => [
      /** custom favicon, logos and login logo url */
      'favicon' => $kitt_instance->theme_url . '/src/assets/icons/vue-icon.png',
      'login_logo' => $kitt_instance->theme_url . '/src/assets/icons/vue-icon.svg',
      'login_logo_url' => WP_HOME,
      'admin_bar_logo' => $kitt_instance->theme_url . '/src/assets/icons/vue-icon.svg',
      'permalink_structure' => '/%postname%/',
      'default_user_role' => 'editor',
      /** add or remove company settings menu page */
      'company_settings' => false
    ]
  ]
);

$kitt_instance->post([
  /** removes completely the default post section */
  'remove_post' => true
]);

$kitt_instance->page([
  'page' => [
    /**
     * info:
     * https://developer.wordpress.org/reference/functions/remove_post_type_support/
     * 
     * NOTE:
     * Gutenberg editor is always disabled
     */
    'remove_support' => ['excerpt', 'comments', 'trackbacks', 'author'],
    /** inspect the label attribute for="" in the screen options panel */
    'remove_meta_box' => ['commentsdiv', 'slugdiv'],
    /** en- or disable the SEO meta box */
    'SEO' => true,
    /** to enable tag support */
    'tag' => true,
    /** to enable category support */
    'category' => false
  ]
]);

$kitt_instance->attachment([
  'attachment' => [
    /** to enable tag support */
    'tag' => false,
    /** to enable category support */
    'category' => false,
    /** enable search duplicates support */
    'search_duplicates' => true
  ],
  /** 
   * set custom upload mimes
   * 
   * extend_defaults = true|false
   * true = merges the default upload mimes
   * false = replaces the default upload mimes
   * 
   * list of defaulst:
   * https://developer.wordpress.org/reference/functions/get_allowed_mime_types/
   */
  'upload_mimes' => [
    'extend_defaults' => true,
    'jpg|jpeg|jpe' => 'image/jpeg',
    'gif' => 'image/gif',
    'png' => 'image/png',
    /**
     * NOTE:
     * the XML declaration is required
     * in each SVG file, otherwise
     * the SVG upload is not accepted
     * 
     * enter the version and the encoding
     * charset at the top of each SVG file 
     * 
     * <?xml version="1.0" encoding="utf-8"?>
     * <svg xmlns="http://www.w3.org/2000/svg" ... viewBox="0 0 100 57">
     *     ...
     * </svg>
     */
    'svg' => 'image/svg+xml',
    'pdf' => 'application/pdf',
    'mp3|m4a|m4b' => 'audio/mpeg',
    'mp4|m4v' => 'video/mp4',
    'zip' => 'application/zip'
  ],
  'options_media' => [
    /** WP default 150x150px */
    'thumbnail_size' => [
      'thumbnail_size_w' => 150,
      'thumbnail_size_h' => 150
    ],
    /** WP default 1 */
    'thumbnail_crop' => 1,
    /** WP default 300x300px */
    'medium_size' => [
      'medium_size_w' => 300,
      'medium_size_h' => 300
    ],
    /** WP default 768x768px */
    'medium_large_size' => [
      'medium_large_size_w' => 768,
      'medium_large_size_h' => 768
    ],
    /** WP default 1024x1024px */
    'large_size' => [
      'large_size_w' => 1024,
      'large_size_h' => 1024
    ],
    /** WP default 0 */
    'uploads_yearmonth' => 1,
    /** WP default open */
    'ping_status' => 'closed',
    /** WP default open */
    'comment_status' => 'closed',
    /** /wp-content/uploads */
    'upload_path' => constant('WP_UPLOAD_DIR'),
    /** http://127.0.0.1/uploads */
    'upload_url_path' => constant('WP_UPLOAD_URL')
  ]
]);

$kitt_instance->comments([
  /** removes completely the default comments section */
  'remove_comments' => true
]);

$kitt_instance->menu([
  /** register main menu locations */
  'menu' => [
    'locations'  => [
      'header' => 'Header'
    ]
  ]
]);
```

### REST-API

In this example project we want to use the REST API to get some data from the backend system that's why we have also to configure it. Please add the following snippet for it.

#### functions.php / REST-API configuration
```PHP
$kitt_instance->REST_API([
  'rest_api' => [
    /**
     * set the namespace for your routes
     * => api.example.com/wp-json/->namespace<-/endpoint
     */
    'namespace' => explode('.', parse_url(WP_HOME)['host'])[0],
    /** removes the default REST API */
    'remove_default' => true,
    /**
     * examples:
     * 'Access-Control-Allow-Origin: ' . WP_HOME
     * 'Access-Control-Allow-Methods: POST, GET'
     * 'Access-Control-Allow-Credentials: true'
     * 'Access-Control-Max-Age: 600'
     */
    'headers' => [
      'Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type',
      'Access-Control-Allow-Origin: ' . WP_HOME,
      'Access-Control-Allow-Methods: POST, GET',
      'Access-Control-Allow-Credentials: true',
      'Access-Control-Max-Age: 600'
    ],
    /** JWT token arguments */
    'token' => [
      'expiration_time' => time() + (DAY_IN_SECONDS * 7),
      'header' => 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Authorization'
    ]
  ]
]);
```

As you can see, I set the `Access-Control-Allow-Origin` header to `WP_HOME`, this means that requests are only allowed from `example.kitt`. This is important because we don't want, that other websites can access the data. The namespace is set to `example` by `explode('.', parse_url(WP_HOME)['host'])[0]`, so if you want to make requests to the REST-API you need to call `api.example.com/wp-json/example/endpoint`.

### JWT Token Handling

Obviously, we need a token for each request. To retrieve a token we will add now a small snippet to the `functions.php` file. Let's extend the instance and add a new endpoint and a callback function to handle this stuff.

#### functions.php / adding REST-API endpoint
```PHP
/**
 * register the /token endpoint to retrieve
 * the token from JWT Authentication for WP REST API
 */
$kitt_instance->rest_routes['token'] = [
  /**
   * class WP_REST_Server {
   * ...
   *   const READABLE = 'GET';
   *   const CREATABLE = 'POST';
   * ...
   * }
   * 
   * \WP_REST_Server::READABLE === GET
   * 
   * documentation
   * https://developer.wordpress.org/reference/classes/wp_rest_server/
   */
  'methods'  => \WP_REST_Server::READABLE,
  'callback' => 'get_token',
  // set the permission to public
  'permission_callback' => '__return_true',
  // the args key is required even if the array is empty
  'args' => []
];

/**
 * define a custom callback function
 * to handle the request
 */
$kitt_instance->get_token = function () {
  $response= null;
  // create a simple curl request
  try {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, ENV_SITEURL . '/wp-json/jwt-auth/v1/token');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
      'username' => constant('REST_USER'),
      'password' => constant('REST_PASSWORD')
    ]));

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    curl_close($ch);
  } catch (Exception $e) {
    $response = $e->getMessage();
  }
  // return the data
  return new \WP_REST_Response(json_decode($response), 200);
};
```

What have we done? We added a new endpoint to `$kitt_instance->rest_routes` which is callable with `token` (`api.example.com/wp-json/example/token`). The method is set to `GET` by `\WP_REST_Server::READABLE`. Every endpoint needs a permission callback. With the [**WordPress Theme Configuration**](https://github.com/dark-kitt/wordpress-theme-configuration) plugin, it is only possible to set the permission to `rest_api_user` (protected) or like in our case `__return_true` (public). Afterward, it is necessary to handle the request by a callback function, which is defined under the `$kitt_instance->rest_routes` configuration. You can also add some arguments in the last array, but in our case, it is not necessary.

### PHPMailer

If you have entered email configurations in the `.env` file before, you can add the following snippet to configure PHPMailer, otherwise, you can ignore this step. Just add the snippet below and test the endpoint by calling a request to `api.example.com/wp-json/example/email`. Afterward, you should receive an email to your account by yourself.

#### functions.php / PHPMailer configuration
```PHP
/**
 * update email route arguments
 * set server settings
 *
 * update values with WP constants
 * or set your custom settings
 */
$kitt_instance->rest_routes['email']['args']['host'] = ['default' => constant('SMTP_HOST')]; // 'smtp.gmail.com'
$kitt_instance->rest_routes['email']['args']['SMTP_auth'] = ['default' => constant('SMTP_AUTH')]; // boolean
$kitt_instance->rest_routes['email']['args']['username'] = ['default' => constant('SMTP_USERNAME')]; // 'your@username.com'
/** 
 * use google app password:
 * https://support.google.com/accounts/answer/185833?hl=en
 */
$kitt_instance->rest_routes['email']['args']['password'] = ['default' => constant('SMTP_PASSWORD')]; // 'app-password'
$kitt_instance->rest_routes['email']['args']['SMTP_secure'] = ['default' => constant('SMTP_SECURE')]; // 'tls'
$kitt_instance->rest_routes['email']['args']['port'] = ['default' => constant('SMTP_PORT')]; // 587
/** PHPMailer debug */
$kitt_instance->rest_routes['email']['args']['debug'] = ['default' => false];
/**
 * test PHPMailer and send a mail to your own account via
 * http://api.example.com/wp-json/->namespace<-/email
 */
$kitt_instance->rest_routes['email']['args']['set_from'] = ['default' => [
  'address' => constant('SMTP_USERNAME'),
  'name' => 'Foo'
]];
$kitt_instance->rest_routes['email']['args']['add_address'] = ['default' => [[
  'address' => constant('SMTP_USERNAME'),
  'name' => 'Bar'
]]];
```

### Add the output

As described before this example project used the second option to handle the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)". So we need to add the output files to the DOM by WordPress. Let's add another snippet. At this time, we will open and edit the `index.php` file.

#### index.php / enqueue scripts and styles
```PHP
// enqueue scripts and styles
add_action('wp_enqueue_scripts', function () {
  if (file_exists('./www/assets-manifest.json')) {
    $manifest = json_decode(file_get_contents('./www/assets-manifest.json'));
    foreach ($manifest as $key => $value) {
      if ($key == 'entrypoints') {
        foreach ($value->main->assets->js as $js_file) {
          $js_file_info = pathinfo($js_file);
          // replace [hash].bundle.min for tag <script id="$id" ...
          $id = preg_replace('/(|\.\w+)\.bundle\.min/', '', $js_file_info['filename']);
          // enqueue the main.bundle.js file at the end of the DOM
          wp_enqueue_script($id, WP_HOME . '/www/' . $js_file, [], false, str_contains($js_file_info['filename'], 'main'));
        }

        foreach ($value->main->assets->css as $css_file) {
          $css_file_info = pathinfo($css_file);
          // replace [hash].bundle.min for tag <link id="$id" ...
          $id = preg_replace('/(|\.\w+)\.bundle\.min/', '', $css_file_info['filename']);
          wp_enqueue_style($id, WP_HOME . '/www/' . $css_file, [], false, 'screen');
        }
      }
    }
  }
});
```

As you can see, I create a manifest.json file inside of the output directory (`/www`) and read and add all scripts and styles that are listed in the JSON file. It is required to add an ID for each file, so, I remove the hash to have a readable ID name. I also create an exception for the `main.bundle.js` file, that this file is always included at the end of the DOM.

The last point is to request a token and hand over it to the front-end system. For this, I created just a global constant.

```PHP
<script>
const TOKEN_DATA = <?= json_encode($kitt_instance->get_token()->data, JSON_PRETTY_PRINT) ?>;
</script>
```

So, in the end, my `index.php` file is looking like this.

#### index.php
```PHP
<?php
// Load WordPress for access of internal functions
require_once('../../../wp/wp-load.php');
// enqueue scripts and styles
add_action('wp_enqueue_scripts', function () {
  if (file_exists('./www/assets-manifest.json')) {
    $manifest = json_decode(file_get_contents('./www/assets-manifest.json'));
    foreach ($manifest as $key => $value) {
      if ($key == 'entrypoints') {
        foreach ($value->main->assets->js as $js_file) {
          $js_file_info = pathinfo($js_file);
          // replace [hash].bundle.min for tag <script id="$id" ...
          $id = preg_replace('/(|\.\w+)\.bundle\.min/', '', $js_file_info['filename']);
          // enqueue the main.bundle.js file at the end of the DOM
          wp_enqueue_script($id, WP_HOME . '/www/' . $js_file, [], false, str_contains($js_file_info['filename'], 'main'));
        }

        foreach ($value->main->assets->css as $css_file) {
          $css_file_info = pathinfo($css_file);
          // replace [hash].bundle.min for tag <link id="$id" ...
          $id = preg_replace('/(|\.\w+)\.bundle\.min/', '', $css_file_info['filename']);
          wp_enqueue_style($id, WP_HOME . '/www/' . $css_file, [], false, 'screen');
        }
      }
    }
  }
});

get_header();
?>

<main id="theme">WordPress index.php</main>

<script>
const TOKEN_DATA = <?= json_encode($kitt_instance->get_token()->data, JSON_PRETTY_PRINT) ?>;
</script>

<?php get_footer(); ?>
```

Ok, that was a lot of instruction, but now you are done! Just start the front-end system by calling `yarn dev` and create the necessary output to make our example project visible at `example.kitt`.

```shell
yarn dev
```

Now it is up to you. Be creative and start coding. Just place your scripts and styles inside of the `/src` directory and create your own custom front-end system.

**Happy coding!**

---
---

## License

[![](https://upload.wikimedia.org/wikipedia/commons/e/e5/CC_BY-SA_icon.svg)](https://creativecommons.org/licenses/by-sa/4.0)