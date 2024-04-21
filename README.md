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

... coming soon
