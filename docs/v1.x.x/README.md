# reacthtmlpack
> Added the missing piece of treating `index.html` as entry point in webpack bundles.


## I came here because I want to...

- Get started using `reacthtmlpack` immediately: go to [Getting Started](https://github.com/tomchentw/reacthtmlpack/blob/master/docs/Getting Started.md)
- Ask myself if its necessary: see [Who Should Use This](#who-should-use-this)
- Understand how to use `reacthtmlpack` in several projects: check out [Different Examples from Simple to Complex](https://github.com/tomchentw/reacthtmlpack/blob/master/docs/Examples.md)
- Understand the problem/solution: keep read on this `README.md`
- Get in touch with the community: join [Gitter Room][gitter-url]
- File a bug or feature request: [open an issue](https://github.com/tomchentw/reacthtmlpack/issues/new)


## The Problem

> Added the missing piece of treating `index.html` as entry point in webpack bundles.

### Slightly Long Version

When I tried to develop a static hosted website (e.g. gh-pages) using React and webpack, I found it annoying that webpack doesn't support `index.html` as entry point natively. People feel the same way, too. They've developed [many tools](https://github.com/tomchentw/reacthtmlpack/blob/master/docs/Existing%20Tools.md) out there to approach the problem. However, all of them has certain pitfalls that doesn't match my needs:

* **extracted css from js**: common pattern for React application
* **cache busting**: generating hashed url to the compiled assets by webpack
* **server rendering**: rendering React component statically as part of html template
* **server bundling**: generating assets using `target: "node"` that will be used in server rendering

*Read more about [server bundling](https://github.com/tomchentw/reacthtmlpack/blob/master/docs/Existing%20Tools.md#server-bundling)*


## Who Should Use This?

You have

* a static hosted website by a web server like nginx/apache.
* developed a react component and want to create a demo page for it on gh-pages


## The Solution

> Create a CLI `reacthtmkpack` that compiles html files into assets

* Use Babel, React, Webpack and Webpack-Dev-Server. All your favorite ones
* Write the `html` template using React (with Babel support). No other template library
* Declare `<script>` or `<link>` dependencies of your template using **React Components**
* **Simple and Explicit** Command Line Interface
* HMR, react-hot-loader supported without hassle
