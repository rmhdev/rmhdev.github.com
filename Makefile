.PHONY:
help:
	@echo "rmhdev.github.com: please use \`make <target>\` where <target> is one of:"
	@echo "  serve           launch jekyll"
	@echo "  watch-sass      watch for sass changes"
	@echo "  compile-sass    compile and compress sass styles"

.PHONY:
serve:
	bundle exec jekyll serve

.PHONY:
watch-sass:
	npm run sass

.PHONY:
compile-sass:
	npm run sass-prod
