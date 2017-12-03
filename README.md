# plain-dialogs

[HTML5 dialog element](https://demo.agektmr.com/dialog/) based
alert/confirm/prompt; modal/non-modal variants, promisified API, no
fancy CSS by default.

[Demo](http://gromnitsky.users.sourceforge.net/js/examples/plain-dialogs/smoke.html)

    npm i plain-dialogs

| file                    | lang  | type       | minified |
| ----------------------- | ----- | ---------- | -------- |
| `dist/plain-dialogs.js` | es6   | UMD        | x        |
| `index.mjs`             | es6   | es6 module |          |

Use [dialog-polyfil](https://github.com/GoogleChrome/dialog-polyfill)
for non-Chromium browsers (just include .css & .js *before*
plain-dialogs lib; you don't need to initialize anything).

An unstyled modal alert:

![](http://ultraimg.com/images/2017/12/03/nqjW.png)

The same dialog after applying some CSS:

![](http://ultraimg.com/images/2017/12/03/nqja.png)

## Why?

The Chromium team [actively
discourages](https://developers.google.com/web/updates/2017/03/dialogs-policy)
us from using `window.alert` et al., sometimes even [implicitly
preventing](https://bugs.chromium.org/p/chromium/issues/detail?id=476350)
us from doing so.

One of the alternatives is to use a "native" dialog element that is
supported by Chrome since forever but is still under a flag in
Firefox.

Unfortunately, this means that the old sync pattern of

    let r = confirm('are you sure?')
    if (r) erase_all_the_monies()

doesn't work w/ "new" dialog elements. To ask a user we need to create
a `<dialog>` dom node, fill it w/ the text of the question, add 2
buttons w/ the proper event listeners, wait for an answer, remove the
node from the document.

This is what this lib does automatically, allowing us to write:

    plainDialogs.confirm('are you sure?').then(erase_all_the_monies)

or

    let r = await plainDialogs.confirm2('are you sure?')
    if (r) erase_all_the_monies()


## API

Every fn return a promise. The last arg of every fn is an option
hash. The default opts are:

~~~
{
    modal: true,
    escape: true,
    title: undefined
}
~~~

### alert

    > await plainDialogs.alert('Hi, mom!')
    true

    > await plainDialogs.alert('<h1>Hi, mom!</h1>', {escape: false})
    true

### confirm

A promise rejects on clicking "Cancel":

    > try { await plainDialogs.confirm('really?') } catch (e) { console.log(`result: ${e}`) }
    result: false

### confirm2

Return a promise that always resolves. Here, a user clicks "Cancel":

    > await plainDialogs.confirm2('really?')
    false

### prompt

not implemented


## Styling

By default there's no styling whatsoever. Every fn creates a tmp
`<dialog>` node w/ `b59LdZ-dlg` class. Create a dialog & use the
Elements tab in Developer Tools to discover more. See `test/smoke.js`
for examples.

~~~
.b59LdZ-dlg {
  width: 275px;
  background: red;
}
~~~

## License

MIT.
