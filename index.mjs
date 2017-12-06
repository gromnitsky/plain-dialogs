/* globals dialogPolyfill */

export function alert(msg, opt) {
    let d = Dialog(opt)
    d.node.innerHTML = d.html(`
<div class='${d.css("body")}'><p>${d.opt.escape ? escape(msg) : msg}</p></div>
<div class='${d.css("footer")}'><button>OK</button></div>`)

    return new Promise( (resolve, _) => {
	let btn = d.node.querySelector('button')
	btn.onclick = () => d.node.close()
	d.node.onclose = evt => {
	    document.body.removeChild(evt.target)
	    resolve(true)
	}

	d.show()
	btn.focus()
    })
}

function _confirm(msg, opt) {
    let d = Dialog(opt)
    d.node.innerHTML = d.html(`
<div class='${d.css("body")}'><p>${d.opt.escape ? escape(msg) : msg}</p></div>
<div class='${d.css("footer")}'>
  <button class='${d.css("btn--cancel")}'>Cancel</button>
  <button class='${d.css("btn--ok")}'>OK</button>
</div>`)

    return new Promise( (resolve, reject) => {
	let btn_cancel = d.node.querySelector('.'+d.css("btn--cancel"))
	btn_cancel.onclick = () => d.node.close()
	d.node.querySelector('.'+d.css("btn--ok"))
	    .onclick = () => d.node.close('ok')
	d.node.onclose = (evt) => {
	    document.body.removeChild(evt.target)
	    if (d.opt._promise_always_resolves) {
		resolve(evt.target.returnValue === 'ok')
	    } else {
		evt.target.returnValue === 'ok' ? resolve(true) : reject(false)
	    }
	}

	btn_cancel.focus()
	d.show()
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

function _prompt(msg, def, opt) {
    let d = Dialog(opt)
    d.node.innerHTML = d.html(`
<div class='${d.css("body")}'><p>
${d.opt.escape ? escape(msg) : msg}<br>
<input style='width: 100%; margin-top: 0.3em;' value='${escape_html(def)}'>
</p></div>
<div class='${d.css("footer")}'>
  <button class='${d.css("btn--cancel")}'>Cancel</button>
  <button class='${d.css("btn--ok")}'>OK</button>
</div>`)

    let val
    return new Promise( (resolve, reject) => {
	d.node.querySelector('.'+d.css("btn--cancel")).onclick = () => {
	    val = null // because dialog#returnValue is always a string
	    d.node.close()
	}
	d.node.oncancel = () => val = null // modal-only
	d.node.querySelector('.'+d.css("btn--ok")).onclick = () => {
	    val = d.node.querySelector('input').value
	    d.node.close()
	}
	d.node.onclose = evt => {
	    document.body.removeChild(evt.target)
	    if (d.opt._promise_always_resolves) {
		resolve(val)
	    } else {
		val === null ? reject(null) : resolve(val)
	    }
	}

	d.show()
    })
}

export function prompt(msg, def, opt) {
    return _prompt(msg, def, opt)
}

export function prompt2(msg, def, opt) {
    opt = opt || {}
    opt._promise_always_resolves = true
    return _prompt(msg, def, opt)
}

// Crockford-style 'say no to this'
function Dialog(opt) {
    let opt_parse = opt => {
	let def = {
	    escape: true,
	    modal: true,
	}
	if (typeof opt === 'object') return Object.assign(def, opt)
	return def
    }

    let css = t => 'b59LdZ-dlg' + (t ? `__${t}` : '')

    opt = opt_parse(opt)
    let node = document.createElement('dialog')
    node.className = css()
    if (typeof dialogPolyfill !== 'undefined')
	dialogPolyfill.registerDialog(node)

    return {
	opt,
	node,
	css,
	html: t => {
	    let head = opt.title ? `<div class='${css("header")}'>${escape(opt.title)}</div>` : ''
	    return head + t
	},
	show: () => {
	    document.body.appendChild(node)
	    node[opt.modal ? 'showModal' : 'show']()
	}
    }
}

function escape_html(t) {
    return String(t === null || t === undefined ? '' : t)
	.replace(/[&<>"'`]/g, char => ({
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#x60;',
	}[char]))
}

function escape(t) { return escape_html(t).replace(/\n/g, '<br>') }
