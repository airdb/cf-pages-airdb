SERVICE := noah

all: help

help: ## Show help messages
	@echo "Container - ${SERVICE} "
	@echo
	@echo "Usage:\tmake COMMAND"
	@echo
	@echo "Commands:"
	@sed -n '/##/s/\(.*\):.*##/  \1#/p' ${MAKEFILE_LIST} | grep -v "MAKEFILE_LIST" | column -t -c 2 -s '#'

.PHONY: dev
dev: ## Run cf pages airdb
	pnpm dev

.PHONY: test
test: ## Testing
	curl http://localhost:8787/message
