<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Publicação do catálogo

Uma alteração da main ou um disparo manual inicia o build do catálogo.

```mermaid
flowchart TD
 A[Main ou execução manual] --> B[Instala dependências]
 B --> C[Gera tokens e Storybook]
 C --> D[Envia artefato]
 D --> E[Publica Pages]
```

Falhas de dependência, histórias ou permissão de Pages impedem a publicação. O catálogo exibe componentes e não substitui a integração na aplicação.
