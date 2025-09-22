.PHONY: dev-api dev-worker dev-studio lint test format

dev-api:
	uvicorn services.api.app.main:app --reload

dev-worker:
	python services/worker/src/protoweaver_worker/worker.py

dev-studio:
	pnpm -C apps/studio dev

lint:
	pnpm -r lint

format:
	pnpm -r format

test:
	pnpm -r test && pytest services/api
