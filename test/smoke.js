import * as pd from './index.js'

$('#alert-modal').onclick = function() {
    pd.alert('A modal <b>dlg</b> w/ escaped text').then(console.log)
}

$('#alert-modal-fancy').onclick = function() {
    pd.alert(`<p><b>Cross-site scripting</b> (<b>XSS</b>) is a type of <a href="/wiki/Computer_security">computer security</a> <a href="/wiki/Vulnerability_(computer_science)">vulnerability</a> typically found in <a href="/wiki/Web_application">web applications</a>.</p>

<p>XSS enables attackers to inject client-side scripts into web pages viewed by other users</p>`, {
	title: 'My Title',
	escape: false
    }).then(console.log)
}

$('#alert').onclick = function() {
    pd.alert('A non-modal dlg', {modal: false}).then(console.log)
}

$('#confirm-modal').onclick = function() {
    pd.confirm('Are you sure?').then(console.log)
}

$('#confirm2').onclick = function() {
    pd.confirm2('Are you sure?', {
	modal: false,
	title: 'Always resolves!'
    }).then(console.log)
}

// helpers

function $(q) { return document.querySelector(q) }

$('#css').onchange = function(evt) {
    if (evt.target.checked) {
	let node = document.createElement('style')
	node.className = 'injected'
	node.innerHTML = `
.b59LdZ-dlg {
  width: 275px;			/* Edge */
  border: 1px solid lightgray;
  border-radius: 3px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
}

.b59LdZ-dlg button {
  width: 6em;
}

.b59LdZ-dlg__header {
  border-bottom: 1px solid lightgray;
  margin: 0 -1em;
  padding: 0 1em 0.3em;
  text-align: center;
  font-style: italic;
  color: gray;
}

.b59LdZ-dlg__body {
  border-bottom: 1px solid lightgray;
  margin: 0 -1em 1em;
  padding: 0 1em;
}
`
	document.body.appendChild(node)
    } else {
	document.body.removeChild($('.injected'))
    }
}
