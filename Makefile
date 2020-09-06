out := dist
pkg.name := $(shell json < package.json name)
mkdir = @mkdir -p $(dir $@)

$(out)/$(pkg.name).js: index.mjs
	$(mkdir)
	node_modules/.bin/babel $< -o $@ --plugins=@babel/plugin-transform-modules-umd --module-id $(pkg.name) --source-maps --minified

publish: $(out)/$(pkg.name).js
	npm publish

upload: node_modules
	rsync -avPL --delete -e ssh test/ gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/examples/plain-dialogs/
