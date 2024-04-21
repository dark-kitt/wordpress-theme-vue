# WordPress - Vue.js
Project: [Part 1](https://github.com/dark-kitt/wordpress-boilerplate/tree/main), [Part 2](https://github.com/dark-kitt/wordpress-theme-configuration), [**Part 3**](https://github.com/dark-kitt/wordpress-theme-vue)

---

# Introduction

This is an example Vue project, based on [**Part 1**](https://github.com/dark-kitt/wordpress-boilerplate/tree/main) and [**Part 2**](https://github.com/dark-kitt/wordpress-theme-configuration) of the WordPress boilerplate, which can be used to create a custom WordPress theme.

You can work with the WordPress backend system in two different ways. The first way would be to separate both systems from each other so that you have a headless backend with an unattached front-end system. The second way would be to use both systems together for an "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)" so that you are still able to use the PHP files from WordPress and hydrate dynamic Vue components inside of your DOM structure.

In my case I used the second option and configured all necessary stuff to make it usable for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)".

In my case, I used the second option and configured all the necessary stuff to make it usable for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)", but it is easy to modify this project to handle the first way and separate both systems. Just install the "[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)", and a template engine like [Handlebars](https://handlebarsjs.com/) to render the output and modify the Webpack configuration a bit.

## Let's start

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

As described before I create only the output for the "[**Islands Architecture**](https://www.patterns.dev/vanilla/islands-architecture)", which means that you only see the JS, the CSS, and the necessary assets inside of the (`/www`) output directory. This means the output must be included with PHP by WordPress, e.g. [**wp_enqueue_script**](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).

---

# Getting started!

... coming soon
