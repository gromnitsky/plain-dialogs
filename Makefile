out := dist
pkg.name := $(shell json < package.json name)
mkdir = @mkdir -p $(dir $@)

$(out)/$(pkg.name).js: index.mjs
	$(mkdir)
	babel --plugins `npm -g root`/babel-plugin-transform-es2015-modules-umd --module-id $(pkg.name) $< -o $@

publish: $(out)/$(pkg.name).js
	npm publish
