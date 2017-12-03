/* globals dialogPolyfill */

export function alert(msg, opt) {
    opt = opt_parse(opt)
    let node = dialog()
    node.innerHTML = html(`
<div class='${css("body")}'><p>${opt.escape ? escape(msg) : msg}</p></div>
<div class='${css("footer")}'><button>OK</button></div>`, opt)

    return new Promise( (resolve, _) => {
	node.querySelector('button').onclick = () => node.close()
	node.onclose = evt => {
	    document.body.removeChild(evt.target)
	    resolve(true)
	}

	show(node, opt)
	node.querySelector('button').focus()
    })
}

function _confirm(msg, opt) {
    opt = opt_parse(opt)
    let node = dialog()
    node.innerHTML = html(`
<div class='${css("body")}'><p>${opt.escape ? escape(msg) : msg}</p></div>
<div class='${css("footer")}'>
  <button class='${css("btn--cancel")}'>Cancel</button>
  <button class='${css("btn--ok")}'>OK</button>
</div>`, opt)

    return new Promise( (resolve, reject) => {
	let btn_cancel = node.querySelector('.'+css("btn--cancel"))
	btn_cancel.onclick = () => node.close()
	node.querySelector('.'+css("btn--ok")).onclick = () => node.close('ok')
	node.onclose = (evt) => {
	    document.body.removeChild(evt.target)
	    if (opt._promise_always_resolves) {
		resolve(evt.target.returnValue === 'ok')
	    } else {
		evt.target.returnValue === 'ok' ? resolve(true) : reject(false)
	    }
	}

	btn_cancel.focus()
	show(node, opt)
    })
}

export function confirm(msg, opt) {
    return _confirm(msg, opt)
}

export function confirm2(msg, opt) {
    opt = opt || {}
    opt._promise_always_resolves = true
    return _confirm(msg, opt)
}

function opt_parse(opt) {
    let def = {
	escape: true,
	modal: true,
    }
    if (typeof opt === 'object') return Object.assign(def, opt)
    return def
}

function escape(t) {
    return String(t).replace(/[&<>"'`]/g, char => ({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'`': '&#x60;',
    }[char])).replace(/\n/g, '<br>')
}

function css(t) { return 'b59LdZ-dlg' + (t ? `__${t}` : '') }

function dialog() {
    let node = document.createElement('dialog')
    node.className = css()
    if (typeof dialogPolyfill !== 'undefined')
	dialogPolyfill.registerDialog(node)
    return node
}

function html(t, opt) {
    let head = opt.title ? `<div class='${css("header")}'>${escape(opt.title)}</div>` : ''
    return head + t
}

function show(node, opt) {
    document.body.appendChild(node)
    node[opt.modal ? 'showModal' : 'show']()
}
