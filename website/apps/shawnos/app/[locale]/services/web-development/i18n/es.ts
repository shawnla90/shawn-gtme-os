import type { WebDevTranslations } from './types'

export const es: WebDevTranslations = {
  locale: 'es',
  dir: 'ltr',

  hero: {
    eyebrow: 'DESARROLLO WEB PARA NEGOCIOS DE SERVICIOS',
    headlineLine1: 'Su Sitio Web Se Ve Bien.',
    headlineLine2: 'Le Esta Costando Dinero.',
    subheadline: 'Podemos demostrarlo.',
    description:
      'La mayoria de los sitios web de negocios de servicios cargan demasiado lento, no aparecen en Google y no rastrean nada. Nosotros construimos sitios que cargan en menos de 1 segundo, aparecen en Google y le dicen exactamente de donde vino su proximo cliente.',
    ctaPrimary: 'Ver Precios',
    ctaSecondary: 'Solicite una Auditoria Gratis',
    textUs: 'o envie un mensaje al',
    scroll: 'desplazar',
  },

  transformationFlow: {
    steps: [
      { label: 'WordPress Lento', detail: '4.2s de carga' },
      { label: 'Auditoria de Rendimiento', detail: 'Revision de velocidad y rendimiento' },
      { label: 'Reconstruccion en Next.js', detail: 'Hosting rapido y seguro' },
      { label: 'Aprobado por Google', detail: '95+ PageSpeed' },
      { label: 'Canal de Clientes', detail: '+40% Conversiones' },
    ],
  },

  problem: {
    headline: 'Su Sitio Web Le Esta Costando Clientes',
    sub: 'La mayoria de los sitios web de negocios son peso muerto. Lentos, desactualizados e invisibles para Google.',
    stats: [
      { stat: '4-6s', label: 'Tiempo de carga promedio de WordPress en movil' },
      { stat: '7%', label: 'Conversiones perdidas por cada segundo de carga' },
      { stat: '53%', label: 'De los usuarios moviles abandonan si el sitio tarda mas de 3 segundos' },
      { stat: '0', label: 'Analiticas en la mayoria de sitios de pequenos negocios' },
    ],
    footnote:
      'La actualizacion principal de Google de febrero 2026 elevo el estandar de rendimiento. Sus competidores que ya se actualizaron estan captando a sus clientes.',
  },

  interlude: {
    title: 'Todavia Usa WordPress?',
    subtitle: 'La mayoria de los negocios no saben que su sitio les esta perdiendo clientes.',
  },

  performance: {
    headline: 'WordPress vs Next.js',
    sub: 'Rendimiento real medido. No son promesas de marketing - son resultados medibles que afectan su posicion en Google.',
    vitals: [
      {
        metric: 'Velocidad de Carga',
        techName: 'LCP (Largest Contentful Paint)',
        wordpress: 4.2,
        nextjs: 1.1,
        unit: 's',
        threshold: 2.5,
        lower: true,
        whatItIs: 'Que tan rapido carga su pagina. Google penaliza todo lo que supere los 2.5 segundos.',
        whatItMeans: 'WordPress hace esperar a sus clientes mas de 4 segundos. El nuestro carga en aproximadamente 1 segundo.',
      },
      {
        metric: 'Tiempo de Respuesta de Botones',
        techName: 'INP (Interaction to Next Paint)',
        wordpress: 380,
        nextjs: 85,
        unit: 'ms',
        threshold: 200,
        lower: true,
        whatItIs: 'Que tan rapido responden los botones al tocarlos. Google penaliza todo lo que supere los 200ms.',
        whatItMeans:
          'En WordPress, tocar "Llamar Ahora" parece que no paso nada. El nuestro responde al instante.',
      },
      {
        metric: 'Estabilidad del Diseno',
        techName: 'CLS (Cumulative Layout Shift)',
        wordpress: 0.25,
        nextjs: 0.02,
        unit: '',
        threshold: 0.1,
        lower: true,
        whatItIs: 'La pagina se mueve mientras carga? Google penaliza puntajes superiores a 0.1.',
        whatItMeans: 'WordPress mueve el contenido mientras los plugins cargan. El nuestro mantiene todo en su lugar.',
      },
    ],
    gaugeGood: 'BUENO',
    gaugeNeedsWork: 'NECESITA MEJORA',
    gaugeMeetsStandard: 'Cumple con el estandar de Google',
    gaugeMayLower: 'Google puede bajar su posicion',
  },

  deliverables: {
    headline: 'Lo Que Recibe',
    sub: 'Cada sitio que construimos incluye estos elementos fundamentales. Sin cargos adicionales. Sin sorpresas.',
    items: [
      {
        title: 'Diseno Personalizado',
        desc: 'Sin plantillas. Disenado para su negocio, su marca y sus clientes.',
      },
      {
        title: 'Rendimiento Primero',
        desc: 'Tiempos de carga menores a 1 segundo. Cada pagina optimizada para velocidad y posicionamiento en buscadores.',
      },
      {
        title: 'SEO Integrado',
        desc: 'Datos estructurados, meta tags, sitemaps, Google Business Profile - desde el primer dia.',
      },
      {
        title: 'Captura de Clientes',
        desc: 'Formularios, sistemas de reservas, chatbots. Convierta visitantes en clientes automaticamente.',
      },
      {
        title: 'Panel de Analiticas',
        desc: 'Sepa exactamente que esta funcionando. Trafico, conversiones, rendimiento de paginas - todo registrado.',
      },
      {
        title: 'Soporte Continuo',
        desc: 'No construimos y desaparecemos. Cada paquete incluye soporte post-lanzamiento.',
      },
    ],
  },

  howItWorks: {
    headline: 'Como Funciona',
    sub: 'Desde la primera llamada hasta el sitio en vivo en 1-4 semanas. Este es el proceso.',
    steps: [
      {
        title: 'Auditoria Gratis del Sitio',
        summary: 'Revisamos como esta funcionando realmente su sitio.',
        detail:
          'Analizamos su sitio web actual con Google PageSpeed Insights, verificamos sus puntajes de Core Web Vitals y revisamos su presencia en las busquedas de Google. Recibe un reporte claro que muestra exactamente donde esta su sitio - velocidad de carga, experiencia movil, vacios de SEO y cuanto le esta costando en clientes perdidos.',
        timeline: '~24 horas',
      },
      {
        title: 'Llamada de Estrategia',
        summary: 'Determinamos que necesita hacer su sitio web.',
        detail:
          'Una conversacion de 30 minutos sobre su negocio, sus clientes y sus objetivos. Hablamos de que servicios ofrece, que areas atiende y como lo encuentran los clientes hoy. Sin tecnicismos. Al final, tiene un plan claro de como se vera su nuevo sitio y que hara por usted.',
        timeline: 'Llamada de 30 min',
      },
      {
        title: 'Diseno y Construccion',
        summary: 'Construimos con su retroalimentacion en cada paso.',
        detail:
          'Disenamos y construimos su sitio desde cero - sin plantillas. Ve el progreso durante el proceso y da su opinion antes de que nada salga en vivo. Nosotros nos encargamos de lo tecnico (hosting, optimizacion de velocidad, configuracion de SEO) mientras usted se enfoca en que se vea bien y diga lo que necesita.',
        timeline: '1-3 semanas',
      },
      {
        title: 'Lanzamiento y Verificacion',
        summary: 'Su sitio sale en vivo y demostramos que funciona.',
        detail:
          'Su nuevo sitio sale en vivo sin tiempo de inactividad. Verificamos que cada pagina cargue rapido, lo analizamos con Google PageSpeed para confirmar los puntajes, configuramos su panel de analiticas y nos aseguramos de que su Google Business Profile este conectado. Ve los numeros de rendimiento desde el primer dia.',
        timeline: 'Dia de lanzamiento',
      },
      {
        title: 'Soporte y Optimizacion',
        summary: 'Seguimos mejorandolo despues del lanzamiento.',
        detail:
          'Cada paquete incluye soporte post-lanzamiento. Monitoreamos la velocidad de su sitio, rastreamos cuales paginas generan mas clientes potenciales y hacemos ajustes para mejorar los resultados. Recibe actualizaciones regulares sobre el rendimiento de su sitio. Cuando su periodo de soporte termina, su sitio sigue funcionando - puede actualizar al plan Administrado o manejarlo usted mismo.',
        timeline: 'Continuo',
      },
    ],
  },

  pricing: {
    headline: 'Precios',
    sub: 'Precios transparentes. Sin sorpresas. Cada paquete incluye despliegue, hosting y soporte.',
    tiers: [
      {
        name: 'Foundation',
        price: '$3,500',
        tag: 'Para Empezar',
        timeline: '1-2 semanas',
        supportPeriod: '1 mes',
        features: [
          'Sitio web personalizado de 5-7 paginas',
          'Diseno responsivo optimizado para movil',
          'Paginas de area de servicio',
          'Formularios de captura de clientes',
          'Configuracion de Google Business Profile',
          'Seccion de resenas',
          'SEO basico + sitemap',
        ],
      },
      {
        name: 'Growth',
        price: '$5,500',
        tag: 'Mas Popular',
        recommended: true,
        timeline: '2-3 semanas',
        supportPeriod: '3 meses',
        features: [
          'Todo lo incluido en Foundation',
          '8-12 paginas',
          'Ingles + Espanol (bilingue)',
          'Integracion de chatbot con IA',
          'Sistema de reservas',
          'Estrategia de contenido (3 articulos de blog)',
          'Panel de analiticas',
        ],
      },
      {
        name: 'Dominance',
        price: '$8,500',
        tag: 'Paquete Completo',
        timeline: '3-4 semanas',
        supportPeriod: '6 meses',
        features: [
          'Todo lo incluido en Growth',
          '12-20 paginas',
          'Soporte para 3+ idiomas',
          'Auditoria SEO completa + schema markup',
          'Panel de analiticas + reportes mensuales',
          'Consultoria de Google Ads',
          'Reporte de analisis de competencia',
        ],
      },
      {
        name: 'Full Stack Dominance',
        price: 'Agende una Llamada',
        tag: 'Solo por Invitacion',
        inviteOnly: true,
        features: [
          'Todo lo incluido en Dominance',
          'Gestion completa de cuenta de Reddit + estrategia',
          'Configuracion y gestion de Reddit Ads',
          'Campana de construccion de karma',
          'Distribucion de contenido (Reddit, LinkedIn, X)',
          'Creacion de contenido semanal (blogs, posts de Reddit, redes sociales)',
          'Analiticas mensuales + atribucion de trafico',
          'Contenido optimizado para IA y motores de busqueda',
          'Estratega de contenido dedicado',
        ],
      },
    ],
    managed: {
      badge: 'Despues de cualquier paquete',
      name: 'Administrado',
      price: '$500-$1,000',
      priceUnit: '/mes',
      description:
        'Actualizaciones de contenido continuas, optimizacion SEO, reportes mensuales de analiticas, soporte prioritario y administracion de Google Ads. El mismo equipo que construyo su sitio sigue mejorandolo.',
      features: [
        'Actualizaciones de contenido continuas',
        'Optimizacion SEO',
        'Reportes mensuales de rendimiento',
        'Soporte prioritario',
        'Google Ads incluido',
      ],
      cta: 'Agende una Llamada',
    },
    supportNote: 'de soporte incluido.',
    getStarted: 'Empezar',
  },

  techStack: {
    headline: 'Esta Pagina Es la Prueba',
    sub: 'Esta viendo un sitio construido con las mismas herramientas que usamos para cada cliente.',
    tools: [
      { name: 'Next.js', why: 'El framework que hace que su sitio cargue en menos de 1 segundo.' },
      { name: 'Vercel', why: 'Entrega su sitio desde el servidor mas cercano a cada visitante.' },
      { name: 'Cloudflare', why: 'Protege su sitio de ataques y lo hace aun mas rapido.' },
      {
        name: 'PostHog',
        why: 'Le muestra exactamente de donde vienen los visitantes y que hacen.',
      },
      { name: 'GitHub', why: 'Cada cambio en su sitio queda registrado y es reversible.' },
    ],
    verifyLink: 'Verifiquelo usted mismo en PageSpeed Insights',
  },

  notRightFit: {
    title: 'Aviso: No Somos la Opcion Correcta Si Usted...',
    subtitle: 'Preferimos ser honestos desde el principio que hacerle perder el tiempo.',
    cards: [
      {
        title: '...Quiere un Sitio de Plantilla por $500',
        desc: 'Construimos sitios personalizados disenados para su negocio. Las plantillas existen por una razon, pero nuestros clientes necesitan mas.',
      },
      {
        title: '...Lo Necesita Para Manana',
        desc: 'Un buen sitio toma de 1 a 4 semanas. Los trabajos apresurados generan sitios malos que le cuestan clientes.',
      },
      {
        title: '...Quiere Quedarse en WordPress',
        desc: 'Nuestro enfoque esta basado en tecnologia mas rapida. WordPress no es parte de nuestro stack.',
      },
      {
        title: '...No Le Importa el Rendimiento',
        desc: 'La velocidad y el posicionamiento son nuestra base. Si eso no le importa, no somos la opcion correcta.',
      },
      {
        title: '...Quiere Editarlo Usted Mismo',
        desc: 'Nosotros manejamos las actualizaciones a traves de paquetes de soporte. Usted enfoquese en su negocio.',
      },
      {
        title: '...Solo Necesita un Logo',
        desc: 'Construimos sitios web completos, no identidades de marca. Podemos recomendarle socios de branding.',
      },
    ],
  },

  faq: {
    headline: 'Preguntas Frecuentes',
    items: [
      {
        q: 'Cuanto cuesta un sitio web para un negocio de servicios?',
        a: 'Nuestros paquetes empiezan en $3,500 por un sitio personalizado de 5-7 paginas con optimizacion movil, formularios de captura de clientes y SEO basico. La mayoria de los negocios de servicios eligen el paquete Growth a $5,500 que agrega sistema de reservas, soporte bilingue, analiticas y 3 meses de soporte. La inversion normalmente se paga sola en 1-2 meses con los nuevos clientes.',
      },
      {
        q: 'Por que no usar WordPress como todos los demas?',
        a: 'Los sitios de WordPress promedian 4-6 segundos de carga en movil. Los nuestros cargan en menos de 1 segundo. Despues de la actualizacion principal de Google de febrero 2026, la velocidad de carga impacta directamente su posicion en buscadores. Un sitio mas rapido significa mas visibilidad, mas clics y mas clientes. Nuestro enfoque tambien elimina vulnerabilidades de plugins, no requiere actualizaciones de mantenimiento y el hosting es gratuito.',
      },
      {
        q: 'Cuanto tiempo toma construirlo?',
        a: 'Los sitios Foundation se lanzan en 1-2 semanas. Los sitios Growth toman 2-3 semanas. Los proyectos Dominance toman 3-4 semanas. Empezamos con una llamada de estrategia y avanzamos por diseno y desarrollo con su retroalimentacion en cada etapa.',
      },
      {
        q: 'Necesito saber algo sobre tecnologia?',
        a: 'No. Nosotros nos encargamos de todo - diseno, desarrollo, hosting y soporte continuo. Usted enfoquese en manejar su negocio. Nosotros construimos el sitio que le trae clientes.',
      },
      {
        q: 'Que significa "soporte" realmente?',
        a: 'Durante su periodo de soporte, monitoreamos la velocidad de su sitio, arreglamos cualquier problema, hacemos actualizaciones de contenido, rastreamos sus analiticas y optimizamos para mejores resultados. Puede contactarnos directamente para cambios. No es un call center - es el mismo equipo que construyo su sitio.',
      },
      {
        q: 'Que pasa cuando termina mi periodo de soporte?',
        a: 'Su sitio sigue funcionando exactamente como estaba. El hosting es gratuito, asi que no hay costos continuos a menos que usted quiera. Puede actualizar a nuestro plan Administrado para optimizacion continua, o manejarlo usted mismo. El sitio es suyo.',
      },
      {
        q: 'Construyen sitios en otros idiomas?',
        a: 'Si. El paquete Growth incluye soporte bilingue (Ingles + Espanol). El paquete Dominance soporta 3 o mas idiomas. Cada idioma tiene sus propias paginas optimizadas - no es solo un plugin de traduccion.',
      },
      {
        q: 'Pueden ayudar con Google Business Profile y busqueda local?',
        a: 'Si. El paquete Foundation incluye configuracion de Google Business Profile. El paquete Dominance incluye una auditoria completa de SEO local, schema markup para resultados de busqueda enriquecidos y soporte multi-ubicacion. Nos aseguramos de que Google entienda exactamente lo que hace y donde lo hace.',
      },
      {
        q: 'Cuanto cuesta la administracion continua?',
        a: 'Nuestro plan Administrado cuesta $500-$1,000/mes dependiendo del alcance. Incluye actualizaciones de contenido continuas, optimizacion SEO, reportes de analiticas y soporte prioritario. La mayoria de los negocios empiezan con un paquete de construccion y agregan el plan Administrado despues cuando ven resultados.',
      },
      {
        q: 'Que es el paquete Full Stack Dominance?',
        a: 'Full Stack Dominance combina nuestro desarrollo web con una operacion completa de distribucion de contenido. Obtiene el sitio Dominance mas gestion de cuenta de Reddit, campanas de construccion de karma, creacion de contenido en Reddit, LinkedIn y X, y reportes mensuales de atribucion de trafico. Generamos 527 visitantes y mas de 75,000 vistas en Reddit en 24 horas para un cliente. Este paquete es solo por invitacion - agende una llamada para ver si es la opcion correcta.',
      },
      {
        q: 'Que los hace diferentes de otros desarrolladores web?',
        a: 'Pruebas. Cada sitio que construimos viene con datos de rendimiento medibles - tiempos de carga, posicionamiento en buscadores, rastreo de conversiones. No solo construimos un sitio y nos vamos. Construimos un sitio que rinde, lo demostramos con datos y seguimos optimizando. Esta pagina que esta leyendo ahora mismo esta construida con la misma tecnologia.',
      },
    ],
  },

  sources: {
    headline: 'Mas Informacion',
    links: [
      {
        label: 'Documentacion de Core Web Vitals de Google',
        href: 'https://web.dev/articles/vitals',
      },
      { label: 'Google PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
      {
        label: 'Guia de Datos Estructurados de Google',
        href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      },
    ],
  },

  cta: {
    headline: 'Listo Para Ver la Diferencia?',
    description:
      'Solicite una auditoria gratis de su sitio. Analizamos su sitio actual con PageSpeed, le mostramos donde esta parado y le trazamos exactamente lo que un nuevo sitio haria por su negocio.',
    ctaPrimary: 'Solicite una Auditoria Gratis',
    ctaSecondary: 'Envie un Mensaje: (347) 452-0467',
  },
}
