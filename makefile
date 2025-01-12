run:
	pnpm cross-env NODE_ENV=production dist/index.js
dev:
	clear && pnpm cross-env NODE_ENV=development tsnd --respawn src/index.ts $(port)
test:
	pnpm jest