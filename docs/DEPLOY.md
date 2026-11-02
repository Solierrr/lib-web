<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Publicação

O workflow [npm-publisher](https://github.com/Solierrr/lib-web/blob/main/.github/workflows/npm-publisher.yml) roda a cada push na main, consulta a versão do manifesto e só publica quando ela ainda não existe no registro. Antes da publicação ele executa o lint, o typecheck, o build e a conferência do pacote, e a publicação usa o `NPM_TOKEN` com provenance.

O processo comum está em [PACKAGE_RELEASE.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PACKAGE_RELEASE.md), com a versão mantida pelo release-please e o pacote publicado como público no registro npm.

O workflow Storybook publica `storybook-static` no Pages e registra a URL de saída no ambiente STORYBOOK.
