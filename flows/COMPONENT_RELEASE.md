<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Publicação de versão

A mudança de componente chega ao consumidor por uma versão do pacote.

```mermaid
flowchart TD
 A[Revisa componente e tipos] --> B[Testes e build]
 B --> C[Main com versão atualizada]
 C --> D{Versão já publicada?}
 D -->|sim| E[Encerra sem publicar]
 D -->|não| F[Valida pacote e publica npm]
 F --> G[Consumidor atualiza dependência]
```

Falha de consulta ao registro, validação ou credencial impede publicar. O fluxo comum está em [PACKAGE_RELEASE.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PACKAGE_RELEASE.md).
