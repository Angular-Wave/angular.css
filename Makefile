.PHONY: build check doc lint prepare-release pretty serve setup test test-components test-docs test-ui types version

setup:
	@rm -r ./node_modules/
	@npm i
	@npx playwright install

BUILD_DIR = ./dist		
build: version
	@if [ -d "$(BUILD_DIR)" ]; then \
		echo "Removing $(BUILD_DIR)..."; \
		rm -r "$(BUILD_DIR)"; \
	fi
	@npm run build

version:
	@node utils/version.cjs	

pretty:
	@npx prettier ./src --write --cache --log-level=silent
	
lint:
	@npx eslint ./src --fix

check:
	@echo "Typechecking Js"
	@npm run check

types:
	@rm -rf @types
	@echo "Generating *.d.ts"
	@npx -p typescript tsc --project tsconfig.types.json
	$(MAKE) pretty


TYPEDOC_DIR = docs/static/typedoc
doc: 
	@rm -rf $(TYPEDOC_DIR)
	@npm run generate-docs
	@npx prettier ./typedoc --write
	mv typedoc $(TYPEDOC_DIR)

serve:
	@npm run serve

prepare-release: check test-docs test types doc pretty build

PLAYWRIGHT_TEST := npx playwright test

test:
	@echo $(INFO) "Playwright test JS"
	@npm run test

test-components:
	@echo $(INFO) "Playwright component and element tests"
	@npm run test:components

test-docs:
	@echo $(INFO) "Playwright docs iframe tests"
	@npm run test:docs

test-ui:
	@echo $(INFO) "Playwright test JS with ui"
	@$(PLAYWRIGHT_TEST) --ui

hugo:
	@if [ ! -d "docs/node_modules" ]; then \
		npm --prefix docs install; \
	fi
	npm --prefix docs run _hugo-dev -- serve --disableFastRender --renderToMemory
