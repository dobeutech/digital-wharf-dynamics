import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Supported languages
export type Language = "en" | "es" | "fr";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Language names for display
export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "nav.brand": "Brand Kit",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",

    // Hero Section
    "hero.badge": "Premium Digital Solutions",
    "hero.headline1": "Transform Your",
    "hero.headline2": "Digital Vision",
    "hero.subtitle":
      "We craft stunning websites and powerful software that help ambitious businesses grow faster and stand out.",
    "hero.cta.primary": "Start Your Project",
    "hero.cta.secondary": "Explore Services",
    "hero.available": "Available for new projects",
    "hero.projects": "Projects delivered",
    "hero.satisfaction": "Technology offerings",

    // Services
    "services.badge": "Our Services",
    "services.title": "What We Deliver",
    "services.subtitle":
      "End-to-end digital solutions tailored to your unique business needs",
    "services.viewAll": "View All Services",
    "services.webDev": "Web Development",
    "services.webDev.desc":
      "Custom websites and web applications built with modern frameworks and best practices",
    "services.software": "Software Solutions",
    "services.software.desc":
      "Scalable software systems designed to streamline your business operations",
    "services.cloud": "Cloud Integration",
    "services.cloud.desc":
      "Seamless cloud infrastructure setup and deployment for maximum reliability",
    "services.consulting": "Consulting",
    "services.consulting.desc":
      "Strategic technology guidance to help you make informed decisions",
    "services.growth": "Growth & Optimization",
    "services.growth.desc":
      "Data-driven strategies to maximize your digital presence and ROI",
    "services.training": "Training & Support",
    "services.training.desc":
      "Comprehensive training programs and ongoing technical support",

    // Mission/Values
    "mission.badge": "Our Values",
    "mission.title": "What Drives Us",
    "mission.subtitle":
      "Building exceptional digital experiences with integrity and innovation",
    "mission.innovation": "Innovation",
    "mission.innovation.desc": "Pushing boundaries with cutting-edge solutions",
    "mission.quality": "Quality",
    "mission.quality.desc": "Delivering excellence in every project",
    "mission.partnership": "Partnership",
    "mission.partnership.desc": "Building lasting relationships with clients",
    "mission.transparency": "Transparency",
    "mission.transparency.desc": "Clear communication and honest practices",

    // Footer
    "footer.cta.title": "Ready to get started?",
    "footer.cta.subtitle":
      "Let's build something incredible together. Start a conversation today.",
    "footer.cta.primary": "Start a Project",
    "footer.cta.secondary": "View Pricing",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.connect": "Connect",
    "footer.legal": "Legal",
    "footer.copyright": "All rights reserved.",
    "footer.status": "All systems operational",

    // Contact Form
    "contact.title": "Get In Touch",
    "contact.subtitle":
      "Have a project in mind? Let's discuss how we can help.",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.company": "Company Name",
    "contact.message": "Your Message",
    "contact.submit": "Send Message",
    "contact.success": "Message sent successfully!",
    "contact.error": "Failed to send message. Please try again.",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.learnMore": "Learn More",

    // Accessibility
    "a11y.settings": "Accessibility Settings",
    "a11y.reduceMotion": "Reduce Motion",
    "a11y.highContrast": "High Contrast",
    "a11y.largeText": "Large Text",
    "a11y.textSize": "Text Size",
    "a11y.focusIndicators": "Enhanced Focus Indicators",
    "a11y.screenReader": "Screen Reader Optimization",

    // Theme
    "theme.toggle": "Toggle theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Language
    "language.select": "Select Language",
    "language.en": "English",
    "language.es": "Spanish",
    "language.fr": "French",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.pricing": "Precios",
    "nav.contact": "Contacto",
    "nav.brand": "Kit de Marca",
    "nav.dashboard": "Panel",
    "nav.admin": "Admin",
    "nav.signIn": "Iniciar Sesión",
    "nav.signOut": "Cerrar Sesión",

    // Hero Section
    "hero.badge": "Soluciones Digitales Premium",
    "hero.headline1": "Transforma Tu",
    "hero.headline2": "Visión Digital",
    "hero.subtitle":
      "Creamos sitios web impresionantes y software potente que ayudan a las empresas ambiciosas a crecer más rápido y destacar.",
    "hero.cta.primary": "Inicia Tu Proyecto",
    "hero.cta.secondary": "Explorar Servicios",
    "hero.available": "Disponible para nuevos proyectos",
    "hero.projects": "Proyectos entregados",
    "hero.satisfaction": "Satisfacción del cliente",

    // Services
    "services.badge": "Nuestros Servicios",
    "services.title": "Lo Que Ofrecemos",
    "services.subtitle":
      "Soluciones digitales integrales adaptadas a tus necesidades empresariales únicas",
    "services.viewAll": "Ver Todos los Servicios",
    "services.webDev": "Desarrollo Web",
    "services.webDev.desc":
      "Sitios web y aplicaciones personalizadas construidas con frameworks modernos y mejores prácticas",
    "services.software": "Soluciones de Software",
    "services.software.desc":
      "Sistemas de software escalables diseñados para optimizar las operaciones de tu negocio",
    "services.cloud": "Integración en la Nube",
    "services.cloud.desc":
      "Configuración e implementación de infraestructura en la nube sin problemas para máxima fiabilidad",
    "services.consulting": "Consultoría",
    "services.consulting.desc":
      "Orientación tecnológica estratégica para ayudarte a tomar decisiones informadas",
    "services.growth": "Crecimiento y Optimización",
    "services.growth.desc":
      "Estrategias basadas en datos para maximizar tu presencia digital y ROI",
    "services.training": "Capacitación y Soporte",
    "services.training.desc":
      "Programas de capacitación integral y soporte técnico continuo",

    // Mission/Values
    "mission.badge": "Nuestros Valores",
    "mission.title": "Lo Que Nos Impulsa",
    "mission.subtitle":
      "Construyendo experiencias digitales excepcionales con integridad e innovación",
    "mission.innovation": "Innovación",
    "mission.innovation.desc": "Empujando límites con soluciones de vanguardia",
    "mission.quality": "Calidad",
    "mission.quality.desc": "Entregando excelencia en cada proyecto",
    "mission.partnership": "Asociación",
    "mission.partnership.desc":
      "Construyendo relaciones duraderas con clientes",
    "mission.transparency": "Transparencia",
    "mission.transparency.desc": "Comunicación clara y prácticas honestas",

    // Footer
    "footer.cta.title": "¿Listo para comenzar?",
    "footer.cta.subtitle":
      "Construyamos algo increíble juntos. Inicia una conversación hoy.",
    "footer.cta.primary": "Iniciar un Proyecto",
    "footer.cta.secondary": "Ver Precios",
    "footer.services": "Servicios",
    "footer.company": "Empresa",
    "footer.connect": "Conectar",
    "footer.legal": "Legal",
    "footer.copyright": "Todos los derechos reservados.",
    "footer.status": "Todos los sistemas operativos",

    // Contact Form
    "contact.title": "Contáctanos",
    "contact.subtitle":
      "¿Tienes un proyecto en mente? Hablemos de cómo podemos ayudar.",
    "contact.name": "Nombre Completo",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.company": "Nombre de la Empresa",
    "contact.message": "Tu Mensaje",
    "contact.submit": "Enviar Mensaje",
    "contact.success": "¡Mensaje enviado exitosamente!",
    "contact.error":
      "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.retry": "Reintentar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.submit": "Enviar",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.learnMore": "Más Información",

    // Accessibility
    "a11y.settings": "Configuración de Accesibilidad",
    "a11y.reduceMotion": "Reducir Movimiento",
    "a11y.highContrast": "Alto Contraste",
    "a11y.largeText": "Texto Grande",
    "a11y.textSize": "Tamaño del Texto",
    "a11y.focusIndicators": "Indicadores de Enfoque Mejorados",
    "a11y.screenReader": "Optimización para Lector de Pantalla",

    // Theme
    "theme.toggle": "Cambiar tema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Sistema",

    // Language
    "language.select": "Seleccionar Idioma",
    "language.en": "Inglés",
    "language.es": "Español",
    "language.fr": "Francés",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.services": "Services",
    "nav.pricing": "Tarifs",
    "nav.contact": "Contact",
    "nav.brand": "Kit de Marque",
    "nav.dashboard": "Tableau de Bord",
    "nav.admin": "Admin",
    "nav.signIn": "Connexion",
    "nav.signOut": "Déconnexion",

    // Hero Section
    "hero.badge": "Solutions Numériques Premium",
    "hero.headline1": "Transformez Votre",
    "hero.headline2": "Vision Numérique",
    "hero.subtitle":
      "Nous créons des sites web époustouflants et des logiciels puissants qui aident les entreprises ambitieuses à croître plus vite et à se démarquer.",
    "hero.cta.primary": "Démarrez Votre Projet",
    "hero.cta.secondary": "Explorer les Services",
    "hero.available": "Disponible pour de nouveaux projets",
    "hero.projects": "Projets livrés",
    "hero.satisfaction": "Satisfaction client",

    // Services
    "services.badge": "Nos Services",
    "services.title": "Ce Que Nous Offrons",
    "services.subtitle":
      "Des solutions numériques complètes adaptées à vos besoins commerciaux uniques",
    "services.viewAll": "Voir Tous les Services",
    "services.webDev": "Développement Web",
    "services.webDev.desc":
      "Sites web et applications personnalisés construits avec des frameworks modernes et les meilleures pratiques",
    "services.software": "Solutions Logicielles",
    "services.software.desc":
      "Systèmes logiciels évolutifs conçus pour rationaliser vos opérations commerciales",
    "services.cloud": "Intégration Cloud",
    "services.cloud.desc":
      "Configuration et déploiement d'infrastructure cloud transparents pour une fiabilité maximale",
    "services.consulting": "Conseil",
    "services.consulting.desc":
      "Conseils technologiques stratégiques pour vous aider à prendre des décisions éclairées",
    "services.growth": "Croissance et Optimisation",
    "services.growth.desc":
      "Stratégies basées sur les données pour maximiser votre présence numérique et votre ROI",
    "services.training": "Formation et Support",
    "services.training.desc":
      "Programmes de formation complets et support technique continu",

    // Mission/Values
    "mission.badge": "Nos Valeurs",
    "mission.title": "Ce Qui Nous Motive",
    "mission.subtitle":
      "Créer des expériences numériques exceptionnelles avec intégrité et innovation",
    "mission.innovation": "Innovation",
    "mission.innovation.desc":
      "Repousser les limites avec des solutions de pointe",
    "mission.quality": "Qualité",
    "mission.quality.desc": "Livrer l'excellence dans chaque projet",
    "mission.partnership": "Partenariat",
    "mission.partnership.desc":
      "Construire des relations durables avec les clients",
    "mission.transparency": "Transparence",
    "mission.transparency.desc": "Communication claire et pratiques honnêtes",

    // Footer
    "footer.cta.title": "Prêt à commencer?",
    "footer.cta.subtitle":
      "Construisons quelque chose d'incroyable ensemble. Démarrez une conversation aujourd'hui.",
    "footer.cta.primary": "Démarrer un Projet",
    "footer.cta.secondary": "Voir les Tarifs",
    "footer.services": "Services",
    "footer.company": "Entreprise",
    "footer.connect": "Connecter",
    "footer.legal": "Mentions Légales",
    "footer.copyright": "Tous droits réservés.",
    "footer.status": "Tous les systèmes opérationnels",

    // Contact Form
    "contact.title": "Contactez-Nous",
    "contact.subtitle":
      "Vous avez un projet en tête? Discutons de la façon dont nous pouvons vous aider.",
    "contact.name": "Nom Complet",
    "contact.email": "Adresse E-mail",
    "contact.phone": "Numéro de Téléphone",
    "contact.company": "Nom de l'Entreprise",
    "contact.message": "Votre Message",
    "contact.submit": "Envoyer le Message",
    "contact.success": "Message envoyé avec succès!",
    "contact.error": "Échec de l'envoi du message. Veuillez réessayer.",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.retry": "Réessayer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.submit": "Soumettre",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.learnMore": "En Savoir Plus",

    // Accessibility
    "a11y.settings": "Paramètres d'Accessibilité",
    "a11y.reduceMotion": "Réduire le Mouvement",
    "a11y.highContrast": "Contraste Élevé",
    "a11y.largeText": "Grand Texte",
    "a11y.textSize": "Taille du Texte",
    "a11y.focusIndicators": "Indicateurs de Focus Améliorés",
    "a11y.screenReader": "Optimisation Lecteur d'Écran",

    // Theme
    "theme.toggle": "Changer le thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",

    // Language
    "language.select": "Sélectionner la Langue",
    "language.en": "Anglais",
    "language.es": "Espagnol",
    "language.fr": "Français",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("dobeu-language") as Language;
    const urlParams = new URLSearchParams(window.location.search);
    const urlLanguage = urlParams.get("lang") as Language;

    if (urlLanguage && ["en", "es", "fr"].includes(urlLanguage)) {
      setLanguageState(urlLanguage);
      localStorage.setItem("dobeu-language", urlLanguage);
    } else if (savedLanguage && ["en", "es", "fr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      if (["en", "es", "fr"].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }

    setIsLoading(false);
  }, []);

  // Update document lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("dobeu-language", lang);

    // Update URL without reload
    const url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Translation function with parameter interpolation
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = translations[language][key] || translations.en[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(
            new RegExp(`{{${paramKey}}}`, "g"),
            String(value),
          );
        });
      }

      return text;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Utility hook for translation only
export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}
