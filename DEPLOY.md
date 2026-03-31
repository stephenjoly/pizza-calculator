# Deployment

This repo uses `deploy-wizard` to manage staging deployment. Generated files should be updated by rerunning `deploy-wizard` or `deploy-wizard render`, not edited by hand unless explicitly noted.

## Architecture

- Staging deploy target: `stephen@10.87.111.253`
- Remote compose file: `/home/stephen/docker/compose/pizza-calculator.yml`
- Remote env file: `/home/stephen/docker/appdata/pizza-calculator/staging.env`
- Proxy provider: `trm-api`
- TRM base URL: `https://trm.stephenjoly.net/`
- TRM is the source of truth for route state.

## Generated Files

- `.deploy-wizard/staging.overlay.yml`
- `.deploy-wizard/generated/staging.compose.template.yml`
- `.deploy-wizard/generated/proxy/pizza-calculator.trm-rule.json`
- `.github/workflows/deploy-staging.yml`
- `DEPLOY.md`
- `.deploy-wizard/staging.env.example`

## Managed Images

- `ghcr.io/stephenjoly/pizza-calculator/pizza-calculator:__DEPLOY_WIZARD_IMAGE_TAG__`

## Proxy Routes

- `pizza-calculator`: pizza-calculator.stephenjoly.net -> 10.87.111.253:80

## GitHub Workflow

- `.github/workflows/deploy-staging.yml` builds and pushes managed images to GHCR.
- `deploy-wizard` is the primary end-to-end flow and can build images locally on the first run if CI is not ready yet.
- `deploy-wizard apply` is the advanced non-interactive deploy path.
- Commit and push the generated workflow before using `deploy-wizard apply` without `--image-tag`.

## Agent Rules

- Treat `deploy-wizard.yml` as the source of truth.
- Do not commit `.deploy-wizard/staging.env.local`.
- Keep Traefik labels out of app compose files; routing is managed by the configured proxy provider.
- If compose source files or managed services change, rerun `deploy-wizard` or `deploy-wizard render` before editing the workflow manually.
