<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Componentes de e-mail

A entrada `/email` funciona com React e React Email e evita a raiz de navegador. `EmailLayout` recebe idioma, título, rodapé e filhos. `EmailAction` recebe endereço, rótulo e texto alternativo de acesso ao link.

Os tokens são convertidos em estilos apropriados pelo componente Tailwind do React Email. O build gera PNGs do branding e das laterais do layout. O código atual inclui referência de fonte externa no cabeçalho, contrariando a descrição antiga de ausência total de CSS externo. O comportamento varia por cliente de e-mail.

O transporte é responsabilidade do consumidor. Quando imagens forem renderizadas como data URLs, a configuração do transporte precisa incorporá-las no envio. A biblioteca não envia SMTP nem mantém destinatários.
