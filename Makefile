PHONY: up shell test generate-json

up:
	docker compose up

shell:
	docker compose exec -it astro sh

test:
	docker compose exec -it astro yarn run test

generate-json:
	docker compose exec -it astro yarn run generate-json