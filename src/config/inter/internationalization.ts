import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Init local só para desenvolvimento/Storybook/testes deste pacote — a
// aplicação consumidora é dona das traduções reais; aqui só cobrimos as
// chaves usadas pelos componentes migrados, pra eles renderizarem sem erro
// fora do web-app.
i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": {
      commons: {
        select: {
          placeholder: "Selecione...",
          clearSelection: "Limpar seleção",
        },
        yes: "Sim",
        no: "Não",
        corridor: {
          viewAll: "Ver todos",
        },
      },
      profile: {
        avatarAlt: "Foto de perfil",
      },
      branding: {},
    },
  },
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
