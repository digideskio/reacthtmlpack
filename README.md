# reacthtmlpack
> Build a single HTML file into a full-featured, production-ready Single Page Application

[![Version][npm-image]][npm-url] [![Travis CI][travis-image]][travis-url] [![Quality][codeclimate-image]][codeclimate-url] [![Coverage][codeclimate-coverage-image]][codeclimate-coverage-url] [![Dependencies][gemnasium-image]][gemnasium-url] [![Gitter][gitter-image]][gitter-url]


## Installation

```sh
# next is v2.x.x
npm install reacthtmlpack@next --save
# latest is v1.x.x. Docs are under docs/v1.x.x/
```


## Examples

Take [an example](https://github.com/react-bootstrap/react-bootstrap/blob/v0.28.3/docs/examples/AlertAutoDismissable.js) from `react-bootstrap`, you'll have two ways to try it:


### With online REPL

1. Copy the contents of [index.html](https://github.com/tomchentw/reacthtmlpack/blob/v2.1.6/examples/AlertAutoDismissable/index.html)
2. Paste to the left area of the REPL ⇨⇨⇨ https://reacthtmlpack.tomchentw.com
3. Click "Submit" and *wait ~20s*
4. Voila! Play aroud with your demo component on the right area!

![reacthtmlpack.tomchentw.com - demo](https://camo.githubusercontent.com/9821d63e30e96737445c98bf83c55057958bb710/687474703a2f2f672e7265636f726469742e636f2f5a33364478626e76714b2e676966)


### Run it on your machine

Save `index.html` and `package.json` into the same directory. You can find it under `examples/AlertAutoDismissable` directory. Then,

```sh
npm install
npm start
```

Visit http://localhost:8080/


## Contributing

[![devDependency Status][david-dm-image]][david-dm-url]

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


[npm-image]: https://img.shields.io/npm/v/reacthtmlpack.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/reacthtmlpack

[travis-image]: https://img.shields.io/travis/tomchentw/reacthtmlpack.svg?style=flat-square
[travis-url]: https://travis-ci.org/tomchentw/reacthtmlpack
[codeclimate-image]: https://img.shields.io/codeclimate/github/tomchentw/reacthtmlpack.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/tomchentw/reacthtmlpack
[codeclimate-coverage-image]: https://img.shields.io/codeclimate/coverage/github/tomchentw/reacthtmlpack.svg?style=flat-square
[codeclimate-coverage-url]: https://codeclimate.com/github/tomchentw/reacthtmlpack
[gemnasium-image]: https://img.shields.io/gemnasium/tomchentw/reacthtmlpack.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/tomchentw/reacthtmlpack
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/tomchentw/reacthtmlpack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[david-dm-image]: https://img.shields.io/david/dev/tomchentw/reacthtmlpack.svg?style=flat-square
[david-dm-url]: https://david-dm.org/tomchentw/reacthtmlpack#info=devDependencies
