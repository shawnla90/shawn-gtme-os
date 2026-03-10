/**
 * ShawnOS — How-To Wiki Data (Spanish)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { HowToWikiEntry, HowToWikiCategory } from './how-to-wiki'

/* ── category metadata (Spanish) ──────────────────── */

export const HOW_TO_WIKI_CATEGORIES_ES: {
  id: HowToWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'ide-fundamentals',
    label: 'Fundamentos de IDE',
    description:
      'Como trabajar con cualquier AI IDE - Cursor, Windsurf, VS Code + Continue. Principios que aplican en todas partes: ventanas de contexto, referencias a archivos, reglas, habilidades, composer vs inline.',
    prompt: '$ cd ~/how-to/ide-fundamentals/',
  },
  {
    id: 'cli-tools',
    label: 'Herramientas CLI',
    description:
      'Claude Code independiente, Claude Code dentro de Cursor, OpenClaw, motores de contexto a nivel de repo. El modelo de estabilidad tipo "cron job".',
    prompt: '$ cd ~/how-to/cli-tools/',
  },
  {
    id: 'mcp-servers',
    label: 'Servidores MCP',
    description:
      'Que son los MCP, como agregarlos y gestionarlos, configuraciones especificas por stack para GTM, contenido y flujos de trabajo full-stack.',
    prompt: '$ cd ~/how-to/mcp-servers/',
  },
  {
    id: 'cost-efficiency',
    label: 'Eficiencia de Costos',
    description:
      'Estrategia de seleccion de modelos, gestion de creditos, presupuesto de tokens. Como obtener el maximo rendimiento sin agotar tu suscripcion.',
    prompt: '$ cd ~/how-to/cost-efficiency/',
  },
  {
    id: 'security',
    label: 'Seguridad',
    description:
      'Guia de seguridad basada en hechos: .gitignore, variables de entorno, motores de contexto, estrategia de repo publico vs privado. Desmintiendo el miedo.',
    prompt: '$ cd ~/how-to/security/',
  },
  {
    id: 'parallel-agents',
    label: 'Agentes Paralelos',
    description:
      'Como ejecutar agentes en paralelo, patrones de orquestacion, cuando dividir vs secuenciar, ejemplos reales del OS.',
    prompt: '$ cd ~/how-to/parallel-agents/',
  },
  {
    id: 'comparisons',
    label: 'Comparaciones',
    description:
      'Analisis detallados cara a cara de herramientas de codigo AI, flujos de trabajo y conceptos. Perspectiva de un profesional que las usa todas a diario.',
    prompt: '$ diff --tool-a --tool-b',
  },
  {
    id: 'abm-pipeline',
    label: 'Pipeline ABM',
    description:
      'Automatizacion de marketing basado en cuentas, paginas de aterrizaje personalizadas, seguimiento de analiticas y el flujo completo de ABM desde la senal hasta la conversion.',
    prompt: '$ cd ~/how-to/abm-pipeline/',
  },
  {
    id: 'deployment-tools',
    label: 'Herramientas de Despliegue',
    description:
      'Plataformas de hosting, despliegue de agentes, kits SDK y herramientas de infraestructura para enviar agentes y servicios mas alla de sitios estaticos.',
    prompt: '$ cd ~/how-to/deployment-tools/',
  },
  {
    id: 'tool-evaluation',
    label: 'Evaluacion de Herramientas',
    description:
      'Marcos de evaluacion independientes para herramientas de go-to-market, proveedores y agencias.',
    prompt: '$ cd ~/how-to/tool-evaluation/',
  },
]

/* ── wiki entries (Spanish) ───────────────────────── */

export const HOW_TO_WIKI_ENTRIES_ES: HowToWikiEntry[] = [
  /* ================================================================== */
  /*  IDE FUNDAMENTALS                                                    */
  /* ================================================================== */

  {
    id: 'getting-started-with-cursor',
    title: 'Primeros Pasos con Cursor',
    subtitle: 'Instala, configura y envia tu primera edicion asistida por AI en menos de 10 minutos',
    category: 'ide-fundamentals',
    description:
      'Guia paso a paso para comenzar con Cursor IDE. Instalacion, configuracion inicial, tu primera edicion con AI y el modelo mental que hace que todo encaje.',
    keywords: [
      'configuracion Cursor IDE',
      'primeros pasos cursor',
      'tutorial Cursor AI IDE',
      'instalar cursor IDE',
      'guia para principiantes cursor IDE',
      'como usar cursor',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'ide-principles-that-transfer',
      'rules-skills-context',
      'claude-code-inside-cursor',
    ],
    sections: [
      {
        heading: 'Que es Cursor',
        type: 'prose',
        content:
          'Cursor es un editor de codigo con AI integrada en cada capa. Es un fork de VS Code, asi que si alguna vez has usado VS Code, la interfaz es identica. Las mismas extensiones, los mismos atajos, la misma configuracion. La diferencia es que Cursor tiene un agente AI incorporado. Puedes hablarle, darle tareas, y el lee y escribe archivos en tu proyecto. Piensa en el como VS Code con un copiloto brillante que puede ver todo tu codigo. No necesitas ser desarrollador para usar Cursor. Yo no lo era cuando empece. Lo use para construir tres sitios web, mas de 40 habilidades de automatizacion y un sistema operativo GTM completo. La herramienta se adapta a tu nivel.',
      },
      {
        heading: 'Instalacion y Primer Inicio',
        type: 'code',
        content:
          'Descarga Cursor desde cursor.com. Instalalo como cualquier aplicacion de Mac o Windows. Al abrirlo por primera vez, te preguntara si quieres importar la configuracion de VS Code. Di que si si tienes configuracion existente. Si es tu primer editor de codigo, omitelo.\n\nAbre una carpeta. Ese es tu proyecto. Todo lo que Cursor hace ocurre dentro del contexto de esa carpeta. File > Open Folder, apuntalo a tu directorio de proyecto. Si aun no tienes uno, crea uno: mkdir ~/my-project && cd ~/my-project.\n\nLo primero que veras es el explorador de archivos a la izquierda y un editor vacio a la derecha. Eso es normal. La magia comienza cuando abres el panel de chat (Cmd+L en Mac, Ctrl+L en Windows). Ahi es donde hablas con la AI.',
      },
      {
        heading: 'Tu Primera Edicion con AI',
        type: 'pattern',
        content:
          'Crea un archivo llamado README.md en tu proyecto. Escribe unas cuantas lineas de texto. Ahora selecciona una oracion y presiona Cmd+K (edicion inline). Escribe "hazlo mas conciso" y presiona enter. Observa como la AI reescribe tu oracion en el lugar. Esa es la interaccion mas simple: selecciona texto, dile a la AI que hacer, acepta o rechaza el cambio.\n\nDespues, abre el panel de chat (Cmd+L). Escribe "crea un script de Python que imprima hola mundo y la fecha actual." El agente creara el archivo, escribira el codigo y podras ejecutarlo desde la terminal. Acabas de pasar de cero a codigo funcional sin escribir una sola linea tu mismo.\n\nEste es el ciclo: describe lo que quieres, deja que la AI lo construya, revisa el resultado, ajusta si es necesario. Cada flujo de trabajo complejo que construyas despues es simplemente este ciclo repetido con mas contexto.',
      },
      {
        heading: 'El Modelo Mental',
        type: 'pro-tip',
        content:
          'Cursor no es autocompletado con esteroides. Es un companero de equipo. La diferencia importa. El autocompletado sugiere la siguiente palabra. Un companero de equipo entiende todo el proyecto y toma decisiones. Cuando le das una tarea a Cursor, lee archivos relevantes, entiende los patrones que has establecido y produce resultados que encajan con tu base de codigo. Pero como cualquier companero de equipo, solo funciona bien si tiene contexto. Un companero nuevo sin induccion produce trabajo generico. Un companero que ha leido tus documentos, tu guia de estilo y tu trabajo anterior produce trabajo excelente. Por eso las siguientes entradas de esta guia importan tanto. Las reglas, habilidades y configuracion de contexto son la induccion que hace que Cursor pase de util a indispensable.',
      },
    ],
  },

  {
    id: 'ide-principles-that-transfer',
    title: 'Principios de IDE que se Transfieren',
    subtitle: 'Aprende una vez, aplica en todas partes - Cursor, Windsurf, VS Code y mas alla',
    category: 'ide-fundamentals',
    description:
      'Principios fundamentales de AI IDE que funcionan en Cursor, Windsurf, VS Code con Continue y herramientas futuras. Ventanas de contexto, referencias a archivos, inline vs chat y los patrones que nunca cambian.',
    keywords: [
      'principios AI IDE',
      'cursor vs windsurf',
      'principios de codigo AI',
      'AI IDE agnostico',
      'ventana de contexto IDE',
      'comparacion AI IDE',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'getting-started-with-cursor',
      'rules-skills-context',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'Por que los Principios Superan a los Productos',
        type: 'prose',
        content:
          'Los AI IDE se mueven rapido. Cursor envia actualizaciones semanalmente. Windsurf se lanzo e itero rapidamente. VS Code agrego Copilot Chat. Aparecen nuevas herramientas cada mes. Si aprendes trucos especificos de Cursor, esos se rompen cuando Cursor cambia o cuando cambias de herramienta. Si aprendes los principios subyacentes, esos se transfieren a todas partes. El principio de cargar contexto antes de pedir resultados funciona en Cursor, Windsurf, Claude Code y cualquier herramienta AI futura. El principio de revisar la salida de AI antes de aceptarla funciona en todas partes. El principio de dividir tareas complejas en pasos mas pequenos funciona en todas partes. Aprende los principios. Los botones especificos del producto son solo detalles de implementacion.',
      },
      {
        heading: 'Principio 1: La Ventana de Contexto lo es Todo',
        type: 'pattern',
        content:
          'Cada AI IDE tiene una ventana de contexto. Esa es la cantidad total de texto que la AI puede ver a la vez. Archivos que tienes abiertos, archivos que referencias con @menciones, el historial de chat, tus reglas y configuraciones. Todo compite por espacio en la ventana de contexto. El principio: coloca la informacion correcta en la ventana de contexto antes de pedir resultados. En Cursor, haces esto con referencias @file y reglas. En Windsurf, con el contexto de Cascade. En VS Code + Continue, con archivos adjuntos. El mecanismo difiere. El principio es identico. Si la AI no tiene el contexto correcto, el resultado sera generico sin importar que IDE uses.',
      },
      {
        heading: 'Principio 2: Inline vs Chat Sirven Propositos Diferentes',
        type: 'pattern',
        content:
          'Cada AI IDE tiene dos modos de interaccion. Edicion inline (selecciona codigo, dile a la AI que lo cambie) y chat (describe una tarea, deja que la AI determine que archivos tocar). Inline es quirurgico. Usalo cuando sabes exactamente que necesita cambiar y donde. Reescribe esta funcion. Corrige este bug. Refactoriza este bloque. Chat es estrategico. Usalo cuando la tarea abarca multiples archivos o cuando necesitas que la AI tome decisiones sobre el enfoque. Construye una nueva pagina. Agrega autenticacion. Refactoriza la capa de datos. Esta distincion es la misma en cada AI IDE. Cursor los llama Cmd+K y Cmd+L. Otras herramientas usan diferentes atajos. El principio es identico: usa inline para precision, chat para alcance.',
      },
      {
        heading: 'Principio 3: Revisa Antes de Aceptar',
        type: 'pro-tip',
        content:
          'La salida de AI es un borrador, no un entregable. Cada AI IDE te muestra un diff de los cambios propuestos. Las lineas verdes son adiciones. Las lineas rojas son eliminaciones. Lee el diff antes de aceptar. Esto se siente lento al principio. No lo es. Es la puerta de calidad que previene errores compuestos. Si aceptas un cambio malo en el paso 1, el paso 2 construye sobre el, el paso 3 lo extiende, y para el paso 5 tienes un desorden que es mas dificil de arreglar que empezar de nuevo. El paso de revision toma 10 segundos. El paso de depuracion despues de aceptar cambios malos toma 10 minutos. Este principio aplica a Cursor, Windsurf, VS Code, Claude Code y cada herramienta futura que proponga cambios de codigo.',
      },
      {
        heading: 'Principio 4: La Especificidad Escala',
        type: 'formula',
        content:
          'La calidad de la salida de AI es directamente proporcional a la especificidad de tu entrada. "Haz que el sitio se vea mejor" produce cambios aleatorios. "Cambia el fondo del hero a #0a0a0a, establece el encabezado a 3rem font-size con peso 600 y agrega 2rem de padding vertical" produce exactamente lo que quieres. Esto escala a cada interaccion en cada AI IDE. Prompts especificos producen salida especifica. Prompts vagos producen salida vaga. La formula: describe el QUE (que cambiar), el DONDE (que archivo o componente) y el COMO (valores especificos, patrones o referencias). Omite cualquiera de esos tres y la AI llena el vacio con una suposicion.',
      },
    ],
  },

  {
    id: 'rules-skills-context',
    title: 'Reglas, Habilidades y Archivos de Contexto',
    subtitle: 'Las tres capas que convierten una AI generica en tu AI',
    category: 'ide-fundamentals',
    description:
      'Como configurar reglas, construir habilidades y estructurar archivos de contexto para AI IDE. El sistema de tres capas que hace que Claude funcione como un companero de equipo que ha leido toda tu documentacion.',
    keywords: [
      'reglas cursor',
      'habilidades AI IDE',
      'archivos de contexto AI',
      'configuracion de habilidades cursor',
      '.cursorrules',
      'configuracion AI IDE',
      'ingenieria de reglas habilidades contexto',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'getting-started-with-cursor',
      'ide-principles-that-transfer',
      'claude-code-quickstart',
    ],
    sections: [
      {
        heading: 'Las Tres Capas',
        type: 'prose',
        content:
          'Hay tres capas de configuracion que moldean como se comporta la AI en tu IDE. Cada capa se carga en un momento diferente y sirve un proposito distinto. Las reglas se cargan automaticamente segun los archivos que estas editando. Hacen cumplir patrones sin que tengas que pensar en ellos. Las habilidades se cargan cuando las invocas con un comando slash o una palabra clave. Ejecutan flujos de trabajo especificos paso a paso. Los archivos de contexto (como CLAUDE.md) se cargan al inicio de cada sesion y establecen la linea base para todo lo demas. Juntas, estas tres capas reemplazan la necesidad de re-explicar tus preferencias, flujos de trabajo y restricciones en cada sesion. Las configuras una vez. Funcionan cada vez.',
      },
      {
        heading: 'Reglas: Aplicacion Automatica de Patrones',
        type: 'pattern',
        content:
          'Las reglas son archivos que se cargan basados en patrones glob. Cuando abres un archivo TypeScript, la regla de TypeScript se carga. Cuando editas un post de blog, la regla de formato de blog se carga. Nunca las invocas manualmente. Se activan segun lo que estes tocando.\n\nEn Cursor, las reglas viven en .cursor/rules/ como archivos .mdc con frontmatter que especifica el patron glob. En Claude Code, viven en .claude/rules/ o se definen en el archivo CLAUDE.md. El formato difiere. El concepto es identico.\n\nLas buenas reglas son estrechas y especificas. "Al editar archivos en content/drafts/, aplica la convencion de nombre con prefijo de fecha y adherencia a la guia de voz." Las malas reglas son amplias y genericas. "Siempre escribe buen codigo." Las reglas estrechas producen comportamiento consistente. Las reglas amplias producen resultados inconsistentes porque la AI interpreta "bueno" de manera diferente en cada sesion.',
      },
      {
        heading: 'Habilidades: Ejecucion de Flujos de Trabajo Bajo Demanda',
        type: 'pattern',
        content:
          'Las habilidades son archivos markdown que definen flujos de trabajo paso a paso. Las invocas explicitamente. Escribe /deploy y la habilidad de despliegue se carga. Escribe /tracker y la habilidad del tracker se carga. Cada habilidad contiene todo lo que el agente necesita para ejecutar ese flujo de trabajo: que archivos leer, que comandos ejecutar, que salida producir y como manejar errores.\n\nEl archivo de habilidad es el flujo de trabajo completo en ingles plano. No estas escribiendo codigo. Estas escribiendo instrucciones que un agente AI sigue. "Paso 1: Verifica cambios sin stage. Paso 2: Agrega todos los archivos modificados al stage. Paso 3: Genera un mensaje de commit a partir del diff." El agente lee estos pasos y los ejecuta.\n\nLas habilidades se acumulan. Cada vez que usas una habilidad y notas un caso borde, corriges la habilidad. Despues de 20 usos, la habilidad maneja escenarios que nunca planeaste. Ese es el patron de la sarten de hierro fundido. La habilidad se sazona mas con el uso.',
      },
      {
        heading: 'Archivos de Contexto: Linea Base de Sesion',
        type: 'pro-tip',
        content:
          'Los archivos de contexto como CLAUDE.md se cargan antes que cualquier otra cosa. Establecen los valores predeterminados para cada sesion. Informacion del entorno (OS, shell, preferencias de idioma), reglas de estilo de codigo y restricciones de comportamiento. Manten los archivos de contexto concisos. Solo pon cosas aqui que apliquen a CADA sesion. Si una regla solo aplica al editar posts de blog, pertenece a un archivo de regla, no a CLAUDE.md. Si un flujo de trabajo solo se ejecuta cuando escribes /deploy, pertenece a un archivo de habilidad, no a CLAUDE.md.\n\nLa jerarquia: CLAUDE.md establece el piso. Las reglas ajustan por tipos de archivo. Las habilidades ejecutan flujos de trabajo especificos. Cada capa agrega contexto sin sobrecargar la ventana de contexto con informacion irrelevante. El agente obtiene exactamente lo que necesita para la tarea actual.',
      },
      {
        heading: 'Errores Comunes de Configuracion',
        type: 'anti-pattern',
        content:
          'Poner todo en CLAUDE.md. Tu CLAUDE.md se convierte en 500 lineas y el agente lee todo en cada sesion, incluso cuando el 90% es irrelevante. Mueve las instrucciones de flujo de trabajo a habilidades. Mueve los patrones especificos de archivos a reglas. Manten CLAUDE.md por debajo de 50 lineas.\n\nEscribir habilidades demasiado vagas. "Despliega el sitio web" no es una habilidad. Es un deseo. Escribe pasos especificos con comandos especificos y criterios de exito especificos.\n\nNo usar reglas en absoluto. Si te encuentras repitiendo la misma instruccion entre sesiones ("usa TypeScript, no JavaScript"), eso deberia ser una regla. Las reglas automatizan las instrucciones repetidas para que nunca tengas que escribirlas de nuevo.',
      },
    ],
  },

  /* ================================================================== */
  /*  CLI TOOLS                                                           */
  /* ================================================================== */

  {
    id: 'claude-code-quickstart',
    title: 'Inicio Rapido con Claude Code',
    subtitle: 'Instala Claude Code y ejecuta tu primera sesion de agente en terminal',
    category: 'cli-tools',
    description:
      'Como instalar y usar Claude Code como herramienta CLI independiente. Instalacion, primera sesion, configuracion de CLAUDE.md y el modelo mental para agentes AI basados en terminal.',
    keywords: [
      'instalar claude code',
      'claude code CLI',
      'tutorial claude code',
      'inicio rapido claude code',
      'instalar claude code',
      'claude code terminal',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-inside-cursor',
      'repo-context-engine',
      'getting-started-with-cursor',
    ],
    sections: [
      {
        heading: 'Que es Claude Code',
        type: 'prose',
        content:
          'Claude Code es un agente AI basado en terminal. Sin GUI. Sin editor. Solo tu terminal y Claude. Escribes una tarea, Claude lee tus archivos, escribe codigo, ejecuta comandos y construye cosas. Vive en tu terminal junto a git, npm y todas las demas herramientas CLI que usas. La ventaja sobre un agente basado en IDE: Claude Code opera a nivel de repo. No esta limitado a un solo archivo o una sola pestana del editor. Ve todo tu proyecto y trabaja entre archivos de forma natural. La desventaja: sin editor visual, sin diffs inline, sin clic para aceptar. Todo sucede a traves de texto. Para algunos flujos de trabajo, eso es una caracteristica. Para otros, quieres el IDE. Por eso existe Claude Code dentro de Cursor.',
      },
      {
        heading: 'Instalacion',
        type: 'code',
        content:
          'Instala Claude Code globalmente via npm:\n\nnpm install -g @anthropic-ai/claude-code\n\nSi recibes errores de permisos en Mac, corrige la propiedad primero:\n\nsudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}\n\nDespues ejecuta la instalacion de nuevo sin sudo. Tras la instalacion, ejecuta hash -r para limpiar la cache del shell, o abre una nueva terminal. Verifica con: claude --version.\n\nEn el primer inicio, Claude Code te pedira autenticarte con tu cuenta de Anthropic. Sigue el flujo del navegador. Una vez autenticado, estas listo. Navega a cualquier carpeta de proyecto y escribe claude para iniciar una sesion.',
      },
      {
        heading: 'Tu Primera Sesion',
        type: 'pattern',
        content:
          'Navega a tu carpeta de proyecto. Escribe claude. Ahora estas en una sesion interactiva. Claude puede ver cada archivo en el directorio actual y subdirectorios.\n\nPrueba: "Lee el README y resume de que trata este proyecto." Claude leera el archivo y te dara un resumen. Eso verifica que puede ver tu proyecto.\n\nPrueba: "Crea un script de Python llamado hello.py que imprima la fecha y hora actual." Claude creara el archivo y escribira el codigo. Puedes ejecutarlo con python hello.py.\n\nPrueba: "Que archivos hay en este proyecto y como estan organizados?" Claude escaneara el arbol de directorios y describira la estructura. Esto es util cuando estas explorando una base de codigo desconocida.\n\nEl modelo de interaccion: describes la intencion, Claude ejecuta. Revisas la salida, Claude ajusta. Cada tarea construye sobre el contexto de la sesion.',
      },
      {
        heading: 'CLAUDE.md para Sesiones CLI',
        type: 'pro-tip',
        content:
          'Crea un archivo CLAUDE.md en la raiz de tu proyecto. Claude Code lee este archivo al inicio de cada sesion. Pon tus valores predeterminados de entorno aqui: OS, shell, lenguajes principales, reglas de gestion de paquetes, preferencias de estilo de codigo. Mantenlo corto. Menos de 50 lineas. Todo en CLAUDE.md consume espacio de la ventana de contexto durante toda la sesion.\n\nTambien puedes crear un ~/.claude/CLAUDE.md para valores predeterminados globales que apliquen a cada proyecto. CLAUDE.md a nivel de proyecto sobreescribe la configuracion global. Esto te permite establecer preferencias universales (valores predeterminados de lenguaje, reglas de git) globalmente mientras mantienes configuraciones especificas del proyecto en cada repo.',
      },
      {
        heading: 'Shift+Tab: Planifica Antes de Ejecutar',
        type: 'pattern',
        content:
          'Presiona Shift+Tab en una sesion de Claude Code para alternar entre modo de planificacion y modo de ejecucion. El modo de planificacion es de solo lectura. Claude explora, lee archivos y mapea pasos sin cambiar nada. El modo de ejecucion es donde Claude realmente escribe archivos y ejecuta comandos.\n\nEl flujo de trabajo: comienza en modo de planificacion para tareas complejas. Deja que Claude analice la base de codigo, identifique los archivos involucrados y proponga un plan paso a paso. Revisa el plan. Si se ve bien, cambia al modo de ejecucion y dile a Claude que proceda. Si se ve mal, ajusta el plan antes de que se escriba cualquier codigo.\n\nEsta es la caracteristica mas subutilizada de Claude Code. La gente salta directamente a la ejecucion y se pregunta por que Claude hace suposiciones erroneas. El modo de planificacion previene esas suposiciones al forzar la exploracion antes de la accion.',
      },
    ],
  },

  {
    id: 'claude-code-inside-cursor',
    title: 'Claude Code Dentro de Cursor',
    subtitle: 'Ejecuta Claude Code como agente de terminal dentro de tu IDE',
    category: 'cli-tools',
    description:
      'Como usar Claude Code dentro de la terminal del IDE Cursor. Combinando el poder de un agente CLI con la retroalimentacion visual de un editor. Cuando usar el agente de terminal vs el agente del IDE.',
    keywords: [
      'claude code cursor',
      'claude code en cursor',
      'agente de terminal cursor',
      'claude code IDE',
      'agente CLI cursor',
      'tutorial claude code dentro de cursor',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'getting-started-with-cursor',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'Por que Ejecutar Claude Code Dentro de Cursor',
        type: 'prose',
        content:
          'Cursor tiene su propio agente AI. Claude Code es un agente AI separado. Ejecutar Claude Code dentro de la terminal de Cursor te da ambos. El agente de Cursor maneja ediciones inline, cambios de archivos basados en chat y diffs visuales. Claude Code en la terminal maneja tareas a nivel de repo, operaciones complejas con multiples archivos y flujos de trabajo que necesitan el CLI. Eliges la herramienta correcta para la tarea. Edicion inline simple? Cmd+K en Cursor. Construir una nueva funcionalidad en 5 archivos? Claude Code en la terminal. La terminal ya esta ahi en Cursor. Solo estas ejecutando un agente diferente en ella.',
      },
      {
        heading: 'Configuracion',
        type: 'code',
        content:
          'Si Claude Code ya esta instalado globalmente (npm install -g @anthropic-ai/claude-code), funciona dentro de la terminal de Cursor inmediatamente. Abre una terminal en Cursor (Ctrl+` o Terminal > New Terminal). Escribe claude. Ahora estas ejecutando Claude Code dentro de Cursor.\n\nTu archivo CLAUDE.md aplica a ambos agentes. El agente de Cursor lo lee. Claude Code lo lee. Los archivos de reglas en .cursor/rules/ solo aplican al agente de Cursor. Las habilidades en .cursor/skills/ aplican al agente de Cursor. Claude Code tiene su propio sistema de habilidades y reglas. Ten en mente esta separacion al configurar.\n\nConsejo pro: abre una terminal dividida. Un panel para Claude Code, otro para comandos manuales. Puedes ejecutar Claude Code en una tarea compleja en un panel mientras ejecutas git status o revisas logs en el otro.',
      },
      {
        heading: 'Cuando Usar Cual Agente',
        type: 'pattern',
        content:
          'Usa el agente de Cursor (chat Cmd+L) para tareas limitadas a uno o pocos archivos. Editar un componente, corregir un bug en una funcion especifica, refactorizar un modulo individual. El diff visual facilita la revision.\n\nUsa Claude Code (terminal) para tareas que abarcan todo el repo. Construir una nueva funcionalidad que crea multiples archivos. Ejecutar un flujo de trabajo que involucra operaciones git, llamadas API y generacion de archivos. Cualquier cosa donde la salida de terminal importa.\n\nUsa ambos en paralelo para maxima velocidad. El agente de Cursor edita el frontend mientras Claude Code en la terminal maneja la capa de datos. No entran en conflicto porque trabajan en archivos diferentes. Esta es la configuracion de agentes paralelos del hombre pobre. Dos agentes, un IDE, diferentes alcances.',
      },
      {
        heading: 'El Modelo de Estabilidad tipo Cron Job',
        type: 'pro-tip',
        content:
          'Claude Code es mas estable para tareas largas y de multiples pasos que el chat del IDE. El agente de Cursor trabaja dentro del ciclo de vida del editor. Si el editor se refresca, el contexto puede cambiar. Claude Code en la terminal mantiene una sesion persistente. No pierde contexto a mitad de tarea.\n\nEsto hace que Claude Code sea ideal para tareas que se sienten como cron jobs: flujos de trabajo secuenciales y de multiples pasos que necesitan ejecutarse hasta completarse sin interrupcion. Scripts de despliegue, migraciones de datos, operaciones masivas de archivos, flujos de configuracion de campanas. Si la tarea tiene mas de 5 pasos y no quieres supervisarla, ejecutala en Claude Code, no en el agente del IDE.',
      },
    ],
  },

  {
    id: 'openclaw-setup',
    title: 'Configuracion de OpenClaw',
    subtitle: 'Alternativa open-source a Claude Code para constructores conscientes del presupuesto',
    category: 'cli-tools',
    description:
      'Como instalar y configurar OpenClaw como alternativa open-source a Claude Code. Configuracion, configuracion de modelos y cuando OpenClaw tiene sentido vs el CLI oficial.',
    keywords: [
      'configuracion openclaw',
      'instalar openclaw',
      'open source claude code',
      'alternativa a claude code',
      'tutorial openclaw',
      'openclaw AI CLI',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-inside-cursor',
      'credit-management',
    ],
    sections: [
      {
        heading: 'Estado: Febrero 2026',
        type: 'anti-pattern',
        content:
          'OpenClaw esta evolucionando activamente y el ecosistema a su alrededor tambien. La informacion en esta pagina refleja mi experiencia practica hasta el 20 de febrero de 2026. Las integraciones de proveedores, precios y soporte de OAuth estan cambiando rapido. Lo que funciona hoy puede cambiar la proxima semana. Mantendre esta pagina actualizada a medida que las cosas cambien, pero trata cada recomendacion aqui como una instantanea en el tiempo, no una respuesta permanente. Si algo se siente mal cuando lo pruebes, revisa los docs de OpenClaw y los changelogs de los proveedores primero.',
      },
      {
        heading: 'Que es OpenClaw',
        type: 'prose',
        content:
          'OpenClaw es una herramienta CLI open-source que replica gran parte de la experiencia de Claude Code pero te permite traer tu propia API key y elegir tu modelo. En vez de pagar por la suscripcion de Claude Code, pagas por token a traves de tu propia API key de Anthropic. Para uso ligero, esto puede ser mas barato. Para uso intensivo, la suscripcion generalmente es la mejor opcion. La interfaz es similar: navega a un proyecto, inicia una sesion, describe tareas y el agente lee y escribe archivos. La diferencia clave es la flexibilidad. OpenClaw soporta multiples proveedores de modelos, asi que puedes usar modelos mas baratos para tareas simples y modelos costosos para tareas complejas.',
      },
      {
        heading: 'OAuth vs API Key: La Realidad de Costos',
        type: 'pro-tip',
        content:
          'Esta es la decision mas importante al configurar OpenClaw: como te autentiques determina que tan rapido gastas dinero. Hay dos caminos. API key significa que pagas por token, directamente de tu bolsillo, cada llamada. OAuth significa que te autentificas a traves de la suscripcion existente de un proveedor y usas sus modelos dentro de los limites de tu plan.\n\nEl camino de API key drenara tu billetera. Aprendi esto por las malas. Ejecutando Opus 4.6 a traves de una API key de Anthropic, estaba gastando mas de $50 al dia durante tres dias consecutivos. Eso no es un error de escritura. El uso agente intensivo con un modelo de primer nivel quema tokens a un ritmo que hace llorar a tu tarjeta de credito. Si estas experimentando, explorando, iterando en prompts o ejecutando flujos de trabajo de agente multi-paso, los tokens se acumulan astronomicamente.\n\nLos modelos gratuitos y baratos disponibles a traves de API keys tampoco son buenos. Ahorras dinero pero la calidad de la salida baja tanto que terminas re-ejecutando tareas, lo que cuesta mas tiempo y a veces mas tokens que usar el buen modelo una vez.\n\nMi recomendacion actual a partir de febrero 2026: configura OpenClaw con ChatGPT via OAuth. OpenAI soporta conexiones OAuth con OpenClaw, lo que significa que te autentificas a traves de tu suscripcion existente de ChatGPT en vez de pagar por token. Obtienes acceso a modelos GPT dentro de tu plan. No es perfecto, pero es dramaticamente mas rentable para uso diario.\n\nAnthropic, desafortunadamente, actualmente no soporta OAuth con OpenClaw. Han dicho que no a esta via de integracion. Eso significa que si quieres usar modelos Claude a traves de OpenClaw, estas atrapado en el camino de API key con facturacion por token. Esto puede cambiar en el futuro, pero a dia de hoy, esa es la realidad. Actualizare esta pagina si y cuando Anthropic abra el soporte OAuth.',
      },
      {
        heading: 'Instalacion',
        type: 'code',
        content:
          'Instala via npm:\n\nnpm install -g openclaw\n\nConfigura tu API key como variable de entorno:\n\nexport ANTHROPIC_API_KEY=your-key-here\n\nAgrega eso a tu .zshrc o .bashrc para que persista entre sesiones. Navega a cualquier carpeta de proyecto y escribe openclaw para comenzar.\n\nPara proveedores de modelos alternativos, configura la variable de entorno apropiada. OpenClaw soporta OpenAI, Anthropic y endpoints de modelos locales. Revisa los docs de OpenClaw para configuracion especifica por proveedor.',
      },
      {
        heading: 'Cuando OpenClaw Tiene Sentido',
        type: 'pattern',
        content:
          'OpenClaw tiene sentido en tres escenarios. Primero, quieres probar el flujo de trabajo de agente CLI sin comprometerte a una suscripcion de Claude Code. Instala OpenClaw, usa tu API key existente y ve si los agentes basados en terminal se adaptan a tu flujo de trabajo.\n\nSegundo, quieres flexibilidad de modelos. OpenClaw te permite cambiar entre proveedores y modelos por sesion. Usa un modelo barato para escanear archivos y un modelo capaz para escribir codigo. Claude Code te bloquea en modelos de Anthropic.\n\nTercero, estas construyendo automatizacion que llama al CLI programaticamente. La naturaleza open-source de OpenClaw significa que puedes inspeccionar el codigo fuente, modificar el comportamiento e integrarlo en pipelines personalizados.\n\nOpenClaw NO tiene sentido si eres un usuario intensivo diario. La suscripcion de Claude Code incluye limites de uso generosos. El precio por token a volumenes altos cuesta mas que la suscripcion.',
      },
      {
        heading: 'Limitaciones vs Claude Code',
        type: 'anti-pattern',
        content:
          'OpenClaw replica la experiencia central pero pierde algunas funcionalidades de Claude Code. La integracion de herramientas es menos pulida. El soporte de servidores MCP puede ir detras. La gestion de sesiones es mas simple. Y pierdes la infraestructura alojada por Anthropic que maneja autenticacion, limitacion de tasa y enrutamiento de modelos.\n\nLa brecha mas grande: Claude Code tiene integracion profunda con el ecosistema de modelos de Anthropic. Funcionalidades como el pensamiento extendido, optimizacion de uso de herramientas y gestion de ventana de contexto estan ajustadas especificamente para modelos Claude. OpenClaw funciona con modelos Claude a traves de la API, pero la integracion no es tan ajustada.\n\nComienza con OpenClaw para aprender el flujo de trabajo. Actualiza a Claude Code cuando el agente de terminal se convierta en una parte central de tu proceso diario.',
      },
    ],
  },



  {
    id: 'claude-code-power-features',
    title: 'Funcionalidades Avanzadas de Claude Code',
    subtitle: 'Memoria, hooks, habilidades personalizadas, seguimiento de costos y worktrees',
    category: 'cli-tools',
    description:
      'Las funcionalidades que convierten Claude Code de un chatbot de terminal en un sistema operativo AI persistente y personalizable. Memoria que persiste entre sesiones, hooks que automatizan comportamiento, comandos slash personalizados, visibilidad de costos y worktrees aislados.',
    keywords: [
      'memoria claude code',
      'hooks claude code',
      'habilidades claude code',
      'comandos slash claude code',
      'seguimiento de costos claude code',
      'worktrees claude code',
      'funcionalidades avanzadas claude code',
      'usuario avanzado claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-inside-cursor',
      'rules-skills-context',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'Mas Alla del Inicio Rapido',
        type: 'prose',
        content:
          'El inicio rapido de Claude Code te deja instalado y funcionando. Esta guia cubre las funcionalidades que hacen que se quede. Memoria que recuerda lo que le ensenaste el martes pasado. Hooks que ejecutan comandos de shell cuando Claude toca herramientas especificas. Comandos slash personalizados que ejecutan tus flujos de trabajo con una sola pulsacion. Seguimiento de costos para que sepas a donde van tus tokens. Y worktrees para ejecutar sesiones paralelas sin conflictos de archivos. Estas son las funcionalidades que uso a diario. La mayoria las descubri por accidente, semanas despues de empezar a usar Claude Code. No deberias tener que esperar semanas.',
      },
      {
        heading: 'Memoria: Tu Agente Recuerda',
        type: 'pattern',
        content:
          'Claude Code tiene un sistema de memoria persistente. Escribe notas en un directorio en ~/.claude/projects/<project-hash>/memory/ y las lee de vuelta al inicio de cada sesion. El archivo indice es MEMORY.md. Las primeras 200 lineas se cargan automaticamente en cada sesion. Archivos de temas adicionales (debugging.md, patterns.md, lo que necesites) se crean a medida que el repo evoluciona.\n\nQue se guarda: patrones estables confirmados en multiples sesiones, decisiones arquitectonicas, rutas de archivos importantes, preferencias del usuario, soluciones a problemas recurrentes. Que no se guarda: contexto especifico de sesion, trabajo en progreso, suposiciones no verificadas de una sola lectura de archivo.\n\nTambien puedes decirle a Claude que recuerde cosas explicitamente. Di "siempre usa bun en vez de npm" y lo escribe en memoria. Di "olvida lo de usar bun" y lo elimina. La memoria se acumula. Despues de unas semanas, Claude inicia una sesion ya conociendo la estructura de tu repo, tus convenciones de nombres, tus herramientas preferidas y los errores que cometio antes. Esa es la diferencia entre un agente en blanco y un companero de equipo.',
      },
      {
        heading: 'Hooks: Automatizando el Comportamiento del Agente',
        type: 'code',
        content:
          'Los hooks son comandos de shell que se disparan en eventos del ciclo de vida de Claude Code. Hay 14 eventos de hook: PreToolUse, PostToolUse, SessionStart, Stop y mas. Los configuras en .claude/settings.json (nivel de proyecto) o ~/.claude/settings.json (global).\n\nEl formato:\n\n"hooks": {\n  "PreToolUse": [\n    {\n      "matcher": "Bash",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "./hooks/validate.sh",\n          "timeout": 600\n        }\n      ]\n    }\n  ]\n}\n\nExisten tres tipos de hook. Los hooks de comando ejecutan scripts de shell. Los hooks de prompt envian contexto a Claude para una decision si/no. Los hooks de agente lanzan un subagente con herramientas de solo lectura para verificacion compleja.\n\nUsos practicos: bloquear comandos rm peligrosos antes de que se ejecuten. Ejecutar un linter despues de cada escritura de archivo. Enviar una notificacion de Slack cuando una sesion termina. Validar mensajes de commit antes de que se procesen. El comando /hooks te da un menu interactivo para gestionarlos sin editar JSON a mano.',
      },
      {
        heading: 'Habilidades Personalizadas y Comandos Slash',
        type: 'pattern',
        content:
          'Las habilidades son archivos markdown en .claude/skills/ que definen flujos de trabajo reutilizables. Cada carpeta de habilidad contiene un archivo SKILL.md con frontmatter YAML e instrucciones paso a paso. Cuando escribes /nombre-de-habilidad en una sesion de Claude Code, la habilidad se carga y Claude sigue las instrucciones.\n\nEl frontmatter controla el comportamiento. Lo basico: name (se convierte en el comando slash), description (Claude usa esto para invocarlo automaticamente cuando es relevante) y allowed-tools (herramientas que Claude puede usar sin pedir permiso). Los campos avanzados: model (sobreescribe que modelo ejecuta esta habilidad), context: fork (ejecuta en un contexto de subagente aislado en vez de la conversacion principal), disable-model-invocation: true (solo el usuario puede activarla, util para habilidades de deploy y commit) y argument-hint (pista de autocompletado como [issue-number]). Tambien puedes incrustar contexto dinamico con la sintaxis !command, que ejecuta un comando de shell antes de que el contenido de la habilidad se envie a Claude.\n\nMi repo tiene cuatro habilidades personalizadas: /handoff genera un documento de traspaso de contexto para la siguiente sesion. /sync-main maneja la divergencia de git de maquinas automatizadas. /update-github ejecuta un escaneo de seguridad pre-push antes de empujar al repo publico. /restart-openclaw diagnostica y reinicia el gateway de OpenClaw. Cada una comenzo simple y se hizo mas robusta a traves del uso real.\n\nEl archivo de habilidad es ingles plano. No estas escribiendo codigo. Estas escribiendo instrucciones que un agente AI sigue paso a paso. Las habilidades se cargan bajo demanda, asi que no consumen espacio de la ventana de contexto hasta que se invocan. Esa es la diferencia clave entre habilidades y CLAUDE.md. Pon el contexto siempre necesario en CLAUDE.md. Pon las instrucciones especificas del flujo de trabajo en habilidades. Las descripciones de habilidades se cargan en el contexto al inicio (limitadas a aproximadamente el 2% de tu ventana de contexto), asi que Claude sabe que habilidades existen y puede sugerirlas.',
      },
      {
        heading: 'Seguimiento de Costos e Insights',
        type: 'pro-tip',
        content:
          'Escribe /cost en una sesion para ver tu gasto de tokens. Muestra costo total, duracion de API, duracion real y cambios de codigo. Escribe /context para ver que esta consumiendo tu ventana de contexto. Escribe /model para cambiar de modelo a mitad de sesion.\n\nEl movimiento de poder es /insights. Genera un reporte HTML interactivo en ~/.claude/usage-data/report.html que analiza hasta 50 sesiones recientes. El reporte incluye un dashboard de estadisticas (conteos de sesiones, mensajes, duracion, tokens, commits de git, rachas de actividad, horas pico), graficos de actividad diaria, distribucion de uso de herramientas, desglose de lenguajes, puntos de friccion con ejemplos especificos y adiciones recomendadas para CLAUDE.md. Ejecuta tus transcripciones a traves de Haiku para extraccion de facetas y almacena en cache los resultados para que las ejecuciones posteriores sean rapidas. Si quieres entender como realmente usas Claude Code versus como crees que lo usas, /insights te muestra los datos.\n\nLa palanca de costo mas grande es la seleccion de modelo. Sonnet maneja la mayoria del trabajo diario. Opus es para arquitectura compleja y decisiones de juicio. Haiku funciona bien para subagentes haciendo tareas mecanicas. Usar Opus como predeterminado en todo es como contratar un arquitecto senior para pintar paredes.\n\nOtros reductores de costo: /clear entre tareas no relacionadas inicia una ventana de contexto fresca. Mueve instrucciones de flujo de trabajo de CLAUDE.md a habilidades para que solo se carguen cuando se invocan. Referencia rutas de archivo especificas en vez de pedirle a Claude que busque. Sesiones cortas y enfocadas superan a conversaciones maraton donde el contexto se acumula y los mensajes antiguos se comprimen.\n\nEl costo promedio ronda los $6 por desarrollador por dia. El 90% de los usuarios se mantiene por debajo de $12. Si estas por encima de eso, revisa que se esta cargando en cada sesion y muevelo a habilidades bajo demanda.',
      },
      {
        heading: 'Worktrees: Trabajo Paralelo Aislado',
        type: 'code',
        content:
          'Los worktrees te permiten ejecutar sesiones paralelas de Claude Code sin conflictos de archivos. Cada worktree obtiene su propia rama y directorio de trabajo mientras comparte el mismo historial de git.\n\nCrea uno con: claude -w feature-name\n\nEsto crea un worktree en .claude/worktrees/feature-name con una rama llamada worktree-feature-name. Inicia Claude en ese directorio y trabaja en lo que necesites. El arbol de trabajo principal permanece intacto.\n\nCuando sales, Claude pregunta si mantener o eliminar el worktree. Si no tuviste cambios, se limpia automaticamente. El comando /resume muestra sesiones de todos los worktrees en el mismo repo, asi que puedes cambiar entre trabajo paralelo facilmente.\n\nLos worktrees son buenos para experimentos aislados y ramas de funcionalidades. Para trabajo paralelo coordinado donde los agentes necesitan comunicarse entre si, los Agent Teams son la mejor herramienta. Los worktrees son carriles individuales. Los Teams son una flota coordinada.',
      },
    ],
  },

  /* ================================================================== */
  /*  MCP SERVERS                                                         */
  /* ================================================================== */

  {
    id: 'what-are-mcps',
    title: 'Que son los MCP?',
    subtitle: 'Model Context Protocol explicado - el puente entre la AI y tus herramientas',
    category: 'mcp-servers',
    description:
      'Que son los servidores Model Context Protocol, como funcionan y por que cambian todo sobre los flujos de trabajo asistidos por AI. El puente que convierte a Claude de un editor de codigo en un sistema operativo.',
    keywords: [
      'que son los servidores MCP',
      'model context protocol explicado',
      'tutorial MCP',
      'servidores MCP para principiantes',
      'que es MCP',
      'herramientas AI MCP',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'mcp-gtm-stack',
      'mcp-content-stack',
      'managing-mcp-servers',
      'mcp-cli-litmus-test',
    ],
    sections: [
      {
        heading: 'El Problema que Resuelven los MCP',
        type: 'prose',
        content:
          'Sin MCP, tu agente AI esta atrapado dentro del editor de codigo. Puede leer archivos, escribir codigo y ejecutar comandos de terminal. Eso es todo. No puede ver tus mensajes de Slack. No puede obtener leads de tu CRM. No puede enviar un borrador a tu plataforma de newsletters. No puede verificar tus analiticas de campanas. Cada vez que necesitas informacion de una herramienta externa, tienes que copiarla manualmente y pegarla en el chat. Ese es el problema. MCP es la solucion. Los servidores Model Context Protocol son puentes entre tu agente AI y tus herramientas de produccion. Cada servidor MCP se conecta a una herramienta externa y le da al agente un conjunto de acciones que puede realizar. Leer un canal de Slack. Exportar leads de HeyReach. Crear un borrador en Substack. Desplegar en Vercel. El agente ahora puede salir del editor e interactuar con el mundo real.',
      },
      {
        heading: 'Como Funcionan',
        type: 'pattern',
        content:
          'Un servidor MCP es un proceso pequeno que se ejecuta en segundo plano cuando tu IDE arranca. Se conecta a un servicio externo usando credenciales API que tu proporcionas. Expone un conjunto de herramientas (acciones) que el agente AI puede llamar.\n\nCuando le dices a Claude "revisa el canal de Slack del partner," Claude ve el servidor MCP de Slack en su lista de herramientas, llama a la herramienta apropiada (leer mensajes del canal) y obtiene los resultados de vuelta. Tu nunca interactuas con el servidor MCP directamente. Tu interactuas con Claude. Claude interactua con el servidor MCP. El servidor MCP interactua con Slack.\n\nPiensalo como darle manos a Claude. Sin MCP, Claude puede pensar y hablar. Con MCP, Claude puede extender la mano y hacer cosas en las herramientas que ya usas.',
      },
      {
        heading: 'El Patron de Configuracion',
        type: 'code',
        content:
          'Cada servidor MCP sigue el mismo patron de configuracion:\n\n1. Obtener una API key de la herramienta externa (token de bot de Slack, API key de HeyReach, etc.)\n2. Agregar una entrada de configuracion a tu archivo de configuracion MCP (.cursor/mcp.json para Cursor, ~/.claude/mcp.json para Claude Code)\n3. La configuracion especifica el nombre del servidor, el comando para iniciarlo y la API key como variable de entorno\n4. Reiniciar tu editor. El servidor arranca automaticamente.\n5. Pruebalo pidiendole a Claude que realice una accion con esa herramienta.\n\nEl formato de configuracion es JSON. Cada servidor obtiene un bloque con un comando (generalmente npx), argumentos (el nombre del paquete npm) y variables de entorno (tus API keys). Nunca hagas commit de este archivo a Git porque contiene secretos. Agregalo a .gitignore.',
      },
      {
        heading: 'Comienza con Dos o Tres',
        type: 'pro-tip',
        content:
          'No instales 15 servidores MCP el primer dia. Cada servidor agrega tiempo de arranque y consume recursos. Comienza con las dos o tres herramientas que mas usas. Si ejecutas campanas de outbound, comienza con tu herramienta de outreach (Instantly o HeyReach) y Slack. Si publicas contenido, comienza con tu plataforma de publicacion (Typefully o Substack) y tu herramienta de analiticas.\n\nConstruye flujos de trabajo alrededor de esos primeros MCP. Acostumbrate al patron de decirle a Claude que interactue con herramientas externas. Luego agrega mas a medida que tus flujos de trabajo lo demanden. Mi configuracion crecio organicamente. Empece con GitHub y Slack. Luego agregue HeyReach. Luego Substack. Luego Browserbase. Cada uno fue agregado porque un flujo de trabajo especifico lo necesitaba, no porque estuviera coleccionando servidores.',
      },
    ],
  },

  {
    id: 'mcp-gtm-stack',
    title: 'MCP para el Stack GTM',
    subtitle: 'Conecta tus herramientas de outbound, CRM e ingresos a tu agente AI',
    category: 'mcp-servers',
    description:
      'Como configurar servidores MCP para flujos de trabajo go-to-market. Instantly para email, HeyReach para LinkedIn, Slack para comunicaciones, Google Sheets para datos y Firecrawl para enriquecimiento.',
    keywords: [
      'MCP stack GTM',
      'herramientas MCP outbound',
      'herramientas MCP ventas',
      'MCP instantly',
      'MCP heyreach',
      'MCP operaciones de ingresos',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'what-are-mcps',
      'mcp-content-stack',
      'managing-mcp-servers',
      'mcp-cli-litmus-test',
    ],
    sections: [
      {
        heading: 'El Stack MCP de GTM',
        type: 'prose',
        content:
          'Si ejecutas pipeline, outbound u operaciones de ingresos, tu stack MCP central conecta tus herramientas de campana a tu agente AI. El objetivo es cero cambio de pestanas. En vez de saltar entre Instantly, HeyReach, Slack y Sheets para verificar el estado de las campanas, le preguntas a Claude. Claude extrae los datos, los analiza y te da un resumen. El stack GTM no se trata de conectar todo. Se trata de conectar las herramientas que estan en tu ciclo de trabajo diario: las que revisas repetidamente, de las que exportas manualmente y entre las que copias y pegas.',
      },
      {
        heading: 'Instantly: Campanas de Email',
        type: 'pattern',
        content:
          'Instantly gestiona secuencias de email, entregabilidad y calentamiento de dominios. El servidor MCP permite a Claude verificar analiticas de campanas, extraer listas de respuestas, gestionar leads y monitorear puntuaciones de entregabilidad sin abrir el dashboard de Instantly.\n\nConfiguracion: Obtener tu API key de la configuracion de Instantly. Agregarla a tu configuracion MCP. El servidor expone herramientas para listar campanas, obtener analiticas y gestionar leads.\n\nFlujo de trabajo real: /instantlyreplies_acme extrae todas las respuestas de la campana de Acme, las guarda en la carpeta de recursos del partner y marca las respuestas positivas para seguimiento. Cero exportacion manual. Cero descargas de CSV. Claude lee las respuestas y las categoriza.',
      },
      {
        heading: 'HeyReach: Automatizacion de LinkedIn',
        type: 'pattern',
        content:
          'HeyReach gestiona solicitudes de conexion en LinkedIn, secuencias de mensajes y analiticas de campanas. El servidor MCP permite a Claude exportar conexiones aceptadas, extraer estadisticas de campanas y verificar el estado de los mensajes.\n\nConfiguracion: API key del dashboard de HeyReach. Servidor MCP basado en HTTP.\n\nFlujo de trabajo real: /heyreach-export accepted exporta todas las conexiones aceptadas de una campana como CSV. /heyreach-conversations extrae el historial completo de mensajes de LinkedIn para conexiones aceptadas. El flujo de traspaso exporta tanto leads aceptados como no aceptados, ejecuta investigacion profunda en los aceptados y enruta todo al responsable con una notificacion de Slack.',
      },
      {
        heading: 'Slack, Sheets y Firecrawl',
        type: 'pattern',
        content:
          'El MCP de Slack lee canales, envia mensajes y busca en el historial. Esencial para comunicaciones con partners. La habilidad /slacksync extrae el historial completo del canal y extrae elementos de accion, decisiones y entregables en un archivo markdown estructurado.\n\nEl MCP de Google Sheets lee y escribe hojas de calculo. Conecta tu repo con datos del equipo. Envia resultados de enriquecimiento a una hoja compartida. Extrae listas de leads para configuracion de campanas.\n\nEl MCP de Firecrawl scrapea sitios web como markdown limpio. Critico para flujos de enriquecimiento. Extrae el sitio web de un prospecto, identifica posicionamiento, detecta puntos de dolor. Claude procesa el HTML crudo en datos estructurados que tus prompts de calificacion pueden usar.\n\nCada uno de estos sirve un proposito especifico en el ciclo GTM: Slack para comunicacion, Sheets para datos compartidos, Firecrawl para investigacion.',
      },
      {
        heading: 'El Ciclo Completo',
        type: 'formula',
        content:
          'El stack MCP de GTM crea un ciclo cerrado. Firecrawl scrapea sitios web de prospectos para investigacion. La investigacion alimenta los prompts de calificacion de Clay. Los leads calificados se enrutan a Instantly (email) o HeyReach (LinkedIn). Los datos de respuesta fluyen de vuelta a traves del MCP. Las notificaciones de Slack alertan al equipo. Sheets rastrea el pipeline.\n\nCada paso en este ciclo solia requerir trabajo manual: exportar, descargar, subir, copiar, pegar. Con MCP, Claude maneja el movimiento de datos. Tu manejas la estrategia y las conversaciones. El stack MCP no reemplaza tu juicio. Reemplaza el trabajo tedioso entre tus decisiones de juicio.',
      },
    ],
  },

  {
    id: 'mcp-content-stack',
    title: 'MCP para el Stack de Contenido',
    subtitle: 'Conecta tus herramientas de publicacion, programacion y distribucion',
    category: 'mcp-servers',
    description:
      'Como configurar servidores MCP para flujos de trabajo de creacion de contenido. Typefully para programacion social, Substack para newsletters, ElevenLabs para audio y Notion para sincronizacion de conocimiento.',
    keywords: [
      'MCP stack de contenido',
      'MCP typefully',
      'MCP substack',
      'MCP creacion de contenido',
      'MCP ElevenLabs',
      'MCP flujo de trabajo de contenido',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'what-are-mcps',
      'mcp-gtm-stack',
      'managing-mcp-servers',
    ],
    sections: [
      {
        heading: 'El Stack MCP de Contenido',
        type: 'prose',
        content:
          'Si publicas contenido en multiples plataformas, tu stack MCP conecta tu repo con tus herramientas de publicacion. El objetivo es de borrador a publicado sin salir del IDE. Escribe un post en markdown. Finalizalo con una habilidad. Envialo a la plataforma. Todo desde la misma sesion de terminal. Sin cambiar pestanas. Sin copiar y pegar. Sin reformatear para cada plataforma. El stack MCP de contenido convierte tu repo en un pipeline de publicacion.',
      },
      {
        heading: 'Typefully: Publicacion Social',
        type: 'pattern',
        content:
          'Typefully programa y publica posts en LinkedIn y X. El servidor MCP permite a Claude enviar borradores finalizados directamente a tu cola de Typefully.\n\nEl flujo de trabajo: escribe un post de LinkedIn en content/drafts/. Ejecuta /finalcopy para normalizar la voz, limpiar el formato y producir texto listo para la plataforma. La habilidad envia la copia final a Typefully como borrador. Lo revisas en el editor de Typefully y lo programas.\n\nEsto elimina el paso de copiar y pegar entre tu repo y tu cola de publicacion. El borrador va de markdown a post programado en un comando. La normalizacion de voz, el formato de plataforma y la colocacion en cola suceden automaticamente.',
      },
      {
        heading: 'Substack: Publicacion de Newsletters',
        type: 'pattern',
        content:
          'El MCP de Substack crea borradores de posts en tu publicacion de Substack. La habilidad /finalsubstack normaliza la voz, extrae contenido publicable, lo guarda localmente y crea el borrador en Substack.\n\nEl flujo de trabajo: escribe un borrador de newsletter en content/substack/drafts/. Itera con Claude hasta que suene bien. Ejecuta /finalsubstack. Claude formatea el post, crea el borrador en Substack y genera fragmentos de promocion cruzada para LinkedIn y X. Abres Substack, revisas el borrador, agregas imagenes si es necesario y publicas.\n\nEl MCP maneja todo el traspaso. Nunca copias 2,000 palabras de tu editor al editor web de Substack. Claude lo hace. Y porque la habilidad tambien genera fragmentos de promocion cruzada, tu plan de distribucion esta listo antes de que el post se publique.',
      },
      {
        heading: 'ElevenLabs y Notion',
        type: 'pattern',
        content:
          'El MCP de ElevenLabs genera audio a partir de texto. Convierte un post de blog en una locuccion. Crea narracion para TikTok a partir de un guion. Genera pruebas de voz para diferentes perfiles de personaje. El MCP maneja texto a voz, clonacion de voz y aislamiento de audio sin salir del IDE.\n\nEl MCP de Notion sincroniza contenido del repo a una base de conocimiento de Notion. La habilidad /notionsync envia habilidades, flujos de trabajo e indices de contenido a paginas de Notion para que tu equipo o audiencia pueda navegarlos en una interfaz visual. El repo sigue siendo la fuente de verdad. Notion es la capa de presentacion.\n\nAmbos sirven el mismo proposito: extender tu contenido mas alla de archivos markdown. ElevenLabs convierte texto en audio. Notion convierte texto en paginas visuales. El repo es el motor. Los MCP son los canales de salida.',
      },
      {
        heading: 'El Pipeline de Contenido',
        type: 'formula',
        content:
          'El stack MCP de contenido crea un pipeline: Idea > Borrador > Finalizar > Publicar > Distribuir.\n\nCaptura de ideas: /ideabank estaciona ideas con etiquetas y referencias cruzadas.\nBorrador: escribe en content/drafts/ con asistencia de Claude y aplicacion de la guia de voz.\nFinalizar: /finalcopy o /finalsubstack normaliza la voz, formatea para la plataforma y envia a la herramienta de publicacion.\nPublicar: revisa en el editor de la plataforma, programa o publica.\nDistribuir: fragmentos de promocion cruzada se auto-generan para otras plataformas.\n\nCada paso en este pipeline solia ser un traspaso manual. Abrir una nueva pestana. Copiar el texto. Reformatearlo. Pegarlo. Programarlo. Con MCP, los traspasos estan automatizados. Tu te enfocas en la escritura y la estrategia. El pipeline maneja la mecanica.',
      },
    ],
  },

  {
    id: 'managing-mcp-servers',
    title: 'Gestion de Servidores MCP',
    subtitle: 'Agregar, depurar, actualizar y organizar tus configuraciones de servidores MCP',
    category: 'mcp-servers',
    description:
      'Como gestionar configuraciones de servidores MCP en Cursor y Claude Code. Agregar nuevos servidores, depurar problemas de conexion, rotar API keys y mantener tu configuracion limpia.',
    keywords: [
      'gestionar servidores MCP',
      'configuracion servidores MCP',
      'depuracion MCP',
      'API keys MCP',
      'gestion servidores MCP',
      'solucion de problemas MCP',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'what-are-mcps',
      'mcp-gtm-stack',
      'mcp-content-stack',
    ],
    sections: [
      {
        heading: 'Donde Viven las Configuraciones',
        type: 'code',
        content:
          'Las configuraciones de servidores MCP viven en archivos JSON. La ubicacion depende de tu herramienta:\n\nCursor (nivel de proyecto): .cursor/mcp.json en la raiz de tu proyecto\nCursor (global): ~/.cursor/mcp.json en tu directorio home\nClaude Code: ~/.claude/mcp.json o a nivel de proyecto .claude/mcp.json\n\nLas configuraciones a nivel de proyecto sobreescriben las configuraciones globales. Usa configuraciones globales para servidores que necesitas en cada proyecto (GitHub, Slack). Usa configuraciones a nivel de proyecto para servidores especificos de un proyecto.\n\nAmbos archivos comparten el mismo formato: un objeto JSON con una clave "mcpServers" que contiene un bloque por servidor. Cada bloque tiene un "command" (como iniciar el servidor), "args" (argumentos para el comando) y "env" (variables de entorno, generalmente API keys).',
      },
      {
        heading: 'Agregar un Nuevo Servidor',
        type: 'pattern',
        content:
          'La habilidad /addmcp automatiza esto, pero entender el proceso manual ayuda cuando las cosas se rompen.\n\n1. Encuentra el paquete npm para el servidor MCP. La mayoria se publican en npm con nombres como @company/mcp-server o mcp-server-toolname.\n2. Obtener la API key de la configuracion o dashboard de la herramienta.\n3. Agregar un nuevo bloque a tu mcp.json con el nombre del servidor, command (generalmente "npx"), args (el nombre del paquete con la bandera "-y") y env (tu API key).\n4. Reiniciar tu editor para que tome la nueva configuracion.\n5. Probar pidiendole a Claude que use la herramienta. "Lista mis canales de Slack" o "Muestra mis campanas de HeyReach."\n\nSi la prueba falla, el problema es casi siempre la API key (incorrecta o expirada) o el nombre del paquete (error tipografico o version incorrecta).',
      },
      {
        heading: 'Depuracion de Problemas de Conexion',
        type: 'pro-tip',
        content:
          'Cuando un servidor MCP deja de funcionar, verifica estas cosas en orden:\n\n1. API key: Ha expirado? La rotaste? Verifica el dashboard de la herramienta.\n2. Sintaxis de configuracion: El JSON es valido? Una coma o corchete faltante rompe todo el archivo de configuracion, no solo un servidor.\n3. Disponibilidad del paquete: Puedes ejecutar el comando npx manualmente en la terminal? Si falla ahi, falla en el IDE tambien.\n4. Red: El servicio externo esta funcionando? Verifica la pagina de estado de la herramienta.\n5. Limites de tasa: Llegaste al limite de tasa de la API? Algunos servicios limitan despues de muchas solicitudes. Agrega retrasos entre llamadas o reduce tamanos de lote.\n\nEl problema mas comun por lejos son las API keys expiradas. Si un servidor funcionaba ayer y falla hoy, verifica la key primero. Ahorrate 20 minutos de depuracion empezando por lo obvio.',
      },
      {
        heading: 'Mantener las Configuraciones Limpias',
        type: 'anti-pattern',
        content:
          'No agregues servidores MCP que no uses activamente. Cada servidor agrega tiempo de arranque. Algunos servidores ejecutan procesos en segundo plano que consumen memoria. Si no estas usando el MCP de Figma a diario, eliminalo. Siempre puedes volver a agregarlo en 30 segundos.\n\nNo hardcodees API keys en archivos que se hagan commit. El archivo mcp.json deberia estar en tu .gitignore. Si compartes un proyecto con colaboradores, crea un mcp.json.example con valores de marcador de posicion y agrega el mcp.json real a .gitignore.\n\nNo instales cada servidor MCP de una lista de "los 50 mejores servidores MCP". Instala los que eliminen friccion de flujos de trabajo que ya haces. El valor de un servidor MCP se mide por cuantos pasos manuales elimina de tu proceso diario. Cero pasos manuales eliminados significa cero valor, sin importar que tan genial sea la herramienta.',
      },
    ],
  },

  /* ================================================================== */
  /*  COST EFFICIENCY                                                     */
  /* ================================================================== */

  {
    id: 'model-selection-strategy',
    title: 'Estrategia de Seleccion de Modelos',
    subtitle: 'Empareja el modelo con la tarea - deja de sobrepagar por trabajo simple',
    category: 'cost-efficiency',
    description:
      'Como elegir entre modelos AI segun la complejidad de la tarea y el costo. Cuando usar modelos rapidos vs modelos capaces. El marco para maximizar la calidad del resultado mientras se minimiza el gasto.',
    keywords: [
      'seleccion de modelo AI',
      'costo de modelos claude',
      'opus vs sonnet',
      'estrategia de modelo AI',
      'elegir modelo AI por tarea',
      'optimizacion de costos seleccion de modelo',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'credit-management',
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'should-you-get-clay',
    ],
    sections: [
      {
        heading: 'El Principio Central',
        type: 'prose',
        content:
          'No toda tarea necesita el modelo mas capaz. Usar un modelo capaz (tier Opus) en una tarea simple de reformateo es como contratar un arquitecto senior para pintar una pared. Usar un modelo rapido (tier Sonnet) en una decision de arquitectura compleja es como contratar un pasante junior para disenar el edificio. El principio central: empareja el modelo con la tarea. Las tareas simples obtienen modelos rapidos. Las tareas complejas obtienen modelos capaces. Todo lo que esta entre medio es una decision de juicio, y el marco a continuacion te ayuda a tomarla.',
      },
      {
        heading: 'El Marco de Emparejamiento',
        type: 'pattern',
        content:
          'Los modelos rapidos funcionan para: reformatear contenido, escanear archivos, ediciones de codigo simples, tareas de copiar-pegar-y-adaptar, transformaciones de datos directas, construir paginas que reflejen patrones existentes. Estas tareas tienen entradas claras, salidas claras y baja ambiguedad.\n\nLos modelos capaces funcionan para: decisiones de arquitectura, depuracion compleja, escritura creativa con voz matizada, cadenas de razonamiento multi-paso, sintesis de investigacion y cualquier cosa donde el agente necesite hacer juicios. Estas tareas tienen ambiguedad, compensaciones y requieren que el modelo piense profundamente.\n\nLa linea divisoria: esta tarea requiere juicio o es mecanica? Las tareas de juicio obtienen el modelo capaz. Las tareas mecanicas obtienen el modelo rapido. Si no estas seguro, empieza con el modelo rapido. Si la salida es mala, escala. Es mas barato probar rapido y actualizar que usar el costoso como predeterminado para todo.',
      },
      {
        heading: 'Seleccion de Modelo para Agentes Paralelos',
        type: 'pro-tip',
        content:
          'Al ejecutar agentes paralelos, asigna modelos por tarea. El agente orquestador usa el modelo capaz porque necesita razonar sobre dependencias, contexto y secuenciacion. Los sub-agentes que hacen trabajo directo (reflejar una pagina existente, actualizar una configuracion, ejecutar una verificacion de build) usan modelos rapidos. Los sub-agentes que hacen trabajo creativo pesado (escribir 17 entradas de wiki, arquitectar una nueva funcionalidad) usan el modelo capaz.\n\nEsto no se trata de ser tacano. Se trata de ser eficiente. Un modelo rapido que completa en 30 segundos una tarea simple es mejor que un modelo capaz que toma 2 minutos en la misma tarea con calidad identica. La velocidad se acumula en agentes paralelos. Cinco agentes rapidos en tareas simples terminan antes que un agente capaz en las mismas cinco tareas.',
      },
      {
        heading: 'El Metodo de Seguimiento Diario',
        type: 'formula',
        content:
          'Rastrea tu uso de modelos durante una semana. Al final de cada dia, anota que tareas usaron que modelo y si la calidad del resultado fue suficiente. Busca dos patrones:\n\n1. Sesiones de modelo capaz donde un modelo rapido habria producido la misma calidad. Estos son sobregastos. Cambia esos tipos de tareas a modelos rapidos.\n2. Sesiones de modelo rapido donde la salida fue mala y tuviste que rehacer el trabajo. Estos son falsa economia. Cambia esos tipos de tareas a modelos capaces.\n\nDespues de una semana, tendras un mapa claro de que tareas necesitan que modelo. Aplica ese mapa en adelante. Revisitalo trimestralmente a medida que los modelos mejoran (el modelo capaz de hoy se convierte en el modelo rapido de manana).',
      },
    ],
  },

  {
    id: 'credit-management',
    title: 'Gestion de Creditos y Tokens',
    subtitle: 'Entiende que estas gastando y a donde van los tokens',
    category: 'cost-efficiency',
    description:
      'Como gestionar creditos y tokens de AI en Cursor, Claude Code y uso de API. Entender que cuesta dinero, a donde van los tokens y estrategias practicas para maximizar tu presupuesto.',
    keywords: [
      'gestion de creditos AI',
      'costo de tokens claude',
      'creditos cursor',
      'presupuesto de tokens AI',
      'costo de claude code',
      'gestionar gasto AI',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'model-selection-strategy',
      'parallel-agent-patterns',
      'rules-skills-context',
      'credit-transparency-gtm-tools',
    ],
    sections: [
      {
        heading: 'Que Cuesta Dinero',
        type: 'prose',
        content:
          'Cada interaccion con AI cuesta tokens. Los tokens son aproximadamente cuatro caracteres de texto. Cada archivo que Claude lee cuesta tokens (entrada). Cada respuesta que Claude genera cuesta tokens (salida). Cada llamada a herramienta que Claude hace cuesta tokens (entrada y salida). La ventana de contexto es el presupuesto total de tokens para una sola interaccion. Archivos que cargas, historial de chat, reglas, habilidades, instrucciones del sistema - todo compite por tokens. Entender esto cambia como interactuas con AI. Historiales de chat largos queman tokens en contexto que podria no ser relevante. Cargar 10 archivos cuando necesitas 2 desperdicia tokens en contexto irrelevante. Un CLAUDE.md de 500 lineas consume tokens en cada sesion.',
      },
      {
        heading: 'A Donde Van los Tokens',
        type: 'pattern',
        content:
          'Instrucciones del sistema y configuracion: CLAUDE.md, reglas, archivos de habilidades que se cargan automaticamente. Este es tu costo base por sesion.\n\nLectura de archivos: cada archivo que el agente lee para entender tu base de codigo. Archivos mas grandes cuestan mas. Leer un archivo de datos de 2,000 lineas cuesta mas que leer una configuracion de 50 lineas.\n\nHistorial de chat: cada mensaje anterior en la conversacion. Las conversaciones largas acumulan contexto. Eventualmente la ventana de contexto se llena y los mensajes antiguos se truncan.\n\nSalida del agente: generacion de codigo, explicaciones, llamadas a herramientas. Salidas mas largas cuestan mas tokens.\n\nLos mayores consumidores de tokens generalmente son las lecturas de archivos (cargar archivos grandes) y el historial de chat (conversaciones largas). Manten los archivos enfocados e inicia nuevas sesiones para nuevas tareas en vez de continuar una sola sesion durante horas.',
      },
      {
        heading: 'Estrategias Practicas',
        type: 'pro-tip',
        content:
          'Inicia nuevas sesiones para nuevas tareas. Una sesion sobre desplegar tu sitio web no necesita el historial de chat de tu sesion anterior sobre escribir un post de blog. Contexto fresco significa menos tokens desperdiciados.\n\nManten CLAUDE.md conciso. Cada linea en CLAUDE.md cuesta tokens en cada sesion. Mueve instrucciones de flujo de trabajo a habilidades (cargadas bajo demanda) y patrones de archivos a reglas (cargadas condicionalmente).\n\nReferencia archivos especificos en vez de pedirle a Claude que busque. Decir "lee website/packages/shared/data/clay-wiki.ts" cuesta menos que decir "encuentra el archivo de datos del clay wiki" porque la busqueda requiere leer multiples archivos.\n\nUsa modelos rapidos para tareas simples. Los modelos rapidos cuestan aproximadamente 3-5x menos por token que los modelos capaces. Si la tarea es mecanica, el modelo mas barato produce resultados identicos.',
      },
      {
        heading: 'El 80/20 del Presupuesto de Tokens',
        type: 'formula',
        content:
          'El ochenta por ciento de tu presupuesto de tokens va a tres cosas: lectura de archivos, historial de chat y contexto del sistema. Optimizar esas tres es el movimiento de mayor impacto.\n\nLectura de archivos: se especifico sobre que archivos cargar. No digas "lee toda la carpeta de datos." Di "lee how-to-wiki.ts."\n\nHistorial de chat: inicia sesiones frescas para nuevos temas. Una sesion enfocada supera a una sesion maraton.\n\nContexto del sistema: manten el contexto que siempre se carga (CLAUDE.md, reglas automaticas) al minimo. Mueve todo lo demas a carga bajo demanda (habilidades, referencias manuales de archivos).\n\nEl 20% restante es la salida del agente. No puedes controlar cuantos tokens usa Claude para generar una respuesta, pero puedes controlar cuanto contexto tiene que procesar antes de generar. Menos contexto irrelevante significa salida mas rapida, mas barata y a menudo mejor.',
      },
    ],
  },
  {
    id: 'nio-workspace-knowledge-graph-example',
    title: 'Grafo de Conocimiento del Workspace Nio (Ejemplo en Vivo)',
    subtitle: 'Workspace de produccion real que muestra como 7 archivos principales + 42 skills crean una capa de operaciones de IA',
    category: 'cli-tools',
    description:
      'Ejemplo en vivo de un grafo de conocimiento OpenClaw en produccion de febrero de 2026. Muestra la estructura de archivos real, la secuencia de arranque y las relaciones que impulsan la capa de operaciones de IA de Nio. Usa esto como plantilla para tu propia configuracion avanzada.',
    keywords: [
      'ejemplo de workspace nio',
      'ejemplo de grafo de conocimiento openclaw',
      'ejemplo de configuracion de IA en produccion',
      'estructura de archivos nio',
      'ejemplo de workspace de operaciones de IA',
      'ejemplo de produccion openclaw',
      'plantilla de grafo de conocimiento',
      'arquitectura del sistema nio',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'openclaw-setup',
      'repo-context-engine',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'El Grafo de Conocimiento (Visual)',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">Este es el mapa de relaciones real entre cada archivo en el workspace de Nio a fecha de 21 de febrero de 2026. Cada flecha es una referencia real. Cada caja es un archivo real.</p>' +
          '<pre style="font-family:var(--font-mono);font-size:12px;line-height:1.5;color:#e2e8f0;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:24px;overflow-x:auto;white-space:pre">' +
          '                              ┌─────────────┐\n' +
          '                              │  AGENTS.md  │ ← BOOT CONTROLLER\n' +
          '                              │ (boot seq)  │\n' +
          '                              └──────┬──────┘\n' +
          '                                     │\n' +
          '                    boot order: 1→2→3→4→5→6 (+7 main only)\n' +
          '                                     │\n' +
          '          ┌──────────┬───────────┬────┼───┬──────────┬──────────┐\n' +
          '          ▼          ▼           ▼    ▼   ▼          ▼          ▼\n' +
          '     ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐\n' +
          '     │ SOUL.md │ │IDENTITY  │ │USER.md │ │BRAIN.md │ │HEART   │ │VOICE.md │\n' +
          '     │  (1)    │ │  .md (2) │ │  (3)   │ │  (4)    │ │BEAT(5) │ │  (6)    │\n' +
          '     └────┬────┘ └──────────┘ └───┬────┘ └────┬────┘ └────────┘ └────┬────┘\n' +
          '          │                       │            │                      │\n' +
          '          │ voice DNA,            │            │ "if empty,           │ distilled from\n' +
          '          │ model routing,        │ refs       │  read HEARTBEAT"     │\n' +
          '          │ blog structure        ▼            │                      ▼\n' +
          '          │                 ┌──────────┐       │        ┌──────────────────────┐\n' +
          '          │                 │CLIENTS.md│       │        │skills/tier-1-voice-  │\n' +
          '          │                 └─────┬────┘       │        │dna/core-voice.md     │\n' +
          '          │                       │            │        │    + anti-slop.md     │\n' +
          '          ▼                       ▼            │        └──────────────────────┘\n' +
          '  ┌───────────────┐    5 client SKILL.md       │\n' +
          '  │skills/tier-1  │    directories              │              ┌──────────┐\n' +
          '  │  voice-dna/   │◄───────────────────────────────────────── │MEMORY.md │\n' +
          '  │skills/tier-3  │                             │              │  (7)     │\n' +
          '  │  pillars/     │                             │              │main only │\n' +
          '  └───────────────┘                             │              └──────────┘\n' +
          '                                                │\n' +
          '          ┌─────────────────────────────────────┘\n' +
          '          │\n' +
          '          │          ┌──────────────┐         ┌──────────────┐\n' +
          '          │          │  TOOLS.md    │────────▶│MISSION-      │\n' +
          '          │          │ (infra map)  │         │CONTROL.md    │\n' +
          '          │          └──────┬───────┘         └──────┬───────┘\n' +
          '          │                 │                        │\n' +
          '          │     ┌───────────┼────────────┐           │ THE PIPELINE\n' +
          '          │     ▼           ▼            ▼           ▼\n' +
          '          │  Discord    WhatsApp     9 MCP      ┌────────────────────────┐\n' +
          '          │  channel    +1347..      tools      │ 4 scripts (in order): │\n' +
          '          │  1474..                              │ 1. updater.py → /tmp/ │\n' +
          '          │                                     │ 2. gen-dashboard.js   │\n' +
          '          │                                     │ 3. gen-metrics.js     │\n' +
          '          │                                     │ 4. validate.js        │\n' +
          '          │                                     └─────────┬──────────────┘\n' +
          '          │                                               │\n' +
          '          │                                               ▼\n' +
          '          │                                     6 output files:\n' +
          '          │                                     metrics.json, tasks,\n' +
          '          │                                     calendar, memories,\n' +
          '          │                                     team, status\n' +
          '          │\n' +
          '          ▼\n' +
          '   ┌──────────────┐\n' +
          '   │ PLAYBOOK.md  │──────────────────────────────────────────┐\n' +
          '   │  (decisions) │                                          │\n' +
          '   └──────┬───────┘                                          │\n' +
          '          │ references:                                      │\n' +
          '          ├──▶ SOUL.md (blog structure)                      │\n' +
          '          ├──▶ VOICE.md (anti-slop)                          │\n' +
          '          ├──▶ MISSION-CONTROL.md (pipeline)                 │\n' +
          '          │                                                  │\n' +
          '          ▼                                                  ▼\n' +
          '   ┌──────────────────────────────────────────────────────────────┐\n' +
          '   │                    skills/ (4 SKILL.md)                      │\n' +
          '   ├─────────────────┬────────────────┬──────────────┬───────────┤\n' +
          '   │ blog-pipeline/  │ website-ops/   │content-      │ cron-ops/ │\n' +
          '   │                 │                │pipeline/     │           │\n' +
          '   │ refs:           │ refs:          │ refs:        │ refs:     │\n' +
          '   │ • SOUL.md       │ • MISSION-     │ • VOICE.md   │ • jobs   │\n' +
          '   │ • VOICE.md      │   CONTROL.md   │ • Typefully  │   .json  │\n' +
          '   │ • Discord ch    │ • 5 apps       │ • Substack   │ • 3 on   │\n' +
          '   │ • nio-blog/     │ • shared pkg   │ • pillars/   │ • 8 off  │\n' +
          '   └─────────────────┴────────────────┴──────────────┴───────────┘\n' +
          '</pre>' +
          '<p style="margin-top:16px;font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">Flujo de arranque:</strong> AGENTS carga 7 archivos (~3,125 tokens) -> Nio tiene identidad completa, contexto y voz. TOOLS, PLAYBOOK, MISSION-CONTROL, CLIENTS y skills se cargan bajo demanda cuando se necesitan para una tarea especifica.</p>',
      },
      {
        heading: 'Secuencia de Arranque: Que se Carga y Por Que',
        type: 'code',
        content:
          '<p style="margin-bottom:16px">AGENTS.md es el controlador de arranque. Carga 7 archivos en orden, en cada sesion. Costo total: ~3,125 tokens (aproximadamente el 12% de la ventana de contexto).</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Orden</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Archivo</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Proposito</th>' +
          '<th style="text-align:right;padding:8px 12px;color:#e2e8f0">Tokens</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">1</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">SOUL.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Identidad principal, voice DNA, reglas de decision, enrutamiento de modelos, estructura de blog</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~952</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">2</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">IDENTITY.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Definicion de rol, restricciones de personalidad, rutas de avatar</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~161</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">3</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">USER.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Quien es Shawn, preferencias, cosas que le molestan, vision general del sistema</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~283</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">4</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">BRAIN.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Bloc de notas de sesion en vivo. Si esta vacio, recurrir a HEARTBEAT.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~44</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">5</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">HEARTBEAT.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">TODOs activos, chequeos rotativos, reglas de silencio</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~244</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">6</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">VOICE.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Restricciones de entrega destiladas del voice DNA de tier-1</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~380</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#facc15">7</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">MEMORY.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Memoria curada a largo plazo. <em>Solo sesion principal</em></td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~774</td>' +
          '</tr>' +
          '</table>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">Como se conectan los archivos:</strong> SOUL.md establece el comportamiento. VOICE.md aplica las reglas de entrega. USER.md ancla al humano. MEMORY.md ancla la continuidad. HEARTBEAT.md previene la deriva forzando una verificacion de lo que esta realmente activo. BRAIN.md mantiene el estado temporal para que no contamine la memoria a largo plazo.</p>',
      },
      {
        heading: 'Infraestructura e Integracion del Pipeline',
        type: 'code',
        content:
          '<p style="margin-bottom:16px">Este workspace no es solo notas. Esta conectado a infraestructura real.</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Canales de Mensajeria</h4>' +
          '<ul style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><strong style="color:#e2e8f0">Discord:</strong> canal 1474174694025330919 (nio-terminal)</li>' +
          '<li><strong style="color:#e2e8f0">WhatsApp:</strong> +13474520467</li>' +
          '</ul>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Herramientas MCP (9 via OpenClaw)</h4>' +
          '<p style="color:#8b949e;margin-bottom:16px">Typefully (programacion social) · GitHub (operaciones de repo/PR) · Slack x2 (lead-alchemy + revpartners) · Firecrawl (web scraping) · Reddit (navegacion) · HeyReach (outreach) · ElevenLabs (TTS) · Substack (newsletters) · Browserbase (automatizacion de navegador)</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Pipeline de Datos de Mission Control</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">Estos 4 scripts se ejecutan en secuencia. Los 4 deben completarse. Saltarse cualquier paso produce datos incompletos.</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><code style="color:#79c0ff">mission_control_updater.py</code> → escribe /tmp/mission_control_enhanced.json</li>' +
          '<li><code style="color:#79c0ff">generate-dashboard-data.js</code> → escribe 5 archivos en public/data/</li>' +
          '<li><code style="color:#79c0ff">generate-metrics.js</code> → escribe public/metrics.json</li>' +
          '<li><code style="color:#79c0ff">validate-mission-control-data.js</code> → valida los 6 archivos de salida</li>' +
          '</ol>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Artefactos de Salida (6 archivos que lee Mission Control)</h4>' +
          '<p style="color:#8b949e">metrics.json · tasks.json · calendar.json · memories.json · team.json · status.json</p>',
      },
      {
        heading: 'Arquitectura de Skills y Flujo de Decisiones',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">Los skills son la capa de ejecucion. Los playbooks son la capa de decisiones. Se conectan a traves de referencias compartidas.</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Capa de Decisiones: PLAYBOOK.md</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">La central de conmutacion. Dirige hacia las reglas relevantes para la tarea actual:</p>' +
          '<ul style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li>SOUL.md para la estructura de blog y restricciones de comportamiento</li>' +
          '<li>VOICE.md para la aplicacion de reglas anti-slop</li>' +
          '<li>MISSION-CONTROL.md para el pipeline del dashboard</li>' +
          '</ul>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Capa de Ejecucion: 4 Skills del Workspace</h4>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Skill</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Referencias</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">blog-pipeline/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">SOUL.md, VOICE.md, canal de Discord, nio-blog/</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">website-ops/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">MISSION-CONTROL.md, 5 apps, paquetes compartidos</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">content-pipeline/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">VOICE.md, Typefully, Substack, pilares de contenido</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#60a5fa">cron-ops/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">jobs.json (3 habilitados, 8 deshabilitados)</td>' +
          '</tr>' +
          '</table>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">Nota de limpieza:</strong> archivos de flujo de trabajo antiguos y puntuales se eliminaron (WORKFLOW_AUTO.md, mission-control-status.md). El sistema converge hacia menos fuentes de verdad, pero mas precisas.</p>',
      },
      {
        heading: 'Enrutamiento de Modelos y Cadena de Respaldo',
        type: 'pro-tip',
        content:
          '<p style="margin-bottom:16px">Diferentes tareas se enrutan a diferentes modelos segun el costo y la capacidad. Si el modelo principal alcanza un limite de tasa o tope de facturacion, el sistema recorre la cadena automaticamente.</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Tarea</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Modelo</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Por que</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Chat / operaciones rapidas</td>' +
          '<td style="padding:8px 12px;color:#4ade80">GPT-5.2</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Gratis via OAuth</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Creacion de contenido</td>' +
          '<td style="padding:8px 12px;color:#c084fc">Opus</td>' +
          '<td style="padding:8px 12px;color:#8b949e">No negociable para la calidad</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Crons de alta frecuencia</td>' +
          '<td style="padding:8px 12px;color:#facc15">Qwen 2.5 14B (local)</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Gratis, corre en Ollama</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Codigo / razonamiento</td>' +
          '<td style="padding:8px 12px;color:#60a5fa">Sonnet → Opus</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Escalamiento eficiente en costo</td>' +
          '</tr>' +
          '</table>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Cadena de Respaldo Automatica</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">Si el modelo principal falla (limite de tasa, facturacion, timeout), OpenClaw recorre la cadena automaticamente:</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><strong style="color:#c084fc">Opus</strong> (primario, Anthropic API)</li>' +
          '<li><strong style="color:#60a5fa">Sonnet</strong> (mismo proveedor, nivel mas economico)</li>' +
          '<li><strong style="color:#4ade80">GPT-5.3-codex</strong> (OAuth gratuito, razonamiento mas fuerte de OpenAI)</li>' +
          '<li><strong style="color:#4ade80">GPT-5.2</strong> (OAuth gratuito, proposito general)</li>' +
          '<li><strong style="color:#facc15">Gemini 3 Pro</strong> (Google API, ultimo recurso)</li>' +
          '</ol>' +
          '<p style="font-size:13px;color:#8b949e">No mas paradas en seco a mitad de tarea. El agente sigue trabajando sin importar que proveedor este disponible.</p>',
      },
      {
        heading: 'Usando Esto como Tu Plantilla',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">Para implementar esta estructura en tu propio workspace de OpenClaw:</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Comienza con AGENTS.md</strong> - define tu secuencia de arranque y el orden de carga de archivos</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Crea los 7 archivos principales</strong> - SOUL, IDENTITY, USER, BRAIN, HEARTBEAT, VOICE, MEMORY</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Configura los archivos de infraestructura</strong> - TOOLS, PLAYBOOK, MISSION-CONTROL, CLIENTS</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Construye skills incrementalmente</strong> - comienza con 3-4 skills, crece segun tus necesidades operativas</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Establece el pipeline</strong> - conecta con tus herramientas (Discord, mensajeria, dashboards)</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Implementa sistemas de memoria</strong> - registros diarios que promueven a memoria a largo plazo</li>' +
          '</ol>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">La idea clave:</strong> esto no es organizacion de archivos. Es un sistema operativo donde cada archivo cumple una funcion especifica en el proceso de toma de decisiones de la IA. La estructura crea memoria institucional que se acumula con el tiempo.</p>',
      },
    ],
  },

  {
    id: 'repo-context-engine',
    title: 'El Repositorio como Motor de Contexto',
    subtitle: 'Tu repositorio no es solo almacenamiento de codigo - es el cerebro del que tu IA lee',
    category: 'cli-tools',
    description:
      'Como estructurar tu repositorio como un motor de contexto para agentes de IA. Taxonomia de carpetas, convenciones de nombres, CLAUDE.md, skills, reglas y el efecto compuesto del conocimiento organizado.',
    keywords: [
      'motor de contexto del repositorio',
      'repositorio de contexto para IA',
      'ingenieria de contexto del repositorio',
      'estructura de repositorio para IA',
      'organizacion de repositorio para IA',
      'configuracion de repositorio de contexto',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'rules-skills-context',
      'constraints-and-context-engines',
    ],
    sections: [
      {
        heading: 'El Repositorio Es el Contexto',
        type: 'prose',
        content:
          'La mayoria de la gente piensa en un repositorio como almacenamiento de codigo. Los archivos entran. El control de versiones rastrea los cambios. Eso es la mitad de la historia. Un repositorio es tambien la fuente de contexto principal para cada agente de IA que toca tu proyecto. Cuando Claude inicia una sesion, lee tu repositorio. Cuando referencias un archivo con @, carga ese archivo en la ventana de contexto. Cuando un skill se ejecuta, lee archivos del repositorio. El repositorio ES el motor de contexto. Como lo organizas determina que tan bien funciona la IA para ti. Un repositorio desordenado produce resultados de IA desordenados. Un repositorio estructurado produce resultados de IA estructurados. La estructura del repositorio es ingenieria de contexto.',
      },
      {
        heading: 'La Taxonomia',
        type: 'pattern',
        content:
          'Cada carpeta debe tener un proposito claro. Cada archivo debe tener un nombre predecible. Cuando Claude necesita investigacion de un partner, busca en partners/{name}/research/. Cuando necesita un skill, busca en .cursor/skills/{name}/SKILL.md. Cuando necesita un borrador de contenido, busca en content/drafts/.\n\nUsa prefijos de fecha para contenido: 2026-02-18_nombre-del-tema.md. Esto ordena cronologicamente y le dice a Claude cuando se escribio algo. Usa slugs en minusculas para carpetas: partners/acme/, skills/deploy/. Usa SKILL.md (mayusculas) para archivos de skill para que destaquen en los listados de directorio.\n\nLa taxonomia no es cuestion de estetica. Es cuestion de previsibilidad. Una estructura predecible significa que Claude gasta cero tiempo buscando y cero tiempo adivinando rutas de archivos. Va directamente al archivo que necesita porque la estructura siempre es la misma.',
      },
      {
        heading: 'Que Va Donde',
        type: 'formula',
        content:
          'CLAUDE.md en la raiz: valores por defecto del entorno, preferencias de idioma, estilo de codigo. Menos de 50 lineas.\n\n.cursor/skills/ o skills/: un SKILL.md por flujo de trabajo. Deploy, tracker, publicacion de contenido, onboarding de partners.\n\n.cursor/rules/: patrones especificos de archivo. Reglas de formato de blog, convenciones de TypeScript, aplicacion de reglas de voz.\n\ncontent/: todo lo que produces. Borradores, posts publicados, imagenes, indices.\n\npartners/ o clients/: carpetas por entidad con investigacion, prompts, flujos de trabajo, recursos.\n\nworkflows/: indices de contenido, seguimiento de pipeline, calendarios editoriales.\n\ndata/: assets generados, estadisticas, exportaciones. Normalmente en gitignore para datos sensibles.\n\nscripts/: automatizacion en Python, procesamiento por lotes, transformaciones de datos. Normalmente en gitignore.\n\nEsta no es la unica estructura valida. Pero cualquier estructura que elijas, se consistente. Una estructura para cada partner, cada tipo de contenido, cada flujo de trabajo. La consistencia es lo que hace funcionar al motor de contexto.',
      },
      {
        heading: 'El Efecto Compuesto',
        type: 'pro-tip',
        content:
          'Un repositorio de contexto se acumula. Cada archivo que agregas hace que las futuras sesiones de IA sean mejores. Una guia de voz que escribiste en el primer mes hace que cada pieza de contenido del segundo mes en adelante suene como tu. Una carpeta de investigacion de partner que creaste para el cliente A se convierte en la plantilla para los clientes B a Z. Un skill que escribiste para desplegar un sitio evoluciona en un skill que despliega tres sitios con manejo de errores y verificacion.\n\nMi repositorio comenzo con un CLAUDE.md y tres skills. Seis meses despues tiene mas de 40 skills, un sistema de voz completo, flujos de trabajo para partners, un sistema de progresion RPG y dashboards automatizados. No reserve tiempo para construir el motor de contexto. Lo construi haciendo el trabajo y capturando los patrones. Cada dia el repositorio mejora. Cada dia la IA trabaja mejor con el. Ese es el efecto compuesto.',
      },
    ],
  },
  {
    id: 'ai-security-myths',
    title: 'Mitos de Seguridad de IA Desmentidos',
    subtitle: 'Separando los riesgos reales del miedo basado en la desinformación',
    category: 'security',
    description:
      'Desmintiendo los mitos comunes de seguridad de IA. Qué es realmente riesgoso, qué no lo es, y cómo pensar en la seguridad como una práctica de ingeniería en lugar de una respuesta al miedo.',
    keywords: [
      'mitos de seguridad IA',
      'seguridad de código IA',
      'es seguro programar con IA',
      'seguridad claude',
      'riesgos de seguridad AI IDE',
      'seguridad IA desmentida',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'constraints-and-context-engines',
      'rules-skills-context',
      'repo-context-engine',
    ],
    sections: [
      {
        heading: 'El Miedo vs La Realidad',
        type: 'prose',
        content:
          'La objeción más común al desarrollo asistido por IA es la seguridad. "¿Y si la IA filtra mi código?" "¿Y si envía mis API keys a la nube?" "¿Y si hace commit de algo sensible?" Estas son preguntas válidas. Pero la mayor parte del miedo proviene de no entender cómo funcionan estas herramientas, no de vulnerabilidades reales. Permíteme separar los riesgos reales de los mitos para que puedas tomar decisiones informadas en lugar de decisiones basadas en el miedo.',
      },
      {
        heading: 'Mito: La IA Envía Tu Código a Servidores Externos',
        type: 'pattern',
        content:
          'Cuando usas Cursor o Claude Code, tu código sí sale de tu máquina - va a los servidores de Anthropic o OpenAI para ser procesado. Así es como funciona la IA basada en la nube. El modelo necesita ver el código para ayudarte con él. Pero esto no es "filtrar." Es el mismo modelo que usar Google Docs (tus documentos van a los servidores de Google) o Slack (tus mensajes van a los servidores de Slack). La pregunta relevante no es "¿mi código sale de mi máquina?" Es "¿qué hace el proveedor con él?" Anthropic y OpenAI tienen políticas de datos claras: no entrenan con tu código de suscripciones pagadas de API e IDE. Lee los términos de servicio de tu plan específico. Los planes Enterprise típicamente incluyen garantías más fuertes de manejo de datos.',
      },
      {
        heading: 'Mito: La IA Hará Commit de Tus Secretos',
        type: 'pattern',
        content:
          'Los agentes de IA pueden ejecutar comandos de Git. Si le dices a Claude que haga commit de todo, hará commit de todo - incluyendo archivos .env con tus API keys. Pero esto no es un problema de IA. Es un problema de .gitignore. El mismo riesgo existe si un desarrollador humano ejecuta git add . sin revisar qué está en staging. La solución es la misma para IA y humanos: configura tu .gitignore correctamente, usa pre-commit hooks que escaneen secretos, y revisa qué se está haciendo commit antes de hacer push.\n\nEl skill /deploy en mi repo incluye un escaneo pre-push que verifica contenido sensible. Esa es una solución de ingeniería, no una respuesta al miedo.',
      },
      {
        heading: 'Lo Que Realmente Es Riesgoso',
        type: 'anti-pattern',
        content:
          'Los riesgos reales son aburridos y prevenibles:\n\n1. Hacer commit de archivos .env a un repo público. Solución: .gitignore y pre-commit hooks.\n2. Hardcodear API keys en archivos de código fuente. Solución: usa variables de entorno.\n3. Hacer push de nombres de clientes o datos de socios a un repo público. Solución: mantén las carpetas sensibles en gitignore.\n4. Usar un servicio de IA de nivel gratuito que entrena con tu input. Solución: usa planes pagados con políticas de datos claras.\n5. No rotar API keys que fueron accidentalmente expuestas. Solución: rota inmediatamente si cualquier key toca el control de versiones.\n\nNinguno de estos es exclusivo de la IA. Son prácticas de higiene de seguridad estándar. Los agentes de IA no introducen nuevos vectores de ataque. Siguen las mismas reglas que cualquier otra herramienta en tu flujo de trabajo de desarrollo.',
      },
      {
        heading: 'La Mentalidad de Ingeniería',
        type: 'pro-tip',
        content:
          'La seguridad no es una razón para evitar herramientas de IA. Es un conjunto de prácticas de ingeniería para implementar junto con ellas. No evitas conducir porque los autos pueden chocar. Te pones el cinturón de seguridad, sigues las reglas de tráfico y le das mantenimiento a tu vehículo. Mismo enfoque aquí. Configura .gitignore antes de tu primer commit. Usa variables de entorno para cada secreto. Mantén los datos sensibles en carpetas con gitignore. Revisa los git diffs antes de hacer push. Usa scripts pre-push que escaneen contenido sensible. Estas son tareas de configuración que se hacen una sola vez. Una vez que están en su lugar, trabajas a toda velocidad con herramientas de IA sin preocuparte por la seguridad. Los 30 minutos de configuración ahorran ansiedad infinita.',
      },
    ],
  },

  {
    id: 'constraints-and-context-engines',
    title: 'Restricciones y Motores de Contexto',
    subtitle: '.gitignore, variables de entorno y la arquitectura que mantiene tu repo seguro',
    category: 'security',
    description:
      'Guía práctica de seguridad para repos impulsados por IA. Configuración de .gitignore, variables de entorno, protección a nivel de carpetas, escaneo pre-push y la estrategia de repo público vs privado.',
    keywords: [
      'gitignore IA',
      'variables de entorno seguridad IA',
      'seguridad de repo IA',
      'escaneo de seguridad pre-push',
      'seguridad de motor de contexto',
      'repo público privado IA',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'ai-security-myths',
      'repo-context-engine',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: '.gitignore: Tu Primera Línea de Defensa',
        type: 'code',
        content:
          'Configura tu .gitignore antes de tu primer commit. No después. Antes.\n\nLo esencial:\n*.env y .env.* - API keys, tokens, contraseñas. Una key filtrada puede costar miles.\nclients/ y partners/ - nombres reales, acuerdos, conversaciones.\ndata/ - CSVs y JSONs con direcciones de correo reales, nombres de empresas, listas de leads.\nscripts/ - los scripts de automatización frecuentemente incluyen API keys o referencias a sistemas internos.\nscreenshots/ - pueden capturar dashboards sensibles o nombres de clientes en pestañas del navegador.\n.cursor/mcp.json - contiene tus API keys para cada herramienta conectada.\nnode_modules/ - miles de archivos de dependencias que no pertenecen al control de versiones.\n\nPrueba tu .gitignore con git status. Si un archivo que esperas que sea ignorado aparece en el estado, la regla de ignore no está funcionando. Arréglalo antes de hacer commit.',
      },
      {
        heading: 'Variables de Entorno',
        type: 'pattern',
        content:
          'Nunca hardcodees API keys en archivos. Usa variables de entorno.\n\nCrea un archivo .env en la raíz de tu proyecto. Agrega tus keys: INSTANTLY_API_KEY=tu-key-aquí. Referencialas en el código con process.env.INSTANTLY_API_KEY. El archivo .env está en gitignore, así que permanece local.\n\nCrea un archivo .env.example (sin valores reales) que SÍ hagas commit. Esto documenta qué variables de entorno necesita tu sistema sin exponer las keys reales. Cuando un colaborador clona el repo, ve .env.example y sabe qué keys agregar.\n\nPara despliegues en Vercel: agrega variables de entorno en el dashboard de Vercel. La app desplegada lee del entorno de Vercel. Tu app local lee del .env. Las keys nunca tocan el control de versiones.',
      },
      {
        heading: 'Protección a Nivel de Carpetas',
        type: 'pattern',
        content:
          'Estructura tu repo para que los datos sensibles tengan un hogar claro que siempre esté en gitignore. Los skills, el contenido y los flujos de trabajo son seguros para compartir. Los clientes, socios, exportaciones de datos y scripts con credenciales no lo son.\n\nEl patrón: el contenido compartible (frameworks, plantillas, posts publicados) vive en carpetas rastreadas. El contenido sensible (datos de clientes, configuraciones de API, scripts internos) vive en carpetas con gitignore. El límite es claro y está aplicado por .gitignore, no por la memoria.\n\nMi repo tiene tanto un repo privado de trabajo (contiene todo) como un repo público en GitHub (contiene solo contenido compartible). El skill /update-github ejecuta un escaneo pre-push que verifica nombres sensibles de socios usando una lista de bloqueo local antes de hacer push al repo público.',
      },
      {
        heading: 'Escaneo Pre-Push',
        type: 'pro-tip',
        content:
          'Un .gitignore previene commits accidentales de carpetas enteras. Pero ¿qué pasa con un nombre de socio que se cuela en un mensaje de commit o un post de blog? El escaneo pre-push los atrapa.\n\nEl skill /update-github escanea archivos rastreados buscando contenido sensible usando una lista de bloqueo de nombres de socios y clientes. Audita el .gitignore para confirmar que todas las carpetas sensibles están excluidas. Verifica mensajes de commit por nombres filtrados. Solo después de que todos los escaneos pasan, hace push.\n\nPuedes construir una versión más simple con un git pre-push hook. El hook ejecuta un script que hace grep por patrones que definas (nombres de empresas, dominios de email, prefijos de keys). Si encuentra una coincidencia, el push es rechazado con una advertencia. Esta es una red de seguridad, no un reemplazo para una buena configuración de .gitignore.',
      },
      {
        heading: 'Estrategia Público vs Privado',
        type: 'formula',
        content:
          'Mantén dos repos o usa separación basada en ramas.\n\nOpción A (dos repos): Tu repo privado contiene todo - skills, contenido, datos de socios, scripts. Tu repo público es un subconjunto limpio. Un script pre-push asegura que nada sensible cruce.\n\nOpción B (basada en ramas): Tu rama principal es pública. El trabajo sensible ocurre en ramas privadas que nunca se fusionan a main. Esto es más simple pero más riesgoso porque un merge equivocado expone todo.\n\nYo uso la Opción A. El repo privado es el sistema operativo completo. El repo público en GitHub es la versión de exhibición con frameworks, contenido publicado y ejemplos de skills. El skill /update-github automatiza la sincronización con escaneo de seguridad. Lo clave: el repo público NUNCA es la copia principal de trabajo. Es una exportación curada del repo privado.',
      },
    ],
  },

  {
    id: 'parallel-agent-patterns',
    title: 'Patrones de Agentes Paralelos',
    subtitle: 'Identifica tareas independientes, lanza agentes concurrentes, evita conflictos',
    category: 'parallel-agents',
    description:
      'Cómo identificar tareas que pueden ejecutarse en paralelo, la prueba de independencia, asignación de modelos y los patrones que convierten builds de 45 minutos en builds de 10 minutos.',
    keywords: [
      'agentes IA paralelos',
      'agentes IA concurrentes',
      'patrón de agentes paralelos',
      'flujo de trabajo multi agente IA',
      'ejecución paralela IA',
      'prueba de independencia de agentes paralelos',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'orchestrating-multi-agent-workflows',
      'model-selection-strategy',
      'credit-management',
    ],
    sections: [
      {
        heading: 'Qué Son los Agentes Paralelos',
        type: 'prose',
        content:
          'Agentes paralelos significa ejecutar múltiples agentes de IA al mismo tiempo en diferentes tareas. No uno después de otro. Todos a la vez. La palabra clave es independiente. Si el Agente A necesita la salida del Agente B, no pueden ejecutarse en paralelo. Si tocan diferentes archivos, diferentes datos, diferentes responsabilidades - lánzalos simultáneamente. Este es el mayor multiplicador de velocidad en el desarrollo asistido por IA. Una tarea que toma 45 minutos secuencialmente puede terminar en menos de 10 minutos con agentes paralelos. La ganancia de velocidad no es teórica. Construyo páginas wiki, archivos de datos y rutas de sitio en paralelo cada semana.',
      },
      {
        heading: 'La Prueba de Independencia',
        type: 'pattern',
        content:
          'Antes de lanzar agentes paralelos, verifica tres cosas para cada par de tareas:\n\n1. ¿Escriben en los mismos archivos? Si sí, no pueden ejecutarse en paralelo. Los conflictos de archivos corrompen la salida.\n2. ¿Uno necesita la salida del otro? Si sí, deben ejecutarse secuencialmente. La tarea dependiente se ejecuta después de que la dependencia se complete.\n3. ¿Importan de algo que aún no existe? Este es el sutil. Si el Agente A crea un archivo de datos y el Agente B importa de él, parecen dependientes. Pero si el Agente B copia un patrón conocido (como replicar una página wiki existente), puede ejecutarse en paralelo porque la estructura de importación es predecible.\n\nSi las tres verificaciones pasan, lánzalos en paralelo. Si alguna falla, secuéncialos. No fuerces el paralelismo en tareas dependientes. Eso crea más trabajo, no menos.',
      },
      {
        heading: 'El Patrón de Oleadas',
        type: 'pattern',
        content:
          'Las características complejas se descomponen en oleadas. Cada oleada contiene tareas que pueden ejecutarse en paralelo. Las oleadas se ejecutan secuencialmente porque las posteriores dependen de las anteriores.\n\nOleada 1: Fundación - archivos de datos, componentes compartidos, definiciones de tipos. Estos no tienen dependencias entre sí pero todo lo posterior depende de ellos.\nOleada 2: Consumidores - páginas, rutas, componentes que importan de la salida de la Oleada 1. Múltiples consumidores pueden ejecutarse en paralelo porque tocan diferentes archivos.\nOleada 3: Integración - actualizaciones de navegación, enlaces cruzados, actualizaciones de exportaciones. Estos conectan las salidas de la Oleada 2 entre sí.\nOleada 4: Verificación - build, pruebas, despliegue. Secuencial porque cada paso depende del anterior.\n\nMapear tu característica en oleadas antes de empezar es el paso de planificación que hace posible la ejecución paralela.',
      },
      {
        heading: 'Asignación de Modelo Por Agente',
        type: 'pro-tip',
        content:
          'No todos los agentes paralelos necesitan el mismo modelo. Asigna modelos según la complejidad de la tarea, no uniformemente.\n\nEl agente orquestador (el que planifica y lanza a los demás) usa el modelo capaz. Necesita razonar sobre dependencias, contexto y secuenciación.\n\nLos sub-agentes haciendo trabajo de copiar-pegar-y-adaptar usan modelos rápidos. Construir una ruta que replica una existente. Actualizar un archivo de configuración. Ejecutar una verificación de build. Estas son tareas mecánicas.\n\nLos sub-agentes haciendo trabajo creativo usan el modelo capaz. Escribir 17 entradas wiki con contenido rico. Arquitectar un nuevo componente. Cualquier cosa que requiera juicio o matiz.\n\nEl resultado: obtienes velocidad (los modelos rápidos completan rápidamente) y calidad (los modelos capaces manejan las partes difíciles) simultáneamente.',
      },
      {
        heading: 'Anti-Patrón: Paralelizar Tareas Dependientes',
        type: 'anti-pattern',
        content:
          'El error más común es lanzar agentes en tareas que dependen unas de otras. El Agente A crea las definiciones de tipos. El Agente B crea un componente que usa esos tipos. Si se ejecutan en paralelo, el Agente B adivina los tipos en lugar de leerlos. A veces la adivinanza es correcta. Frecuentemente no lo es. Y el tiempo de debugging elimina cualquier ganancia de velocidad del paralelismo.\n\nOtro error: cinco agentes todos editando el mismo archivo de configuración. Conflictos de merge, cambios sobrescritos, salida corrupta. Los cambios de cada agente se ven correctos de forma aislada pero se rompen cuando se combinan.\n\nLa solución: planifica primero. Mapea las dependencias. Agrupa las tareas independientes en oleadas paralelas. Secuencia las tareas dependientes en oleadas separadas. La planificación toma 5 minutos. El debugging por mal paralelismo toma 30.',
      },
    ],
  },

  {
    id: 'orchestrating-multi-agent-workflows',
    title: 'Orquestando Flujos de Trabajo Multi-Agente',
    subtitle: 'Planifica las oleadas, asigna los modelos, lanza los agentes, verifica la salida',
    category: 'parallel-agents',
    description:
      'Guía paso a paso para orquestar flujos de trabajo multi-agente. Planificación de oleadas, escritura de prompts para agentes, gestión de traspasos de contexto y verificación de la salida combinada.',
    keywords: [
      'flujo de trabajo multi agente',
      'orquestar agentes IA',
      'orquestación de flujo de trabajo de agentes',
      'tutorial multi agente IA',
      'orquestación de agentes paralelos',
      'planificación de flujo de trabajo de agentes',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'model-selection-strategy',
      'credit-management',
    ],
    sections: [
      {
        heading: 'El Modelo Mental de Orquestación',
        type: 'prose',
        content:
          'Tú eres el orquestador. Claude es la fuerza de trabajo. Tu trabajo no es escribir código. Tu trabajo es planificar el trabajo, asignar los agentes, proveer el contexto y verificar la salida. Piensa en ti mismo como un gerente de proyecto que resulta tener una oferta infinita de trabajadores capaces disponibles instantáneamente. El cuello de botella no es la mano de obra. Es la planificación. Un flujo de trabajo multi-agente bien planificado termina en minutos. Uno mal planificado termina en horas (o nunca) porque los agentes se pisan entre sí, producen salida conflictiva o pierden requisitos que no estaban en sus instrucciones.',
      },
      {
        heading: 'Paso 1: Planifica en Modo de Solo Lectura',
        type: 'pattern',
        content:
          'Comienza cada flujo de trabajo multi-agente en modo de planificación. Pídele a Claude que analice la tarea, identifique todos los archivos que necesitan ser creados o modificados, mapee las dependencias entre ellos y agrupe las tareas independientes en oleadas paralelas.\n\nEl plan debe incluir: archivos a crear (con rutas completas), archivos a modificar (con cambios específicos), la estructura de oleadas (qué tareas se ejecutan en paralelo, cuáles secuencialmente), recomendaciones de modelo por agente y pasos de verificación.\n\nRevisa el plan antes de ejecutar. Si una dependencia está mal, corrígela ahora. Si una agrupación de tareas no tiene sentido, ajústala ahora. Los cambios al plan no cuestan nada. Los cambios después de que los agentes han comenzado cuestan tiempo y contexto.',
      },
      {
        heading: 'Paso 2: Escribe Prompts Específicos por Agente',
        type: 'pattern',
        content:
          'Cada agente recibe su propio prompt con su propio contexto. Los agentes no comparten contexto entre sí. El Agente B no sabe qué está haciendo el Agente A. Eso es una característica, no un bug. Significa que tienes control total sobre lo que cada agente ve y hace.\n\nUn buen prompt de agente incluye: la tarea específica ("Crea el archivo website/packages/shared/data/how-to-wiki.ts"), el patrón a seguir ("Replica la estructura de clay-wiki.ts"), los datos o contenido específico a incluir, referencias a archivos que debe leer para contexto, y los criterios de éxito ("El archivo debe exportar un array tipado de 17 entradas con contenido completo de WikiSection").\n\nLos prompts de agente malos son vagos. "Construye la wiki." Los prompts de agente buenos son específicos. "Crea how-to-wiki.ts con la interfaz HowToWikiEntry, 6 categorías, 17 entradas y funciones auxiliares siguiendo el patrón exacto de context-wiki.ts."',
      },
      {
        heading: 'Paso 3: Lanza, Monitorea, Verifica',
        type: 'formula',
        content:
          'Lanza los agentes de la Oleada 1 en paralelo. Monitorea su progreso. Cuando todos los agentes de la Oleada 1 completen, verifica su salida antes de lanzar la Oleada 2. La verificación entre oleadas atrapa errores temprano.\n\nLista de verificación por oleada:\n- ¿Los archivos creados existen en las rutas esperadas?\n- ¿Los tipos e interfaces coinciden con lo que los consumidores posteriores esperan?\n- ¿El build sigue pasando después de los cambios de la oleada?\n- ¿Hay errores de TypeScript o linting?\n\nSolo después de que la verificación pasa lanzas la siguiente oleada. Si un agente produjo mala salida, corrígela antes de proceder. Una mala base de la Oleada 1 significa que cada agente de la Oleada 2 construye sobre suposiciones rotas.\n\nVerificación final después de todas las oleadas: compila el proyecto entero, verifica que todas las rutas rendericen, confirma que los enlaces cruzados resuelvan, confirma que los metadatos SEO sean correctos. Esta es la última puerta de calidad antes de que la característica se lance.',
      },
      {
        heading: 'Ejemplo Real: Construyendo una Característica Wiki',
        type: 'pro-tip',
        content:
          'Cuando construí el Clay Wiki, la orquestación fue: Oleada 1 - un agente escribió el archivo de datos (todas las 17 entradas, tipos, helpers). Oleada 2 - tres agentes ejecutaron en paralelo: componente de página hub, componente de página de detalle y configuración de ruta en ShawnOS. Oleada 3 - dos agentes ejecutaron en paralelo: actualizaciones de navegación y llenado de enlaces cruzados. Oleada 4 - un agente ejecutó el build y verificó todas las rutas.\n\nTiempo total: menos de 15 minutos. Estimación de tiempo secuencial: más de 45 minutos. La diferencia de velocidad vino de la planificación. Identificar qué tareas eran independientes. Agruparlas en oleadas. Darle a cada agente exactamente el contexto que necesitaba. La ejecución en sí fue rápida. La planificación es lo que hizo posible la ejecución.',
      },
    ],
  },

  {
    id: 'agent-teams-claude-code',
    title: 'Equipos de Agentes en Claude Code',
    subtitle: 'Coordinación multi-agente con listas de tareas compartidas, mensajería y capas de gestión',
    category: 'parallel-agents',
    description:
      'Cómo usar los Equipos de Agentes de Claude Code para trabajo paralelo coordinado. Creación de equipos, asignación de tareas, mensajería entre agentes, la capa de gestión que previene el caos y ejemplos reales de producción.',
    keywords: [
      'claude code equipos de agentes',
      'claude code multi agente',
      'tutorial equipos de agentes',
      'coordinación de equipos claude code',
      'orquestación multi agente claude',
      'equipos de agentes experimental',
      'claude code teammates',
      'gestión de tareas claude code',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'claude-code-power-features',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'Qué Son los Equipos de Agentes',
        type: 'prose',
        content:
          'Los Equipos de Agentes son sesiones de Claude Code que pueden comunicarse entre sí. Las entradas anteriores de agentes paralelos en esta guía cubren los subagentes, que son de tipo disparar-y-olvidar. Lanzas un subagente, hace su tarea, reporta al padre. Eso es todo. No hay comunicación entre subagentes. No hay seguimiento de tareas compartido. No hay coordinación más allá de lo que el padre orquesta.\n\nLos Equipos de Agentes agregan tres cosas que los subagentes no tienen. Primero, una lista de tareas compartida que cada miembro del equipo puede leer y actualizar. Segundo, mensajería directa entre agentes, no solo de padre a hijo sino de par a par. Tercero, gestión del ciclo de vida para que el líder del equipo pueda crear, asignar, monitorear y cerrar miembros del equipo desde una sola sesión.\n\nLa diferencia práctica: los subagentes son buenos para tareas paralelas independientes donde ningún agente necesita saber qué está haciendo otro agente. Los equipos son buenos para tareas paralelas coordinadas donde los agentes necesitan traspasar contexto, verificar el trabajo del otro o adaptarse basándose en lo que un compañero descubrió. Si alguna vez has gestionado un pequeño equipo de personas, el modelo mental es idéntico. Asignas tareas, las personas trabajan en paralelo, te envían mensajes con preguntas, revisas la salida y decides cuándo el trabajo está terminado.',
      },
      {
        heading: 'Habilitando y Creando un Equipo',
        type: 'code',
        content:
          'Los Equipos de Agentes son experimentales a partir de febrero 2026. Habilítalos agregando la variable de entorno a tu configuración de Claude Code:\n\nEn ~/.claude/settings.json:\n{\n  "env": {\n    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"\n  }\n}\n\nReinicia Claude Code después de agregar esto. La característica no se activará hasta la siguiente sesión.\n\nUna vez habilitado, puedes pedirle a Claude que cree un equipo naturalmente o sucede a través de la herramienta TeamCreate. Un equipo obtiene un nombre, una descripción y un archivo de configuración en ~/.claude/teams/{team-name}/config.json. La configuración rastrea los miembros del equipo con sus nombres, IDs de agente y roles.\n\nCada equipo obtiene una lista de tareas correspondiente en ~/.claude/tasks/{team-name}/. Este es el rastreador de trabajo compartido que cada miembro del equipo puede leer y escribir.\n\nLos modos de visualización importan. El predeterminado es in-process, donde todos los miembros del equipo se ejecutan en la terminal principal y usas Shift+Down para alternar entre ellos. Si tienes tmux o iTerm2, configura "teammateMode": "tmux" en settings.json y cada miembro del equipo obtiene su propio panel dividido. La vista de panel facilita monitorear trabajo paralelo. También puedes pasar --teammate-mode en la línea de comandos para sesiones únicas.',
      },
      {
        heading: 'Listas de Tareas y Asignación',
        type: 'pattern',
        content:
          'Las tareas son la columna vertebral de la coordinación. Cada pieza de trabajo obtiene una tarea con un asunto, descripción, estado (pending, in_progress, completed) y dependencias opcionales.\n\nLas dependencias son la característica clave. La Tarea 4 puede estar bloqueada por las Tareas 2 y 3. Eso significa que nadie toma la Tarea 4 hasta que ambas 2 y 3 estén terminadas. Esto aplica la disciplina de oleadas automáticamente. No necesitas supervisar la secuenciación. La lista de tareas la aplica.\n\nEl flujo de trabajo: el líder del equipo crea tareas, establece dependencias y asigna responsables. Los miembros del equipo revisan la lista de tareas después de completar cada pieza de trabajo para encontrar qué está disponible a continuación. Reclaman tareas desbloqueadas, las trabajan, las marcan como completas y buscan la siguiente.\n\nConsejo: prefiere asignar tareas en orden de ID (primero las más bajas) cuando hay múltiples disponibles. Las tareas anteriores frecuentemente establecen contexto del que las tareas posteriores dependen. Este es el mismo patrón de oleadas de la guía de agentes paralelos, solo formalizado en un sistema de tareas en lugar de orquestación manual.',
      },
      {
        heading: 'Comunicación Entre Agentes',
        type: 'pattern',
        content:
          'Los miembros del equipo se comunican a través de SendMessage. Existen tres tipos de mensajes.\n\nLos mensajes directos van a un miembro específico del equipo por nombre. El investigador envía hallazgos al líder del equipo. El escritor le hace una pregunta al revisor. Estos son los más comunes y los mensajes más económicos.\n\nLos broadcasts van a todos los miembros del equipo a la vez. Úsalos con moderación porque cada broadcast envía un mensaje separado a cada agente, lo que significa que N miembros del equipo equivalen a N llamadas de API. Uso válido: un bloqueador crítico que afecta a todos. Uso inválido: una actualización de estado que solo le importa al líder.\n\nLas solicitudes de shutdown le dicen a un miembro del equipo que termine y salga. El miembro del equipo puede aprobar (y terminar) o rechazar con una razón. Así es como terminas limpiamente una sesión de equipo sin matar procesos.\n\nLos mensajes se entregan automáticamente. No necesitas consultar una bandeja de entrada. Cuando un miembro del equipo envía un mensaje, llega a tu conversación como un nuevo turno. Si estás ocupado a mitad de turno, los mensajes se encolan y se entregan cuando tu turno termine.',
      },
      {
        heading: 'La Capa de Gestión',
        type: 'pro-tip',
        content:
          'Los agentes no son el avance. La capa de gestión lo es. Sin restricciones, los agentes paralelos crean caos. Dos agentes editan el mismo archivo y la última escritura gana silenciosamente. Un agente toma una decisión arquitectónica que conflictúa con la suposición de otro agente. Un despliegue sale antes de que todos los agentes terminen.\n\nLa capa de gestión es un archivo de restricciones que cada miembro del equipo lee antes de hacer cualquier cambio. Mi TEAM-CONSTRAINTS.md aplica seis reglas:\n\n1. Propiedad de archivos. Un escritor por archivo por oleada. No dos agentes tocan el mismo archivo simultáneamente.\n2. Registro de decisiones. Cuando un agente toma una decisión (convención de nombres, ruta de importación, estructura de datos), envía un mensaje al líder del equipo con un prefijo [DECISION]. Esa decisión se hace disponible para todos los miembros del equipo.\n3. Leer antes de escribir. Cada agente lee un ejemplo existente de lo que está por crear. El código existente ES la guía de estilo.\n4. Disciplina de oleadas. Tareas de fundación primero, consumidores segundo, integración tercero, validación al final. No se salta adelante.\n5. Puerta de build. No se despliega hasta que el build pase limpio y el líder del equipo confirme.\n6. Contexto antes de acción. Cada miembro del equipo recibe el archivo de restricciones, una descripción específica de la tarea, referencias a archivos y límites de propiedad. Si falta alguno, el agente pregunta antes de proceder.\n\nNo necesitas mi archivo de restricciones exacto. Necesitas UN archivo de restricciones. Las reglas específicas importan menos que tener reglas. Sin ellas, los agentes divagan. Con ellas, los agentes se coordinan.',
      },
      {
        heading: 'Equipos vs Subagentes: Cuándo Usar Cuál',
        type: 'formula',
        content:
          'Usa subagentes (la herramienta Task) cuando las tareas son completamente independientes. Ningún agente necesita la salida de otro agente. Ningún agente necesita verificar el trabajo de otro agente. Cada tarea tiene una entrada clara y una salida clara sin dependencias cruzadas. Ejemplo: tres agentes cada uno escribiendo una página wiki separada que no referencia a las otras.\n\nUsa equipos cuando las tareas son coordinadas. Los agentes necesitan traspasar contexto. La salida de un agente alimenta la entrada de otro agente. Alguien necesita revisar antes de que el siguiente paso comience. Ejemplo: un investigador recopila datos, un escritor los convierte en contenido, un revisor verifica el cumplimiento de la voz, y un agente de despliegue hace push del resultado.\n\nLa diferencia de costo importa. Los equipos usan aproximadamente 7x más tokens que una sola sesión porque cada miembro del equipo ejecuta su propia ventana de contexto. Mantén los equipos pequeños (2 a 4 agentes), mantén las tareas enfocadas y limpia cuando termines. No crees un equipo para una tarea que un solo agente enfocado puede manejar.\n\nLimitaciones actuales a conocer: un equipo por sesión, no hay equipos anidados (los miembros del equipo no pueden crear sus propios equipos), el rol de líder es fijo (no se puede transferir el liderazgo a mitad de sesión), y la reanudación de sesión no funciona con miembros del equipo in-process. Estas son restricciones experimentales que probablemente mejorarán.\n\nEl marco de decisión: si puedes describir la tarea en un solo prompt y el agente puede terminar sin preguntarle a nadie, usa un subagente. Si la tarea involucra traspasos, revisiones o coordinación de múltiples pasos, usa un equipo.',
      },
    ],
  },

  {
    id: 'testing-ai-features-recursive-method',
    title: 'Probando Nuevas Características de IA con Recursive Drift',
    subtitle:
      'El ciclo construir-probar-interrogar-codificar para mantenerte actualizado sin abrumarte',
    category: 'cli-tools',
    description:
      'Un método sistemático para evaluar nuevas características de herramientas de IA usando el framework Recursive Drift. Flujo de trabajo de dos terminales, interrogación como debugging y codificación de conocimiento validado en skills reutilizables.',
    keywords: [
      'probar actualizaciones de IA',
      'claude code nuevas características',
      'actualizaciones AI CLI',
      'método de pruebas recursivo',
      'evaluación de características IA',
      'flujo de trabajo de pruebas claude code',
      'mantenerse actualizado con herramientas IA',
      'framework de evaluación de herramientas IA',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'agent-teams-claude-code',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'El Problema: Velocidad de Características',
        type: 'prose',
        content:
          'Las herramientas de IA lanzan actualizaciones más rápido de lo que puedes aprenderlas. Claude Code, Cursor, ChatGPT, Windsurf - todas lanzan nuevas características semanalmente. A veces diariamente. Y cada característica podría cambiar cómo trabajas.\n\nLa reacción natural es uno de dos extremos. Ignorar todo y seguir haciendo lo que funciona hasta que se rompa. O perseguir cada actualización y nunca terminar nada porque siempre estás aprendiendo algo nuevo.\n\nAmbos pierden. La primera persona se pierde la característica que le habría ahorrado 3 horas al día. La segunda persona nunca entrega porque está perpetuamente en proceso de onboarding.\n\nNecesitas un camino intermedio. Una forma sistemática de clasificar, probar e integrar nuevas características sin descarrilar tu trabajo real.',
      },
      {
        heading: 'El Ciclo de Cuatro Pasos',
        type: 'pattern',
        content:
          'Constrúyelo. Pruébalo. Interrógalo. Codifícalo.\n\nEstos cuatro pasos son Recursive Drift aplicado a la evaluación de características. Cada paso produce salida que alimenta al siguiente, y el paso final retroalimenta tu sistema para que la siguiente evaluación empiece más inteligente.\n\nConstruir: usa la característica de verdad. No leas el changelog y formes una opinión. Abre una terminal y pruébala. Construye algo real con ella, no un ejemplo de juguete. No sabes si una característica funciona hasta que hayas entregado algo con ella.\n\nProbar: evalúa lo que construiste. ¿Funcionó? ¿Fue más rápido? ¿Introdujo problemas? Esto no es "¿se ejecuta sin errores?" Esto es "¿hace mi flujo de trabajo existente mejor o peor?" Usa un segundo contexto para evaluar - una terminal diferente, una sesión diferente, una perspectiva fresca.\n\nInterrogar: pregúntale a la IA sobre lo que acaba de pasar. ¿Qué hizo realmente la característica por debajo? ¿Cuáles son los casos borde? ¿Qué hizo mal? Copia tu salida de construcción en una nueva sesión y pídele que se critique a sí misma. La autoevaluación de la IA revela limitaciones que el paso de construcción pasó por alto.\n\nCodificar: convierte el conocimiento validado en contexto reutilizable. Escribe un skill. Actualiza un flujo de trabajo. Agrégalo a tus archivos de memoria. Si la característica vale la pena usarla, vale la pena documentarla en una forma que tus futuras sesiones puedan acceder automáticamente.',
      },
      {
        heading: 'El Método de Dos Terminales',
        type: 'formula',
        content:
          'La Terminal 1 es el constructor. La Terminal 2 es el evaluador. Nunca se fusionan.\n\nLa separación es el método. Cuando construyes y evalúas en la misma sesión, el sesgo de confirmación toma el control. La IA que construyó la cosa defenderá la cosa que construyó. Un contexto fresco no tiene apego a la salida.\n\nFlujo de trabajo:\n1. Terminal 1: empieza a construir con la nueva característica. Dale una tarea real de tu trabajo actual.\n2. Déjala ejecutarse. No interrumpas.\n3. Terminal 2: abre una nueva sesión. Pega la salida de la Terminal 1. Pregunta: "¿Qué hace esto bien? ¿Cuáles son las limitaciones? ¿Qué rompería esto?"\n4. Toma los hallazgos de la Terminal 2 y pégalos de vuelta en la Terminal 1. Pídele que aborde las preocupaciones.\n5. Repite hasta que tengas una imagen clara de lo que funciona y lo que no.\n\nEste es el ciclo freefall-break-ask de Recursive Drift, externalizado a través de dos contextos. El constructor hace freefall. El evaluador hace break. El ida y vuelta es el estado ask. La separación fuerza la honestidad.',
      },
      {
        heading: 'La Interrogación como Debugging',
        type: 'pro-tip',
        content:
          'El paso de interrogación es donde la mayoría de las personas se detienen demasiado temprano. Prueban la característica, deciden "funciona" o "no funciona," y siguen adelante. Eso es un binario cuando necesitas un espectro.\n\nPregúntale a la IA sobre lo que acaba de construir. No "¿esto funcionó?" sino "¿qué suposiciones hiciste? ¿qué pasaría si la entrada fuera 10x más grande? ¿qué elegiste no hacer?"\n\nCopia las salidas de una sesión a otra. La Terminal 2 no tiene el contexto de la Terminal 1, que es el punto. Lee la salida en frío. Atrapa cosas que la ventana de contexto del constructor enterró.\n\nEl patrón: construye en el contexto A, evalúa en el contexto B, sintetiza en el contexto A. Esta polinización cruzada saca a la superficie casos borde, límites de rendimiento y modos de fallo que te perderías en un flujo de trabajo de un solo contexto.\n\nEjemplo real: probando Agent Teams en Claude Code. La Terminal 1 construyó un equipo, ejecutó tareas, ejercitó el sistema de mensajería. La Terminal 2 recibió la salida completa e identificó que la tarea era en realidad demasiado simple para equipos - los subagentes habrían sido más económicos y rápidos. Esa evaluación se convirtió en el skill de agent-routing. La prueba de la característica produjo la barrera contra su mal uso.',
      },
      {
        heading: 'De la Evaluación al Skill',
        type: 'pattern',
        content:
          'La fase de interrogación produce conocimiento en bruto. La fase de codificación lo convierte en infraestructura.\n\nCuando validas que una característica funciona, tienes tres opciones. Puedes recordarla y olvidarla para la próxima semana. Puedes guardar los docs en marcadores y nunca leerlos de nuevo. O puedes escribirla en tu sistema - un archivo de skill, una regla en CLAUDE.md, un documento de flujo de trabajo, una entrada how-to.\n\nLa tercera opción es la única que se acumula. Cada característica que codificas hace tu sistema más denso. La siguiente sesión empieza con ese conocimiento ya cargado. No re-aprendes. Construyes sobre lo que la última sesión descubrió.\n\nLa plantilla de codificación:\n- Qué hace la característica (una oración)\n- Cuándo usarla vs cuándo no (la salida de la clasificación)\n- El flujo de trabajo que funcionó (los hallazgos de las dos terminales)\n- Limitaciones conocidas (de la interrogación)\n- Skills relacionados a los que se conecta\n\nEsta plantilla es en sí misma un producto del ciclo recursivo. Fue refinada a través de múltiples evaluaciones de características hasta que el patrón se estabilizó.',
      },
      {
        heading: 'Clasificación: Qué Merece el Ciclo Completo',
        type: 'anti-pattern',
        content:
          'No todas las actualizaciones merecen el ciclo completo. El objetivo es profundidad selectiva, no cobertura exhaustiva.\n\nEjecuta el ciclo completo cuando:\n- Una característica mapea a un punto de dolor conocido en tu flujo de trabajo. Has estado trabajando manualmente alrededor de algo. La actualización podría automatizarlo.\n- Una característica cambia el comportamiento del que dependes. Los cambios que rompen cosas necesitan atención inmediata. Tus skills y flujos de trabajo existentes pueden dejar de funcionar.\n- Una característica habilita algo previamente imposible. Las nuevas capacidades expanden lo que puedes construir. Estas son las evaluaciones de mayor ROI.\n\nOmite cuando:\n- La característica es para un caso de uso que no tienes. No toda actualización es relevante.\n- El cambio es cosmético o menor. Los ajustes de UI raramente afectan la salida.\n- Estás a mitad de sprint con una fecha límite. Programa la evaluación, no dejes que interrumpa el trabajo de producción.\n\nLa clasificación toma 5 minutos. Escanea el changelog. Compara contra tus puntos de dolor activos. Si nada mapea, sigue adelante. Si algo sí, ejecuta el ciclo. Con el tiempo desarrollas un instinto para qué actualizaciones importan. Ese instinto es en sí mismo un skill compuesto construido de ejecutar el ciclo suficientes veces.',
      },
    ],
  },

  {
    id: 'optimize-for-ai-citations',
    title: 'Cómo Optimizar Tu Contenido para Citaciones de IA',
    subtitle: 'Estructura contenido para que ChatGPT, Perplexity y Google AI Overviews te citen por nombre',
    category: 'geo-seo',
    description:
      'Guía paso a paso de Generative Engine Optimization (GEO). Cómo estructurar contenido para que las plataformas de IA citen tu marca en respuestas generadas, con el patrón de Answer Block y estrategias de autoridad de entidad.',
    keywords: [
      'generative engine optimization',
      'optimización GEO',
      'citaciones de IA',
      'cómo ser citado por ChatGPT',
      'optimización de búsqueda IA',
      'SEO para Perplexity',
      'optimización google AI overview',
      'optimización AEO',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'build-content-knowledge-graph',
      'schema-markup-for-geo',
      'create-llms-txt',
      'build-content-engineering-system',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'Qué Es GEO y Por Qué Importa Ahora',
        type: 'prose',
        content:
          'Generative Engine Optimization es estructurar tu contenido para que las plataformas de IA citen tu marca en sus respuestas generadas. No posicionar tu enlace en una lista de diez. Citarte por nombre dentro de la respuesta. Este es un juego fundamentalmente diferente al SEO tradicional. El tráfico de referencia de IA aumentó un 527% año tras año. Gartner proyecta que el 25% del tráfico de búsqueda orgánica se desplazará a chatbots de IA para 2026. La estadística que reconfiguró toda mi estrategia de contenido: el 47% de las citaciones de AI Overview provienen de páginas que se posicionan debajo de la posición 5 en búsqueda tradicional. La correlación de Domain Authority cayó a r=0.18 para citaciones de IA. Eso significa que la calidad y estructura del contenido superan al tamaño de la marca. Una página bien construida en un sitio pequeño puede superar al contenido empresarial. Esta es la ventana.',
      },
      {
        heading: 'El Patrón de Answer Block - Escribe para Extracción',
        type: 'pattern',
        content:
          'Cada sección en cada página debe abrir con una respuesta autónoma de 40-60 palabras que se sostenga sola sin el contexto circundante. Este es el answer block. Los motores de IA escanean buscando pasajes que puedan extraer y citar textualmente. Si tu párrafo de apertura responde la pregunta completamente, le das al motor exactamente lo que necesita.\n\nEl detalle de soporte sigue al answer block y agrega profundidad para lectores humanos. Pero el answer block es lo que se cita. Los pasajes autónomos de 134-167 palabras alcanzan el punto óptimo de extracción. Las páginas con puntuaciones de completitud semántica por encima de 8.5 de 10 tienen 4.2x más probabilidad de ser citadas. Agregar estadísticas y fuentes citadas aumenta la visibilidad en IA un 30-40%. Cada término de conocimiento, guía how-to y entrada wiki en ShawnOS sigue este patrón. El campo de definición es un answer block. El primer párrafo de cada sección es un answer block. Está integrado en las estructuras de datos, no añadido después.',
      },
      {
        heading: 'Autoridad de Entidad - Haz Tu Marca Reconocible para la IA',
        type: 'pattern',
        content:
          'La autoridad de entidad es qué tan bien los motores de IA reconocen tu marca como una entidad conocida a través de la web. Los sitios con 15 o más entidades reconocidas tienen una probabilidad de citación 4.8x mayor. Construir autoridad de entidad significa presencia de marca consistente a través de múltiples contextos: tus propios sitios, menciones de terceros, discusiones en Reddit, publicaciones en LinkedIn, contribuciones como invitado y apariciones en podcasts.\n\nEl enfoque de ShawnOS: tres sitios (shawnos.ai, thegtmos.ai, thecontentos.ai) todos refuerzan la misma entidad con señales de expertise consistentes. Enlaces entre sitios, feeds RSS compartidos, schema de autor consistente en cada página. Cada pieza de contenido agrega otro nodo al grafo de entidad. La arquitectura monorepo hace esto fluido - una capa de datos compartida, un push, tres sitios actualizados simultáneamente. No necesitas tres sitios. Necesitas presencia consistente y reconocible a través de múltiples superficies.',
      },
      {
        heading: 'Midiendo Tu Visibilidad en IA',
        type: 'pro-tip',
        content:
          'No puedes optimizar lo que no puedes medir. Rastrea las citaciones de IA manualmente buscando tu nombre de marca y temas clave en ChatGPT, Perplexity, Google AI Overviews y Claude. Herramientas como AirOps proporcionan monitoreo automatizado de citaciones y seguimiento de share-of-voice a través de motores de IA. Su servidor MCP se integra directamente en tu flujo de trabajo de desarrollo para datos de visibilidad en tiempo real.\n\nLas métricas que importan: tasa de citación (con qué frecuencia te citan cuando se discute tu tema), precisión de citación (si la IA atribuye correctamente) y frescura de citación (si cita tu contenido más reciente o una versión obsoleta). Rastrea estas mensualmente. El contenido que no se actualiza trimestralmente tiene 3x más probabilidad de perder sus citaciones de IA. La frescura no es opcional - es una señal de posicionamiento.',
      },
    ],
  },

  {
    id: 'build-content-knowledge-graph',
    title: 'Cómo Construir un Grafo de Conocimiento de Contenido',
    subtitle: 'Convierte contenido disperso en un sistema interconectado que acumula autoridad',
    category: 'geo-seo',
    description:
      'Cómo arquitectar un grafo de conocimiento de contenido usando el Keyword Nugget Pattern y clusters de temas. Convierte páginas individuales en un sistema interconectado donde cada pieza fortalece a todas las demás.',
    keywords: [
      'grafo de conocimiento de contenido',
      'keyword nugget pattern',
      'arquitectura de topic cluster',
      'estrategia de enlaces internos',
      'arquitectura de contenido',
      'estructura de contenido SEO',
      'sistema de ingeniería de contenido',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'build-content-engineering-system',
      'schema-markup-for-geo',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'Qué Es un Grafo de Conocimiento de Contenido',
        type: 'prose',
        content:
          'Un grafo de conocimiento de contenido es una red estructurada de contenido donde cada pieza es un nodo y cada referencia cruzada es un borde. Es lo opuesto a un blog plano donde los posts existen de forma aislada. En un grafo de conocimiento, una página de definición enlaza a una guía how-to que enlaza a un post de blog que enlaza a una página de comparación que enlaza de vuelta a la definición. Cada nodo fortalece a todos los demás nodos. Los motores de IA aman esto porque señala cobertura comprehensiva y autoridad temática.\n\nEn ShawnOS, el grafo de conocimiento es literal. Los objetos de datos TypeScript en engineering-terms.ts, how-to-wiki.ts, content-wiki.ts y context-wiki.ts son los nodos. Los arrays related son los bordes. Las páginas basadas en plantillas renderizan el grafo en HTML. Los enlaces internos programáticos conectan cada mención de un término a su página de definición automáticamente. El grafo no es una metáfora. Es la estructura de datos.',
      },
      {
        heading: 'El Keyword Nugget Pattern - Un Concepto Se Convierte en Cinco Páginas',
        type: 'pattern',
        content:
          'Toma un concepto. Crea cinco o más páginas interconectadas a partir de él. Un término de conocimiento lo define. Una guía how-to lo enseña. Un post de blog cuenta la historia de construirlo. Una entrada wiki proporciona la referencia completa. Una página de comparación lo posiciona contra alternativas. Cada página apunta a diferentes intenciones de búsqueda para el mismo concepto subyacente.\n\nEjemplo: "Lead Scoring" se convierte en un término de conocimiento (definición y por qué importa), una guía how-to (cómo construir un modelo de lead scoring), un post de blog (por qué reconstruimos nuestro lead scoring en 2026), una entrada wiki (guía de referencia completa) y una página de comparación (lead scoring vs datos de intención). Las cinco páginas se enlazan entre sí. El término de conocimiento acumula autoridad de cada pieza que lo referencia. Este es un ciclo auto-reforzante que se acumula con el tiempo.',
      },
      {
        heading: 'Arquitectura de Topic Cluster - Tres Pilares',
        type: 'pattern',
        content:
          'Los topic clusters organizan tu grafo de conocimiento en pilares. Cada pilar cubre un tema amplio. Las páginas de cluster de soporte profundizan en subtemas. Cada página de cluster enlaza de vuelta al pilar y a páginas hermanas.\n\nShawnOS ejecuta tres pilares para GEO e ingeniería de contenido:\n\n1. GEO (Generative Engine Optimization) - qué es GEO, GEO vs SEO vs AEO, cómo los motores de IA obtienen contenido, factores de ranking, extractabilidad de contenido, autoridad de entidad, schema markup para GEO, herramientas de monitoreo.\n\n2. Ingeniería de Contenido - qué es, arquitectura de grafos de conocimiento, diseño de topic clusters, enlaces internos, el keyword nugget pattern, jerarquía de tipos de contenido, sistemas de contenido programático, construir tu propio sistema de contenido.\n\n3. SEO en la Era de la IA - fundamentos de SEO técnico, guía de schema markup, optimización de RSS y feeds, robots.txt para crawlers de IA, implementación de llms.txt, señales de frescura de contenido.\n\nCada pilar tiene 8-10 páginas de soporte. La página pilar enlaza a todas ellas. Todas enlazan de vuelta.',
      },
      {
        heading: 'Enlaces Internos que Crean Ciclos de Autoridad',
        type: 'formula',
        content:
          'La fórmula: cada mención de un término definido en cualquier parte de tu sitio debe enlazar a la página de definición de ese término. Cada página de definición debe enlazar a la guía how-to, la entrada wiki y cualquier post de blog que cubra el mismo concepto. Cada guía how-to debe referenciar los términos que enseña. Esto crea ciclos donde la autoridad fluye continuamente entre páginas.\n\nEn un monorepo con datos compartidos, esto es programático. Un componente escanea el contenido de la página buscando nombres de términos y los auto-enlaza. El array related en cada entrada de datos define conexiones explícitas. Los enlaces entre sitios entre shawnos.ai, thegtmos.ai y thecontentos.ai extienden el grafo a través de dominios. El resultado: agregar un nuevo término de conocimiento automáticamente crea enlaces desde cada página que menciona ese término. El grafo se crece a sí mismo.',
      },
    ],
  },

  {
    id: 'schema-markup-for-geo',
    title: 'Cómo Configurar Schema Markup para GEO',
    subtitle: 'Dile a los motores de IA exactamente qué es tu contenido con datos estructurados',
    category: 'geo-seo',
    description:
      'Cómo implementar schema markup que ayuda a los motores de IA a extraer y citar tu contenido. DefinedTerm, HowTo, FAQPage, BlogPosting y los patrones JSON-LD que aumentan la probabilidad de citación por IA.',
    keywords: [
      'schema markup GEO',
      'JSON-LD para IA',
      'datos estructurados SEO',
      'schema DefinedTerm',
      'schema markup HowTo',
      'schema FAQPage',
      'schema markup Next.js',
      'datos estructurados para citaciones de IA',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'create-llms-txt',
      'build-content-knowledge-graph',
    ],
    sections: [
      {
        heading: 'Por Qué el Schema Importa para los Motores de IA',
        type: 'prose',
        content:
          'El schema markup son datos estructurados incrustados en tus páginas usando JSON-LD que les dicen a las máquinas qué tipo de contenido están viendo. Sin schema, un motor de IA tiene que adivinar si una página es una definición, un tutorial, un post de blog o una página de producto. Con schema, se lo dices explícitamente. Las páginas con 3 o más tipos de schema tienen aproximadamente un 13% más de probabilidad de citación por motores de IA. El 96% de las citaciones de AI Overview provienen de fuentes con señales fuertes de E-E-A-T, y el schema es cómo haces esas señales legibles por máquinas. Esto no es opcional para GEO. Es infraestructura.',
      },
      {
        heading: 'Tipos de Schema por Tipo de Contenido',
        type: 'code',
        content:
          'Haz coincidir tu schema con tu tipo de contenido. Los términos de conocimiento y entradas de glosario usan DefinedTerm o Article más FAQPage más BreadcrumbList. Las guías how-to usan HowTo con elementos step más BreadcrumbList. Las entradas wiki usan TechArticle o Article más FAQPage. Los posts de blog usan BlogPosting con author y datePublished. Cada página en cada sitio también debe incluir schemas de Organization, Person (para el autor) y WebSite.\n\nEl paquete npm schema-dts te da tipos de TypeScript para todo el vocabulario de schema.org. Instálalo y obtienes autocompletado y verificación de tipos para cada propiedad de schema. No más adivinar si es datePublished o publishDate. Los tipos aplican la corrección en tiempo de build.',
      },
      {
        heading: 'Implementando Schema en Next.js con JSON-LD',
        type: 'code',
        content:
          'En Next.js, inyecta schema JSON-LD como una etiqueta script en tu página o componente de layout. Crea un componente reutilizable que tome datos de schema tipados y renderice la etiqueta script. En ShawnOS, el schema se genera a partir de los mismos objetos de datos TypeScript que renderizan el contenido de la página. El objeto de datos del término de conocimiento contiene el nombre, definición y términos relacionados. El componente de schema lee esos mismos campos y produce un bloque JSON-LD de DefinedTerm.\n\nEsto significa que el schema y el contenido nunca pueden desfasarse. Cuando actualizas una definición en engineering-terms.ts, el schema se actualiza automáticamente en el siguiente build. Sin sincronización manual. Sin campo separado de CMS para datos de schema. Una sola fuente de verdad renderizada de dos formas: una vez como contenido visible, una vez como datos estructurados invisibles.',
      },
      {
        heading: 'Probando y Validando Tu Schema',
        type: 'pro-tip',
        content:
          'Usa el Rich Results Test de Google para validar páginas individuales. Usa el Schema Markup Validator para verificaciones comprehensivas contra la especificación de schema.org. Ejecuta ambos después de cada despliegue que cambie la estructura de contenido. Errores comunes: campos requeridos faltantes (HowTo necesita al menos un elemento step), tipos que no coinciden (usar Article cuando DefinedTerm es más específico) y schema huérfano (datos estructurados que no coinciden con el contenido visible de la página). Google advierte explícitamente contra schema que no refleja lo que los usuarios ven en la página. El schema debe describir tu contenido, no inventar contenido que no existe.',
      },
    ],
  },

  {
    id: 'create-llms-txt',
    title: 'Cómo Crear un Archivo llms.txt',
    subtitle: 'Dale a los asistentes de IA un mapa legible por máquinas del contenido de tu sitio',
    category: 'geo-seo',
    description:
      'Cómo crear un archivo llms.txt que ayude a los LLMs y asistentes de IA a descubrir y entender el contenido de tu sitio. Formato, estructura, ubicación y mejores prácticas.',
    keywords: [
      'llms.txt',
      'archivo llms txt',
      'descubrimiento de sitio LLM',
      'descubrimiento de contenido IA',
      'formato llms.txt',
      'cómo crear llms.txt',
      'mapa de sitio para asistentes IA',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'schema-markup-for-geo',
      'build-content-engineering-system',
    ],
    sections: [
      {
        heading: 'Qué Es llms.txt y Por Qué Existe',
        type: 'prose',
        content:
          'llms.txt es un archivo legible por máquinas que se ubica en la raíz de tu sitio y ayuda a los LLMs y asistentes de IA a entender qué contiene tu sitio y cómo está organizado. Piénsalo como robots.txt para la comprensión de IA. robots.txt les dice a los crawlers a qué pueden acceder. llms.txt les dice a los asistentes de IA qué hay realmente ahí y de qué se trata. Cuando un asistente de IA encuentra tu dominio, llms.txt le da contexto instantáneo - descripción del sitio, tipos de contenido, URLs de feeds, temas clave. Es un archivo de texto pequeño con un impacto enorme en la descubribilidad por IA. El formato es markdown simple con algunas convenciones.',
      },
      {
        heading: 'El Formato y Estructura de llms.txt',
        type: 'code',
        content:
          'El archivo sigue una estructura markdown simple. Comienza con un encabezado de nivel uno que contiene el nombre de tu sitio. Agrega una cita en bloque con una descripción de una oración. Luego usa encabezados de nivel dos para organizar secciones: About (autor, stack tecnológico, red), Content Types (rutas y descripciones para cada tipo de contenido), Feeds (URLs de RSS y otros feeds) y Key Topics (lista con viñetas de lo que tu sitio cubre).\n\nMantenlo conciso. Este no es un sitemap completo. Es un mapa de contenido de alto nivel que ayuda a los asistentes de IA a decidir si tu sitio es relevante para una consulta y dónde buscar tipos específicos de información. Cada entrada de tipo de contenido debe incluir la ruta URL y una breve descripción de lo que hay ahí. Las URLs de feeds ayudan a los asistentes de IA a descubrir tu contenido más reciente sin rastrear cada página.',
      },
      {
        heading: 'Dónde Ponerlo y Cómo Probarlo',
        type: 'pattern',
        content:
          'Coloca llms.txt en tu directorio público para que se sirva en tudominio.com/llms.txt. En una app Next.js, eso significa la carpeta public/ en la raíz de la app. En ShawnOS, cada uno de los tres sitios tiene su propio llms.txt adaptado al contenido de ese sitio. shawnos.ai/llms.txt mapea el blog, la base de conocimiento, la wiki how-to, los logs diarios y todas las secciones wiki. thegtmos.ai/llms.txt mapea la base de conocimiento GTM y la Clay wiki. thecontentos.ai/llms.txt mapea la wiki de contenido.\n\nPruébalo navegando a la URL en tu navegador. Deberías ver el texto markdown sin formato. Luego pruébalo preguntándole a un asistente de IA sobre tu sitio y verificando si referencia los tipos de contenido y la estructura descrita en tu llms.txt. El archivo aún no está ampliamente estandarizado, pero la adopción temprana significa que estás indexado antes de que el estándar se sature.',
      },
    ],
  },

  {
    id: 'build-content-engineering-system',
    title: 'Cómo Construir Tu Propio Sistema de Ingeniería de Contenido',
    subtitle: 'Sé dueño del pipeline de extremo a extremo - sin CMS, sin dependencia de proveedores, control total',
    category: 'geo-seo',
    description:
      'Cómo construir un sistema de ingeniería de contenido que controles completamente. Arquitectura monorepo, objetos de datos TypeScript como grafo de contenido, feeds RSS programáticos, schema automatizado e iteración a hipervelocidad.',
    keywords: [
      'sistema de ingeniería de contenido',
      'construye tu propio CMS',
      'arquitectura de contenido monorepo',
      'contenido programático',
      'automatización de pipeline de contenido',
      'gestión de contenido TypeScript',
      'sistema operativo de contenido',
      'ingeniería de contenido vs CMS',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-knowledge-graph',
      'optimize-for-ai-citations',
      'schema-markup-for-geo',
      'create-llms-txt',
      'build-sqlite-content-index',
      'build-remotion-video-system',
    ],
    sections: [
      {
        heading: 'Por Qué Ser Dueño del Sistema Supera a Usar una Plataforma',
        type: 'prose',
        content:
          'La victoria no es ninguna herramienta individual. Es construir un sistema que controles completamente que te da refinamiento completo sobre tu pipeline de ingeniería de contenido a hipervelocidad. Un CMS te da un formulario y un botón de publicar. Un sistema de ingeniería de contenido te da un codebase donde cada tipo de contenido es una interfaz TypeScript, cada página es una plantilla, cada enlace es programático y cada despliegue actualiza tres sitios simultáneamente. Cambias un archivo de datos y la base de conocimiento, los feeds RSS, los sitemaps y el schema markup se actualizan en un solo push. Sin pasos manuales. Sin limitaciones de plataforma. Sin dependencia de proveedores. Tu grafo de conocimiento es un activo que posees, almacenado en archivos TypeScript versionados, no atrapado en una base de datos SaaS de la que no puedes exportar.',
      },
      {
        heading: 'La Arquitectura Monorepo - Paquetes Compartidos a Través de Tres Sitios',
        type: 'pattern',
        content:
          'ShawnOS es un monorepo Turborepo con tres apps Next.js (shawnos.ai, thegtmos.ai, thecontentos.ai) y un paquete compartido. El paquete compartido contiene todo lo que cruza los límites de los sitios: componentes, archivos de datos, infraestructura de feeds RSS, definiciones de tipos y funciones de utilidad. Cada app importa del paquete compartido. Una biblioteca de componentes, una capa de datos, un conjunto de tipos.\n\nEsto significa que un nuevo término de conocimiento agregado a engineering-terms.ts está inmediatamente disponible en los tres sitios. Una actualización de componente de schema se propaga a todos lados. Una mejora de feed RSS funciona a través de todos los feeds. El monorepo elimina la duplicación y asegura la consistencia. No necesitas tres sitios para beneficiarte de este patrón. Incluso un solo sitio gana al separar datos, componentes y configuración de la app en paquetes distintos.',
      },
      {
        heading: 'Archivos de Datos como Grafo de Contenido - Objetos TypeScript No CMS',
        type: 'code',
        content:
          'Cada pieza de contenido en ShawnOS es un objeto TypeScript en un archivo de datos. Los términos de conocimiento son objetos con campos name, definition, whyItMatters, howYouUseIt y related. Las entradas wiki tienen campos id, title, subtitle, category, description, keywords, sections y related. Las interfaces TypeScript aplican la estructura en tiempo de build. No puedes publicar un término de conocimiento sin una definición. No puedes crear una entrada wiki sin secciones.\n\nEste es el grafo de contenido. Los archivos de datos son los nodos. Los arrays related y las referencias cruzadas son los bordes. Las páginas basadas en plantillas leen los datos y renderizan HTML. Nunca escribes HTML directamente. Escribes datos y el sistema los renderiza. Agregar un nuevo tipo de contenido significa definir una nueva interfaz y una nueva plantilla. El sistema escala horizontalmente sin crecimiento de complejidad.',
      },
      {
        heading: 'Infraestructura de Feeds RSS - Siete Feeds Auto-Generados',
        type: 'pattern',
        content:
          'La infraestructura de RSS vive en packages/shared/lib/rss/. Usa el paquete npm feed para generar RSS 2.0, Atom 1.0 y JSON Feed 1.1 a partir de los mismos objetos de datos que renderizan las páginas. Las funciones de fuente de contenido convierten cada tipo de datos (posts de blog, entradas wiki, términos de conocimiento, logs diarios) en objetos FeedItem estandarizados. Una utilidad de merge deduplica y ordena items por fecha.\n\nshawnos.ai sirve siete feeds: blog, todo el contenido, términos de conocimiento, guías how-to, logs diarios, logs de terminal de Nio y actualizaciones. Cada feed es un route handler de Next.js que llama a getFeedConfig, convierte los datos relevantes en feed items y devuelve una Response con los headers correctos de Content-Type y Cache-Control. Agregar un nuevo feed toma cinco líneas de código. Toda la infraestructura de feeds se regenera en cada despliegue porque los archivos de datos son la fuente de verdad.',
      },
      {
        heading: 'El Resultado: Iteración a Hipervelocidad con Control Completo',
        type: 'pro-tip',
        content:
          'El estado final es un sistema donde agregar contenido es agregar datos, no navegar por un CMS. Abro engineering-terms.ts, agrego un nuevo objeto de término, guardo el archivo y hago push. Al desplegarse, ese término aparece en la página de conocimiento, obtiene su propio enlace ancla, aparece en el feed RSS, obtiene schema markup, aparece en el sitemap y está disponible para enlaces internos programáticos desde cada página que lo menciona. Tiempo total: menos de dos minutos.\n\nEsta es la ventaja competitiva que herramientas como AirOps complementan pero no pueden reemplazar. AirOps es excelente para inteligencia competitiva, monitoreo de citaciones y seguimiento de share-of-voice. Úsalo para visibilidad de cómo tu contenido se desempeña a través de motores de IA. Pero el sistema en sí - el grafo de contenido, las plantillas, la automatización, los feeds, el pipeline de schema - eso es tuyo. Sé dueño del sistema. Usa herramientas para monitorearlo. El sistema es el foso.',
      },
    ],
  },

  {
    id: 'build-remotion-video-system',
    title: 'Cómo Construir un Sistema de Renderizado de Video con React y Remotion',
    subtitle:
      'Sin GPU, sin After Effects - componentes React que renderizan a MP4 dentro de tu monorepo',
    category: 'cli-tools',
    description:
      'Cómo construir un pipeline de renderizado de video programático usando Remotion y React. Arquitectura basada en escenas, salida multi-aspect-ratio, animación determinista con ruido Perlin e integración con monorepo usando design tokens compartidos.',
    keywords: [
      'remotion react video',
      'renderizado de video programático',
      'sistema de video react',
      'remotion monorepo',
      'video multi-aspect-ratio',
      'animación determinista',
      'pipeline de video react',
      'tutorial remotion',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-engineering-system',
      'build-sqlite-content-index',
    ],
    sections: [
      {
        heading: 'Qué Es Remotion y Por Qué Encaja',
        type: 'prose',
        content:
          'Remotion es un framework de React que renderiza video frame por frame. Escribes componentes JSX. Remotion evalúa cada frame a tu FPS objetivo y codifica el resultado a MP4, WebM o GIF. No se requiere GPU. No hay editor de timeline. No hay After Effects. Todo el pipeline se ejecuta en Node.js en una laptop estándar. La ventaja clave para una configuración monorepo es que los componentes de video pueden importar los mismos paquetes compartidos que tus sitios web. Design tokens, objetos de datos, paletas de colores y definiciones de tipos se comparten a través de todo el codebase. Cambia un valor hex en el paquete compartido y los sitios web y los videos se actualizan en el siguiente build.',
      },
      {
        heading: 'Arquitectura Multi-Aspect-Ratio',
        type: 'pattern',
        content:
          'Define presets de aspect ratio como un objeto constante: linkedin (1080x1350, 4:5), reels (1080x1920, 9:16), landscape (1920x1080, 16:9). Crea un hook useScale() que normaliza todo el renderizado a una resolución base (1080x1350) y escala proporcionalmente. Cada marca obtiene tres composiciones en Root.tsx - una por aspect ratio - compartiendo el mismo árbol de componentes. Nueve composiciones totales de un solo codebase: tres marcas por tres formatos. El registro de composiciones es la única fuente de verdad para lo que se renderiza. Agregar una nueva marca significa agregar tres líneas a Root.tsx, no reconstruir ningún componente.',
      },
      {
        heading: 'Composición Basada en Escenas con TransitionSeries',
        type: 'code',
        content:
          'Cada video es una secuencia de escenas conectadas por TransitionSeries de @remotion/transitions. Cada escena es un componente React con un conteo de frames fijo definido en un archivo de configuración de timing central. La configuración de timing V3 define cuatro escenas totalizando 310 frames a 30fps (aproximadamente 10 segundos): Hook (36 frames), BootWikiBlitz (110 frames), Progression (100 frames), CtaNetwork (94 frames), con superposiciones de 10 frames entre escenas para transiciones suaves. El archivo de timing es el único punto de control para el ritmo del video. Cambiar un número cambia todo el ritmo sin tocar ningún código de componente.',
      },
      {
        heading: 'Animación Determinista con Ruido Perlin',
        type: 'pattern',
        content:
          'Remotion requiere renderizado determinista. Math.random() produce valores diferentes por frame y rompe el render. La solución es ruido Perlin de @remotion/noise. La función noise2D toma una cadena de semilla, coordenadas x e y y devuelve un float determinista. Alimenta el ruido por instancia de componente (índice de columna, índice de partícula) y condúcelo con el número de frame. MatrixRain usa ruido para selección de caracteres, deriva de columna y brillo de opacidad. ParticleField usa dos streams de ruido independientes para deriva x e y más un tercero para pulso. TypewriterText usa matemáticas simples de frame para revelación de caracteres. Misma semilla, misma salida, cada render. Animación orgánica que es completamente reproducible.',
      },
      {
        heading: 'SceneWrapper y Tratamiento Visual',
        type: 'pattern',
        content:
          'Un componente SceneWrapper aplica tratamiento visual consistente a cada escena: fondo de lienzo oscuro, viñeta radial para oscurecimiento de bordes, lavado de color de acento a baja opacidad, campo de partículas ambientales, grano de película vía SVG feTurbulence y superposición de scanlines para una estética CRT. El wrapper acepta un prop de color de acento que tiñe toda la escena. La escena BootWikiBlitz cicla a través de la paleta de la marca mientras las tarjetas wiki giran - verde, teal, ámbar, púrpura - dándole a cada tarjeta una sensación distinta mientras mantiene consistencia visual. Los design tokens viven en un archivo tokens.ts que mapea nombres de marca a colores y define la familia de fuentes compartida.',
      },
      {
        heading: 'Pipeline de Renderizado y Despliegue',
        type: 'pro-tip',
        content:
          'Ejecuta npm run render:all para generar las nueve variantes. Remotion renderiza cada composición a frames y luego codifica a MP4. Las salidas van a website/apps/video/out/ y se despliegan al directorio public/video/ de cada sitio. El índice de contenido SQLite rastrea todos los archivos de video con su marca, aspect ratio, formato y estado de despliegue. Todo el pipeline se ejecuta localmente en un MacBook. Sin granja de render en la nube. Sin servicio externo. El CI del monorepo puede disparar renders en push si es necesario, pero para velocidad de iteración, el renderizado local a 30fps para videos de 10 segundos toma segundos, no minutos.',
      },
    ],
  },

  {
    id: 'build-sqlite-content-index',
    title: 'Cómo Construir un Índice de Contenido SQLite para Tu Repo',
    subtitle:
      'Convierte tu sistema de archivos en una base de datos consultable con cero dependencias externas',
    category: 'cli-tools',
    description:
      'Cómo construir un índice de contenido SQLite que haga todo tu repo consultable. Parsing de contenido multi-plataforma, detección de referencias cruzadas, inventario de assets y una interfaz CLI de consultas - todo con solo la librería estándar de Python.',
    keywords: [
      'índice de contenido sqlite',
      'base de datos de contenido del repo',
      'gestión de contenido sqlite',
      'consultar archivos de contenido',
      'CLI de índice de contenido',
      'enlaces de contenido cross-platform',
      'detección de páginas muertas',
      'herramienta de auditoría de contenido',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-engineering-system',
      'build-remotion-video-system',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'Por Qué un Índice SQLite para Contenido',
        type: 'prose',
        content:
          'Un repo con más de 100 archivos de contenido a través de 6 plataformas se vuelve opaco. El sistema de archivos organiza archivos por ruta pero no puede responder preguntas como: cuántos posts se finalizaron esta semana, qué contenido tiene hermanos cross-platform, o cuál es el conteo total de palabras de febrero. Una base de datos SQLite ubicada junto al repo te da consultas SQL sobre tu contenido sin cambiar la fuente de verdad. El índice es dato derivado - reconstruido de archivos rastreados por git en cada ejecución. Elimina la base de datos, ejecuta el script, obtén el mismo resultado. Cero dependencias externas. Solo la librería estándar de Python: json, sqlite3, pathlib, re.',
      },
      {
        heading: 'Diseño del Schema - Nueve Tablas',
        type: 'code',
        content:
          'El schema cubre cada tipo de contenido en el repo. La tabla content contiene cada borrador y final a través de todas las plataformas con campos para platform, stage, title, slug, date, pillar, arc, series y word count. daily_logs rastrea métricas de rendimiento. sessions es solo-append y sobrevive reconstrucciones del índice - registros históricos, no datos derivados. skills indexa el registro de skills de Claude y Cursor. content_links almacena el grafo de relaciones con dos tipos de enlace: series_sibling (auto-detectado) y cross_platform_note (parseado del contenido). assets cataloga assets visuales con metadatos estructurados parseados de nombres de archivos. videos y thumbnails rastrean el pipeline de video. El principio de diseño del schema: cada tabla mapea a un tipo de contenido, cada fila se deriva de un archivo, cada reconstrucción es idempotente.',
      },
      {
        heading: 'Parsing de Metadatos - Dos Formatos',
        type: 'pattern',
        content:
          'Los archivos de contenido usan dos formatos de metadatos. La mayoría de las plataformas usan sintaxis de blockquote: > **Key**: Value en la parte superior del archivo. Los posts del sitio web usan frontmatter YAML entre delimitadores ---. El parser detecta el formato automáticamente y extrae campos estructurados. El título se extrae de los metadatos o recurre al primer encabezado #. El conteo de palabras elimina el frontmatter antes de contar. El parser de formato dual significa que no necesitas estandarizar todo tu repo de contenido a un solo formato. Encuentra el contenido donde está.',
      },
      {
        heading: 'Detección de Enlaces Cross-Platform',
        type: 'pattern',
        content:
          'El índice descubre relaciones entre archivos de contenido automáticamente. La detección implícita de hermanos coincide archivos con (date, slug) idénticos a través de plataformas y crea enlaces series_sibling. Si tienes linkedin/final/2026-02-17_build-your-own-os.md y substack/final/2026-02-17_build-your-own-os.md, el índice los enlaza sin anotación manual. La detección explícita de referencias cruzadas parsea secciones de Cross-Platform Notes, busca palabras clave de plataforma con alias, y coincide con contenido existente por fecha y plataforma. Esto crea un grafo de contenido consultable que muestra cómo las piezas se relacionan a través de tu pipeline de publicación.',
      },
      {
        heading: 'Inventario de Assets y Videos',
        type: 'code',
        content:
          'Los patrones de nombres de archivo codifican metadatos estructurados. El parser de assets extrae type, tier, class, variant y size de nombres de archivo como tier-3-idle-256.gif o class-alchemist-static.png. El parser de video extrae brand, aspect ratio y format de nombres de archivo como contentos-landscape o gtmos-linkedin-4x5. Los alias de marca manejan variaciones - lead-magnet mapea a shawnos, por ejemplo. El resultado es un inventario consultable de cada asset visual en el repo sin catalogación manual. Ejecuta una consulta para encontrar todas las animaciones idle de tier-3 para shawnos. Ejecuta otra para encontrar videos desplegados que faltan en un sitio específico.',
      },
      {
        heading: 'Detección de Páginas Muertas y Brechas de Contenido',
        type: 'pro-tip',
        content:
          'Consulta la tabla content por archivos con cero enlaces entrantes desde content_links - esos son huérfanos, contenido que existe pero nada apunta hacia él. Consulta por archivos con cero enlaces salientes - esos son callejones sin salida que no conectan hacia adelante. El uso más poderoso es la detección de brechas: consulta por temas esperados que tienen cero cobertura. Así es como el índice reveló su propia brecha. Tres sistemas principales se lanzaron sin cobertura de blog. La herramienta que encuentra brechas de contenido encontró brechas de contenido sobre la herramienta. Usa el índice como un instrumento de auditoría de contenido, no solo un catálogo. Ejecútalo semanalmente. Deja que las consultas te digan qué escribir a continuación.',
      },
    ],
  },

  {
    id: 'content-cluster-strategy',
    title: 'Cómo Diseñar una Estrategia de Content Cluster a Través de Múltiples Sitios',
    subtitle:
      'Topología hub-and-spoke, enrutamiento canónico y enlaces entre sitios que acumulan autoridad',
    category: 'geo-seo',
    description:
      'Cómo diseñar una estrategia de content cluster que abarque múltiples sitios web. Topología hub-and-spoke, enrutamiento basado en taxonomía, designación de sitio canónico, enlaces bidireccionales entre sitios y schema de breadcrumb que le dice a los motores de IA exactamente cómo se conecta tu contenido.',
    keywords: [
      'estrategia de content cluster',
      'contenido hub and spoke',
      'arquitectura de contenido multi-sitio',
      'enlaces entre sitios SEO',
      'topología de contenido',
      'enrutamiento de sitio canónico',
      'schema markup de breadcrumb',
      'arquitectura de topic cluster',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'build-content-knowledge-graph',
      'build-content-engineering-system',
      'optimize-for-ai-citations',
    ],
    sections: [
      {
        heading: 'Qué Es una Topología de Content Cluster',
        type: 'prose',
        content:
          'Una topología de content cluster es la arquitectura deliberada de cómo el contenido se conecta dentro y a través de sitios web. Las páginas individuales son nodos. Las referencias cruzadas y los enlaces internos son bordes. La topología determina cómo la autoridad fluye a través del grafo. Un blog plano sin enlaces internos es una colección de nodos desconectados - cada página empieza desde cero. Una topología de cluster con enlaces bidireccionales, vocabulario compartido y jerarquía explícita crea un grafo donde cada nueva página fortalece cada página existente. Los motores de IA evalúan la autoridad temática midiendo este grafo. Los sitios con cobertura comprehensiva e interconectada de un tema obtienen citación preferencial.',
      },
      {
        heading: 'Modelo Hub-and-Spoke',
        type: 'pattern',
        content:
          'Define un concepto padre como el hub. Ramifica verticales especializadas como spokes. El sitio hub cubre la meta-narrativa - el proceso de construir. Los sitios spoke cubren las salidas - lo que el proceso produce. En una arquitectura de tres sitios: el hub (shawnos.ai) cubre construir con IA y el viaje de construcción del sistema. El spoke uno (thegtmos.ai) cubre los flujos de trabajo GTM que el sistema produce. El spoke dos (thecontentos.ai) cubre la metodología de contenido que el sistema demuestra. La estructura recursiva es el punto. El contenido de cada sitio prueba la tesis de los otros dos sitios. El acto de construir ES el contenido del hub. Los flujos de trabajo producidos SON el contenido del spoke uno. La metodología de crear contenido ES el contenido del spoke dos.',
      },
      {
        heading: 'Enrutamiento Basado en Taxonomía',
        type: 'code',
        content:
          'Define la topología en un archivo de taxonomía versionado, no en la cabeza de alguien. Mapea cada pilar de contenido a un dominio. Mapea reglas de enrutamiento explícitamente: las historias personales se enrutan al hub, los sistemas GTM se enrutan al spoke uno, la estrategia de contenido se enruta al spoke dos. Los posts cross-domain obtienen un dominio primario más enlaces cruzados a hermanos. El archivo de taxonomía se convierte en la única fuente de verdad para la ubicación del contenido. Cualquier miembro del equipo, cualquier agente de IA, cualquier skill de automatización puede leer el archivo y saber dónde pertenece el contenido. El ciclo de vida de estado (draft, review, final, published, archived) se aplica uniformemente a través de todos los dominios.',
      },
      {
        heading: 'Designación de Sitio Canónico',
        type: 'pattern',
        content:
          'Cada entrada de contenido compartido obtiene un campo canonicalSite que designa qué dominio la renderiza nativamente. Cuando una guía how-to tiene canonicalSite configurado como gtmos, se renderiza en thegtmos.ai y genera una redirección desde shawnos.ai. El hub no duplica el contenido de los spokes - lo enruta hacia él. Esto previene penalizaciones por contenido duplicado mientras mantiene el grafo entre sitios. Los tres sitios importan el mismo paquete de datos TypeScript. La designación canónica es un campo en el objeto de datos, no una configuración de DNS o CMS. Agregar una nueva entrada entre sitios significa configurar un campo. El monorepo se encarga del resto.',
      },
      {
        heading: 'Enlaces Bidireccionales Entre Sitios',
        type: 'pattern',
        content:
          'Cada nueva entrada debe enlazar a entradas relacionadas existentes. Cada entrada existente que se relaciona con la nueva debe enlazar de vuelta. Esto crea bordes bidireccionales en el grafo de contenido. Sin callejones sin salida, sin huérfanos. La implementación es simple: arrays related en cada objeto de datos. Cuando agregas una nueva guía how-to, llena su array related con IDs de guías existentes. Luego actualiza esas guías existentes para incluir el nuevo ID en sus arrays related. Las páginas de plantilla renderizan estos arrays como enlaces clicables. Los enlaces internos programáticos manejan conexiones a nivel de mención. El resultado es un grafo donde puedes alcanzar cualquier nodo desde cualquier otro nodo en dos o tres clicks.',
      },
      {
        heading: 'Schema de Breadcrumb para Motores de IA',
        type: 'pro-tip',
        content:
          'Los breadcrumbs no son solo navegación - son señales de topología. El schema markup BreadcrumbList en JSON-LD les dice a los motores de búsqueda y motores de IA exactamente dónde se ubica una página en tu jerarquía. Una guía how-to en gtmos obtiene breadcrumbs: GTMOS, How-To, Content Cluster Strategy. Esto comunica que gtmos es el sitio de autoridad para este tema. Los breadcrumbs entre sitios les dicen a los motores de IA que el hub y los spokes son parte de una entidad. Combinado con schema sameAs conectando los tres dominios, la jerarquía de breadcrumbs señala un cluster multi-sitio, no tres blogs independientes. Los motores de IA con 15 o más entidades reconocidas tienen una probabilidad de citación 4.8x mayor. La arquitectura de cluster es cómo construyes el conteo de entidades.',
      },
    ],
  },

  {
    id: 'parallel-session-handoffs',
    title: 'Traspasos de Sesión Paralelo-Seguros',
    subtitle: 'Deja de perder contexto cuando múltiples terminales escriben al mismo tiempo',
    category: 'parallel-agents',
    description:
      'Cómo actualizar de un solo archivo de traspaso de contexto a un sistema basado en directorio paralelo-seguro. Escrituras con timestamp, leer-todo-al-iniciar, consumo con marca-de-hecho y auto-limpieza. El patrón que hace que 6 sesiones simultáneas de Claude Code dejen de sobrescribirse entre sí.',
    keywords: [
      'traspasos de contexto paralelos',
      'sistema de traspaso claude code',
      'contexto de agentes paralelos',
      'arquitectura de traspaso de sesión',
      'condición de carrera en traspaso de contexto',
      'multi-terminal claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'El Problema con Un Solo Archivo de Traspaso',
        type: 'prose',
        content:
          'El patrón predeterminado de traspaso de contexto es un solo archivo en una ruta conocida. ~/.claude/context-handoff.md o similar. Cada sesión lo lee al iniciar y lo escribe al terminar. Esto funciona cuando ejecutas una terminal a la vez. Silenciosamente se rompe en el momento que ejecutas dos. La Terminal A escribe su traspaso. La Terminal B lo sobrescribe 30 segundos después. El contexto de la Terminal A desapareció y nunca lo notas porque el archivo sigue existiendo. Solo tiene el contenido equivocado. Esta es una condición de carrera de última-escritura-gana. Si ejecutas 4 a 6 terminales como yo, pierdes 3 a 5 sesiones de contexto cada día. El sistema se ve saludable porque siempre hay un archivo de traspaso ahí. El daño es invisible hasta que una sesión matutina arranca con la mitad del contexto faltando.',
      },
      {
        heading: 'Configurando el Directorio de Traspasos',
        type: 'code',
        content:
          'Paso 1: Crea el directorio.\n\nmkdir -p ~/.claude/handoffs\n\nPaso 2: Agrega la convención de nombres. Cada archivo de traspaso usa este formato:\n\n~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md\n\nEl timestamp tiene precisión de segundos. El slug es una descripción corta del trabajo de la sesión. Ejemplos:\n\n2026-02-27_143022_blog-pipeline-fix.md\n2026-02-27_143055_wiki-entry-batch.md\n2026-02-27_144501_deploy-verification.md\n\nPaso 3: Actualiza tu CLAUDE.md con las nuevas instrucciones. Agrega estas reglas a la sección de flujo de trabajo de sesión:\n\nAl iniciar sesión: lee todos los traspasos no consumidos de ~/.claude/handoffs/. Salta cualquier archivo que termine en _done.md. Después de leer, renombra cada archivo de .md a _done.md.\n\nAl terminar sesión: escribe un nuevo traspaso a ~/.claude/handoffs/ usando la convención de nombres con timestamp. Nunca sobrescribas otro archivo.',
      },
      {
        heading: 'Leyendo y Consumiendo Traspasos',
        type: 'pattern',
        content:
          'Al iniciar sesión, el agente hace tres cosas en orden.\n\nPrimero, lista todos los traspasos no consumidos:\nls ~/.claude/handoffs/*.md 2>/dev/null | grep -v \'_done.md$\'\n\nSegundo, lee cada archivo y fusiona el contexto. Si hay tres traspasos no consumidos de tres terminales diferentes, la nueva sesión obtiene los tres. Nada se pierde.\n\nTercero, marca cada archivo como consumido renombrándolo:\nmv file.md file_done.md\n\nEl sufijo _done.md es el marcador de consumo. Las sesiones futuras saltan estos archivos. El contenido original permanece en disco para referencia. Ningún dato se elimina durante el consumo, solo se renombra.\n\nEste patrón significa que no importa cuántas terminales escribieron traspasos durante la noche. La sesión matutina lee cada uno de ellos. El contexto de todas las sesiones paralelas se fusiona en un solo punto de partida.',
      },
      {
        heading: 'Auto-Limpieza',
        type: 'code',
        content:
          'Los traspasos consumidos se acumulan. Sin limpieza, el directorio crece indefinidamente. Agrega un paso de limpieza que se ejecute al iniciar sesión, después de leer y consumir:\n\nfind ~/.claude/handoffs -name \'*_done.md\' -mtime +7 -delete 2>/dev/null\n\nEsto elimina traspasos consumidos con más de 7 días de antigüedad. Los traspasos no consumidos nunca se eliminan. La ventana de 7 días te da suficiente historial para debuggear si algo salió mal. Ajusta la ventana según la frecuencia con que referencias traspasos antiguos.\n\nEl bloque completo de instrucciones para CLAUDE.md:\n\nAl Iniciar Sesión:\n1. Lee todos los traspasos no consumidos: ls ~/.claude/handoffs/*.md 2>/dev/null | grep -v \'_done.md$\'\n2. También verifica la ubicación legacy: ~/.claude/context-handoff.md\n3. Después de leer, marca cada uno como consumido: renombra file.md a file_done.md\n4. Limpia traspasos consumidos antiguos: find ~/.claude/handoffs -name \'*_done.md\' -mtime +7 -delete\n\nAl Terminar Sesión:\nEscribe traspaso a ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md. Nunca sobrescribas el traspaso de otra sesión.',
      },
      {
        heading: 'Actualizando Tus Archivos de Memoria',
        type: 'pro-tip',
        content:
          'Mientras actualizas los traspasos, actualiza tus archivos de memoria también. El mismo problema de archivo plano aplica. Un solo MEMORY.md que cada sesión lee y escribe crecerá hasta que alcance el límite de la ventana de contexto. A más de 200 líneas, el modelo empieza a ignorar la mitad inferior.\n\nLa solución es un patrón de índice. Mantén MEMORY.md como un índice liviano de menos de 200 líneas. Tiene encabezados de sección y resúmenes de una línea. Las notas detalladas viven en archivos de tema: identity.md, voice-rules.md, infrastructure.md, completed-work.md. MEMORY.md enlaza a ellos. Las sesiones solo cargan un archivo de tema cuando la tarea actual es relevante.\n\nEsto refleja cómo funciona el directorio de traspasos. En lugar de un archivo que hace todo, tienes archivos estructurados que se cargan bajo demanda. El índice siempre está en contexto. Los detalles se cargan cuando se necesitan. Ambas actualizaciones siguen el mismo principio: deja de poner todo en un archivo y empieza a usar estructura para gestionar la escala.',
      },
    ],
  },

  {
    id: 'env-files-explained',
    title: 'Archivos de Entorno Explicados',
    subtitle: 'Qué son los archivos .env, por qué importan y cómo configurarlos sin filtrar secretos',
    category: 'security',
    description:
      'Guía completa de archivos .env para desarrolladores y constructores. Qué son las variables de entorno, cómo crear y gestionar archivos .env, mejores prácticas de seguridad y los errores que filtran secretos a GitHub.',
    keywords: [
      'archivo env',
      'archivo .env',
      'archivos .env',
      'archivos de entorno',
      'qué es un archivo env',
      'qué es un archivo .env',
      'variables de entorno',
      'configuración de archivo env',
      'dotenv',
      'seguridad de archivo env',
      'archivo env gitignore',
      'cómo usar archivos env',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'constraints-and-context-engines',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'Qué Es Realmente un Archivo .env',
        type: 'prose',
        content:
          'Un archivo .env es un archivo de texto plano que almacena valores de configuración que tu aplicación necesita para ejecutarse. API keys, contraseñas de base de datos, URLs de servicios, feature flags. Un par key-value por línea. No se necesitan comillas (aunque algunos parsers las aceptan). Sin sintaxis especial.\n\nEl archivo se ubica en la raíz de tu proyecto y nunca se hace commit a Git. Tu código lee de él usando process.env.VARIABLE_NAME en Node.js o os.environ en Python. Los valores existen solo en tu máquina. Tu compañero de equipo tiene su propio .env con sus propias keys. Producción tiene su propio conjunto en la plataforma de hosting.\n\nEl nombre empieza con un punto, lo que lo convierte en un archivo oculto en Mac y Linux. Eso es intencional. No debería ser visible por defecto porque contiene secretos.',
      },
      {
        heading: 'Por Qué Necesitas Uno',
        type: 'pattern',
        content:
          'Tres problemas que los archivos .env resuelven.\n\nPrimero, seguridad. Las API keys hardcodeadas en archivos de código fuente terminan en GitHub. Los bots escanean repos públicos buscando keys expuestas dentro de minutos de un push. Las keys de AWS se roban. Las keys de Stripe se roban. Pasa constantemente. Los archivos .env mantienen los secretos fuera del control de versiones completamente.\n\nSegundo, portabilidad. Tu máquina local, tu servidor de staging y tu servidor de producción todos necesitan diferentes URLs de base de datos, diferentes endpoints de API, diferentes feature flags. Mismo codebase, diferentes variables de entorno. Despliegas el mismo código en todos lados y el archivo .env le dice cómo comportarse.\n\nTercero, colaboración. Tu compañero de equipo usa sus propias API keys. Tu pipeline de CI usa keys de cuenta de servicio. Nadie comparte credenciales a través de Slack o email. Cada uno tiene su propio archivo .env con sus propios valores.',
      },
      {
        heading: 'Configurándolo',
        type: 'code',
        content:
          'Paso 1: Crea el archivo en la raíz de tu proyecto.\n\ntouch .env\n\nPaso 2: Agrega tus variables. Una por línea. Sin espacios alrededor del signo de igual.\n\nAPI_KEY=sk_live_abc123\nDATABASE_URL=postgres://user:pass@localhost:5432/mydb\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\nDEBUG=true\n\nPaso 3: Agrega .env a tu .gitignore inmediatamente. Esto es innegociable.\n\necho ".env" >> .gitignore\necho ".env.local" >> .gitignore\necho ".env*.local" >> .gitignore\n\nPaso 4: Instala un loader si tu framework no tiene uno integrado. Next.js carga archivos .env automáticamente. Para otros proyectos Node.js, usa dotenv:\n\nnpm install dotenv\n\nLuego en la parte superior de tu archivo de entrada:\n\nrequire(\'dotenv\').config()\n\nPaso 5: Accede a las variables en tu código.\n\nNode.js: process.env.API_KEY\nPython: os.environ.get(\'API_KEY\')\nNext.js (lado del cliente): process.env.NEXT_PUBLIC_SITE_URL\n\nEl prefijo NEXT_PUBLIC_ en Next.js significa que la variable está expuesta al navegador. Sin ese prefijo, permanece solo del lado del servidor. Esto importa. No pongas keys secretas detrás de NEXT_PUBLIC_.',
      },
      {
        heading: 'La Jerarquía de Archivos .env',
        type: 'pattern',
        content:
          'La mayoría de los frameworks soportan múltiples archivos .env con una prioridad de carga. Next.js los carga en este orden, con archivos posteriores sobrescribiendo a los anteriores:\n\n.env (valores base por defecto, se puede hacer commit al repo si no hay secretos)\n.env.local (sobrescrituras locales, nunca se hace commit)\n.env.development (solo en modo de desarrollo)\n.env.development.local (sobrescrituras locales de desarrollo)\n.env.production (solo en builds de producción)\n.env.production.local (sobrescrituras locales de producción)\n\nLos archivos .local siempre sobrescriben a los archivos no locales. Los archivos específicos de entorno sobrescriben al .env base. Esto te permite hacer commit de valores seguros por defecto en .env mientras mantienes los secretos en .env.local.\n\nUn patrón común: .env tiene NEXT_PUBLIC_SITE_URL=https://tusitio.com como el valor por defecto de producción. .env.local lo sobrescribe a http://localhost:3000 para desarrollo local. Sin cambios de código necesarios para alternar entre entornos.',
      },
      {
        heading: 'Los Errores que Filtran Secretos',
        type: 'pro-tip',
        content:
          'Error 1: Olvidar agregar .env a .gitignore antes del primer commit. Una vez que un archivo es rastreado por Git, agregarlo a .gitignore después no lo remueve del historial. Necesitas git rm --cached .env para dejar de rastrearlo, luego force push. Si ya hiciste push a un repo público, rota cada key en ese archivo inmediatamente. Las keys antiguas están en el historial de Git para siempre.\n\nError 2: Usar el prefijo NEXT_PUBLIC_ en keys secretas. NEXT_PUBLIC_STRIPE_SECRET_KEY es visible en el bundle del navegador. Cualquiera puede inspeccionarla. Solo usa el prefijo público para valores que son seguros de exponer, como la URL de tu sitio o una API key pública.\n\nError 3: Compartir archivos .env a través de Slack o email. Usa un gestor de contraseñas, un vault de secretos o una herramienta de compartición segura. Los archivos .env en historiales de chat se indexan, cachean y respaldan en lugares que no puedes controlar.\n\nError 4: No crear un archivo .env.example. Esta es una plantilla que muestra qué variables espera tu app, sin los valores reales. Haz commit de esto al repo para que los nuevos desarrolladores sepan qué llenar.\n\nAPI_KEY=\nDATABASE_URL=\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n\nError 5: Imprimir variables de entorno en logs durante debugging y olvidar remover las sentencias de log. console.log(process.env) vuelca cada secreto a cualquier servicio de logging que uses.',
      },
      {
        heading: 'Variables de Entorno en Producción',
        type: 'pattern',
        content:
          'En producción, no usas archivos .env. Configuras variables de entorno directamente en tu plataforma de hosting.\n\nVercel: Settings > Environment Variables. Agrega cada par key-value. Elige a qué entornos aplica (Production, Preview, Development).\n\nRailway: pestaña Variables en la configuración de tu servicio.\n\nAWS: Parameter Store o Secrets Manager.\n\nEl principio es el mismo en todos lados. Los secretos viven en la plataforma, no en archivos. Tu código lee de process.env sin importar de dónde vengan los valores. Localmente vienen del .env. En producción vienen de la plataforma. Tu código no necesita saber la diferencia.',
      },
    ],
  },

  {
    id: 'heyreach-linkedin-automation',
    title: 'Automatización de LinkedIn con HeyReach',
    subtitle: 'Configura HeyReach para outreach de LinkedIn multi-sender con calentamiento adecuado y estructura de campañas',
    category: 'mcp-servers',
    description:
      'Guía completa de HeyReach para automatización de outreach en LinkedIn. Arquitectura multi-sender, configuración de campañas, secuencias de solicitudes de conexión, estrategia de calentamiento e integración con Clay e Instantly para GTM full-funnel.',
    keywords: [
      'heyreach',
      'configuración de heyreach',
      'automatización de linkedin heyreach',
      'campañas heyreach',
      'herramienta de automatización de linkedin',
      'guía de heyreach',
      'automatización de outreach linkedin',
      'heyreach multi sender',
      'integración heyreach clay',
      'heyreach mcp',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Qué Es HeyReach',
        type: 'prose',
        content:
          'HeyReach es una herramienta de automatización de LinkedIn construida para outreach multi-sender. La idea central: conecta múltiples cuentas de LinkedIn a un workspace y ejecuta campañas a través de todas ellas simultáneamente. Una persona puede gestionar 5, 10, 20 cuentas de sender desde un solo dashboard.\n\nPor qué importa el multi-sender: LinkedIn limita cada cuenta a aproximadamente 100 solicitudes de conexión por semana y 150 vistas de perfil por día. Una cuenta se agota rápido. Cinco cuentas ejecutando la misma campaña alcanzan 500 conexiones por semana. Las matemáticas son directas. Más senders significa más pipeline.\n\nHeyReach maneja la rotación automáticamente. Construyes una campaña, asignas senders, subes una lista de leads y distribuye el outreach entre las cuentas. También gestiona el calentamiento, los límites de solicitudes de conexión y el seguimiento de respuestas por cuenta.',
      },
      {
        heading: 'Configuración de Cuenta y Senders',
        type: 'code',
        content:
          'Paso 1: Crea tu workspace de HeyReach en app.heyreach.io. Un workspace por equipo o agencia.\n\nPaso 2: Conecta cuentas de LinkedIn. HeyReach usa una extensión de navegador o autenticación basada en cookies para vincular cuentas. Cada cuenta se convierte en un "sender" en el workspace.\n\nReglas de calentamiento para nuevos senders:\nSemana 1: 10 solicitudes de conexión por día, 30 vistas de perfil\nSemana 2: 15 solicitudes de conexión por día, 50 vistas de perfil\nSemana 3: 20 solicitudes de conexión por día, 80 vistas de perfil\nSemana 4+: 25 solicitudes de conexión por día, 100 vistas de perfil\n\nNo saltes el calentamiento. LinkedIn marca cuentas que pasan de cero actividad a 100 solicitudes de la noche a la mañana. El período de calentamiento construye un patrón de actividad natural que mantiene las cuentas seguras.\n\nPaso 3: Configura límites diarios por sender en Settings > Sender Limits. Sé conservador. 20-25 solicitudes de conexión por día por cuenta es el techo seguro. Algunas cuentas pueden manejar más, pero el riesgo de restricción sube después de 30.',
      },
      {
        heading: 'Arquitectura de Campañas',
        type: 'pattern',
        content:
          'Una campaña de HeyReach tiene tres componentes: la lista de leads, la secuencia y el pool de senders.\n\nLista de leads: carga CSV o sincronización con CRM. Cada fila necesita una URL de perfil de LinkedIn como mínimo. Nombre, empresa y título ayudan con las variables de personalización. HeyReach deduplica a través de campañas automáticamente, así que la misma persona no recibe dos contactos.\n\nSecuencia: El flujo de mensajes. Una secuencia típica de outbound:\n\nPaso 1: Ver perfil (día 0)\nPaso 2: Enviar solicitud de conexión con nota (día 1)\nPaso 3: Si acepta, enviar primer mensaje (día 2-3 después de aceptación)\nPaso 4: Mensaje de seguimiento si no hay respuesta (día 5-7 después del primer mensaje)\nPaso 5: Toque final (día 10-14 después del segundo mensaje)\n\nNotas de solicitud de conexión: mantenlas por debajo de 300 caracteres. Lidera con por qué te estás comunicando, no quién eres. "Vi que tu equipo está escalando la organización de SDRs - construimos algo exactamente para eso" supera a "Hola, soy Shawn de GTMe OS y me encantaría conectar."\n\nPool de senders: Asigna 3-5 senders por campaña. HeyReach rota qué sender contacta a qué lead. Esto distribuye el volumen y hace que el patrón de outreach se vea más natural para LinkedIn.',
      },
      {
        heading: 'Integración con Clay',
        type: 'pattern',
        content:
          'El poder real es Clay alimentando a HeyReach. Clay enriquece tu lista de leads con datos de empresa, technographics, señales de contratación y scores personalizados. Luego empujas leads cualificados directamente a campañas de HeyReach.\n\nEl flujo:\n\n1. Tabla de Clay con leads enriquecidos (empresa, título, URL de LinkedIn, score)\n2. Filtra a leads cualificados (score por encima del umbral, coincidencia de título, fit de empresa)\n3. Push a HeyReach vía webhook o exportación CSV\n4. HeyReach ejecuta la secuencia de LinkedIn\n5. Las respuestas se sincronizan de vuelta a tu CRM\n\nPara el enfoque de webhook, Clay tiene una acción HTTP que puede hacer POST a los endpoints de API de HeyReach. Mapea las columnas de Clay a los campos de lead de HeyReach: linkedin_url, first_name, last_name, company_name, title.\n\nPara el enfoque de CSV: exporta desde Clay, sube a la campaña de HeyReach. Menos automatizado pero funciona para campañas por lotes donde quieres revisar la lista antes de lanzar.',
      },
      {
        heading: 'Multi-Canal con Instantly',
        type: 'pattern',
        content:
          'HeyReach maneja LinkedIn. Instantly maneja email. Ejecutar ambos en la misma lista de leads crea una secuencia multi-canal.\n\nLa lógica de enrutamiento depende del lead. Si tienes un email verificado, van a Instantly para outreach por email Y a HeyReach para LinkedIn. Si solo tienes una URL de LinkedIn y no email, van solo a HeyReach. Si el dominio de email usa filtrado de spam agresivo (Proofpoint, Mimecast), lidera con LinkedIn a través de HeyReach y usa email como canal de seguimiento.\n\nEl timing importa. No bombardees ambos canales el mismo día. Escálonálos. Solicitud de conexión de LinkedIn el día 1. Email el día 3. Seguimiento de LinkedIn el día 7. Seguimiento de email el día 10. El prospecto ve tu nombre a través de dos canales sin sentirse spameado.\n\nRastrea qué canal obtiene la respuesta. Con el tiempo verás patrones. Algunas industrias responden mejor en LinkedIn. Algunas responden mejor al email. Deja que los datos dirijan tu asignación de canales.',
      },
      {
        heading: 'Seguridad y Salud de Cuentas',
        type: 'pro-tip',
        content:
          'LinkedIn restringe cuentas que se comportan como bots. HeyReach mitiga esto con límites integrados y calentamiento, pero aún necesitas ser inteligente al respecto.\n\nNunca excedas 25 solicitudes de conexión por día por cuenta. El límite duro de LinkedIn es alrededor de 100 por semana, pero distribuirlas en 5 días a 20 cada uno es más seguro que hacer 50 el lunes y 50 el viernes.\n\nUsa las cuentas manualmente también. Publica contenido, comenta en posts, participa en grupos. LinkedIn rastrea patrones de actividad general. Una cuenta que solo envía solicitudes de conexión y mensajes se ve automatizada. Una cuenta que también publica y comenta se ve humana.\n\nRota senders periódicamente. Si una cuenta recibe una restricción temporal, retírala de las campañas por 1-2 semanas. Déjala enfriarse. Usa los senders restantes para mantener el volumen de la campaña.\n\nMonitorea las tasas de aceptación. Una tasa de aceptación saludable es 30-50% para outreach dirigido. Por debajo del 20% significa que tu mensajería o targeting está mal. Por debajo del 10% y LinkedIn puede empezar a marcar la cuenta.\n\nMantén las notas de solicitud de conexión genuinas. Las plantillas que suenan como plantillas se ignoran. Personaliza la primera línea con algo específico sobre la persona o su empresa. HeyReach soporta variables como {first_name}, {company_name} y campos personalizados de tu CSV.',
      },
    ],
  },
  {
    id: 'claude-code-vs-cursor',
    title: 'Claude Code vs Cursor',
    subtitle: 'Agente de terminal vs copiloto IDE - cuando usar cada uno y cuando usar ambos',
    category: 'comparisons',
    description:
      'Comparacion practica de Claude Code y Cursor desde alguien que usa ambos a diario. Diferencias de arquitectura, ejemplos reales de flujos de trabajo, desglose de costos y la configuracion hibrida que permite desarrollar mas rapido que cualquiera de las dos herramientas por separado.',
    keywords: [
      'claude code vs cursor',
      'cursor vs claude code',
      'claude code o cursor',
      'mejor herramienta AI para programar 2026',
      'comparacion claude code cursor',
      'comparacion asistentes AI para programar',
      'terminal vs IDE AI coding',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-power-features',
      'getting-started-with-cursor',
      'ide-principles-that-transfer',
    ],
    sections: [
      {
        heading: 'La Respuesta Corta',
        type: 'prose',
        content:
          'Claude Code es un agente nativo de terminal. Describes lo que quieres, el conduce. Cursor es un IDE con AI integrada en cada superficie. Tu conduces, el asiste. La pregunta no es cual es mejor - es cual modo coincide con el trabajo que estas haciendo ahora mismo.\n\nUso ambos todos los dias. Claude Code maneja refactorizaciones multi-archivo, automatizacion de infraestructura, pipelines de despliegue y cualquier cosa que se beneficie de la ejecucion autonoma. Cursor maneja ediciones inline, depuracion visual, ajustes de componentes y cualquier cosa donde quiero control preciso sobre cada cambio.\n\nLa mejor configuracion es ambos. Claude Code para delegar, Cursor para precision. El resto de esta pagina explica exactamente cuando y por que.',
      },
      {
        heading: 'Arquitectura: Agente vs Asistente',
        type: 'pattern',
        content:
          'Claude Code se ejecuta en tu terminal. Sin GUI. Escribes lo que quieres, lee tu codebase, planifica un enfoque y ejecuta - creando archivos, ejecutando comandos, editando codigo. Opera como un desarrollador senior al que le asignas tareas. El archivo CLAUDE.md en tu repositorio es su documento de onboarding. Skills, hooks y reglas moldean su comportamiento. Puede crear subagentes y equipos de agentes para trabajo paralelo.\n\nCursor es un fork de VS Code con AI en cada capa. Las completaciones con Tab predicen tu proxima edicion. Cmd+K hace reescrituras inline. Cmd+L abre el chat para tareas multi-archivo. El modo Composer planifica y ejecuta entre archivos con revision de diffs en cada paso. Opera como un programador en pareja sentado a tu lado.\n\nLa diferencia de arquitectura importa. Claude Code no tiene overhead de GUI - lee y escribe archivos directamente, ejecuta comandos de shell y encadena operaciones. Cursor te muestra cada cambio visualmente y espera aprobacion. Claude Code es mas rapido para trabajo autonomo. Cursor es mas seguro para trabajo exploratorio donde quieres ver cada diff antes de que se aplique.',
      },
      {
        heading: 'Cuando Gana Claude Code',
        type: 'pattern',
        content:
          'Claude Code es la mejor opcion cuando la tarea se puede describir por adelantado y ejecutar de forma autonoma. Escenarios especificos:\n\nRefactorizaciones multi-archivo. "Renombra el componente UserProfile a AccountProfile en todas partes, actualiza todas las importaciones, corrige todas las referencias." Claude Code encuentra cada archivo, hace cada cambio, ejecuta el build para verificar. En Cursor, revisarias cada cambio de archivo individualmente.\n\nInfraestructura y automatizacion. "Configura un nuevo cron job que ejecute el script de sincronizacion diaria a medianoche, crea el plist de launchd y verifica que se cargue." Claude Code ejecuta los comandos de shell directamente. Cursor necesitaria que copies y pegues comandos de terminal.\n\nNavegacion de codebases grandes. Claude Code lee toda la estructura de tu repositorio, sigue importaciones, entiende relaciones entre modulos. No necesita que abras archivos manualmente o agregues @referencias. Encuentra lo que necesita.\n\nEjecucion en segundo plano. Puedes ejecutar sesiones de Claude Code en segundo plano mientras trabajas en Cursor en otra cosa. Dos flujos de trabajo paralelos. Intenta eso con dos instancias de Cursor y tu maquina peleara por recursos de GPU.\n\nCI/CD y despliegue. Claude Code puede ejecutar builds, revisar logs, corregir errores y reintentar - todo de forma autonoma. Maneja el pipeline completo de despliegue sin que estes mirando cada paso.',
      },
      {
        heading: 'Cuando Gana Cursor',
        type: 'pattern',
        content:
          'Cursor es la mejor opcion cuando quieres control visual e iteracion rapida sobre codigo especifico. Escenarios especificos:\n\nTrabajo de UI y componentes. Estas ajustando un componente React, modificando estilos, moviendo elementos. Cursor te muestra el codigo, la vista previa y las sugerencias de AI todo en una vista. Claude Code haria esto a ciegas - escribiendo codigo sin ver el resultado visual.\n\nEdiciones inline de precision. Selecciona tres lineas, Cmd+K, "convierte esto a un ternario." Listo en dos segundos con confirmacion visual. Claude Code necesitaria un prompt completo describiendo el archivo, la ubicacion y el cambio.\n\nCompletaciones con Tab. Cursor predice tu proxima linea mientras escribes. Esto es velocidad pura para escribir codigo nuevo cuando conoces el patron pero quieres que la AI complete el boilerplate. Claude Code no tiene completaciones inline - no es un editor.\n\nExploracion y aprendizaje. Cuando estas en un codebase desconocido, Cursor te permite hacer clic entre archivos, pasar el cursor para ver tipos y preguntar a la AI sobre funciones especificas. El ciclo de retroalimentacion visual es mas rapido para entender codigo que no escribiste.\n\nCorrecciones pequenas y quirurgicas. Un typo, una importacion faltante, un nombre de variable incorrecto. Abre el archivo, corrigelo, sigue adelante. Claude Code es excesivo para un cambio de una linea.',
      },
      {
        heading: 'Comparacion de Costos',
        type: 'formula',
        content:
          'Precios de Claude Code: suscripcion Claude Max a $100/mes para uso intensivo (modelo nivel Opus, ilimitado dentro de lo razonable) o plan Pro de $20/mes con limites de uso. Tambien hay precios por API disponibles para uso programatico.\n\nPrecios de Cursor: plan Pro de $20/mes incluye 500 solicitudes rapidas premium. Despues de eso, entras en modo lento o pagas excedentes. Plan Business de $40/mes para equipos.\n\nEl calculo real de costos no es el precio de suscripcion - es el tiempo ahorrado. Claude Code a $100/mes que ahorra 2 horas diarias en refactorizaciones y automatizacion se paga solo en la primera semana. Cursor a $20/mes que previene bugs a traves de la revision visual de diffs se paga solo en el primer dia.\n\nSi tienes presupuesto limitado: empieza con Cursor Pro a $20/mes. Cubre el 80% de los casos de uso. Agrega Claude Code cuando encuentres tareas que necesiten ejecucion autonoma multi-archivo.\n\nSi estas optimizando para produccion: ejecuta ambos. Usa Claude Code para el trabajo pesado y Cursor para el acabado. Los $120/mes combinados siguen siendo mas baratos que una hora de un contratista.',
      },
      {
        heading: 'La Configuracion Hibrida que Realmente Uso',
        type: 'pro-tip',
        content:
          'Mi flujo de trabajo diario usa ambas herramientas en un patron especifico.\n\nManana: Abro la terminal de Claude Code. Ejecuto /morning para obtener el resumen diario. Claude Code lee el handoff de ayer, revisa git status, muestra tareas prioritarias. Maneja la planificacion y carga de contexto.\n\nConstruccion: Si la tarea es una nueva funcionalidad o refactorizacion, Claude Code conduce. Describo lo que quiero, planifica, apruebo el plan, ejecuta. Si la tarea es pulir UI o trabajo de componentes, abro Cursor y trabajo interactivamente.\n\nDespliegue: Claude Code maneja el pipeline completo. Build check, git commit, push, verificacion. Ejecuta escaneos de seguridad pre-push, revisa datos sensibles y maneja la secuencia de despliegue.\n\nDepuracion: Depende del bug. Si es un error de logica en codigo backend, Claude Code lee los logs, rastrea el problema y lo corrige. Si es un bug visual en la UI, Cursor es mejor porque puedo ver el componente mientras edito.\n\nFin de sesion: Claude Code escribe el documento de context handoff. Esto no es solo un resumen - es un briefing estructurado que la siguiente sesion de Claude Code lee para continuar exactamente donde lo deje. Cursor no tiene este concepto.\n\nLa idea clave: no son herramientas competidoras. Son herramientas complementarias que sirven diferentes modos de interaccion. Usa ambas y te mueves mas rapido que con cualquiera de las dos sola.',
      },
    ],
  },

  {
    id: 'claude-code-vs-github-copilot',
    title: 'Claude Code vs GitHub Copilot',
    subtitle: 'Agente autonomo vs asistente inline - la diferencia fundamental',
    category: 'comparisons',
    description:
      'Comparacion lado a lado de Claude Code y GitHub Copilot. Agente primero vs completacion primero, capacidades agenticas, precios y que herramienta se adapta a que flujo de trabajo de desarrollo.',
    keywords: [
      'claude code vs github copilot',
      'github copilot vs claude code',
      'comparacion claude code copilot',
      'mejor asistente AI para programar',
      'alternativa a copilot 2026',
      'github copilot vs anthropic',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-vs-cursor',
      'claude-code-quickstart',
      'claude-code-power-features',
      'ide-principles-that-transfer',
    ],
    sections: [
      {
        heading: 'Diferencia Fundamental',
        type: 'prose',
        content:
          'GitHub Copilot empezo como autocompletado y crecio hasta convertirse en un asistente. Claude Code empezo como un agente y se mantuvo como agente. Esa historia de origen moldea todo sobre como funcionan.\n\nCopilot predice tu proxima linea de codigo basandose en el contexto. Es reactivo - espera a que escribas y luego sugiere lo que viene despues. Copilot Chat agrego funciones conversacionales, y Copilot Workspace agrego planificacion multi-archivo. Pero el producto central sigue siendo un motor de sugerencias inline que vive en tu editor.\n\nClaude Code toma una descripcion de tarea y la ejecuta de principio a fin. Lee tu codebase, planifica un enfoque, escribe codigo, ejecuta comandos, revisa resultados e itera. No espera a que escribas. Tu delegas y el entrega.\n\nCopilot mejora tu velocidad de escritura. Claude Code reemplaza categorias enteras de trabajo manual.',
      },
      {
        heading: 'Capacidades Cara a Cara',
        type: 'pattern',
        content:
          'Completacion con Tab: Copilot es el mejor de su clase. Se entrena con tu archivo actual y repositorio para predecir completaciones con alta precision. Claude Code no ofrece completaciones inline - no es un editor.\n\nChat: Ambos tienen interfaces conversacionales. Copilot Chat funciona dentro de VS Code, JetBrains y el CLI. El chat de Claude Code funciona en la terminal. Copilot Chat responde preguntas y hace ediciones de un solo archivo. El chat de Claude Code hace cambios multi-archivo y ejecuta comandos de shell.\n\nEjecucion autonoma: Claude Code puede ejecutar builds, ejecutar tests, revisar logs, corregir errores y reintentar - todo sin intervencion humana. Copilot Workspace planifica cambios multi-archivo pero requiere aprobacion manual en cada paso. Claude Code opera a un nivel de autonomia superior.\n\nComprension de contexto: Claude Code lee todo tu repositorio, sigue importaciones, entiende instrucciones de CLAUDE.md y carga skills bajo demanda. Copilot usa indexacion del repositorio y el contexto del archivo abierto. Claude Code tiene mayor conciencia del proyecto para codebases complejos.\n\nMulti-agente: Claude Code soporta subagentes y equipos de agentes para ejecucion paralela. Multiples instancias de Claude pueden trabajar en diferentes partes de tu codebase simultaneamente. Copilot no tiene capacidades multi-agente.\n\nPersonalizacion: Claude Code tiene CLAUDE.md, skills, hooks y reglas que personalizan profundamente su comportamiento por proyecto. Copilot tiene .github/copilot-instructions.md para instrucciones basicas del proyecto. Claude Code es significativamente mas configurable.',
      },
      {
        heading: 'Desglose de Precios',
        type: 'formula',
        content:
          'GitHub Copilot Individual: $10/mes. Incluye completaciones con Tab, chat y funciones agenticas basicas. El mejor punto de entrada en valor para cualquier herramienta de codigo AI.\n\nGitHub Copilot Business: $19/mes por usuario. Agrega politicas a nivel organizacion, logs de auditoria, indemnizacion de propiedad intelectual.\n\nClaude Code Pro: $20/mes. Incluye Claude Code en terminal, extensiones IDE y acceso web. Uso limitado en el modelo Opus.\n\nClaude Code Max: $100/mes o niveles de $200/mes. Limites de uso mas altos, acceso prioritario al modelo Opus 4, ideal para usuarios avanzados que ejecutan Claude Code como su herramienta principal de desarrollo.\n\nLas cuentas: Copilot a $10/mes es imbatible para completaciones con Tab puras. Si todo lo que necesitas es escribir mas rapido, empieza ahi. Claude Code a $20-100/mes es para desarrolladores que quieren automatizacion de tareas, no solo sugerencias de codigo. Si pasas mas tiempo orquestando trabajo que escribiendo codigo, Claude Code entrega mas valor por dolar.',
      },
      {
        heading: 'Cual Es el Adecuado para Ti',
        type: 'pro-tip',
        content:
          'Elige GitHub Copilot si: pasas la mayor parte de tu tiempo escribiendo codigo nuevo en un editor, quieres las mejores sugerencias inline, tu trabajo es principalmente ediciones de un solo archivo, o tu equipo usa GitHub y quiere AI integrada en toda la plataforma.\n\nElige Claude Code si: pasas la mayor parte de tu tiempo en operaciones multi-archivo, quieres ejecucion autonoma de tareas, ejecutas builds y despliegues complejos, trabajas en monorepos grandes con cadenas de dependencias profundas, o quieres personalizar el comportamiento de la AI extensivamente con skills y hooks.\n\nElige ambos si: quieres completaciones con Tab mientras escribes (Copilot) Y agentes autonomos multi-archivo (Claude Code). No entran en conflicto. Copilot corre en tu editor. Claude Code corre en tu terminal. Muchos desarrolladores ejecutan Cursor (con sus propias completaciones) mas Claude Code y obtienen los beneficios de ambos mundos.\n\nLa respuesta honesta: la mayoria de desarrolladores serios en 2026 usan mas de una herramienta de AI. Las herramientas tienen diferentes fortalezas y la combinacion es mas poderosa que cualquier herramienta individual.',
      },
    ],
  },

  {
    id: 'context-engineering-vs-prompt-engineering',
    title: 'Ingenieria de Contexto vs Ingenieria de Prompts',
    subtitle: 'Por que la informacion correcta importa mas que las palabras correctas',
    category: 'comparisons',
    description:
      'Ingenieria de contexto vs ingenieria de prompts explicado. Que cambio, por que la ingenieria de prompts toco techo y como la ingenieria de contexto construye sistemas de AI confiables controlando que informacion ve el modelo en lugar de como formulas las solicitudes.',
    keywords: [
      'ingenieria de contexto vs ingenieria de prompts',
      'prompt engineering vs context engineering',
      'que es ingenieria de contexto',
      'ingenieria de contexto explicada',
      'context engineering 2026',
      'prompt engineering obsoleto',
      'context engineering agentes AI',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'repo-context-engine',
      'constraints-and-context-engines',
      'parallel-session-handoffs',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'El Cambio',
        type: 'prose',
        content:
          'La ingenieria de prompts optimiza como preguntas. La ingenieria de contexto optimiza que informacion ve el modelo cuando preguntas. Esa no es una diferencia sutil - cambia todo el enfoque para construir con AI.\n\nEn 2023-2024, la ingenieria de prompts era la habilidad. Crear la instruccion perfecta. Agregar razonamiento chain-of-thought. Usar ejemplos few-shot. Formular tu solicitud con precision y el modelo rinde mejor. Esto funcionaba cuando las interacciones con AI eran de una sola pregunta y respuesta.\n\nEn 2025-2026, el techo se hizo obvio. Los modelos mejoraron en seguir instrucciones independientemente de la formulacion. Un prompt bien estructurado y una solicitud casual producen resultados casi identicos en modelos modernos. El cuello de botella paso de la calidad de instruccion a la calidad de informacion. No importa cuan perfectamente formules "refactoriza este modulo" si el modelo no puede ver el modulo, sus dependencias o los estandares de codigo que debe seguir.\n\nLa ingenieria de contexto es la respuesta. En lugar de optimizar el prompt, optimizas la ventana de contexto - la informacion total que el modelo procesa antes de generar una respuesta.',
      },
      {
        heading: 'Ingenieria de Prompts: Lo Que Realmente Significa',
        type: 'pattern',
        content:
          'La ingenieria de prompts es el arte de escribir instrucciones que producen resultados deseados de modelos de lenguaje. Las tecnicas fundamentales incluyen:\n\nAsignacion de rol: "Eres un desarrollador senior de TypeScript." Le da al modelo una perspectiva desde la cual razonar.\n\nChain-of-thought: "Piensa paso a paso antes de responder." Fuerza al modelo a mostrar su razonamiento, lo que mejora la precision en tareas complejas.\n\nEjemplos few-shot: "Aqui hay tres ejemplos del formato que quiero..." Demuestra el patron de salida esperado.\n\nRestricciones: "Responde en JSON. Usa solo los datos proporcionados. No hagas suposiciones." Limita el espacio de salida.\n\nEstas tecnicas aun funcionan. Siguen siendo utiles. Pero operan en la capa de instruccion. Le dicen al modelo como procesar informacion. No controlan que informacion esta disponible para procesar.',
      },
      {
        heading: 'Ingenieria de Contexto: Lo Que Realmente Significa',
        type: 'pattern',
        content:
          'La ingenieria de contexto es la practica de controlar que informacion ve el modelo, cuando la ve y como esta estructurada. Las tecnicas fundamentales incluyen:\n\nSeleccion dinamica de contexto: Cargar solo los archivos, documentos y datos relevantes para la tarea actual. No todo - lo correcto. Una tarea de refactorizacion necesita el archivo objetivo, sus importaciones, sus tests y los estandares de codigo. Cargar todo el repositorio agrega ruido que degrada el rendimiento.\n\nArquitectura de memoria: Decidir que recuerda el modelo entre sesiones. Los archivos CLAUDE.md persisten contexto del proyecto. Los documentos de handoff llevan estado entre sesiones. Las bases de conocimiento proporcionan referencia del dominio. Cada uno sirve una funcion de memoria diferente.\n\nCompresion de contexto: Resumir o estructurar informacion para que quepa dentro de los limites de tokens preservando lo que importa. Los logs crudos son costosos en contexto. Un resumen estructurado de error con archivo, linea y mensaje es eficiente en contexto.\n\nIntegracion de herramientas y recuperacion: Darle al modelo acceso a busqueda, lectura de archivos, llamadas API y bases de datos para que pueda obtener informacion bajo demanda en lugar de necesitar todo precargado.\n\nEsquema y estructura: Organizar el contexto con encabezados claros, esquemas tipados y formatos predecibles para que el modelo lo procese eficientemente. Los datos estructurados superan a los datos no estructurados consistentemente.',
      },
      {
        heading: 'Por Que Esto Importa para los Profesionales',
        type: 'pro-tip',
        content:
          'Si estas construyendo funcionalidades de AI, automatizando flujos de trabajo o usando herramientas de codigo AI diariamente, la ingenieria de contexto es la habilidad que mueve la aguja.\n\nUn ejemplo practico: administro un monorepo con tres sitios Next.js, mas de 40 skills de automatizacion y cron jobs diarios. Cada sesion de Claude Code empieza leyendo un archivo CLAUDE.md que contiene estructura del proyecto, convenciones de codigo, pasos de despliegue y reglas de seguridad. Lee el context handoff de la sesion anterior. Carga skills relevantes segun la tarea.\n\nEsto es ingenieria de contexto. El modelo ve la informacion correcta antes de escribir una sola linea de codigo. Los prompts que escribo son casuales - "agrega una nueva entrada de wiki how-to sobre servidores MCP" - porque el contexto hace el trabajo pesado. El CLAUDE.md le dice el formato del archivo. Las entradas existentes le muestran el patron. Los skills le dicen el flujo de trabajo.\n\nCompara eso con solo ingenieria de prompts: "Eres un desarrollador experto en TypeScript. Por favor crea una nueva entrada de wiki how-to en el formato HowToWikiEntry definido en how-to-wiki.ts con id, title, subtitle, category, description, array de keywords, nivel de dificultad, canonicalSite, entradas relacionadas y array de secciones con heading, type y campos de content..." Estas gastando tokens en instrucciones que el contexto maneja automaticamente.\n\nLa conclusion: la ingenieria de prompts es una tecnica. La ingenieria de contexto es un sistema. Las tecnicas tocan techo. Los sistemas se componen.',
      },
    ],
  },

  {
    id: 'claude-md-vs-agents-md-vs-cursorrules',
    title: 'CLAUDE.md vs AGENTS.md vs .cursorrules',
    subtitle: 'Tres formatos de archivos de configuracion para herramientas de codigo AI - comparados',
    category: 'comparisons',
    description:
      'Comparacion de archivos de configuracion CLAUDE.md, AGENTS.md y .cursorrules. Que hace cada uno, como se superponen, las diferencias clave y como mantener los tres en un repositorio sin duplicar contenido.',
    keywords: [
      'CLAUDE.md vs AGENTS.md',
      'cursorrules vs CLAUDE.md',
      'AGENTS.md vs cursorrules',
      'archivos de configuracion de agentes AI',
      'guia de archivo CLAUDE.md',
      'guia de archivo AGENTS.md',
      'guia de archivo cursorrules',
      'comparacion de configuracion de IDE AI',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'rules-skills-context',
      'claude-code-quickstart',
      'getting-started-with-cursor',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'Tres Archivos, Un Objetivo',
        type: 'prose',
        content:
          'CLAUDE.md es para Claude Code. AGENTS.md es un estandar multi-herramienta. .cursorrules es para Cursor IDE. Los tres sirven el mismo proposito: darle a la herramienta de AI contexto e instrucciones especificas del proyecto para que produzca mejor resultado. La diferencia es alcance y formato.\n\nSi solo usas una herramienta de AI, usa el archivo de configuracion de esa herramienta. Si usas multiples herramientas - y la mayoria de profesionales serios lo hacen - necesitas una estrategia para mantenerlos sincronizados sin triplicar tu carga de mantenimiento.',
      },
      {
        heading: 'CLAUDE.md en Detalle',
        type: 'pattern',
        content:
          'CLAUDE.md es el archivo de configuracion de Anthropic para Claude Code. Se carga automaticamente al inicio de la sesion y permanece en contexto durante toda la conversacion.\n\nUbicacion: raiz del repositorio para nivel de proyecto, ~/.claude/CLAUDE.md para global, y directorios anidados para nivel de modulo. Claude Code fusiona todos los niveles aplicables.\n\nFormato: Markdown plano. Encabezados, viñetas, bloques de codigo, tablas. No se necesita sintaxis especial. Claude lo lee como cualquier otro documento.\n\nCaracteristicas unicas: soporta importaciones @path/to/file que se expanden inline. Soporta multiples niveles (global, proyecto, directorio). Tiene un comando dedicado /init que auto-genera un archivo inicial desde tu codebase.\n\nMejor para: convenciones de codigo, comandos de build/test, reglas de seguridad, arquitectura del proyecto, pasos de despliegue e instrucciones de comportamiento como "nunca hagas commit de archivos .env" o "ejecuta tests antes de marcar una tarea como completa."\n\nLos mejores archivos CLAUDE.md tienen menos de 200 lineas. Usan instrucciones especificas y verificables ("usa indentacion de 2 espacios" no "formatea el codigo correctamente"). Apuntan a archivos en lugar de copiar contenido ("ver docs/ARCHITECTURE.md para el diagrama completo del sistema" no pegar el diagrama inline).',
      },
      {
        heading: 'AGENTS.md en Detalle',
        type: 'pattern',
        content:
          'AGENTS.md es un estandar abierto emergente pensado para funcionar con todas las herramientas de codigo AI - no solo Claude Code. Fue diseñado por la comunidad como un archivo de configuracion agnóstico de herramientas.\n\nUbicacion: raiz del repositorio, similar a CLAUDE.md.\n\nFormato: Markdown con secciones estructuradas. Tipicamente incluye: descripcion del proyecto, resumen de arquitectura, estandares de codigo, instrucciones de testing y configuraciones especificas por herramienta.\n\nFilosofia: escribe tus instrucciones una vez, haz que cada herramienta de AI las lea. En lugar de mantener archivos separados para Claude Code, Cursor, Copilot y Windsurf, mantén un AGENTS.md y deja que cada herramienta lo analice.\n\nRevision de realidad: la adopcion aun es temprana. Claude Code lee CLAUDE.md nativamente. Cursor lee .cursorrules nativamente. El soporte de AGENTS.md varia. Algunas herramientas lo respetan, otras lo ignoran. El estandar es prometedor pero aun no es universal.\n\nMejor para: equipos que usan multiples herramientas de AI y quieren una unica fuente de verdad para instrucciones del proyecto.',
      },
      {
        heading: '.cursorrules en Detalle',
        type: 'pattern',
        content:
          '.cursorrules es el archivo de instrucciones a nivel de proyecto de Cursor IDE. Se carga cuando abres un proyecto en Cursor.\n\nUbicacion: raiz del repositorio como .cursorrules (archivo unico) o directorio .cursor/rules/ para multiples archivos de reglas con patrones glob.\n\nFormato: texto plano o Markdown. El enfoque .cursor/rules/ usa archivos .mdc con frontmatter YAML que especifica que patrones de archivos activan la regla.\n\nCaracteristicas unicas: activacion de reglas basada en glob (las reglas solo se cargan cuando editas archivos que coinciden), reglas solicitadas por el agente que se cargan bajo demanda, e integracion con los modos composer y chat de Cursor.\n\nMejor para: flujos de trabajo especificos de Cursor, reglas basadas en patrones de archivos (cargar convenciones de TypeScript solo al editar archivos .ts) y equipos que estandarizan Cursor como su IDE.\n\nLimitacion: .cursorrules solo funciona en Cursor. Si alguien en tu equipo usa una herramienta diferente, no obtiene ningun beneficio de estos archivos.',
      },
      {
        heading: 'La Estrategia Practica: Una Sola Fuente de Verdad',
        type: 'pro-tip',
        content:
          'Mantener tres archivos de configuracion separados con la misma informacion es una pesadilla de mantenimiento. Aqui esta el enfoque que funciona:\n\nCLAUDE.md es tu configuracion principal. Es la mas detallada porque Claude Code es el mas capaz siguiendo instrucciones complejas y multi-paso. Escribe tu contexto completo del proyecto, convenciones y flujos de trabajo aqui.\n\nAGENTS.md es una referencia cruzada simplificada. Enlaza a CLAUDE.md para detalles. Incluye solo las instrucciones universales que toda herramienta deberia seguir: estandares de codigo, requisitos de testing, resumen de arquitectura.\n\n.cursorrules maneja reglas especificas de Cursor. Activacion por patrones de archivos, preferencias de edicion inline, instrucciones del modo composer. No dupliques lo que ya esta en CLAUDE.md.\n\nLa estructura:\n\nCLAUDE.md - Configuracion completa del proyecto (200 lineas)\nAGENTS.md - Subconjunto universal + enlaces a CLAUDE.md (50 lineas)\n.cursor/rules/*.mdc - Reglas especificas de Cursor por patron de archivos (archivos por regla)\n\nDe esta manera, cuando las convenciones cambian, actualizas CLAUDE.md. AGENTS.md apunta a el. .cursorrules solo contiene comportamiento especifico de Cursor que no aplica en otro lugar.\n\nSi solo usas Claude Code: solo mantén CLAUDE.md. Omite los demas hasta que los necesites.',
      },
    ],
  },

  {
    id: 'subagents-vs-agent-teams',
    title: 'Subagentes vs Equipos de Agentes en Claude Code',
    subtitle: 'Cuando crear ayudantes vs cuando orquestar un equipo completo',
    category: 'comparisons',
    description:
      'Guia practica para elegir entre subagentes y equipos de agentes en Claude Code. Como funciona cada uno, casos de uso reales, implicaciones de costos y el marco de decision para flujos de trabajo de desarrollo AI paralelo.',
    keywords: [
      'claude code subagentes vs equipos de agentes',
      'agent teams claude code',
      'claude code subagentes',
      'agentes paralelos claude code',
      'multi-agente claude code',
      'tutorial equipos de agentes claude code',
      'cuando usar equipos de agentes',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'agent-teams-claude-code',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'Dos Modelos de Paralelismo',
        type: 'prose',
        content:
          'Claude Code ofrece dos formas de ejecutar multiples instancias de AI en tu codebase. Los subagentes son trabajadores ligeros creados desde tu sesion actual. Los equipos de agentes son instancias completas de Claude Code que se coordinan entre si. La diferencia es comunicacion y autonomia.\n\nLos subagentes reportan al padre. No pueden hablar entre ellos. Ejecutan una tarea enfocada y devuelven resultados. Piensa en ellos como funciones que llamas en paralelo.\n\nLos equipos de agentes se comunican entre si. Reclaman tareas de una lista compartida. Pueden enviar mensajes a compañeros de equipo, compartir descubrimientos y coordinarse sin un orquestador central. Piensa en ellos como un equipo real trabajando en el mismo proyecto.',
      },
      {
        heading: 'Subagentes: Como Funcionan',
        type: 'pattern',
        content:
          'Los subagentes se crean usando la herramienta Agent dentro de una sesion de Claude Code. Especificas la tarea, el tipo de agente (Explore, Plan, proposito general) y opcionalmente un modo de aislamiento (worktree para ramas de git separadas).\n\nCada subagente obtiene su propia ventana de contexto. Puede leer archivos, ejecutar comandos, buscar codigo y devolver resultados. Cuando termina, el resultado regresa a la sesion padre.\n\nCaracteristicas clave:\n\nComunicacion unidireccional. El padre envia una tarea, el subagente devuelve un resultado. Sin negociacion de ida y vuelta.\n\nSistema de archivos compartido. Los subagentes ven el mismo repositorio (a menos que usen aislamiento con worktree). Los cambios de un subagente son visibles para otros.\n\nOrquestacion del padre. La sesion principal decide que delegar, cuando crear subagentes y como combinar resultados.\n\nCosto: cada subagente consume tokens proporcionales a su tarea. Una busqueda rapida de archivos podria usar 5K tokens. Una exploracion profunda podria usar 50K. La sesion padre asume el costo.\n\nMejor para: investigacion paralela, busquedas independientes de archivos, generacion de contenido en paralelo, cualquier tarea donde necesites velocidad a traves de paralelismo pero las tareas son independientes.',
      },
      {
        heading: 'Equipos de Agentes: Como Funcionan',
        type: 'pattern',
        content:
          'Los equipos de agentes son una funcion experimental (activar via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1). Una sesion actua como lider de equipo. Crea tareas en una lista de tareas compartida. Los compañeros reclaman tareas, trabajan en ellas y comunican resultados entre si.\n\nCaracteristicas clave:\n\nComunicacion entre pares. Los compañeros de equipo se envian mensajes directamente. El lider del equipo no necesita transmitir cada pieza de informacion.\n\nSistema de tareas compartido. Las tareas se publican en una lista compartida. Los compañeros reclaman tareas segun disponibilidad y capacidad. No se requiere asignacion central.\n\nVentanas de contexto independientes. Cada compañero tiene su propio contexto completo. Pueden mantener diferentes modelos mentales del codebase y compartir descubrimientos a traves de mensajes.\n\nMayor autonomia. Los compañeros pueden descubrir problemas, crear nuevas tareas y coordinar soluciones sin que el lider del equipo dirija cada paso.\n\nCosto: cada compañero es una instancia completa de Claude. Un equipo de 3 personas usa aproximadamente 3x los tokens. Un equipo de 5 personas usa 5x. Esto se acumula rapido.\n\nMejor para: funcionalidades complejas multi-modulo, revisiones de codigo paralelas con diferentes areas de enfoque, depuracion con hipotesis competidoras y cualquier tarea donde los agentes necesiten reaccionar a los hallazgos de los demas.',
      },
      {
        heading: 'Marco de Decision',
        type: 'formula',
        content:
          'Usa subagentes cuando:\n- Las tareas son independientes (ninguna tarea depende del resultado de otra)\n- La comunicacion es unidireccional (enviar tarea, obtener resultado)\n- Quieres que la sesion padre mantenga control total\n- El presupuesto es una preocupacion (los subagentes son mas baratos)\n- Las tareas estan bien definidas con criterios claros de finalizacion\n\nUsa equipos de agentes cuando:\n- Las tareas interactuan (cambios en frontend afectan backend, interfaces compartidas)\n- Los agentes necesitan reaccionar a los descubrimientos de los demas\n- El espacio del problema es ambiguo y requiere exploracion\n- Quieres que los agentes desafien los enfoques de los demas\n- El trabajo tomaria demasiado tiempo para una sola sesion y se beneficia del paralelismo verdadero\n\nUsa una sola sesion cuando:\n- La tarea es secuencial (cada paso depende del anterior)\n- El codebase es lo suficientemente pequeño para una ventana de contexto\n- Necesitas control estricto sobre cada decision\n- El costo importa mas que la velocidad\n\nEjemplo real de mi flujo de trabajo: uso subagentes diariamente para investigacion paralela - "explora el modulo de auth," "encuentra todos los endpoints de API," "revisa la cobertura de tests." Estas son consultas independientes. Uso equipos de agentes para funcionalidades de varios dias - "construye el nuevo dashboard" donde un agente maneja la capa de API, otro maneja los componentes de UI y un tercero escribe tests. Necesitan coordinarse en el contrato de interfaz entre capas.',
      },
      {
        heading: 'Revision de Costos Real',
        type: 'pro-tip',
        content:
          'Los subagentes son baratos. Un subagente explore tipico usa 10-50K tokens. A precios actuales, eso son centavos. Puedes crear 5-10 subagentes en paralelo sin pensar en el costo.\n\nLos equipos de agentes son caros. Cada compañero mantiene una ventana de contexto completa que crece con cada mensaje y lectura de archivo. Un equipo de 3 personas trabajando durante una hora puede consumir 500K-1M tokens. Con precios de API, eso son dolares. Con suscripcion Max, cuenta contra tus limites de uso.\n\nLa regla: empieza con subagentes. Escala a equipos de agentes solo cuando encuentres un problema real de coordinacion que los subagentes no puedan resolver. La mayoria de las tareas no necesitan equipos de agentes. El patron de sesion-unica-con-subagentes maneja el 90% del trabajo paralelo.\n\nOtra opcion: multiples pestañas de terminal, cada una ejecutando una sesion independiente de Claude Code en diferentes partes del codebase. Esto te da paralelismo sin el overhead de equipos de agentes. La compensacion es que las sesiones no pueden comunicarse - tu eres el orquestador.',
      },
    ],
  },

  {
    id: 'how-to-write-claude-md',
    title: 'Como Escribir un Archivo CLAUDE.md',
    subtitle: 'La guia completa para configurar Claude Code para tu proyecto',
    category: 'cli-tools',
    description:
      'Guia paso a paso para escribir un archivo CLAUDE.md efectivo. Que incluir, que omitir, ubicacion de archivos, sintaxis de importacion y ejemplos reales de un monorepo en produccion con tres sitios Next.js.',
    keywords: [
      'como escribir CLAUDE.md',
      'guia CLAUDE.md',
      'archivo CLAUDE.md',
      'tutorial CLAUDE.md',
      'ejemplo CLAUDE.md',
      'mejores practicas CLAUDE.md',
      'configuracion de claude code',
      'escribir archivo CLAUDE.md',
      'plantilla CLAUDE.md',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'rules-skills-context',
      'claude-md-vs-agents-md-vs-cursorrules',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'Que Hace CLAUDE.md',
        type: 'prose',
        content:
          'CLAUDE.md es un archivo Markdown plano que Claude Code lee al inicio de cada sesion. Es el documento de onboarding para tu compañero de equipo AI. Todo en este archivo se convierte en parte de la ventana de contexto - Claude lo ve antes de que escribas tu primer mensaje.\n\nSin un CLAUDE.md, Claude Code opera de forma generica. No conoce la estructura de tu proyecto, tus convenciones de codigo, tus comandos de build ni tu proceso de despliegue. Con un CLAUDE.md, opera como un compañero de equipo que ha leido toda tu documentacion.\n\nEl archivo vive en la raiz de tu repositorio. Se versiona con tu codigo. Cuando el proyecto evoluciona, el CLAUDE.md evoluciona con el. Cuando un nuevo desarrollador se une, obtiene Claude Code preconfigurado para tu proyecto automaticamente.',
      },
      {
        heading: 'Ubicacion de Archivos y Jerarquia',
        type: 'pattern',
        content:
          'Claude Code carga CLAUDE.md desde multiples ubicaciones, fusionandolos en orden:\n\n1. ~/.claude/CLAUDE.md - Configuracion global. Aplica a cada proyecto. Pon tus preferencias personales aqui: configuracion del editor, estilo de commits, preferencias de comunicacion.\n\n2. /project-root/CLAUDE.md - Configuracion del proyecto. Aplica a este repositorio. Pon instrucciones especificas del proyecto aqui: comandos de build, estandares de codigo, resumen de arquitectura.\n\n3. /project-root/src/CLAUDE.md - Configuracion de directorio. Aplica cuando se trabaja en el directorio src/. Pon instrucciones especificas del modulo aqui: convenciones de API para el modulo de API, patrones de componentes para el modulo de UI.\n\nCada nivel agrega al contexto. Global mas proyecto mas directorio. Usa esto para evitar repeticion: global maneja tu estilo personal, proyecto maneja el codebase, directorio maneja el modulo.\n\nPara monorepos: pon convenciones compartidas en el CLAUDE.md raiz. Pon instrucciones especificas de la app en el directorio de cada app. Por ejemplo, website/apps/dashboard/CLAUDE.md podria decir "esta app usa Tailwind CSS y componentes shadcn/ui" mientras el CLAUDE.md raiz cubre la configuracion compartida de TypeScript.',
      },
      {
        heading: 'Que Incluir',
        type: 'pattern',
        content:
          'Los archivos CLAUDE.md mas efectivos cubren seis areas:\n\n1. Comandos de build y test. Los comandos exactos para compilar, testear, lintear y desplegar. No "ejecuta los tests" sino "npm run test" o "pytest -x tests/". Claude Code los usa directamente.\n\n2. Estructura del proyecto. Un mapa breve del codebase. Donde vive el codigo fuente, donde van los tests, donde estan los archivos de configuracion. Dos a cinco lineas, no un arbol de directorio entero.\n\n3. Convenciones de codigo. Indentacion, patrones de nombres, orden de importaciones, nombres de archivos. Especificas y verificables: "usa indentacion de 2 espacios" no "formatea el codigo bien."\n\n4. Reglas de seguridad. Que nunca hacer. "Nunca hagas commit de archivos .env." "Nunca hagas push a main sin que pasen los tests." "Nunca elimines archivos de migracion." Estas son barreras que previenen errores costosos.\n\n5. Instrucciones de flujo de trabajo. Como quieres que Claude Code opere. "Ejecuta tests antes de marcar una tarea como completa." "Escribe un context handoff al final de cada sesion." "Entra en modo plan para tareas con 3+ pasos."\n\n6. Referencias clave. Apuntadores a documentos importantes. "Ver docs/ARCHITECTURE.md para el diseño del sistema." "Ver .cursor/rules/ para reglas por patron de archivos." Apuntadores, no copias - esto mantiene el CLAUDE.md liviano.',
      },
      {
        heading: 'Que Omitir',
        type: 'anti-pattern',
        content:
          'Errores comunes que empeoran los archivos CLAUDE.md:\n\nNo pegues bloques de codigo grandes. Se vuelven obsoletos cuando el codigo cambia. Apunta al archivo en su lugar: "ver src/lib/auth.ts para el patron de autenticacion."\n\nNo excedas 200 lineas. Cada linea consume tokens de contexto. Un CLAUDE.md de 500 lineas consume el espacio disponible para codigo real y conversacion. Si necesitas mas detalle, usa la sintaxis @import para cargar archivos bajo demanda.\n\nNo escribas instrucciones vagas. "Escribe buen codigo" y "sigue las mejores practicas" no tienen significado para una AI. Se interpretan diferente en cada sesion. "Usa retornos tempranos en lugar de if-else anidados" es especifico y consistente.\n\nNo dupliques documentacion. Si tienes un CONTRIBUTING.md, apunta a el. No copies su contenido en CLAUDE.md. Una sola fuente de verdad.\n\nNo incluyas secretos o variables de entorno. CLAUDE.md se versiona. Si tu build necesita claves de API, di "configura OPENAI_API_KEY en .env" no el valor real de la clave.',
      },
      {
        heading: 'Sintaxis de Importacion para Proyectos Grandes',
        type: 'code',
        content:
          'CLAUDE.md soporta importar otros archivos con la sintaxis @path/to/file. Los archivos importados se expanden inline cuando Claude Code carga el contexto.\n\nUsa importaciones para:\n- Documentos de arquitectura: @docs/ARCHITECTURE.md\n- Convenciones del equipo: @docs/CONVENTIONS.md\n- Documentacion de API: @docs/API.md\n\nEsto mantiene el CLAUDE.md raiz liviano (menos de 200 lineas) mientras le da a Claude acceso a referencias detalladas cuando las necesita. Los archivos importados solo se cargan cuando el CLAUDE.md se procesa, asi que no consumen tokens hasta que una sesion comienza.\n\nUn patron que funciona: mantén el CLAUDE.md como la tabla de contenidos y usa importaciones para los capitulos. El CLAUDE.md dice "Para instrucciones de despliegue, ver @docs/DEPLOY.md." Claude ve el documento completo de despliegue cuando lo necesita.',
      },
      {
        heading: 'Empezar en 60 Segundos',
        type: 'pro-tip',
        content:
          'El camino mas rapido: abre Claude Code en tu proyecto y ejecuta /init. Genera un CLAUDE.md inicial basado en la estructura de tu proyecto, package.json y archivos de configuracion existentes. Revisalo, recorta lo generico y agrega tus instrucciones especificas del proyecto.\n\nSi quieres empezar desde cero, crea un CLAUDE.md en la raiz de tu proyecto con estas tres secciones:\n\n## Comandos de Build\nnpm install\nnpm run dev\nnpm run test\nnpm run build\n\n## Estructura del Proyecto\n- src/ - Codigo fuente de la aplicacion\n- tests/ - Archivos de test\n- docs/ - Documentacion\n\n## Reglas\n- Ejecutar tests antes de hacer commit\n- Usar TypeScript modo estricto\n- Nunca hacer commit de archivos .env\n\nEso es suficiente para hacer Claude Code significativamente mas util. Puedes expandirlo con el tiempo a medida que notas patrones - cada vez que Claude Code hace algo mal, agrega una regla. Cada vez que re-explicas algo, agregalo al archivo. El CLAUDE.md se sazona con el uso, como un sarten de hierro fundido.',
      },
    ],
  },

  {
    id: 'how-to-setup-claude-code-hooks',
    title: 'Como Configurar Hooks de Claude Code',
    subtitle: 'Automatiza flujos de trabajo en cada etapa del ciclo de vida del agente',
    category: 'cli-tools',
    description:
      'Guia practica de hooks de Claude Code. Como configurar hooks pre-edit, post-edit, pre-command y de notificacion con ejemplos reales para formateo, escaneo de seguridad y automatizacion de flujos de trabajo.',
    keywords: [
      'hooks de claude code',
      'tutorial hooks claude code',
      'configuracion hooks claude code',
      'como usar hooks de claude code',
      'automatizacion claude code',
      'hook pre-commit claude code',
      'automatizacion de flujos de trabajo claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'claude-code-quickstart',
      'rules-skills-context',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'Que Son los Hooks',
        type: 'prose',
        content:
          'Los hooks son comandos de shell que se ejecutan automaticamente en puntos especificos del ciclo de vida de Claude Code. Te dan control deterministico sobre el comportamiento del agente. En lugar de esperar que Claude recuerde formatear codigo despues de una edicion, un hook lo garantiza.\n\nLa palabra clave es deterministico. Las instrucciones de CLAUDE.md son sugerencias - el modelo generalmente las sigue pero podria no hacerlo. Los hooks son garantias. Un hook pre-command que bloquea rm -rf siempre lo bloqueara. Un hook post-edit que ejecuta Prettier siempre formateara el archivo.\n\nLos hooks ejecutan tu codigo, no el de Claude. Ejecutan comandos de shell en tu maquina. Esto los hace poderosos (puedes hacer cualquier cosa que un script de shell pueda hacer) y peligrosos (un hook malo puede romper tu flujo de trabajo). Empieza simple, agrega complejidad segun sea necesario.',
      },
      {
        heading: 'Tipos de Hooks y Ciclo de Vida',
        type: 'pattern',
        content:
          'Claude Code soporta hooks en estos puntos del ciclo de vida:\n\nPreToolUse: Se ejecuta antes de que Claude ejecute una herramienta (edicion de archivo, comando bash, etc.). Usa esto para bloquear comandos peligrosos, validar rutas de archivos o inyectar contexto. Si tu hook devuelve un codigo de salida distinto de cero, la llamada a la herramienta se bloquea.\n\nPostToolUse: Se ejecuta despues de que Claude ejecuta una herramienta. Usa esto para formatear archivos editados, ejecutar linters, enviar notificaciones o registrar cambios. La llamada a la herramienta ya ocurrio - estas reaccionando a ella.\n\nNotification: Se ejecuta cuando Claude necesita input humano o quiere notificarte. Usa esto para enviar mensajes de Slack, reproducir sonidos o disparar notificaciones del sistema cuando Claude esta esperando aprobacion.\n\nStop: Se ejecuta cuando Claude termina una respuesta. Usa esto para limpieza, registro o disparar flujos de trabajo post-respuesta.\n\nCada hook recibe contexto sobre lo que lo activo: el nombre de la herramienta, la ruta del archivo, el comando o el mensaje de notificacion. Usas este contexto para decidir que debe hacer tu hook.',
      },
      {
        heading: 'Configurando Tu Primer Hook',
        type: 'code',
        content:
          'Ejecuta /hooks en Claude Code para abrir la configuracion interactiva de hooks. O edita tu configuracion directamente.\n\nLos hooks viven en la configuracion de Claude Code (ya sea a nivel de proyecto en .claude/settings.json o a nivel de usuario en ~/.claude/settings.json). El formato es un objeto JSON que mapea tipos de hooks a arrays de configuraciones de hooks.\n\nCada hook tiene: un matcher (que herramienta o evento lo activa), un command (que ejecutar) y opcionalmente un timeout.\n\nEjemplo: un hook PostToolUse que formatea archivos TypeScript despues de ediciones.\n\nEl matcher verifica si la herramienta fue "Edit" o "Write" y el archivo termina en .ts o .tsx. El comando ejecuta Prettier en el archivo editado. Cada vez que Claude edita un archivo TypeScript, se auto-formatea.\n\nEjemplo: un hook PreToolUse que bloquea comandos bash peligrosos.\n\nEl matcher verifica si la herramienta es "Bash" y el comando contiene "rm -rf" o "drop table" o "force push." Si coincide, el hook sale con codigo 1 y bloquea el comando. Claude ve el bloqueo y ajusta su enfoque.\n\nEmpieza con estos dos patrones: auto-formateo despues de ediciones y bloqueo de comandos peligrosos. Proporcionan valor inmediato con complejidad minima.',
      },
      {
        heading: 'Patrones de Hooks del Mundo Real',
        type: 'pattern',
        content:
          'Escaneo de seguridad: Un hook PreToolUse que revisa archivos editados en busca de secretos codificados (claves API, contraseñas, tokens) antes de que la edicion se aplique. Usa un patron grep simple contra el nuevo contenido. Bloquea la edicion si se detectan secretos.\n\nNotificacion en inactividad: Un hook Notification que envia una notificacion de macOS o mensaje de Slack cuando Claude esta esperando aprobacion. Util cuando ejecutas tareas largas - puedes trabajar en otra cosa y recibir un aviso cuando Claude te necesita.\n\nAuto-testing: Un hook PostToolUse que ejecuta el archivo de test relevante despues de cualquier edicion de archivo fuente. Si editas src/auth.ts, el hook ejecuta tests/auth.test.ts automaticamente. Claude ve los resultados del test en su siguiente turno.\n\nSeguridad de git: Un hook PreToolUse que previene que Claude ejecute git push --force, git reset --hard o git checkout . sin confirmacion explicita. Estos son los comandos destructivos de git que pueden perder trabajo.\n\nInyeccion de contexto: Un hook PreToolUse que se ejecuta al inicio de sesion y agrega la fecha de hoy, la rama actual de git y mensajes de commits recientes al contexto. Claude empieza cada sesion con conciencia situacional fresca.',
      },
      {
        heading: 'Depuracion y Trampas',
        type: 'pro-tip',
        content:
          'Los hooks se ejecutan sincronicamente. Un hook lento bloquea a Claude de proceder. Mantén los hooks rapidos - menos de 2 segundos. Si necesitas ejecutar algo lento (una suite de tests completa, un build), hazlo en segundo plano y reporta resultados asincronicamente.\n\nLos errores de hooks son visibles para Claude. Si tu hook imprime a stderr o sale con un codigo distinto de cero, Claude lo ve como retroalimentacion. Esto es util: un hook que bloquea un comando e imprime "Bloqueado: nunca hagas force push a main" le enseña a Claude a evitar ese comando en turnos futuros.\n\nPrueba los hooks fuera de Claude Code primero. Escribe el comando de shell, ejecutalo manualmente, verifica que funciona. Luego agregalo como hook. Depurar un hook roto dentro de una sesion activa de Claude Code es frustrante.\n\nLos matchers son coincidencias de cadenas, no regex (en la configuracion basica). Usa el campo command para logica de coincidencia compleja. Tu script de hook puede inspeccionar el contexto completo y decidir si actuar o dejar pasar.\n\nEl orden de los hooks importa. Los hooks del mismo tipo se ejecutan en orden de array. Si tienes dos hooks PreToolUse, el primero se ejecuta primero. Si bloquea la herramienta, el segundo nunca se ejecuta.',
      },
    ],
  },

  {
    id: 'how-to-build-persistent-ai-memory',
    title: 'Como Construir Memoria de Agente AI que Persiste entre Sesiones',
    subtitle: 'Handoffs de sesion, archivos de memoria y la arquitectura que hace que la AI recuerde',
    category: 'cli-tools',
    description:
      'Como construir memoria persistente para agentes de codigo AI. Context handoffs, archivos de memoria estructurados, bases de conocimiento y el sistema practico que lleva estado entre sesiones de Claude Code sin perder contexto.',
    keywords: [
      'memoria de agente AI',
      'memoria AI persistente',
      'memoria claude code',
      'context handoff AI',
      'memoria de sesion AI',
      'handoff de sesion claude code',
      'gestion de estado de agente AI',
      'como hacer que la AI recuerde',
      'memoria AI entre sesiones',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'parallel-session-handoffs',
      'repo-context-engine',
      'constraints-and-context-engines',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'El Problema',
        type: 'prose',
        content:
          'Cada sesion de AI empieza con amnesia. Claude Code abre, lee tu CLAUDE.md y conoce las convenciones de tu proyecto. Pero no sabe en que trabajaste ayer, que decisiones se tomaron, que esta bloqueado o cual es el siguiente paso. Re-explicas el contexto en cada sesion. Esto desperdicia tiempo y tokens.\n\nLa solucion es un sistema de memoria - documentos estructurados que llevan estado entre sesiones. No un volcado de historial de chat. No un resumen vago. Un sistema que le da a cada nueva sesion exactamente el contexto que necesita para continuar donde la ultima lo dejo.',
      },
      {
        heading: 'Las Tres Capas de Memoria',
        type: 'pattern',
        content:
          'Un sistema de memoria de AI de grado produccion tiene tres capas. Cada una sirve un proposito diferente y persiste de manera diferente.\n\nCapa 1: Handoffs de Sesion (memoria episodica). Que paso en la ultima sesion. Que se construyo, que decisiones se tomaron, cual es el estado actual, que deberia pasar despues. Se escribe al final de cada sesion. Se lee al inicio de la siguiente. De corta vida - el handoff de ayer importa, el de la semana pasada no.\n\nCapa 2: Auto-Memoria (memoria semantica). Hechos estables sobre el proyecto y el usuario. Preferencias, convenciones, decisiones arquitectonicas clave, rutas de archivos importantes. Persiste indefinidamente. Se actualiza cuando nuevos hechos se confirman a traves de multiples sesiones. Este es el archivo MEMORY.md que Claude Code gestiona en su directorio de proyectos.\n\nCapa 3: Base de Conocimiento (memoria procedural). Como hacer las cosas. Skills, flujos de trabajo, patrones, plantillas. El CLAUDE.md, archivos de skills y entradas de wiki. Persiste mientras el proyecto exista. Evoluciona lentamente a traves de actualizaciones deliberadas.\n\nLa Capa 1 cambia diariamente. La Capa 2 cambia semanalmente. La Capa 3 cambia mensualmente. Cada capa se carga en un momento diferente y sirve una funcion diferente en la ventana de contexto.',
      },
      {
        heading: 'Construyendo Handoffs de Sesion',
        type: 'code',
        content:
          'Un handoff de sesion es un documento Markdown estructurado que se escribe al final de cada sesion de Claude Code. Responde cinco preguntas:\n\n1. Que se hizo? - Lista de trabajo completado con archivos especificos cambiados\n2. Cual es el estado actual? - Rama de git, cambios sin commit, estado del build\n3. Que decisiones se tomaron? - Elecciones clave y su razonamiento\n4. Que esta bloqueado? - Dependencias, esperando input externo, preguntas abiertas\n5. Que deberia pasar despues? - Lista priorizada de proximos pasos\n\nEl handoff va a un archivo con marca de tiempo: ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md. Los nombres con marca de tiempo previenen conflictos cuando multiples sesiones se ejecutan en paralelo.\n\nAl inicio de sesion, Claude Code lee todos los handoffs no consumidos (archivos que no terminan en _done.md), los procesa y luego renombra cada uno a file_done.md. Los handoffs consumidos antiguos se limpian despues de 7 dias.\n\nEsto es seguro para ejecucion paralela. Dos sesiones de Claude Code en diferentes terminales pueden ambas escribir handoffs sin sobreescribirse mutuamente. La siguiente sesion lee todos y obtiene el contexto combinado.',
      },
      {
        heading: 'Auto-Memoria que Realmente Funciona',
        type: 'pattern',
        content:
          'Claude Code tiene un sistema de auto-memoria incorporado. Escribe en un archivo MEMORY.md en su directorio de configuracion del proyecto. Este archivo se carga en el contexto al inicio de sesion.\n\nReglas para auto-memoria efectiva:\n\nGuarda patrones estables confirmados en multiples interacciones. No cada dato aislado - patrones que ves recurrentes. "El usuario prefiere indentacion de 2 espacios" es estable. "El usuario esta trabajando en el modulo auth hoy" es especifico de sesion y pertenece a un handoff, no a la memoria.\n\nOrganiza por tema, no cronologicamente. Crea archivos separados para diferentes dominios (debugging.md, infrastructure.md, voice-rules.md) y enlazalos desde MEMORY.md. Esto mantiene el archivo de memoria raiz liviano.\n\nMantén MEMORY.md bajo 200 lineas. Las lineas despues de 200 se truncan cuando se cargan en el contexto. Pon los hechos mas importantes primero. Mueve detalles a archivos por tema.\n\nActualiza o elimina memorias obsoletas. Si una convencion cambia, actualiza la memoria. Si una decision se revirtio, elimina la memoria antigua. Las memorias obsoletas causan mas daño que no tener memorias porque la AI sigue instrucciones desactualizadas con confianza.\n\nGuarda solicitudes explicitas del usuario inmediatamente. Si el usuario dice "siempre usa bun en lugar de npm," guardalo ahora. No esperes multiples confirmaciones.',
      },
      {
        heading: 'El Sistema Completo en Practica',
        type: 'pro-tip',
        content:
          'Asi es como las tres capas trabajan juntas en un flujo de trabajo diario real.\n\n9 AM: Abro Claude Code. Lee CLAUDE.md (Capa 3 - conoce el proyecto). Lee MEMORY.md (Capa 2 - conoce mis preferencias). Lee el handoff de ayer (Capa 1 - sabe que paso ayer). En 10 segundos, Claude tiene el contexto de un compañero de equipo que estuvo aqui ayer.\n\nDurante la sesion: Claude usa la Capa 3 para seguir convenciones del proyecto. Usa la Capa 2 para coincidir con mis preferencias. Usa la Capa 1 para continuar el trabajo de la sesion anterior sin que yo re-explique nada.\n\nFin de sesion: Claude escribe un nuevo handoff (Capa 1). Si se descubrieron patrones estables, actualiza MEMORY.md (Capa 2). Si un flujo de trabajo cambio, el skill relevante se actualiza (Capa 3).\n\nEl efecto compuesto: despues de una semana de esto, el sistema conoce mi proyecto profundamente. Despues de un mes, maneja el 80% del trabajo rutinario sin que yo proporcione contexto. Despues de tres meses, una nueva sesion de Claude es mas productiva en su primer minuto que un nuevo desarrollador humano en su primer dia.\n\nLa idea clave: la memoria no es un solo archivo. Son tres capas que sirven diferentes horizontes temporales. Construye las tres y el efecto compuesto es dramatico.',
      },
    ],
  },

  {
    id: 'top-10-claude-code-tips',
    title: 'Los 10 Mejores Consejos de Claude Code para Usuarios Avanzados',
    subtitle: 'Consejos practicos del uso diario - no los obvios',
    category: 'cli-tools',
    description:
      'Diez consejos de Claude Code que van mas alla de lo basico. Skills, hooks, sesiones paralelas, gestion de contexto y los flujos de trabajo que multiplican tu produccion por 10. De un profesional que ejecuta Claude Code como su herramienta principal de desarrollo.',
    keywords: [
      'consejos claude code',
      'trucos claude code',
      'usuario avanzado claude code',
      'mejores practicas claude code',
      'consejos avanzados claude code',
      'productividad claude code',
      'guia claude code 2026',
      'mejores consejos claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'claude-code-quickstart',
      'how-to-write-claude-md',
      'how-to-setup-claude-code-hooks',
    ],
    sections: [
      {
        heading: '1. Usa el Modo Plan para Todo lo No Trivial',
        type: 'pattern',
        content:
          'Antes de que Claude Code escriba una sola linea de codigo, entra en modo plan. Escribe /plan o pide a Claude que planifique el enfoque. Explora el codebase, identifica archivos afectados, considera casos extremos y presenta una estrategia de implementacion para tu aprobacion.\n\nSin modo plan: Claude empieza a programar inmediatamente, se da cuenta a mitad de camino de que el enfoque no funciona, retrocede y produce resultados desordenados.\n\nCon modo plan: Claude pasa 30 segundos mapeando el problema, apruebas o ajustas el enfoque, luego ejecuta limpiamente. La inversion de 30 segundos ahorra 10 minutos de depuracion.\n\nLa regla: cualquier tarea que toque 3 o mas archivos recibe modo plan. Sin excepciones.',
      },
      {
        heading: '2. Escribe Skills para Flujos de Trabajo Repetitivos',
        type: 'pattern',
        content:
          'Si haces algo mas de dos veces, deberia ser un skill. Un skill es un archivo Markdown en .claude/skills/ que define un flujo de trabajo paso a paso que Claude sigue cuando se activa.\n\nEjemplos de skills que vale la pena construir: /deploy (build, test, commit, push, verificar), /morning (leer handoffs, revisar git status, mostrar prioridades), /draft-email (reunir contexto, escribir email, enviar a carpeta de borradores). Cada skill reemplaza 5-10 instrucciones manuales con un solo comando.\n\nLos skills se componen. Cada vez que el skill se ejecuta y notas un caso extremo, corrige el skill. Despues de 20 usos, maneja escenarios que nunca planificaste. Despues de 50 usos, se ejecuta impecablemente sin intervencion.\n\nLa estructura del directorio de skills: .claude/skills/skill-name/SKILL.md. El archivo SKILL.md contiene la descripcion del disparador, las instrucciones paso a paso y cualquier contexto que el skill necesite.',
      },
      {
        heading: '3. Ejecuta Sesiones Paralelas en Terminales Separadas',
        type: 'pattern',
        content:
          'Abre tres pestañas de terminal. Ejecuta Claude Code en cada una. Dale a cada sesion una tarea diferente. Acabas de triplicar tu rendimiento.\n\nPestaña 1: Refactorizando la capa de API. Pestaña 2: Escribiendo tests para la nueva funcionalidad. Pestaña 3: Actualizando documentacion. Las tres se ejecutan concurrentemente en el mismo codebase.\n\nCuidado con los conflictos: si dos sesiones editan el mismo archivo, la segunda escritura gana. Limita tus sesiones paralelas a diferentes directorios o modulos. Trabajo de API en una sesion, trabajo de UI en otra, documentacion en una tercera.\n\nPara maxima seguridad, usa git worktrees. Cada sesion obtiene su propia rama y directorio de trabajo. No son posibles los conflictos. Fusiona cuando termines.',
      },
      {
        heading: '4. Usa Subagentes para Investigacion, No Solo Codigo',
        type: 'pattern',
        content:
          'Los subagentes no son solo para cambios de codigo paralelos. Son asistentes de investigacion. Cuando Claude Code necesita entender un modulo complejo antes de hacer cambios, crea un subagente Explore.\n\n"Antes de refactorizar, quiero entender el modulo de auth. Crea un agente explore para mapear todos los flujos de autenticacion, encontrar cada lugar donde se validan tokens e identificar cualquier secreto codificado."\n\nEl subagente investiga el codigo, devuelve un resumen estructurado y la sesion principal toma decisiones con contexto completo. Esto mantiene la ventana de contexto principal limpia - la investigacion ocurre en el contexto del subagente, y solo el resumen regresa.',
      },
      {
        heading: '5. Configura un Skill de Rutina Matutina',
        type: 'pattern',
        content:
          'Los primeros cinco minutos de una sesion de programacion marcan el tono. En lugar de revisar el estado manualmente, construye un skill /morning que lo haga automaticamente.\n\nUn buen skill matutino: lee el context handoff de ayer, ejecuta git status, revisa PRs no fusionados, muestra las tres tareas prioritarias principales e imprime un resumen limpio. Abres Claude Code, escribes /morning y obtienes un resumen situacional completo.\n\nEste unico skill ahorra 10 minutos cada mañana y asegura que nunca empieces una sesion sin contexto. En un mes, eso son mas de 3 horas ahorradas solo en revision de estado.',
      },
      {
        heading: '6. Usa /compact Antes de que el Contexto se Alargue',
        type: 'pro-tip',
        content:
          'Las conversaciones de Claude Code consumen espacio de la ventana de contexto. Despues de 20-30 turnos, el contexto se llena y el rendimiento se degrada. El comando /compact resume la conversacion hasta el momento y libera espacio.\n\nEl truco: usa /compact proactivamente, no reactivamente. Despues de completar un bloque importante de trabajo, compacta antes de empezar el siguiente bloque. Esto le da a Claude espacio fresco de contexto para la nueva tarea mientras preserva un resumen de lo que ya se hizo.\n\nNo esperes hasta que Claude empiece a olvidar cosas o repetirse. Eso significa que el contexto ya esta saturado. Compacta temprano, compacta seguido.',
      },
      {
        heading: '7. Escribe Context Handoffs al Final de la Sesion',
        type: 'pattern',
        content:
          'Nunca cierres una sesion de Claude Code sin escribir un handoff. El handoff captura que se hizo, cual es el estado actual y que deberia pasar despues. La siguiente sesion lo lee y comienza con contexto completo.\n\nAutomatiza esto con un skill o un hook. Un hook Stop puede pedirle a Claude que escriba un handoff antes de salir. Un skill /handoff puede generar un documento de handoff estructurado bajo demanda.\n\nEl handoff es el puente entre sesiones. Sin el, cada sesion empieza desde cero. Con el, las sesiones se construyen una sobre otra. Despues de una semana de handoffs, Claude conoce tu proyecto tan bien como tu.',
      },
      {
        heading: '8. Usa Hooks para Seguridad, No Solo Conveniencia',
        type: 'pattern',
        content:
          'Los hooks de mayor valor no son formateadores ni notificadores. Son puertas de seguridad.\n\nUn hook PreToolUse que bloquea git push --force ha prevenido perdida de datos mas de una vez. Un hook que escanea archivos editados en busca de claves API antes de que se escriban captura secretos antes de que lleguen al disco. Un hook que previene ediciones en archivos de migracion evita romper la base de datos.\n\nLos hooks de seguridad se configuran una vez y te protegen para siempre. Los 30 minutos para configurarlos ahorran horas de respuesta a crisis.',
      },
      {
        heading: '9. Mantén CLAUDE.md Bajo 200 Lineas',
        type: 'anti-pattern',
        content:
          'Un CLAUDE.md de 500 lineas es peor que uno de 100 lineas. Consume espacio de contexto que Claude necesita para codigo real. Entierra instrucciones importantes bajo muros de detalle. La adherencia del modelo a las instrucciones baja a medida que el archivo crece.\n\nLa solucion: mantén CLAUDE.md liviano. Usa @imports para documentos detallados. Apunta a archivos en lugar de copiar contenido. Elimina cualquier instruccion que Claude ya siga por defecto.\n\nCada linea en CLAUDE.md debe ganarse su lugar. Si Claude haria lo correcto sin la instruccion, elimina la instruccion. Solo incluye reglas que anulan los valores por defecto o refuerzan convenciones especificas del proyecto.',
      },
      {
        heading: '10. Construye un Archivo de Lecciones para Auto-Mejora',
        type: 'pro-tip',
        content:
          'Cada vez que Claude Code comete un error y lo corriges, agrega la leccion a un archivo. Yo uso tasks/lessons.md. El CLAUDE.md le dice a Claude que lea este archivo al inicio de sesion.\n\nFormato: fecha, contexto, regla. "2026-03-01: MCP create_note hace doble escape de saltos de linea. Regla: Nunca uses MCP create_note para contenido multi-linea. Usa la REST API directamente."\n\nCon el tiempo, este archivo se convierte en una base de conocimiento personalizada de problemas especificos del proyecto. Claude lo lee, evita los mismos errores y tu tasa de error baja a casi cero. El archivo de lecciones es el camino mas rapido hacia una instancia de Claude Code que se siente como si tuviera meses de experiencia en tu proyecto.\n\nLa meta-leccion: los agentes de AI no aprenden entre sesiones a menos que construyas el mecanismo. El archivo de lecciones es ese mecanismo.',
      },
    ],
  },

  {
    id: 'best-mcp-servers-2026',
    title: 'Los Mejores Servidores MCP para Desarrolladores en 2026',
    subtitle: 'Los servidores MCP que vale la pena configurar - y los que puedes omitir',
    category: 'mcp-servers',
    description:
      'Lista curada de los mejores servidores del Model Context Protocol para desarrolladores en 2026. Que hace cada uno, complejidad de configuracion, utilidad diaria y evaluacion honesta de cuales servidores MCP realmente mejoran tu flujo de trabajo.',
    keywords: [
      'mejores servidores MCP',
      'servidores MCP 2026',
      'servidores model context protocol',
      'lista de servidores MCP',
      'mejores servidores MCP para desarrolladores',
      'recomendaciones servidores MCP',
      'top servidores MCP',
      'servidores MCP claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'what-are-mcps',
      'managing-mcp-servers',
      'mcp-gtm-stack',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'Como Evaluar Servidores MCP',
        type: 'prose',
        content:
          'No todos los servidores MCP valen el tiempo de configuracion. Un servidor MCP conecta un servicio externo a tu agente AI - pero eso solo importa si usas ese servicio con suficiente frecuencia para beneficiarte de la integracion con AI.\n\nLos criterios de evaluacion: Con que frecuencia usas este servicio? Cuanta friccion elimina el servidor MCP? Que tan confiable es el servidor? Es la alternativa (pestaña del navegador, herramienta CLI) realmente peor?\n\nHe probado mas de 30 servidores MCP durante seis meses. Algunos se convirtieron en esenciales diarios. Algunos fueron demos interesantes que elimine despues de una semana. Aqui estan los que se quedaron.',
      },
      {
        heading: 'Nivel 1: Esenciales Diarios',
        type: 'pattern',
        content:
          'Playwright (automatizacion de navegador): El servidor MCP mas util para cualquier desarrollador. Le da a Claude Code un navegador real. Navegar paginas, hacer clic en botones, rellenar formularios, tomar capturas de pantalla, leer contenido de paginas. Casos de uso: probar despliegues, extraer datos, verificar cambios de UI, interactuar con servicios web. La configuracion es un solo comando. La confiabilidad es excelente.\n\nFilesystem (acceso mejorado a archivos): Extiende el acceso a archivos de Claude Code mas alla del proyecto actual. Lee desde cualquier directorio en tu maquina. Util cuando tu flujo de trabajo abarca multiples repositorios o necesitas referenciar archivos fuera de la raiz del proyecto.\n\nGitHub (operaciones de repositorio): Gestion de pull requests, seguimiento de issues, revision de codigo - todo desde la terminal. Crear PRs, comentar en issues, revisar estado de CI, fusionar ramas. Elimina el viaje al navegador para operaciones comunes de GitHub.\n\nPostHog (analitica): Consulta tus datos de analitica directamente desde Claude Code. "Cuantos usuarios visitaron el dashboard esta semana?" se convierte en una consulta en lenguaje natural en lugar de iniciar sesion en PostHog, navegar al dashboard y construir una consulta. Esencial si tomas decisiones de desarrollo basadas en datos.',
      },
      {
        heading: 'Nivel 2: Alto Valor para Flujos de Trabajo Especificos',
        type: 'pattern',
        content:
          'Supabase (operaciones de base de datos): Ejecutar consultas SQL, gestionar migraciones, desplegar funciones edge, generar tipos TypeScript. Si Supabase es tu backend, este servidor MCP reemplaza el dashboard para la mayoria de operaciones. Claude puede consultar tu base de datos, entender el esquema y escribir migraciones que realmente funcionan.\n\nAttio o HubSpot (CRM): Buscar contactos, crear registros, actualizar etapas de deals - todo desde Claude Code. Valioso para equipos GTM que necesitan datos del CRM junto al codigo. Advertencia: los servidores MCP de CRM tienen problemas de confiabilidad. Algunas operaciones funcionan perfectamente. Otras silenciosamente corrompen datos. Prueba exhaustivamente antes de confiarle registros de produccion.\n\nTypefully (programacion de redes sociales): Redactar y programar publicaciones desde Claude Code. Si publicas contenido regularmente, esto elimina el cambio de contexto a la UI de Typefully. Claude puede redactar una publicacion, la revisas y se programa sin salir de la terminal.\n\nExa o Perplexity (busqueda web): Dale a Claude Code acceso web. Puede buscar documentacion, verificar precios actuales, encontrar ejemplos de codigo o verificar hechos. Util para sesiones de desarrollo donde necesitas informacion en tiempo real.',
      },
      {
        heading: 'Nivel 3: Bueno Tenerlos',
        type: 'pattern',
        content:
          'Slack (mensajeria): Enviar y leer mensajes de Slack desde Claude Code. Util para notificaciones automatizadas (despliegue completado, tests fallando) pero limitado para conversaciones reales. La interfaz MCP no es ideal para discusiones con hilos.\n\nLinear o Jira (gestion de proyectos): Crear issues, actualizar estados, consultar backlogs. Util si tu gestion de tareas vive en estas herramientas. Pero la mayoria de desarrolladores encuentran mas rapido simplemente abrir la UI web para tareas de gestion de proyectos.\n\nNotion (documentacion): Leer y escribir paginas de Notion. Util para equipos que mantienen su documentacion en Notion y quieren que Claude la referencie. La configuracion puede ser complicada con los permisos.\n\nSentry (monitoreo de errores): Consultar errores, verificar tasas de error, investigar stack traces. Valioso durante sesiones de depuracion. Menos util para desarrollo rutinario.',
      },
      {
        heading: 'Servidores MCP para Omitir',
        type: 'anti-pattern',
        content:
          'Algunos servidores MCP dan mas problemas de lo que valen:\n\nCualquier cosa que duplique capacidades existentes de Claude Code. Claude Code ya puede leer archivos, ejecutar comandos y buscar codigo. Un servidor MCP que proporciona "lectura mejorada de archivos" agrega overhead sin mejora significativa.\n\nServidores con mal manejo de errores. Si un servidor MCP falla silenciosamente o devuelve errores cripticos, crea mas trabajo del que ahorra. Antes de comprometerte con cualquier servidor MCP, prueba casos de error: que pasa cuando el servicio esta caido, cuando la autenticacion expira, cuando se alcanzan limites de tasa?\n\nServidores para servicios que usas una vez por semana. El overhead de mantener la configuracion del servidor MCP, manejar renovaciones de tokens de autenticacion y depurar problemas de conexion solo vale la pena para servicios que usas diariamente. Si revisas tu dashboard de Stripe una vez por semana, simplemente abre una pestaña del navegador.\n\nServidores que requieren infraestructura local compleja. Algunos servidores MCP necesitan Docker, bases de datos locales o procesos en segundo plano. A menos que el valor sea enorme, el costo de mantenimiento supera la conveniencia.',
      },
      {
        heading: 'Consejo de Configuracion',
        type: 'pro-tip',
        content:
          'Empieza con Playwright. Es el servidor MCP mas universalmente util. Un npm install, una entrada de configuracion y Claude Code puede interactuar con cualquier sitio web.\n\nAgrega GitHub despues si usas GitHub diariamente. El servidor MCP del CLI gh esta probado en batalla y es confiable.\n\nLuego agrega tus servidores especificos del stack. Supabase si usas Supabase. PostHog si usas PostHog. Empareja servidores MCP con tus herramientas diarias.\n\nMantén tu configuracion MCP limpia. Los servidores no usados consumen tiempo de inicio y tokens de contexto. Elimina cualquier servidor que no hayas usado en la ultima semana. Siempre puedes volver a agregarlo.\n\nConsejo profesional: documenta tu configuracion MCP en CLAUDE.md. Lista cuales servidores estan configurados y para que son. Esto ayuda a Claude Code a usarlos apropiadamente y ayuda a compañeros de equipo a replicar tu configuracion.',
      },
    ],
  },

  {
    id: 'clay-vs-apollo-vs-zoominfo',
    title: 'Clay vs Apollo vs ZoomInfo',
    subtitle: 'Plataformas de enriquecimiento de leads comparadas - desde alguien que ejecuta las tres',
    category: 'comparisons',
    description:
      'Comparacion practica de Clay, Apollo y ZoomInfo para enriquecimiento de leads B2B. Precios, calidad de datos, flexibilidad de flujo de trabajo y las verdaderas compensaciones al construir infraestructura de outbound a escala de startup.',
    keywords: [
      'clay vs apollo',
      'clay vs zoominfo',
      'apollo vs zoominfo',
      'clay vs apollo vs zoominfo',
      'mejor herramienta de enriquecimiento de leads',
      'comparacion clay.com',
      'herramientas de enriquecimiento de datos B2B 2026',
      'comparacion de plataformas de enriquecimiento de leads',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'heyreach-linkedin-automation',
      'mcp-gtm-stack',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'La Version Rapida',
        type: 'prose',
        content:
          'Apollo es tu kit de inicio. Buena base de datos, secuenciacion integrada, tier gratuito que realmente funciona. ZoomInfo es el estandar enterprise. Base de datos masiva, datos de intent, precios premium. Clay es la capa de orquestacion. No posee una base de datos - se conecta a mas de 150 proveedores incluyendo Apollo y ZoomInfo y te permite construir flujos de trabajo de enriquecimiento personalizados.\n\nEl error que cometen la mayoria de los equipos: elegir uno y apostar todo. La respuesta correcta para la mayoria de las startups es Apollo para la base de datos de contactos, Clay para la logica de enriquecimiento y quiza ZoomInfo mas adelante cuando necesites señales de intent a escala.\n\nYo ejecuto Apollo como mi fuente principal de contactos, Clay como mi motor de enriquecimiento y scoring, y envio todo a Attio CRM. Aqui esta como rinde realmente cada herramienta en produccion.',
      },
      {
        heading: 'Apollo: La Navaja Suiza',
        type: 'pattern',
        content:
          'Que hace bien Apollo: base de datos de mas de 275M de contactos, secuencias de email integradas, integracion con LinkedIn, datos de intent decentes y un tier gratuito con 60 creditos/mes. Para una startup que necesita pasar de cero a outbound en un dia, Apollo es el camino mas rapido.\n\nLos datos de contacto son solidos para B2B en Norteamerica. La precision de email se situa alrededor del 85-90% en emails verificados. Los numeros de telefono son irregulares - quiza 60% precisos para lineas directas. Los datos de empresa (ingresos, cantidad de empleados, stack tecnologico) son generalmente confiables para empresas con mas de 50 empleados.\n\nDonde Apollo se queda corto: el enriquecimiento es una caja negra. Obtienes lo que Apollo tenga. Sin logica waterfall, sin proveedores de respaldo, sin cadenas de enriquecimiento personalizadas. Si Apollo no tiene el dato que necesitas, estas atascado. El secuenciador de email es funcional pero basico - sin tests A/B en horarios de envio, variables de personalizacion limitadas y la analitica es superficial.\n\nPrecios: el tier gratuito es genuinamente util para probar. Los planes pagos empiezan en $49/usuario/mes. El modelo por credito significa que los usuarios con enriquecimiento intensivo agotan sus asignaciones rapido. Presupuesta $100-200/mes para un operador individual haciendo prospeccion seria.',
      },
      {
        heading: 'ZoomInfo: El Estandar Enterprise',
        type: 'pattern',
        content:
          'Que hace bien ZoomInfo: la base de datos B2B propietaria mas grande del mercado. Datos de intent que realmente predicen comportamiento de compra. Datos de jerarquia empresarial que mapean unidades de toma de decisiones. Numeros de telefono que funcionan. Si vendes a empresas enterprise y necesitas los datos mas profundos posibles sobre cuentas objetivo, ZoomInfo no tiene rival.\n\nLos datos de intent son el verdadero diferenciador. ZoomInfo rastrea señales de consumo de contenido a traves de su red - cuando una empresa empieza a investigar temas relacionados con tu producto, lo ves. Esto es oro para ABM. En lugar de outbound de rociar y rezar, apuntas a empresas que estan activamente buscando soluciones como la tuya.\n\nDonde ZoomInfo se queda corto: precio. Los contratos anuales empiezan en $15,000+. Eso es presupuesto enterprise, no presupuesto de startup. La plataforma tambien es pesada - la UI asume un equipo de RevOps gestionando flujos de trabajo complejos. Los operadores individuales la encuentran abrumadora. Y la estructura de contrato es rigida - compromisos anuales con auto-renovacion que es notoriamente dificil de cancelar.\n\nRevision de realidad: la mayoria de las startups no necesitan ZoomInfo. Apollo cubre el 80% de los mismos datos al 10% del costo. ZoomInfo vale la pena cuando haces ABM enterprise a escala y los datos de intent impulsan pipeline medible.',
      },
      {
        heading: 'Clay: La Capa de Orquestacion',
        type: 'pattern',
        content:
          'Clay es fundamentalmente diferente de Apollo y ZoomInfo. No es una base de datos - es una plataforma de orquestacion de datos. Construyes tablas, extraes datos de mas de 150 proveedores, enriqueces registros a traves de logica waterfall, puntuas leads con formulas personalizadas y envias leads calificados a tus herramientas de outreach.\n\nQue hace bien Clay: enriquecimiento waterfall. En lugar de depender de un proveedor para direcciones de email, Clay prueba Proveedor A, luego Proveedor B, luego Proveedor C hasta obtener una coincidencia. Esto tipicamente produce 20-30% mas emails validos que cualquier proveedor individual. Las formulas de scoring personalizadas te permiten definir exactamente que significa "calificado" para tu ICP. Y Claygent (el agente AI de Clay) puede investigar prospectos rastreando sus sitios web, perfiles de LinkedIn y menciones en noticias.\n\nDonde Clay se queda corto: curva de aprendizaje. Clay piensa en hojas de calculo y formulas. Si no te sientes comodo con operaciones de datos estructurados, la primera semana es dolorosa. Los creditos se queman rapido en cadenas de enriquecimiento complejas - una sola fila puede usar 5-10 creditos si ejecutas multiples enriquecimientos. Y Clay no tiene sus propias herramientas de outreach - necesitas Instantly, Lemlist o HeyReach para el envio real.\n\nPrecios: empieza en $149/mes por 2,000 creditos. Los usuarios serios necesitan el plan de $349/mes (10,000 creditos) como minimo. Consejo profesional: conecta tus propias claves API de proveedores como Prospeo o BuiltWith directamente en Clay para evitar costos de creditos en esos enriquecimientos.',
      },
      {
        heading: 'El Stack que Realmente Ejecuto',
        type: 'pro-tip',
        content:
          'Mi stack de outbound en produccion usa las tres herramientas en roles especificos:\n\nApollo: fuente de contactos. Extraigo leads de Apollo basado en filtros ICP (titulo, tamaño de empresa, industria, stack tecnologico). Apollo es el punto de partida - la lista de leads cruda.\n\nClay: enriquecimiento y scoring. Los leads de Apollo fluyen a Clay donde reciben enriquecimiento waterfall de email (email de Apollo, luego Prospeo, luego Dropcontact), enriquecimiento de empresa (ingresos, stack tecnologico, señales de contratacion) y scoring ICP personalizado. Los leads que puntuan por encima del umbral se envian a outreach.\n\nInstantly: entrega de email. Los leads calificados de Clay van a Instantly para secuencias de cold email. Instantly maneja la rotacion de dominios, warmup y entregabilidad.\n\nHeyReach: entrega por LinkedIn. Los mismos leads calificados tambien van a HeyReach para outreach en LinkedIn. Solicitudes de conexion, mensajes de seguimiento y vistas de perfil se ejecutan en paralelo con el email.\n\nAttio: CRM. Todo fluye a Attio para seguimiento de pipeline. Etapas de deals, notas, actividades - todo centralizado.\n\nEl costo total: Apollo ($49/mes) + Clay ($349/mes) + Instantly ($47/mes) + HeyReach ($79/mes) + Attio (tier gratuito) = aproximadamente $525/mes por una infraestructura de outbound completa. Compara eso con ZoomInfo solo a $15,000+/año.\n\nEste stack genera mas pipeline calificado de lo que ZoomInfo generaria solo porque el enriquecimiento waterfall y el scoring personalizado producen outreach mejor orientado. Volumen con precision vence a datos premium con rociar y rezar.',
      },
    ],
  },

  {
    id: 'instantly-vs-smartlead-vs-lemlist',
    title: 'Instantly vs Smartlead vs Lemlist',
    subtitle: 'Plataformas de cold email comparadas - entregabilidad, precios y lo que realmente importa',
    category: 'comparisons',
    description:
      'Comparacion practica de Instantly, Smartlead y Lemlist para outreach de cold email. Entregabilidad, modelos de precios, limites de escalamiento y el desglose honesto de que herramienta se adapta a que caso de uso.',
    keywords: [
      'instantly vs smartlead',
      'instantly vs lemlist',
      'smartlead vs lemlist',
      'instantly vs smartlead vs lemlist',
      'mejor herramienta de cold email 2026',
      'comparacion software cold email',
      'reseña de instantly',
      'reseña de smartlead',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'cold-email-infrastructure',
      'heyreach-linkedin-automation',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'Lo Que Importa en Herramientas de Cold Email',
        type: 'prose',
        content:
          'Tres cosas determinan si una herramienta de cold email funciona: entregabilidad, escalabilidad y ajuste al flujo de trabajo. Todo lo demas - funciones de AI, plantillas elegantes, complementos multicanal - es secundario. Si tus emails caen en spam, nada mas importa. Si no puedes escalar mas alla de 100 emails/dia sin quemar dominios, la herramienta es un cuello de botella. Si el flujo de trabajo no coincide con como opera tu equipo, la adopcion muere.\n\nHe usado las tres en produccion. Instantly es mi principal. Aqui esta la comparacion honesta.',
      },
      {
        heading: 'Instantly: Mejor para Volumen + Entregabilidad',
        type: 'pattern',
        content:
          'Instantly esta construido alrededor de una idea: el cold email a escala requiere infraestructura, no solo software. La plataforma incluye cuentas de envio ilimitadas con tarifa plana, warmup integrado, rotacion automatica de dominios y monitoreo de entregabilidad.\n\nFortalezas: Cuentas de email ilimitadas en el plan Growth de $47/mes. Esa es la funcion estrella. Puedes conectar 20, 50 o 100 dominios de envio e Instantly rota entre ellos automaticamente. El sistema de warmup es solido - envia y recibe emails a traves de su red para construir reputacion del remitente. La base de datos de leads B2B (mas de 450M de contactos) es una buena adicion si no tienes Clay.\n\nDebilidades: El editor de emails es basico. Sin personalizacion avanzada mas alla de campos de fusion. La analitica esta mejorando pero aun va por detras de Lemlist. La UI puede sentirse desordenada si ejecutas muchas campañas. El soporte al cliente es responsivo pero a veces lento en problemas tecnicos complejos.\n\nMejor para: remitentes de volumen que priorizan entregabilidad y eficiencia de costos. Si envias mas de 500 emails/dia a traves de multiples dominios, Instantly es la opcion mas rentable.',
      },
      {
        heading: 'Smartlead: Mejor para Agencias + Usuarios Tecnicos',
        type: 'pattern',
        content:
          'Smartlead es la plataforma de cold email con API primero. Esta construida para agencias que gestionan multiples clientes y usuarios tecnicos que quieren control granular sobre el comportamiento de envio.\n\nFortalezas: Buzones ilimitados empezando en $39/mes - incluso mas barato que Instantly. Portales de cliente con marca blanca para agencias. Los controles de envio mas granulares: ventanas de envio personalizadas, limites por cuenta, throttling inteligente. Opciones de IP dedicada para remitentes enterprise. El sistema de sub-cuentas para agencias es el mejor de su clase.\n\nDebilidades: la UI es mas rustica que Instantly o Lemlist. La configuracion toma mas tiempo porque hay mas opciones que ajustar. La documentacion asume comodidad tecnica. La base de datos de leads no es tan completa como la de Instantly o Apollo. Algunas funciones avanzadas requieren planes de nivel superior.\n\nMejor para: agencias ejecutando campañas para 5+ clientes, operadores tecnicos que quieren control fino y equipos enviando a muy alto volumen (mas de 1000 emails/dia) que necesitan infraestructura dedicada.',
      },
      {
        heading: 'Lemlist: Mejor para Personalizacion + Multicanal',
        type: 'pattern',
        content:
          'Lemlist empezo como una herramienta de cold email y evoluciono en una plataforma de outreach multicanal. Su diferenciador es la profundidad de personalizacion - imagenes dinamicas, landing pages personalizadas y pasos de LinkedIn integrados en secuencias de email.\n\nFortalezas: el mejor motor de personalizacion en cold email. Imagenes dinamicas que insertan el nombre del prospecto, logo de la empresa o captura del sitio web en elementos visuales. Pasos de LinkedIn integrados (visitas de perfil, solicitudes de conexion, mensajes) junto al email. Creacion de landing pages para cada prospecto. La herramienta de warmup (Lemwarm) es efectiva.\n\nDebilidades: precio por usuario a $69/mes se acumula rapido. Cada miembro del equipo necesita su propio asiento. Sin cuentas de envio ilimitadas - pagas por cuenta. Esto hace que Lemlist sea caro a escala comparado con Instantly o Smartlead. La automatizacion de LinkedIn es buena pero no tan robusta como una herramienta dedicada como HeyReach.\n\nMejor para: equipos que venden deals de alto ACV donde la personalizacion impulsa las tasas de respuesta. Si cada respuesta vale $1,000+ en pipeline, la inversion extra en personalizacion vale la pena. Menos ideal para outbound de alto volumen y bajo contacto.',
      },
      {
        heading: 'Marco de Decision',
        type: 'formula',
        content:
          'Elige Instantly si: priorizas entregabilidad y volumen, quieres cuentas ilimitadas con tarifa plana, eres un operador individual o equipo pequeño y tu outreach es principalmente email primero.\n\nElige Smartlead si: ejecutas una agencia gestionando multiples clientes, quieres maximo control sobre comportamiento de envio, necesitas portales de cliente con marca blanca o eres muy tecnico y quieres flujos de trabajo con API primero.\n\nElige Lemlist si: vendes deals de alto ACV donde la personalizacion importa, quieres multicanal nativo (email + LinkedIn) en una herramienta, creas campañas visuales/personalizadas o tu equipo es lo suficientemente pequeño para que el precio por asiento sea manejable.\n\nLas cuentas de presupuesto:\n- 1 usuario, 5 cuentas de envio, 200 emails/dia: Instantly ($47/mes) o Smartlead ($39/mes)\n- 3 usuarios, 15 cuentas, 500 emails/dia: Instantly ($47/mes) vs Lemlist ($207/mes) vs Smartlead ($39/mes)\n- Agencia, 10 clientes, 50 cuentas: Smartlead ($79/mes) es el claro ganador\n\nMi recomendacion para la mayoria de startups: Instantly para email + HeyReach para LinkedIn. Lemlist si haces ABM enterprise donde cada prospecto recibe una experiencia personalizada. Smartlead si eres una agencia.',
      },
    ],
  },

  {
    id: 'heyreach-vs-dripify-vs-expandi',
    title: 'HeyReach vs Dripify vs Expandi',
    subtitle: 'Herramientas de automatizacion de LinkedIn comparadas - seguridad de cuenta, escalamiento y rendimiento real',
    category: 'comparisons',
    description:
      'Comparacion de HeyReach, Dripify y Expandi para automatizacion de LinkedIn. Rotacion de cuentas, funciones de seguridad, modelos de precios y que herramienta se adapta a operadores individuales vs agencias vs equipos enterprise.',
    keywords: [
      'heyreach vs dripify',
      'heyreach vs expandi',
      'dripify vs expandi',
      'mejor herramienta automatizacion linkedin 2026',
      'comparacion automatizacion linkedin',
      'reseña heyreach',
      'herramientas de outreach linkedin',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'heyreach-linkedin-automation',
      'instantly-vs-smartlead-vs-lemlist',
      'clay-vs-apollo-vs-zoominfo',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'Por Que Importa la Automatizacion de LinkedIn',
        type: 'prose',
        content:
          'La entregabilidad de email se vuelve mas dificil cada año. LinkedIn es el contrapeso. Las solicitudes de conexion y mensajes llegan a la bandeja de entrada con casi 100% de entrega. Las tasas de respuesta en outreach de LinkedIn son 3-5 veces mas altas que el cold email para B2B. La compensacion: LinkedIn limita cuanto puedes enviar y restringen cuentas que parecen automatizadas.\n\nUna buena herramienta de automatizacion de LinkedIn maximiza tu volumen de outreach mientras mantiene tus cuentas seguras. Una mala hace que tu perfil de LinkedIn sea restringido en una semana. Las tres herramientas que vale la pena considerar son HeyReach, Dripify y Expandi.',
      },
      {
        heading: 'HeyReach: Cuentas Ilimitadas, Un Precio',
        type: 'pattern',
        content:
          'HeyReach es la unica herramienta de automatizacion de LinkedIn que te permite conectar cuentas ilimitadas en una sola suscripcion. Esta es la funcion estrella. Conectas 5, 10 o 20 cuentas de LinkedIn, creas una campaña y HeyReach automaticamente rota el envio entre todas ellas.\n\nPor que importa la rotacion de cuentas: LinkedIn limita cada cuenta a aproximadamente 25 solicitudes de conexion por dia. Una cuenta = 125 solicitudes por semana. Cinco cuentas = 625 solicitudes por semana. Veinte cuentas = 2,500 por semana. HeyReach escala linealmente con cuentas.\n\nFortalezas: precio fijo independiente del numero de cuentas (empezando en $79/mes). Bandeja de entrada unificada entre todas las cuentas. Analitica a nivel de campaña que agrega entre remitentes. Rotacion inteligente que distribuye el volumen uniformemente y pausa cuentas que se acercan a los limites.\n\nDebilidades: la UI es funcional pero no pulida. La configuracion de campañas tiene una curva de aprendizaje. Las funciones multicanal (integracion de email) son basicas comparadas con Lemlist. Los reportes podrian ser mas granulares.\n\nMejor para: agencias gestionando outreach entre multiples cuentas de clientes, equipos con 3+ remitentes y cualquiera haciendo outreach de LinkedIn de alto volumen.',
      },
      {
        heading: 'Dripify: Simple y Asequible',
        type: 'pattern',
        content:
          'Dripify es la herramienta de automatizacion de LinkedIn mas accesible. Interfaz limpia, constructor de campañas directo y precios que funcionan para operadores individuales.\n\nFortalezas: configuracion facil - puedes lanzar tu primera campaña en 15 minutos. El constructor de secuencias drip es intuitivo con logica condicional (si aceptado, enviar mensaje A; si no, esperar e intentar de nuevo). Buscador de email integrado para seguimiento multicanal. La analitica es clara y accionable. Los precios empiezan en $39/usuario/mes en el plan Basico.\n\nDebilidades: cada cuenta de LinkedIn requiere una suscripcion separada. A $39-79/usuario/mes, un equipo de 5 personas cuesta $195-395/mes - mas que la tarifa plana de HeyReach. Sin rotacion de cuentas entre perfiles. Acceso API limitado para integraciones personalizadas. La automatizacion imita el comportamiento humano pero no tiene las mismas funciones de seguridad sofisticadas que Expandi.\n\nMejor para: operadores individuales y equipos pequeños (1-2 personas) que quieren automatizacion de LinkedIn sin complejidad. Si tienes una cuenta de LinkedIn y quieres automatizar tu outreach, Dripify es el camino mas rapido a resultados.',
      },
      {
        heading: 'Expandi: Seguridad y Control Enterprise',
        type: 'pattern',
        content:
          'Expandi esta construido para usuarios que no pueden permitirse perder su cuenta de LinkedIn. Direcciones IP dedicadas, algoritmos de timing inteligente y las funciones de seguridad mas sofisticadas de la categoria.\n\nFortalezas: IP dedicada por cuenta (tu actividad no comparte infraestructura con otros usuarios). Timing inteligente que imita patrones de uso humano - variando tiempos de envio, agregando retrasos aleatorios, respetando horarios laborales en la zona horaria del prospecto. Personalizacion avanzada con GIFs e imagenes dinamicas. Integraciones webhook para sincronizacion con CRM. El historial de seguridad es el mejor de la industria.\n\nDebilidades: opcion mas cara a $99/cuenta/mes. Cada cuenta es una suscripcion separada. La interfaz es poderosa pero compleja - mas opciones y configuraciones de las que la mayoria de usuarios necesitan. El tiempo de configuracion es mayor que Dripify. La curva de aprendizaje es mas pronunciada.\n\nMejor para: vendedores enterprise con perfiles de LinkedIn de alta autoridad que no pueden arriesgar. Si tu perfil de LinkedIn es un activo central del negocio (alto numero de seguidores, red establecida, marca personal), las funciones de seguridad de Expandi justifican el precio premium.',
      },
      {
        heading: 'Mi Recomendacion',
        type: 'pro-tip',
        content:
          'Para la mayoria de equipos construyendo outbound: HeyReach. La rotacion de cuentas ilimitadas a precio fijo es el modelo mas escalable. Conecta las cuentas de LinkedIn de tu equipo, construye campañas que roten entre todas y escala tu outreach de LinkedIn sin escalar tus costos linealmente.\n\nPara operadores individuales con presupuesto limitado: Dripify. Simple, asequible, cumple el objetivo. Actualiza a HeyReach cuando agregues un segundo remitente de LinkedIn.\n\nPara vendedores enterprise protegiendo perfiles de alto valor: Expandi. La IP dedicada y las funciones de seguridad valen el precio premium si una restriccion de LinkedIn te costaria mas de $99/mes en pipeline perdido.\n\nLa combinacion que ejecuto: HeyReach para outreach de LinkedIn emparejado con Instantly para email. Clay alimenta ambas herramientas con leads enriquecidos y puntuados. Este enfoque multicanal tipicamente genera 2-3 veces la tasa de respuesta del outbound de un solo canal porque los prospectos ven tu nombre en LinkedIn y email dentro de la misma semana.',
      },
    ],
  },

  {
    id: 'gtm-engineer-vs-sdr-vs-revops',
    title: 'GTM Engineer vs SDR vs RevOps',
    subtitle: 'Tres roles, un objetivo de ingresos - que hace realmente cada uno',
    category: 'comparisons',
    description:
      'Desglose claro de los roles de GTM Engineer, SDR y RevOps. Que hace cada uno, donde se superponen, progresion de carrera, compensacion y por que GTM Engineering es el rol de mas rapido crecimiento en B2B.',
    keywords: [
      'GTM engineer vs SDR',
      'GTM engineer vs RevOps',
      'que es un GTM engineer',
      'rol de GTM engineer',
      'salario de GTM engineer',
      'descripcion de puesto GTM engineer',
      'SDR a GTM engineer',
      'revenue operations vs GTM engineering',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'outbound-sales-stack-2026',
      'cold-email-infrastructure',
    ],
    sections: [
      {
        heading: 'La Version de 30 Segundos',
        type: 'prose',
        content:
          'Los SDRs hacen el outreach manualmente. RevOps construye los sistemas dentro de los cuales trabajan los SDRs. Los GTM Engineers automatizan el outreach en si para que menos SDRs hagan mas con menos trabajo manual.\n\nSDR: "Voy a enviar 50 emails hoy y hacer 30 llamadas." RevOps: "Voy a construir el flujo de Salesforce que enruta estos leads al SDR correcto." GTM Engineer: "Voy a construir el pipeline que busca, enriquece, puntua y secuencia leads automaticamente para que el SDR solo hable con prospectos calificados."\n\nEstos no son roles que compiten. Son capas. La mayoria de las empresas en crecimiento necesitan los tres. Pero si estas construyendo un equipo desde cero con presupuesto limitado, un GTM Engineer te da el mayor apalancamiento.',
      },
      {
        heading: 'SDR: La Capa Humana de Outreach',
        type: 'pattern',
        content:
          'Que hacen los SDRs: investigacion de prospectos, llamadas en frio, cold email, outreach en LinkedIn, agendar reuniones para ejecutivos de cuenta. Son la primera linea de generacion de ingresos.\n\nDia tipico: investigar 20 cuentas, enviar 50 emails personalizados, hacer 30 llamadas en frio, enviar 15 mensajes de LinkedIn, agendar 2-3 reuniones. La mayor parte del trabajo ocurre dentro de un CRM (Salesforce, HubSpot) y una plataforma de engagement de ventas (Outreach, Salesloft, Apollo).\n\nCompensacion: salario base $45,000-65,000 con OTE (ganancias en objetivo) de $70,000-90,000. Los mejores performers en hubs tecnologicos superan los $100,000+ OTE.\n\nTrayectoria de carrera: SDR a SDR Senior (12-18 meses), luego a Account Executive, Gerente de Ventas o - cada vez mas - GTM Engineer.\n\nLa realidad: el trabajo de SDR es en gran medida manual y repetitivo. Los mejores SDRs naturalmente empiezan a automatizar sus propios flujos de trabajo. Construyen plantillas de email, crean hojas de calculo de prospeccion, encuentran herramientas que aceleran la investigacion. Ese instinto de automatizar es la semilla del GTM Engineering.',
      },
      {
        heading: 'RevOps: El Arquitecto de Sistemas',
        type: 'pattern',
        content:
          'Que hace RevOps: posee el stack tecnologico, construye flujos de trabajo de CRM, crea dashboards de reportes, gestiona la higiene de datos, diseña la logica de enrutamiento de leads y asegura que marketing, ventas y customer success operen con los mismos datos.\n\nDia tipico: arreglar una automatizacion rota de Salesforce, construir un modelo de scoring de leads, auditar la calidad de datos en el CRM, crear un reporte de pipeline para liderazgo, evaluar un nuevo vendor de herramientas, configurar flujos de trabajo de HubSpot para una nueva campaña.\n\nCompensacion: $90,000-150,000 base. Roles de RevOps Senior y nivel Director alcanzan $150,000-200,000+.\n\nConjunto de habilidades: administracion de CRM (Salesforce, HubSpot), analisis de datos, automatizacion de flujos de trabajo, evaluacion de herramientas, coordinacion interfuncional. RevOps vive en la interseccion de ventas, marketing y customer success.\n\nLa brecha: RevOps construye los sistemas pero raramente construye el pipeline de outbound en si. Configuran el CRM. No buscan los leads. Configuran las secuencias de email. No escriben la logica de enriquecimiento. Esta brecha es donde vive el GTM Engineering.',
      },
      {
        heading: 'GTM Engineer: El Constructor de Automatizacion',
        type: 'pattern',
        content:
          'Que hacen los GTM Engineers: construyen pipelines automatizados que buscan, enriquecen, puntuan y secuencian leads con minima intervencion manual. Combinan el conocimiento de outbound de un SDR con las habilidades tecnicas de un ingeniero y el pensamiento de sistemas de RevOps.\n\nDia tipico: construir un flujo de enriquecimiento en Clay que extrae de 5 proveedores de datos, escribir un script Python que valida direcciones de email via busqueda de registro MX, configurar una campaña de Instantly con rotacion de dominios, configurar un scraper de Playwright que extrae datos de precios de sitios web de competidores, construir una formula de scoring que clasifica leads por ajuste al ICP.\n\nCompensacion: $130,000-200,000+ base. El rol es lo suficientemente nuevo como para que la compensacion varie ampliamente. Los mejores GTM Engineers en startups bien financiadas alcanzan $200,000+ en compensacion total. El aumento del 205% año tras año en publicaciones de empleo significa que la demanda supera con creces la oferta.\n\nConjunto de habilidades: Clay, Apollo, Instantly, scripting Python, integraciones API, enriquecimiento de datos, entregabilidad de email, configuracion de CRM, herramientas de AI/automatizacion. Los mejores GTM Engineers tambien entienden metodologia de ventas - saben que hace un lead calificado porque han hecho el outreach ellos mismos.\n\nPor que es el rol de mas rapido crecimiento: un GTM Engineer puede reemplazar 3-5 SDRs en terminos de produccion de pipeline. No porque trabajen mas duro, sino porque construyen maquinas que trabajan 24/7. Las empresas reportan tasas de conversion 7 veces mas altas y costos de pipeline 80% mas bajos cuando GTM Engineers construyen la infraestructura de outbound.',
      },
      {
        heading: 'La Trayectoria de Carrera de SDR a GTM Engineer',
        type: 'pro-tip',
        content:
          'El camino mas rapido al GTM Engineering empieza en un puesto de SDR. Aqui esta por que: los SDRs entienden el outbound a nivel terreno. Saben cuales emails obtienen respuestas, cuales scripts de llamada funcionan, cuales mensajes de LinkedIn se aceptan. Ese conocimiento de dominio es irremplazable.\n\nLa transicion: empieza a automatizar tu propio flujo de trabajo de SDR. Aprende Clay para enriquecer tus propias listas de leads. Aprende Instantly para escalar tu outreach de email. Aprende Python basico para scriptar las partes repetitivas. Dentro de 6 meses de desarrollo deliberado de habilidades, tienes la base.\n\nLas habilidades para apilar: Clay (orquestacion de datos), Python (scripting y automatizacion), alfabetizacion en APIs (conectar herramientas), entregabilidad de email (SPF, DKIM, DMARC, warmup) y herramientas de AI (Claude Code, ChatGPT para investigacion y generacion de contenido).\n\nYo hice esta transicion. Empece en outbound manual, aprendi las herramientas, empece a automatizar y ahora administro un sistema operativo GTM completo. La experiencia manual importa - no puedes automatizar lo que no entiendes.\n\nLa realidad del mercado: las empresas estan activamente convirtiendo a sus mejores SDRs en GTM Engineers. Si eres un SDR que puede construir tablas de Clay y escribir scripts de Python, estas en el top 1% de candidatos para el rol mejor pagado en revenue operations.',
      },
    ],
  },

  {
    id: 'cold-email-infrastructure',
    title: 'Como Construir Infraestructura de Cold Email desde Cero',
    subtitle: 'Dominios, DNS, warmup y el stack de entregabilidad que realmente llega a las bandejas de entrada',
    category: 'comparisons',
    description:
      'Guia paso a paso para construir infraestructura de cold email. Compra de dominios, configuracion de SPF/DKIM/DMARC, warmup de buzones, rotacion de envio y las practicas de entregabilidad que te mantienen fuera del spam en 2026.',
    keywords: [
      'infraestructura de cold email',
      'guia de configuracion de cold email',
      'SPF DKIM DMARC cold email',
      'configuracion de entregabilidad de email',
      'configuracion de dominio cold email',
      'como configurar cold email',
      'warmup de cold email',
      'infraestructura de envio de email 2026',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'instantly-vs-smartlead-vs-lemlist',
      'outbound-sales-stack-2026',
      'clay-vs-apollo-vs-zoominfo',
    ],
    sections: [
      {
        heading: 'Por Que la Infraestructura Importa Mas Que el Copywriting',
        type: 'prose',
        content:
          'Todos se obsesionan con el copywriting de email. La linea de asunto. El gancho de apertura. El CTA. Nada de eso importa si el email cae en spam. La entregabilidad es la base. Construyela bien y un copy mediocre aun genera respuestas. Construyela mal y el mejor copy del mundo pasa sin ser leido.\n\nLa infraestructura de cold email tiene tres capas: dominios (tu identidad de envio), autenticacion (demostrar que eres legitimo) y reputacion (ganar confianza con el tiempo). Omite cualquier capa y tus emails caen en spam en semanas.',
      },
      {
        heading: 'Paso 1: Estrategia de Dominios',
        type: 'code',
        content:
          'Nunca envies cold email desde tu dominio principal. Si tu empresa es acme.com, compra dominios secundarios para outbound: tryacme.com, getacme.com, acmehq.com, useacme.com. Si un dominio se quema, tu dominio principal permanece limpio.\n\nCuantos dominios: empieza con 3-5. Cada dominio obtiene 2-3 buzones. Eso te da 6-15 cuentas de envio para rotar. Por cada 50 emails/dia que quieras enviar, planifica un dominio con 2-3 buzones.\n\nReglas de compra de dominios: compra solo .com (otros TLDs tienen menor confianza). Mantén el nombre cercano a tu marca (los prospectos deben reconocerlo). Evita guiones, numeros o palabras aleatorias. Registra a traves de Google Domains, Namecheap o Cloudflare.\n\nConfiguracion de buzones: usa Google Workspace ($6/usuario/mes) o Microsoft 365 ($6/usuario/mes) para tus cuentas de envio. Estos tienen las mejores tasas de colocacion en bandeja de entrada. Evita SMTP personalizado o proveedores de email baratos - los principales proveedores de bandeja de entrada confian mas en remitentes de Google y Microsoft.',
      },
      {
        heading: 'Paso 2: Autenticacion DNS (SPF, DKIM, DMARC)',
        type: 'code',
        content:
          'Cada dominio de envio necesita tres registros DNS. Estos demuestran a los proveedores de bandeja de entrada que tus emails son legitimos.\n\nSPF (Sender Policy Framework): le dice a los proveedores de bandeja de entrada cuales servidores estan autorizados para enviar email desde tu dominio. Agrega un registro TXT a tu DNS:\n\nPara Google Workspace: v=spf1 include:_spf.google.com ~all\nPara Microsoft 365: v=spf1 include:spf.protection.outlook.com ~all\n\nDKIM (DomainKeys Identified Mail): firma criptograficamente tus emails para que los proveedores de bandeja de entrada puedan verificar que no fueron modificados en transito. Google Workspace y Microsoft 365 ambos tienen configuracion de DKIM en sus paneles de administracion. Genera la clave, agrega los registros CNAME o TXT a tu DNS.\n\nDMARC (Domain-based Message Authentication): le dice a los proveedores de bandeja de entrada que hacer cuando SPF o DKIM fallan. Empieza con una politica de monitoreo:\n\nv=DMARC1; p=none; rua=mailto:dmarc@tudominio.com\n\nDespues de 2-4 semanas de monitoreo sin problemas, actualiza a:\n\nv=DMARC1; p=quarantine; rua=mailto:dmarc@tudominio.com\n\nEventualmente mueve a p=reject para maxima confianza. Esto le dice a los proveedores de bandeja de entrada que rechacen cualquier email de tu dominio que falle la autenticacion.\n\nVerificacion: usa MXToolbox o mail-tester.com para verificar que los tres registros estan configurados correctamente antes de enviar un solo email.',
      },
      {
        heading: 'Paso 3: Warmup',
        type: 'pattern',
        content:
          'Los dominios nuevos tienen cero reputacion. Los proveedores de bandeja de entrada tratan a los remitentes desconocidos como sospechosos. El warmup construye tu reputacion de remitente gradualmente.\n\nComo funciona el warmup: tus cuentas de envio intercambian emails con otras cuentas en una red de warmup. Estos emails se abren, se responden y se marcan como importantes. Esto le indica a Gmail, Outlook y Yahoo que tu dominio envia email que la gente quiere leer.\n\nCronograma: minimo 14 dias antes de enviar cualquier cold email. 21-30 dias es mejor. Durante el warmup, tus cuentas deben enviar y recibir 20-40 emails de warmup por dia con engagement (aperturas, respuestas, clics).\n\nHerramientas de warmup integradas: Instantly incluye warmup en cada plan. Smartlead lo incluye. Lemlist tiene Lemwarm. Si tu herramienta de cold email no incluye warmup, usa una herramienta independiente como Warmbox o Mailreach.\n\nNunca detengas el warmup. Mantén el warmup ejecutandose incluso despues de empezar campañas de cold email. Los emails de warmup continuos mantienen tu reputacion de remitente junto a tu outreach frio. La mayoria de herramientas te permiten ejecutar ambos simultaneamente.\n\nSeñales de que el warmup esta funcionando: tasas de apertura superiores al 60% en la red de warmup, cero ubicaciones en carpeta de spam y tu dominio pasa todas las verificaciones de autenticacion en mail-tester.com (puntuacion 9/10 o superior).',
      },
      {
        heading: 'Paso 4: Estrategia de Envio',
        type: 'formula',
        content:
          'Las reglas que te mantienen fuera del spam:\n\nVolumen por cuenta: nunca excedas 30 cold emails por dia por cuenta. 20-25 es mas seguro. Combinado con emails de warmup, cada cuenta deberia enviar 40-60 emails totales diarios (20-25 frios + 20-30 warmup).\n\nCalendario de escalado: semana 1 despues del warmup: 5 cold emails/dia por cuenta. Semana 2: 10/dia. Semana 3: 15/dia. Semana 4: 20-25/dia. No saltes al volumen completo inmediatamente.\n\nRotacion de dominios: distribuye tu volumen diario de envio entre todos los dominios. Si envias 100 cold emails/dia, usa 5 cuentas en 3 dominios. Tu herramienta de cold email maneja esta rotacion automaticamente.\n\nTiming de envio: horarios laborales en la zona horaria del prospecto. De martes a jueves son los dias de mayor rendimiento. Evita los lunes por la mañana y viernes por la tarde.\n\nGestion de rebotes: mantén la tasa de rebote por debajo del 3%. Si una campaña excede el 5% de rebotes, pausala y limpia la lista. Las altas tasas de rebote destruyen la reputacion del remitente rapidamente.\n\nTasa de quejas de spam: mantente por debajo del 0.1%. El limite duro de Gmail es 0.3% - por encima de eso, tu dominio se marca. Monitorea esto en Google Postmaster Tools.\n\nCumplimiento de desuscripcion: incluye un enlace de desuscripcion en cada cold email. Esto es legalmente requerido (CAN-SPAM, GDPR) y reduce las quejas de spam porque los destinatarios molestos se desuscriben en lugar de reportar spam.',
      },
    ],
  },

  {
    id: 'how-to-build-abm-pipeline-with-ai',
    title: 'Como Construir un Pipeline ABM con AI',
    subtitle: 'El pipeline automatizado basado en cuentas desde ICP hasta reunion agendada',
    category: 'comparisons',
    description:
      'Como construir un pipeline ABM impulsado por AI para equipos pequeños. Fuente de cuentas, enriquecimiento, scoring, outreach personalizado y el stack de automatizacion que ejecuta marketing basado en cuentas sin un equipo de 10 personas.',
    keywords: [
      'automatizacion de pipeline ABM',
      'account based marketing AI',
      'ABM para startups',
      'pipeline ABM automatizado',
      'como construir ABM',
      'herramientas ABM equipo pequeño',
      'automatizacion account based marketing',
      'pipeline ABM con AI',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'cold-email-infrastructure',
      'instantly-vs-smartlead-vs-lemlist',
      'heyreach-linkedin-automation',
      'data-lake-for-gtm',
    ],
    sections: [
      {
        heading: 'ABM Sin el Presupuesto Enterprise',
        type: 'prose',
        content:
          'El ABM tradicional requiere Demandbase ($50K+/año), un gerente dedicado de ABM, un equipo de contenido y meses de configuracion. Eso es ABM enterprise. La mayoria de las startups no pueden pagarlo y no lo necesitan.\n\nEl ABM impulsado por AI invierte el modelo. En lugar de plataformas de intent caras e investigacion manual de cuentas, usas Clay para enriquecimiento, AI para personalizacion y automatizacion para ejecucion. Un operador individual puede ejecutar un programa de ABM dirigido que supera a los equipos enterprise siendo mas preciso y mas rapido para iterar.\n\nEl pipeline que construi genera reuniones calificadas de cuentas objetivo a aproximadamente $525/mes en costos de herramientas. Aqui esta el sistema completo.',
      },
      {
        heading: 'Paso 1: Define tu ICP como una Formula de Scoring',
        type: 'pattern',
        content:
          'La mayoria de los equipos definen su ICP en una diapositiva: "Empresas SaaS mid-market, 50-500 empleados, Series A-C, Norteamerica." Eso es demasiado vago para automatizar.\n\nUn ICP automatizable es una formula de scoring. Cada atributo obtiene un valor de puntos:\n\nTamaño de empresa: 50-200 empleados = 10 puntos, 200-500 = 8 puntos, 500-1000 = 5 puntos.\nEtapa de financiamiento: Series A = 10, Series B = 8, Seed = 5, Bootstrapped = 3.\nIndustria: SaaS = 10, Fintech = 8, E-commerce = 5.\nSeñales de stack tecnologico: usa Salesforce = 5, usa HubSpot = 3, usa Outreach = 5.\nSeñales de contratacion: publico empleos de SDR/BDR en los ultimos 90 dias = 10 puntos.\nSeñales de crecimiento: headcount crecio 20%+ en los ultimos 6 meses = 8 puntos.\n\nLa puntuacion total determina el nivel: 40+ = Nivel 1 (outreach prioritario), 25-39 = Nivel 2 (outreach estandar), debajo de 25 = omitir.\n\nEsta formula va directamente a Clay. Cada cuenta se puntua automaticamente. No se necesita juicio humano para la clasificacion inicial.',
      },
      {
        heading: 'Paso 2: Fuente Automatizada de Cuentas y Enriquecimiento',
        type: 'code',
        content:
          'El pipeline de enriquecimiento se ejecuta en Clay con logica waterfall:\n\n1. Buscar cuentas en Apollo por filtros ICP (industria, tamaño, ubicacion, stack tecnologico)\n2. Enriquecer datos de empresa: ingresos (de Apollo), stack tecnologico (de BuiltWith via Clay), financiamiento (de Crunchbase), crecimiento de headcount (de LinkedIn via Clay)\n3. Puntuar cada cuenta usando la formula ICP\n4. Para cuentas Nivel 1 y Nivel 2, encontrar contactos: buscar tomadores de decisiones por titulo (VP Sales, Head of Revenue, CRO, VP Marketing)\n5. Enriquecimiento waterfall de email: probar email de Apollo, luego Prospeo, luego Dropcontact hasta verificar\n6. Validar emails: verificacion de registro MX para confirmar que el dominio acepta email\n7. Investigacion AI: usar Claygent para visitar el sitio web de cada empresa y extraer un dato relevante de personalizacion (lanzamiento de producto reciente, auge de contratacion, ronda de financiamiento, anuncio de alianza)\n\nEl pipeline entero se ejecuta en una tabla de Clay. Las nuevas cuentas fluyen, el enriquecimiento ocurre automaticamente y los leads calificados con emails verificados y datos de personalizacion salen hacia tus herramientas de outreach.\n\nCosto por lead enriquecido: aproximadamente $0.50-1.50 en creditos de Clay dependiendo de cuantos pasos de enriquecimiento se activen. Para 500 leads/mes, presupuesta $250-750 en creditos de Clay.',
      },
      {
        heading: 'Paso 3: Secuencias de Outreach Multicanal',
        type: 'pattern',
        content:
          'Los leads calificados de Clay se envian a dos canales de outreach simultaneamente:\n\nEmail via Instantly: secuencia de 4 pasos durante 14 dias. Email 1: cold email personalizado referenciando la investigacion de Claygent. Email 2 (dia 3): seguimiento de valor agregado con insight relevante. Email 3 (dia 7): referencia a prueba social o caso de estudio. Email 4 (dia 14): email de despedida.\n\nLinkedIn via HeyReach: secuencia paralela de 3 pasos. Dia 0: vista de perfil. Dia 1: solicitud de conexion con nota personalizada. Dia 3 (si se acepto): mensaje directo expandiendo sobre el email.\n\nEl timing es deliberado. El email llega primero, LinkedIn refuerza. El prospecto ve tu nombre en dos lugares dentro de la misma semana. Este enfoque multicanal tipicamente genera 2-3 veces la tasa de respuesta del email solo.\n\nPersonalizacion a escala: la investigacion de Claygent del Paso 2 alimenta tanto las plantillas de email como de LinkedIn como variables de fusion. Cada prospecto recibe una primera linea unica que referencia algo especifico de su empresa. Esto no es "Hola {first_name}, note que {company_name} esta creciendo" - es "Vi que tu equipo acaba de lanzar el tier enterprise y publico 3 puestos de SDR este mes. Ese patron de escalamiento es exactamente donde encaja nuestra automatizacion."\n\nManejo de respuestas: las respuestas positivas van al CRM (Attio) como nuevos deals. Reuniones agendadas via enlace de Calendly en el email. Las respuestas negativas disparan eliminacion automatica de todas las secuencias.',
      },
      {
        heading: 'El Stack Completo y Costo',
        type: 'pro-tip',
        content:
          'El stack ABM completo:\n\nClay ($349/mes) - enriquecimiento, scoring, investigacion de personalizacion\nApollo ($49/mes) - base de datos de contactos y fuente inicial\nInstantly ($47/mes) - entrega de email y rotacion de dominios\nHeyReach ($79/mes) - automatizacion de LinkedIn y rotacion de cuentas\nAttio (gratis) - CRM y seguimiento de pipeline\nGoogle Workspace ($6/mes por buzon x 6 = $36/mes) - infraestructura de envio\n\nTotal: aproximadamente $560/mes\n\nQue produce: 500-1000 contactos de outbound enriquecidos, puntuados y personalizados por mes. Secuencias multicanal ejecutandose automaticamente. Generacion de pipeline 24/7 con mantenimiento diario minimo (30 minutos para manejo de respuestas y optimizacion de secuencias).\n\nCompara con: un SDR cuesta $70,000-90,000/año ($6,000-7,500/mes). Este pipeline automatizado produce volumen de reuniones comparable o superior al 8% del costo. Y escala con costos de herramientas, no con headcount.\n\nEl elemento humano: aun necesitas a alguien para manejar respuestas positivas, ejecutar llamadas de descubrimiento y cerrar deals. La automatizacion maneja todo antes de la primera conversacion humana. Ese es el 80% del proceso de ventas que solia requerir trabajo manual de SDR.',
      },
    ],
  },

  {
    id: 'how-to-use-clay-enrichment',
    title: 'Cómo Usar Clay para Enriquecimiento de Leads',
    subtitle: 'Enriquecimiento en cascada, fórmulas de scoring y los workflows de Clay que realmente funcionan',
    category: 'comparisons',
    description:
      'Tutorial práctico para usar Clay.com para enriquecimiento de leads B2B. Configuración de tablas, lógica de enriquecimiento en cascada, investigación con Claygent AI, optimización de créditos y ejemplos reales de workflows de un pipeline en producción.',
    keywords: [
      'cómo usar clay',
      'tutorial enriquecimiento clay',
      'guía clay.com',
      'enriquecimiento en cascada clay',
      'enriquecimiento de leads clay',
      'tutorial claygent',
      'ejemplos de workflow clay',
      'tutorial clay.com 2026',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'how-to-build-abm-pipeline-with-ai',
      'outbound-sales-stack-2026',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Qué Es Realmente Clay',
        type: 'prose',
        content:
          'Clay es una hoja de cálculo que puede llamar APIs. Ese es el modelo mental más simple. Cada fila es un lead o empresa. Cada columna es un punto de datos. La diferencia con Google Sheets: las columnas de Clay pueden extraer datos de más de 150 proveedores automáticamente. Escribe un nombre de empresa y Clay puede obtener los ingresos, el conteo de empleados, el tech stack, el historial de financiamiento, la actividad de contratación y los perfiles sociales - todo sin salir de la tabla.\n\nEl poder está en el workflow, no en ningún punto de datos individual. Encadenas enriquecimientos juntos: buscar leads de Apollo, enriquecer datos de empresa de múltiples proveedores, calificarlos contra tu ICP, encontrar contactos, verificar emails, generar líneas de apertura personalizadas y enviar al outreach. Una tabla reemplaza un proceso manual de 10 pasos.',
      },
      {
        heading: 'Configurando Tu Primera Tabla de Enriquecimiento',
        type: 'code',
        content:
          'Comienza con una fuente. La más fácil: pega una lista de dominios de empresas o importa desde un CSV. Clay también se conecta directamente a Apollo, LinkedIn Sales Navigator y otras bases de datos.\n\nColumna 1: Dominio de la empresa (tu entrada)\nColumna 2: Nombre de la empresa (auto-enriquecido desde el dominio)\nColumna 3: Conteo de empleados (enriquecimiento de Clay desde múltiples proveedores)\nColumna 4: Industria (enriquecimiento de Clay)\nColumna 5: Estimación de ingresos (enriquecimiento de Clay)\nColumna 6: Tech stack (integración con BuiltWith - agrega tu propia API key para ahorrar créditos)\n\nPara cada columna, haz clic en el botón + y selecciona una acción de enriquecimiento. Clay te muestra qué proveedores pueden llenar esa columna y cuánto cuesta en créditos. Comienza con el proveedor más barato. Si devuelve vacío, agrega un proveedor de respaldo.\n\nEsto es enriquecimiento en cascada: prueba el Proveedor A (más barato o más preciso). Si no hay resultado, prueba el Proveedor B. Si todavía no hay resultado, prueba el Proveedor C. Tú defines el orden de prioridad. Clay los recorre automáticamente para cada fila.\n\nConsejo de créditos: cada acción de enriquecimiento cuesta créditos. Una sola fila con 5 enriquecimientos puede usar 5-15 créditos. A $349/mes por 10,000 créditos, eso son 650-2,000 filas por mes. Planifica tu profundidad de enriquecimiento basándote en tu presupuesto de créditos.',
      },
      {
        heading: 'Enriquecimiento de Email en Cascada',
        type: 'pattern',
        content:
          'Encontrar direcciones de email verificadas es el workflow de Clay de mayor valor. El enfoque en cascada produce 20-30% más emails válidos que cualquier proveedor individual.\n\nConfigura tres columnas de enriquecimiento de email en orden:\n\n1. Búsqueda de email en Apollo (más barato, buena cobertura para contactos de EE.UU.)\n2. Buscador de email Prospeo (fuerte para contactos europeos, conecta tu propia API key)\n3. Enriquecimiento de email Dropcontact (compatible con GDPR, bueno para contactos que Apollo no encuentra)\n\nCada columna tiene una condición: solo ejecutar si la columna anterior devolvió vacío. Esto evita desperdiciar créditos en leads que ya tienen un email verificado.\n\nDespués de la cascada, agrega una columna de validación MX. Esta verifica si el dominio del email realmente acepta email. Atrapa dominios inactivos, errores tipográficos y direcciones honeypot. La validación MX cuesta casi nada en créditos y te ahorra daño en la tasa de rebote.\n\nResultados: una cascada con 3 proveedores y validación MX típicamente produce 70-85% de cobertura de email válido en una lista de contactos B2B. El enriquecimiento de un solo proveedor te da 50-60%. Esa diferencia del 20% son cientos de contactos extra por mes llegando a bandejas de entrada reales.',
      },
      {
        heading: 'Claygent: Investigación con IA a Escala',
        type: 'pattern',
        content:
          'Claygent es el agente de IA integrado de Clay. Dale un prompt y una URL, e investiga el objetivo y devuelve datos estructurados. Así es como generas personalización a escala sin investigar manualmente cada prospecto.\n\nPrompt de ejemplo: "Visita el sitio web de esta empresa y encuentra: 1) Su lanzamiento de producto más reciente o anuncio importante 2) Si están contratando para roles de ventas o marketing 3) Un dato específico que muestre que están creciendo."\n\nClaygent visita el sitio web, lee el contenido y devuelve los hallazgos en el formato que especificaste. Esto se ejecuta en cada fila automáticamente.\n\nCasos de uso más allá de la personalización:\n\nAnálisis de competidores: "Visita la página de precios de esta empresa y extrae sus niveles de precios y listas de características."\nDetección de tech stack: "Visita este sitio web e identifica qué herramientas de analytics, CRM y marketing usan basándote en el código fuente de la página e integraciones visibles."\nInvestigación de contenido: "Encuentra el post de blog más reciente de esta empresa y resume su tema principal."\n\nCosto en créditos: Claygent usa más créditos que los enriquecimientos estándar (típicamente 5-10 créditos por fila). Úsalo selectivamente - ejecuta Claygent solo en cuentas de Nivel 1 que pasaron tu umbral de scoring, no en cada lead.',
      },
      {
        heading: 'Trucos de Optimización de Créditos',
        type: 'pro-tip',
        content:
          'Los créditos de Clay son el principal driver de costo. Así es como obtener el máximo valor:\n\nTrae tus propias API keys. Para proveedores como BuiltWith, Prospeo, Dropcontact y Hunter - conecta tus propias API keys en la configuración de Clay. Estos enriquecimientos usan tu suscripción al proveedor en lugar de créditos de Clay. Si ya pagas por Prospeo ($39/mes por 5,000 búsquedas), enruta esas búsquedas a través de tu key en lugar de quemar créditos de Clay.\n\nFiltra antes de enriquecer. No enriquezcas cada fila en tu tabla. Agrega condiciones de filtro: solo enriquecer empresas con 50+ empleados, solo encontrar contactos con VP o Director en el título, solo ejecutar Claygent en cuentas con scoring de 40+. Cada filtro ahorra créditos en leads de bajo valor.\n\nProcesamiento por lotes. Sube tu lista completa de leads, ejecuta los enriquecimientos baratos primero (nombre de empresa, industria, tamaño), filtra a cuentas cualificadas, luego ejecuta los enriquecimientos costosos (cascada de email, investigación con Claygent) solo en el conjunto filtrado.\n\nTablas plantilla. Construye tu workflow de enriquecimiento una vez, guárdalo como plantilla. Las nuevas campañas parten de la plantilla en lugar de reconstruir desde cero. Esto previene errores que desperdician créditos en enriquecimientos mal configurados.\n\nMonitorea el uso de créditos. Clay muestra el consumo de créditos por columna. Si un enriquecimiento está quemando créditos sin agregar valor (baja tasa de llenado, datos que no usas), elimínalo de la cascada.',
      },
    ],
  },

  {
    id: 'outbound-sales-stack-2026',
    title: 'El Stack Completo de Ventas Outbound para Startups en 2026',
    subtitle: 'Todas las herramientas que necesitas - y las que puedes omitir',
    category: 'comparisons',
    description:
      'El stack completo de tecnología de ventas outbound para startups en 2026. Sourcing de datos, enriquecimiento, email, LinkedIn, CRM y automatización - con precios, alternativas y el orden de construcción que te lleva al pipeline más rápido.',
    keywords: [
      'stack ventas outbound 2026',
      'mejores herramientas ventas outbound',
      'tech stack ventas startups',
      'herramientas cold outreach 2026',
      'comparación herramientas ventas outbound',
      'stack ventas B2B',
      'herramientas ventas startups',
      'tech stack GTM 2026',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'instantly-vs-smartlead-vs-lemlist',
      'heyreach-vs-dripify-vs-expandi',
      'cold-email-infrastructure',
    ],
    sections: [
      {
        heading: 'El Stack de un Vistazo',
        type: 'prose',
        content:
          'Necesitas cinco capas para ejecutar outbound: datos (a quién apuntar), enriquecimiento (qué sabes sobre ellos), entrega de email (cómo llegar a su bandeja de entrada), entrega de LinkedIn (cómo llegar a su feed) y CRM (dónde rastrear todo). Toda otra herramienta es opcional.\n\nLa mayoría de las startups compran de más. Se registran en 15 herramientas, pasan meses integrándolas y generan cero pipeline. Comienza con el stack mínimo que produce reuniones. Agrega herramientas solo cuando un cuello de botella específico lo demande.',
      },
      {
        heading: 'Capa 1: Sourcing de Datos',
        type: 'pattern',
        content:
          'Qué hace: encuentra las empresas y contactos que coinciden con tu ICP.\n\nRecomendado: Apollo ($49/mes). 275M+ contactos, datos de empresa decentes, filtros de ICP integrados. El tier gratuito (60 créditos/mes) es suficiente para validar tu ICP antes de pagar.\n\nAlternativa: LinkedIn Sales Navigator ($99/mes). Mejor para targeting basado en cuentas donde necesitas encontrar personas específicas en empresas específicas. Los filtros de búsqueda son más granulares que Apollo para antigüedad, función y atributos de empresa.\n\nOmitir por ahora: ZoomInfo ($15,000+/año). Precio empresarial para necesidades empresariales. Apollo cubre el 80% de los mismos datos al 3% del costo.\n\nOpción económica: tier gratuito de Apollo + investigación manual en LinkedIn. Puedes construir un pipeline significativo con cero costos de sourcing de datos si estás dispuesto a invertir tiempo en lugar de dinero.',
      },
      {
        heading: 'Capa 2: Enriquecimiento y Scoring',
        type: 'pattern',
        content:
          'Qué hace: agrega puntos de datos a tus leads (email, teléfono, detalles de empresa, tech stack, señales de contratación) y los califica contra tu ICP.\n\nRecomendado: Clay ($149-349/mes). Enriquecimiento en cascada de más de 150 proveedores. Fórmulas de scoring personalizadas. Investigación con Claygent AI. Esta es la herramienta de mayor apalancamiento en el stack - convierte listas de contactos crudas en outbound cualificado y personalizado.\n\nAlternativa: enriquecimiento integrado de Apollo (incluido en la suscripción). Limitado a los propios datos de Apollo. Sin lógica de cascada, sin scoring personalizado. Funciona si tus necesidades son básicas.\n\nOmitir por ahora: Clearbit, Lusha u otras herramientas de enriquecimiento independientes. Clay las subsume al conectarse a todas ellas a través de una sola interfaz.\n\nOpción económica: omite el enriquecimiento dedicado por completo. Usa los datos de Apollo tal cual y enfócate en volumen sobre personalización. Esto funciona para productos de menor ACV donde la tasa de respuesta por email importa menos que el volumen total.',
      },
      {
        heading: 'Capa 3: Entrega de Email',
        type: 'pattern',
        content:
          'Qué hace: envía secuencias de cold email con infraestructura de entregabilidad adecuada.\n\nRecomendado: Instantly ($47/mes). Cuentas de envío ilimitadas, warmup integrado, rotación de dominios. Mejor equilibrio de entregabilidad y costo para la mayoría de las startups.\n\nAlternativa: Smartlead ($39/mes). Ligeramente más barato, más técnico, mejor para agencias. Lemlist ($69/usuario/mes) si necesitas personalización avanzada para deals de alto ACV.\n\nLa infraestructura que necesitas independientemente de la herramienta: 3-5 dominios secundarios, buzones de Google Workspace o Microsoft 365, SPF/DKIM/DMARC configurado en cada dominio, 14-21 días de warmup antes del primer envío en frío.\n\nOmitir por ahora: Outreach, Salesloft o secuencias de HubSpot para outbound en frío. Estos están diseñados para secuencias tibias a leads existentes, no para prospección en frío a escala. Sus funciones de entregabilidad van detrás de las herramientas dedicadas de cold email.',
      },
      {
        heading: 'Capa 4: Entrega de LinkedIn',
        type: 'pattern',
        content:
          'Qué hace: automatiza solicitudes de conexión, mensajes e interacción de perfil en LinkedIn.\n\nRecomendado: HeyReach ($79/mes). Cuentas de LinkedIn ilimitadas con tarifa fija. Rotación de cuentas entre tu equipo. Mejor valor para outreach multicanal en LinkedIn con múltiples remitentes.\n\nAlternativa: Dripify ($39/usuario/mes) para operadores solos que quieren simplicidad. Expandi ($99/cuenta/mes) para vendedores enterprise que necesitan máxima seguridad de cuenta.\n\nPor qué necesitas LinkedIn junto al email: las tasas de apertura de email en cold outbound promedian 40-50%. Las tasas de aceptación de conexión en LinkedIn promedian 30-40%. Ejecutar ambos canales en los mismos prospectos significa que ven tu nombre en dos lugares. Las tasas de respuesta multicanal son típicamente 2-3x las de un solo canal.\n\nOmitir por ahora: InMail de LinkedIn Sales Navigator. Las tasas de respuesta en InMail son pobres comparadas con solicitudes de conexión con notas personalizadas. Ahorra los $99/mes a menos que necesites específicamente los filtros de búsqueda avanzados.',
      },
      {
        heading: 'Capa 5: CRM',
        type: 'pattern',
        content:
          'Qué hace: rastrea pipeline, deals, actividades y relaciones con clientes.\n\nRecomendado: Attio (tier gratuito para comenzar, $29/usuario/mes para pago). CRM moderno con excelente API, modelo de datos flexible e integraciones nativas con Clay y herramientas de outbound comunes. El tier gratuito maneja todo lo que un equipo pequeño necesita.\n\nAlternativa: HubSpot CRM (tier gratuito). El CRM gratuito más popular. Más pesado que Attio, más funciones para automatización de marketing, ecosistema más grande de integraciones.\n\nOmitir por ahora: Salesforce. CRM empresarial para equipos empresariales. Si eres una startup con menos de 10 representantes de ventas, Salesforce agrega complejidad sin valor proporcional. Siempre puedes migrar después cuando superes Attio o HubSpot.\n\nEl costo total del stack:\nApollo ($49) + Clay ($349) + Instantly ($47) + HeyReach ($79) + Attio (gratis) + dominios y buzones ($50) = aproximadamente $575/mes.\n\nEso es el precio del presupuesto mensual de café de un SDR junior para infraestructura que genera pipeline 24/7.',
      },
      {
        heading: 'Orden de Construcción: Qué Configurar Primero',
        type: 'pro-tip',
        content:
          'Semana 1: Apollo (tier gratuito) + infraestructura de email (comprar dominios, configurar DNS, iniciar warmup). Costo: $50 para dominios y buzones.\n\nSemana 2: Instantly (conectar cuentas con warmup, construir primera secuencia de email). Comienza con tu mejor segmento de ICP. 50 emails/día para probar mensajes. Costo: agrega $47/mes.\n\nSemana 3: Clay (construir workflow de enriquecimiento, empezar a calificar leads). Reemplaza la investigación manual de Apollo con enriquecimiento automatizado. Costo: agrega $149-349/mes.\n\nSemana 4: HeyReach (agregar LinkedIn a tu outreach multicanal). Los mismos leads que reciben email ahora también reciben toques de LinkedIn. Costo: agrega $79/mes.\n\nSemana 5: CRM (Attio o HubSpot, mover el seguimiento de pipeline de hojas de cálculo). Costo: gratis.\n\nEste orden de construcción significa que estás enviando outbound para la semana 2 (14 días), no la semana 8. Comienza a generar pipeline inmediatamente con infraestructura básica, luego agrega sofisticación por capas. No esperes hasta que todo el stack esté perfecto para empezar a contactar.\n\nLa única regla: nunca lances outbound sin dominios con warmup y DNS adecuado. Dos semanas de warmup es no negociable. Todo lo demás se puede iterar mientras el pipeline está funcionando.',
      },
    ],
  },

  {
    id: 'clay-vs-manual-enrichment',
    title: 'Clay vs Enriquecimiento Manual',
    subtitle: 'Cuándo Clay se paga solo y cuándo una hoja de cálculo es suficiente',
    category: 'comparisons',
    description:
      'Comparación honesta de enriquecimiento automatizado con Clay vs investigación manual. Cuándo Clay vale la inversión, cuándo lo manual funciona, el cálculo de punto de equilibrio y cómo decidir basándote en tu volumen de outbound y complejidad de ICP.',
    keywords: [
      'vale la pena clay',
      'reseña clay.com',
      'precio de clay vale la pena',
      'necesito clay',
      'clay vs hoja de cálculo',
      'investigación manual de leads vs clay',
      'ROI de clay',
      'costo beneficio clay.com',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'how-to-use-clay-enrichment',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'La Respuesta Honesta',
        type: 'prose',
        content:
          'Clay no es para todos. Si envías 50 cold emails a la semana a un ICP obvio (todas empresas SaaS, todas con 100+ empleados, todas en Norteamérica), Apollo solo maneja tu sourcing y enriquecimiento. No necesitas Clay.\n\nClay se vuelve esencial cuando: tu ICP requiere múltiples puntos de datos para calificar (tech stack + etapa de financiamiento + señales de contratación + tamaño de empresa), necesitas personalización que va más allá de "Hola {first_name}", o tu volumen excede lo que una persona puede investigar manualmente en un día.\n\nEl punto de equilibrio: si la investigación manual te toma 5 minutos por lead y Clay toma 30 segundos, Clay ahorra 4.5 minutos por lead. Con 200 leads/mes, eso son 15 horas ahorradas. A $349/mes por Clay, estás pagando $23/hora por el ahorro de tiempo. Si tu tiempo vale más de $23/hora, Clay se paga solo.',
      },
      {
        heading: 'Cuándo lo Manual Funciona Bien',
        type: 'pattern',
        content:
          'La investigación manual con una hoja de cálculo supera a Clay en estos escenarios:\n\nBajo volumen: menos de 100 leads por mes. El ahorro de tiempo no justifica el costo de suscripción. Gasta los $349/mes en otra cosa.\n\nICP simple: si tus criterios de cualificación son básicos (título + tamaño de empresa + industria), Apollo o LinkedIn Sales Navigator te da todo lo que necesitas sin Clay.\n\nABM altamente dirigido: si estás contactando 10 cuentas enterprise específicas por mes, cada una merece 30 minutos de investigación manual profunda. Ninguna automatización puede igualar la calidad de un humano leyendo la última charla del CEO en una conferencia y referenciándola en la línea de apertura.\n\nPresupuesto bootstrapped: cuando gastas $0 en herramientas y cada dólar cuenta, tu tiempo es el recurso más barato. Intercambia tiempo por dinero hasta que los ingresos justifiquen la inversión.\n\nUn buen workflow manual: LinkedIn Sales Navigator para sourcing, tier gratuito de Apollo para búsqueda de email, Google para investigación de empresa, una Google Sheet para seguimiento. Costo: $99/mes para Sales Navigator. Resultado: 50-100 leads bien investigados por mes.',
      },
      {
        heading: 'Cuándo Clay Se Vuelve Esencial',
        type: 'pattern',
        content:
          'Clay vale cada centavo en estos escenarios:\n\nVolumen superior a 200 leads/mes: la investigación manual a este volumen toma 15+ horas/mes. Clay lo hace en minutos. El ahorro de tiempo por sí solo justifica el costo.\n\nScoring complejo de ICP: cuando la cualificación requiere combinar 5+ puntos de datos (conteo de empleados + financiamiento + tech stack + señales de contratación + tasa de crecimiento), construir esto en una hoja de cálculo es frágil. Las fórmulas de Clay lo manejan con elegancia y consistencia.\n\nNecesidades de enriquecimiento en cascada: si un solo proveedor de email te da 55% de cobertura pero necesitas 80%+, la cascada de Clay a través de 3-4 proveedores es la única solución escalable. Verificar manualmente múltiples proveedores para cada contacto es agotador.\n\nPersonalización a escala: cuando cada email outbound necesita una primera línea personalizada referenciando algo específico de la empresa, Claygent automatiza lo que tomaría 3-5 minutos por lead manualmente.\n\nEnrutamiento multicanal: Clay puede enviar leads cualificados tanto a Instantly (email) como a HeyReach (LinkedIn) automáticamente. El enrutamiento manual entre herramientas es propenso a errores y lento.\n\nLa señal: si te encuentras pasando más tiempo preparando outreach que enviándolo, Clay resuelve ese cuello de botella.',
      },
      {
        heading: 'El Camino de Migración',
        type: 'pro-tip',
        content:
          'No necesitas ir all-in con Clay inmediatamente. Aquí está el camino gradual:\n\nMes 1: Workflow manual con Apollo + hoja de cálculo. Aprende tu ICP, prueba mensajes, entiende qué puntos de datos realmente predicen leads cualificados. Costo: $49/mes.\n\nMes 2: Agrega Clay al tier de $149/mes (2,000 créditos). Construye un workflow de enriquecimiento para tu segmento de ICP de mayor valor. Mantén la investigación manual para todo lo demás. Demuestra el ROI a pequeña escala.\n\nMes 3: Si Clay está produciendo leads mejor cualificados (mayores tasas de respuesta, más reuniones agendadas), actualiza al tier de $349/mes. Mueve todo el enriquecimiento a Clay. Elimina la hoja de cálculo.\n\nMes 4+: Optimiza workflows de Clay. Agrega Claygent para personalización. Conecta tus propias API keys para reducir el uso de créditos. Construye tablas plantilla para diferentes tipos de campaña.\n\nLa métrica clave a rastrear: reuniones agendadas por cada 100 contactos outbound. Si los leads enriquecidos con Clay agendan reuniones al doble de la tasa de los leads investigados manualmente, la herramienta se ha pagado 10 veces.',
      },
    ],
  },

  {
    id: 'email-deliverability-checklist-2026',
    title: 'Checklist de Entregabilidad de Email para 2026',
    subtitle: 'El checklist de 15 puntos que mantiene el cold email fuera del spam',
    category: 'comparisons',
    description:
      'Checklist completo de entregabilidad de email para outreach en frío en 2026. Configuración de DNS, warmup, límites de envío, reglas de contenido y monitoreo - el checklist paso a paso usado en un stack outbound en producción.',
    keywords: [
      'checklist entregabilidad email',
      'entregabilidad cold email 2026',
      'mejores prácticas entregabilidad email',
      'evitar carpeta spam cold email',
      'checklist warmup email',
      'checklist SPF DKIM DMARC',
      'prevención spam cold email',
      'guía entregabilidad email',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'cold-email-infrastructure',
      'instantly-vs-smartlead-vs-lemlist',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'Antes de Enviar un Solo Email',
        type: 'code',
        content:
          'El checklist pre-lanzamiento. No omitas ningún paso.\n\n1. Compra 3-5 dominios secundarios (nunca envíes cold email desde tu dominio principal)\n2. Configura buzones de Google Workspace o Microsoft 365 en cada dominio (2-3 por dominio)\n3. Agrega registro SPF al DNS para cada dominio\n4. Habilita la firma DKIM en el panel de administración de tu proveedor de email y agrega registros DKIM al DNS\n5. Agrega registro DMARC al DNS (comienza con p=none, actualiza a p=quarantine después de 2 semanas)\n6. Verifica todos los registros en MXToolbox.com o mail-tester.com (la puntuación debe ser 9/10 o mayor)\n7. Inicia warmup en cada buzón (mínimo 14 días, idealmente 21-30 días)\n8. Configura Google Postmaster Tools para cada dominio para monitorear la reputación\n9. Crea un dominio de tracking personalizado para tu herramienta de cold email (evita listas negras de dominios de tracking compartidos)\n10. Haz un envío de prueba a tus propias cuentas de Gmail, Outlook y Yahoo para verificar la colocación en bandeja de entrada',
      },
      {
        heading: 'Reglas de Envío',
        type: 'formula',
        content:
          'Estos límites mantienen tus dominios saludables:\n\n11. Máximo 25-30 cold emails por buzón por día (más 20-30 emails de warmup)\n12. Incrementa el volumen gradualmente: 5/día semana 1, 10/día semana 2, 15/día semana 3, 20-25/día semana 4\n13. Rota entre todos los dominios y buzones (tu herramienta de cold email maneja esto automáticamente)\n14. Mantén la tasa de rebote por debajo del 3% (por encima del 5% = pausa y limpia tu lista inmediatamente)\n15. Mantén la tasa de quejas de spam por debajo del 0.1% (el límite duro de Gmail es 0.3%)',
      },
      {
        heading: 'Reglas de Contenido que Afectan la Entregabilidad',
        type: 'pattern',
        content:
          'Lo que escribes afecta dónde aterriza. Reglas de contenido:\n\nEvita palabras que activan filtros de spam en los asuntos: "gratis", "garantizado", "actúa ahora", "tiempo limitado", "haz clic aquí." Estos no son activadores automáticos de spam, pero aumentan la sensibilidad del filtro de spam.\n\nMantén los emails cortos. 50-125 palabras funciona mejor para cold email. Los emails largos señalan marketing en lugar de comunicación personal.\n\nLimita los enlaces. Un enlace máximo en el cuerpo del email (tu CTA). Cero enlaces en el primer email de una secuencia funciona aún mejor. Los filtros de spam marcan emails con múltiples enlaces.\n\nSin imágenes en cold email. Las imágenes activan filtros de spam y parecen emails de marketing. El texto puro parece una persona real escribiendo a otra persona.\n\nFormato de texto plano. Sin formato HTML, sin negritas, sin colores. Si tu cold email parece un newsletter, se filtra como un newsletter.\n\nIncluye un mecanismo de cancelación de suscripción. Una línea simple al final: "Si esto no es relevante, dímelo y no haré seguimiento." Esto es legalmente requerido y reduce las quejas de spam.\n\nEvita acortadores de URL. bit.ly y servicios similares son abusados por spammers. Usa tu URL de dominio completo o un dominio de tracking personalizado.',
      },
      {
        heading: 'Monitoreo Continuo',
        type: 'pattern',
        content:
          'La entregabilidad se degrada si dejas de prestar atención. Verificaciones semanales:\n\nGoogle Postmaster Tools: verifica la reputación del dominio (debe ser "High" o "Medium"). Si cae a "Low", pausa el envío en frío inmediatamente e investiga.\n\nTasa de rebote por campaña: cualquier campaña por encima del 3% de tasa de rebote necesita limpieza de lista. Extrae las direcciones rebotadas, identifica el patrón (¿todas de una empresa? ¿fuente de datos antigua? ¿dominio específico?) y corrige la fuente.\n\nMonitoreo de quejas de spam: verifica en tu herramienta de cold email. Incluso una queja por cada 1,000 emails (0.1%) es una señal de advertencia. Investiga qué emails provocaron las quejas.\n\nTasas de apertura como indicador de entregabilidad: si tus tasas de apertura caen por debajo del 30%, probablemente tienes un problema de entregabilidad. Las tasas de apertura saludables de cold email son 45-65%. Por debajo del 30% significa que los emails están cayendo en spam.\n\nSalud del warmup: verifica que el warmup sigue ejecutándose en todas las cuentas. Algunas herramientas pausan el warmup automáticamente cuando el volumen de envío es alto. Mantén el warmup ejecutándose continuamente.\n\nEdad del dominio: rastrea qué tan antiguo es cada dominio. Los dominios con menos de 30 días deben enviar a volumen reducido. Los dominios con menos de 90 días no deben exceder 20 emails/día.',
      },
      {
        heading: 'Recuperación de Emergencia',
        type: 'pro-tip',
        content:
          'Si un dominio es marcado o la colocación en bandeja de entrada cae:\n\n1. Pausa todo el envío en frío desde el dominio afectado inmediatamente\n2. Mantén el warmup ejecutándose (o aumenta ligeramente el volumen de warmup)\n3. Verifica Google Postmaster Tools para problemas específicos\n4. Revisa campañas recientes por altas tasas de rebote, quejas de spam o problemas de contenido\n5. Espera 7-14 días con solo warmup (sin cold email) para reconstruir la reputación\n6. Reanuda el envío en frío al 50% del volumen y aumenta gradualmente durante 2 semanas\n\nSi un dominio está completamente quemado (la reputación se mantiene en "Bad" después de 30 días de descanso), retíralo. Elimina todos los buzones, detén el warmup y reemplaza con un nuevo dominio. Quemar dominios es normal en outbound en frío - trata los dominios como infraestructura consumible, no como activos permanentes.\n\nLa prevención: rota dominios antes de que se quemen. Si tienes 5 dominios, usa 3 activamente y mantén 2 solo en warmup como respaldo. Rota el conjunto activo cada 60-90 días. Esto mantiene cada dominio fresco y previene que cualquier dominio individual acumule demasiado historial de envío en frío.',
      },
    ],
  },

  {
    id: 'linkedin-vs-twitter-vs-reddit-b2b',
    title: 'LinkedIn vs X vs Reddit para Contenido B2B',
    subtitle: 'Dónde publicar, qué funciona en cada uno y cómo manejar los tres sin agotarte',
    category: 'comparisons',
    description:
      'Comparación de LinkedIn, X/Twitter y Reddit para distribución de contenido B2B. Diferencias de audiencia, comportamiento del algoritmo, formatos de contenido que funcionan y la estrategia multiplataforma que genera efecto compuesto.',
    keywords: [
      'linkedin vs twitter para B2B',
      'linkedin vs reddit contenido',
      'mejor plataforma contenido B2B 2026',
      'linkedin vs x vs reddit',
      'distribución contenido B2B',
      'dónde publicar contenido B2B',
      'comparación linkedin reddit twitter',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'mcp-content-stack',
      'how-to-grow-on-reddit',
      'how-to-repurpose-content',
      'content-stack-solo-builders',
    ],
    sections: [
      {
        heading: 'Tres Plataformas, Tres Audiencias',
        type: 'prose',
        content:
          'LinkedIn es donde los profesionales actúan. X es donde los builders debaten. Reddit es donde los practicantes ayudan. La misma persona, tres modos diferentes. El ejecutivo que publica thought leadership pulido en LinkedIn es la misma persona que da upvote a opiniones técnicas sin filtro en Reddit a las 11pm.\n\nEl error: elegir una plataforma e ignorar las otras. La oportunidad: la misma idea central se presenta de manera diferente en cada plataforma. Un post de LinkedIn sobre automatización con IA obtiene engagement profesional. La misma idea como comentario en Reddit obtiene credibilidad técnica. La misma idea como hilo en X obtiene alcance en la comunidad de builders.\n\nYo manejo las tres. Sirven diferentes propósitos en el mismo funnel.',
      },
      {
        heading: 'LinkedIn: Señal Profesional',
        type: 'pattern',
        content:
          'Qué funciona en LinkedIn: historias de experiencia personal, opiniones contrarias sobre tendencias de la industria, resultados específicos con números y frameworks que la gente puede capturar y compartir.\n\nComportamiento del algoritmo: LinkedIn recompensa el engagement temprano. Los primeros 60-90 minutos determinan tu alcance. Los posts que obtienen comentarios (no solo likes) dentro de la primera hora se impulsan a la red más amplia. El algoritmo favorece posts de solo texto y carruseles sobre enlaces (los enlaces externos se suprimen).\n\nFormato que funciona: párrafos cortos, una idea por línea, 150-300 palabras. Comienza con un gancho que detenga el scroll. Termina con una pregunta o CTA que invite comentarios. Evita hashtags en 2026 - agregan desorden sin beneficio significativo de alcance.\n\nA quién llegas: tomadores de decisiones, ejecutivos, VPs, gerentes de contratación. La audiencia de LinkedIn tiende a ser senior. Si tu contenido apunta a fundadores, VPs de Ventas o CTOs, LinkedIn es el canal principal.\n\nCadencia de publicación: 3-5 posts por semana. La consistencia importa más que la perfección. Un post mediocre que se publica supera a un post perfecto guardado en tus borradores.',
      },
      {
        heading: 'X/Twitter: Comunidad de Builders',
        type: 'pattern',
        content:
          'Qué funciona en X: opiniones en tiempo real, building in public, insights técnicos, hot takes sobre herramientas y tendencias, hilos desglosando temas complejos.\n\nComportamiento del algoritmo: X recompensa la velocidad de engagement. Los primeros 30-60 minutos son críticos. Respuestas, retweets y bookmarks señalan valor. X Premium da un impulso algorítmico - los creadores serios lo necesitan. Los hilos obtienen 3x más engagement que tweets individuales.\n\nFormato que funciona: tweets individuales para hot takes (menos de 280 caracteres, punzantes). Hilos para profundidad (5-15 tweets, cada uno valioso por sí solo). Quote tweets con comentario adicional. Evita opiniones genéricas - X recompensa la especificidad y la convicción.\n\nA quién llegas: builders, ingenieros, indie hackers, fundadores de startups. La audiencia de X tiende a ser técnica y con opiniones fuertes. Si tu contenido apunta a desarrolladores, product builders o fundadores en etapa temprana, X es un canal principal.\n\nCadencia de publicación: 2-5 tweets/hilos originales por semana más 10-20 respuestas a otras personas. Las respuestas construyen tu red más rápido que los posts originales. Responde a personas más grandes que tú con opiniones sustanciales, no comentarios de "gran post".',
      },
      {
        heading: 'Reddit: Credibilidad de Practicante',
        type: 'pattern',
        content:
          'Qué funciona en Reddit: ayuda genuina, respuestas técnicas específicas, experiencia personal compartida sin autopromoción y opiniones honestas respaldadas por evidencia.\n\nComportamiento del algoritmo: Reddit es impulsado por la comunidad, no por el algoritmo. Los upvotes determinan la visibilidad dentro de un subreddit. Los moderadores controlan la calidad. Los posts y comentarios que proporcionan valor genuino reciben upvotes. La autopromoción recibe downvotes y se elimina.\n\nFormato que funciona: comentarios detallados respondiendo preguntas específicas (200-500 palabras con ejemplos reales). Posts de experiencia personal ("Construí X, esto es lo que aprendí"). Posts de comparación con pros y contras honestos. Evita cualquier cosa que suene a marketing.\n\nA quién llegas: practicantes, operadores hands-on, personas resolviendo problemas activamente. La audiencia de Reddit tiende hacia personas que hacen el trabajo, no que gestionan el trabajo. Si tu contenido apunta a personas que usan las herramientas diariamente, Reddit construye la credibilidad más profunda.\n\nCadencia de publicación: 5-10 comentarios por semana en 3-5 subreddits relevantes. Enfócate en ayudar a personas con problemas específicos. No dejes enlaces. No menciones tu producto a menos que te lo pregunten directamente. Construye karma a través de contribución genuina primero.',
      },
      {
        heading: 'La Estrategia Multiplataforma',
        type: 'pro-tip',
        content:
          'Así es como manejar las tres sin triplicar tu carga de trabajo:\n\nCreación de contenido core: escribe una pieza sustancial por semana. Un post de blog, una guía detallada o una experiencia documentada. Este es tu material fuente.\n\nLinkedIn: extrae el insight clave y el ángulo personal. Escríbelo como un post personal de 200 palabras. Lidera con la opinión contraria o el resultado sorprendente. Publica de martes a jueves entre 8-10am.\n\nX: extrae la opinión más afilada. Escríbela como un tweet individual o un hilo de 5 tweets. Sé más directo y con más opinión que en LinkedIn. Publica cualquier día, interactúa en respuestas durante el día.\n\nReddit: encuentra hilos de subreddits donde la gente pregunta sobre tu tema. Escribe comentarios detallados y útiles que se basen en tu experiencia. No pongas enlace a tu blog. Solo ayuda. La credibilidad se acumula con el tiempo.\n\nEl flywheel: LinkedIn construye autoridad profesional. X construye comunidad de builders. Reddit construye credibilidad de practicante. Juntos, crean una presencia que ninguna plataforma individual puede igualar. Y las tres alimentan el SEO - el contenido de Reddit se indexa en Google, los perfiles de LinkedIn rankean, los hilos de X son citados por motores de IA.\n\nInversión de tiempo: 3-4 horas por semana en total. 1 hora para contenido core. 30 minutos para adaptación de LinkedIn. 30 minutos para adaptación de X. 1-2 horas para comentar en Reddit durante la semana.',
      },
    ],
  },

  {
    id: 'ai-content-vs-human-content',
    title: 'Contenido de IA vs Contenido Humano',
    subtitle: 'Cuándo la IA escribe mejor, cuándo los humanos escriben mejor y cómo usar ambos',
    category: 'comparisons',
    description:
      'Comparación honesta de contenido generado por IA vs contenido escrito por humanos. Dónde la IA sobresale, dónde falla, el framework anti-slop para control de calidad y el workflow híbrido que produce mejor resultado que cualquiera de los dos solos.',
    keywords: [
      'contenido IA vs contenido humano',
      'escritura IA vs escritura humana',
      'calidad contenido generado por IA',
      'es suficiente el contenido de IA',
      'detección contenido IA',
      'contenido slop IA',
      'cómo evitar slop de IA',
      'mejores prácticas contenido IA',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'how-to-use-ai-content-creation',
      'how-to-build-voice-system',
      'content-stack-solo-builders',
    ],
    sections: [
      {
        heading: 'La Diferencia Real',
        type: 'prose',
        content:
          'La IA escribe más rápido. Los humanos escriben con experiencia vivida. Esa es la diferencia fundamental, y determina cuándo usar cada uno.\n\nLa IA puede generar una comparación de 2,000 palabras sobre herramientas de cold email en 3 minutos. Será precisa, bien estructurada y completa. Pero leerá como un informe de investigación - exhaustivo pero impersonal. Sin historias reales. Sin "probé esto y falló a las 3am." Sin opiniones ganadas.\n\nLos humanos escriben más lento pero integran experiencia en cada oración. El desarrollador que pasó tres meses depurando un pipeline de despliegue escribe diferente sobre despliegue que una IA resumiendo documentación. La diferencia se siente, no siempre es medible.\n\nEl mejor contenido en 2026 no es ni pura IA ni puro humano. Es contenido humano asistido por IA - el humano proporciona la experiencia, las opiniones y la voz; la IA maneja la estructura, la investigación y la generación del primer borrador.',
      },
      {
        heading: 'Dónde Gana la IA',
        type: 'pattern',
        content:
          'La IA es mejor que la mayoría de los humanos en:\n\nContenido de referencia estructurado. Documentación, glosarios, tablas comparativas, checklists. La IA organiza información de manera limpia y no olvida cubrir casos extremos.\n\nPrimeros borradores. Pasar de página en blanco a borrador estructurado es donde la IA ahorra más tiempo. El primer borrador nunca es el producto final, pero tener una estructura a la cual reaccionar es más rápido que escribir desde cero.\n\nVolumen. Si necesitas 50 descripciones de producto, 20 variantes de email o 10 landing pages, la IA maneja volúmenes que tomarían semanas a un equipo humano.\n\nSíntesis de investigación. Combinar información de múltiples fuentes en un resumen coherente. La IA lee 10 artículos y sintetiza los puntos clave más rápido y de manera más completa que un humano ojeando los mismos artículos.\n\nEstructura optimizada para SEO. La IA produce naturalmente contenido bien estructurado con encabezados claros, integración de palabras clave y flujo lógico. Esto es lo que los motores de búsqueda quieren.',
      },
      {
        heading: 'Dónde Ganan los Humanos',
        type: 'pattern',
        content:
          'Los humanos son mejores que cualquier IA en:\n\nExperiencia original. "Envié esta feature a las 2am mientras mi perro Broly dormía sobre mi teclado" no puede ser generado. Las experiencias vividas son el foso de contenido que la IA no puede replicar.\n\nOpiniones contrarias. La IA optimiza para el consenso. Te da la opinión promedio. Los humanos forman opiniones fuertes, a veces equivocadas, basadas en experiencia personal. "Todos dicen que Cursor es mejor. Yo creo que Claude Code es mejor por X razón." Esas opiniones impulsan el engagement.\n\nVoz y personalidad. La IA escribe con una voz competente y genérica. Los humanos tienen peculiaridades, patrones, preferencias. "Energía en minúsculas. Sustancia sobre pulido." Eso es una voz. La IA puede imitarla con suficientes ejemplos, pero la voz se origina en un humano.\n\nResonancia emocional. La historia del cambio de carrera. La narrativa de lucha. El post honesto de fracaso. Estos conectan porque los lectores sienten al humano detrás de las palabras.\n\nContexto cultural. La IA pierde matices, timing y las reglas no escritas de comunidades específicas. Un comentario en Reddit que cae perfectamente en r/ClaudeAI requiere entender la cultura de la comunidad, no solo el tema.',
      },
      {
        heading: 'El Framework Anti-Slop',
        type: 'formula',
        content:
          'El slop de IA es contenido que se lee como si fue generado sin edición humana. Tiene patrones reveladores:\n\nFrases genéricas: "En el panorama en constante evolución de..." "Vale la pena señalar que..." "Al final del día..." "Profundicemos más en..." Si ves estas en tu borrador, la IA está llenando espacio sin agregar sustancia.\n\nTransiciones vacías: "Además..." "Adicionalmente..." "Más aún..." Estas son palabras de relleno. Córtalas y el contenido queda más conciso.\n\nCoberturas excesivas: "Se podría argumentar potencialmente que..." "Hay varias consideraciones a tener en cuenta..." Solo di la cosa. Haz una afirmación. Respáldala.\n\nSin específicos: "Muchas empresas encuentran éxito con..." ¿Qué empresas? ¿Qué éxito? La IA recurre a generalizaciones vagas por defecto. El contenido humano nombra nombres y cita números.\n\nLa regla de las 3 banderas: si una pieza de contenido activa 3 o más patrones anti-slop, reescríbela desde cero. No la parchees. Parchear slop de IA deja artefactos que los lectores perciben aunque no puedan articular por qué. Empieza de nuevo con la experiencia humana como base y usa la IA para estructurar alrededor.',
      },
      {
        heading: 'El Workflow Híbrido',
        type: 'pro-tip',
        content:
          'El workflow que produce el mejor contenido:\n\n1. Lluvia de ideas humana. Tú identificas el tema desde tu experiencia real. No "¿sobre qué debería escribir?" sino "¿qué aprendí esta semana que otros encontrarían útil?"\n\n2. Investigación y estructura con IA. Usa IA para reunir datos de apoyo, identificar ángulos que podrías no ver y producir un esquema estructural.\n\n3. Primer borrador humano. Escribe la apertura, los argumentos clave y la conclusión tú mismo. Usa tu voz, tus ejemplos, tus opiniones. Aquí es donde el contenido obtiene su alma.\n\n4. Expansión con IA. Deja que la IA llene las secciones de apoyo, agregue contexto, mejore transiciones y maneje las partes que necesitan exhaustividad pero no personalidad.\n\n5. Edición humana y pasada de voz. Lee la pieza completa en voz alta. ¿Suena como tú? Corta cualquier cosa que suene genérica. Agrega específicos donde la IA fue vaga. Inyecta la personalidad.\n\n6. Auditoría anti-slop. Pasa por el checklist anti-slop. Tres o más banderas significa otra pasada de edición.\n\nEsto produce contenido que es completo (contribución de IA), auténtico (contribución humana) y pulido (edición iterativa). Toma 60-90 minutos en lugar de las 3 horas de escritura puramente humana o los 10 minutos de generación puramente por IA que nadie quiere leer.',
      },
    ],
  },

  {
    id: 'building-in-public-as-gtm',
    title: 'Building in Public como Canal GTM',
    subtitle: 'Por qué tu build log es tu mejor marketing y cómo hacerlo sin sentir vergüenza',
    category: 'comparisons',
    description:
      'Building in public como estrategia go-to-market. Por qué la documentación supera a la publicidad, qué compartir y qué mantener privado, tácticas específicas por plataforma y el efecto compuesto de construir de manera transparente.',
    keywords: [
      'building in public',
      'estrategia build in public',
      'building in public marketing',
      'build in public GTM',
      'construcción transparente',
      'estrategia contenido build in public',
      'ship in public',
      'consejos building in public',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'ai-content-vs-human-content',
    ],
    sections: [
      {
        heading: 'Por Qué Funciona Building in Public',
        type: 'prose',
        content:
          'El marketing tradicional dice: "Aquí está nuestro producto. Aquí está por qué es genial. Cómpralo." Building in public dice: "Esto es lo que construí hoy. Esto es lo que se rompió. Esto es lo que aprendí. Esto es lo que voy a construir después."\n\nEl segundo enfoque construye más confianza, más rápido. Las personas confían en el proceso sobre las afirmaciones. Cuando muestras el medio desordenado - la sesión de depuración a las 3am, el deploy fallido, el pivote cuando el primer enfoque no funcionó - demuestras competencia a través de evidencia, no de aseveraciones.\n\nBuilding in public funciona como canal GTM porque atrae a tus clientes ideales a través de la especificidad. Un post sobre "cómo automaticé mi pipeline outbound con Clay e Instantly" solo resuena con personas que se preocupan por la automatización de outbound. Esas son exactamente las personas que quieres que te encuentren. El contenido autoselecciona la audiencia.',
      },
      {
        heading: 'Qué Compartir',
        type: 'pattern',
        content:
          'El contenido que funciona en build-in-public:\n\nActualizaciones de envío. "Envié 3 nuevas features esta semana: X, Y, Z. Así es como funcionan y por qué las construimos." Corto, específico, muestra velocidad.\n\nDecisiones técnicas. "Elegimos SQLite sobre Postgres para nuestro índice de contenido. Aquí está por qué." Enseña a tu audiencia mientras posiciona tu experiencia.\n\nPost-mortems de fracasos. "Nuestra entregabilidad de email se desplomó la semana pasada. Esto es lo que salió mal y cómo lo arreglamos." Estos obtienen el mayor engagement porque son raros. Todos publican victorias. Pocos publican derrotas.\n\nNúmeros. Ingresos, conteo de usuarios, tráfico, costos - lo que te sientas cómodo compartiendo. Los números específicos construyen credibilidad. "377 impresiones en 2 meses con cero SEO deliberado" es más interesante que "creciendo de manera constante."\n\nDesgloses de stack. Las herramientas que usas y por qué. "$525/mes ejecuta toda mi infraestructura outbound" es contenido que tu ICP busca activamente.\n\nLogs diarios/semanales. Qué construiste, qué aprendiste, qué sigue. La consistencia es la clave. Un build log semanal durante 12 meses crea un cuerpo de trabajo que se acumula en autoridad.',
      },
      {
        heading: 'Qué Mantener Privado',
        type: 'anti-pattern',
        content:
          'No todo debe ser público:\n\nNombres y detalles de clientes. Nunca compartas con quién trabajas sin permiso explícito. Los patrones están bien ("ayudamos a una fintech Serie B"). Los específicos no.\n\nOpiniones no validadas sobre personas. Critica enfoques, nunca individuos. "Esta arquitectura tiene problemas de escalabilidad" está bien. "El código de esta persona es malo" no lo está.\n\nDetalles de seguridad. Tu configuración de despliegue, API keys, URLs internas, configuraciones de servidor. Comparte lo que construiste, no cómo irrumpir en ello.\n\nIngresos de clientes específicos. Los números agregados están bien. Los ingresos por cliente son privados.\n\nNegociaciones en progreso. No compartas deals, alianzas o discusiones de negocios antes de que se cierren. El anuncio prematuro crea presión y puede matar deals.',
      },
      {
        heading: 'Tácticas de Build-in-Public por Plataforma',
        type: 'pattern',
        content:
          'LinkedIn: pule la historia ligeramente. Enmarca la construcción como un insight profesional. "Construí un workflow de IA multi-agente esta semana. El insight clave: la delegación supera la optimización." Los profesionales de negocios interactúan con conclusiones que pueden aplicar a su propio trabajo.\n\nX/Twitter: crudo y en tiempo real. "Acabo de enviar. 3 sitios desplegados desde un monorepo en 20 segundos. El pipeline de CI tomó más tiempo en construirse que los sitios mismos." X recompensa la velocidad y la autenticidad.\n\nReddit: ayuda primero, comparte después. Responde preguntas en subreddits relevantes con tu experiencia de construcción. "Tuve exactamente este problema. Así es como lo resolví: [respuesta técnica detallada]." Construyendo credibilidad en comunidades que confían en practicantes sobre promotores.\n\nBlog: el archivo. Todo lo que compartes en plataformas sociales es efímero. El post del blog es el registro permanente. Escribe un resumen semanal o mensual de lo que enviaste, lo que aprendiste y lo que cambió. Este es tu juego de SEO - los posts de blog rankean en Google mucho después de que los posts sociales desaparecen de los feeds.\n\nGitHub: la prueba. Un repo público con historial de commits es el artefacto definitivo de build-in-public. La gente puede ver lo que realmente construiste, no solo lo que afirmas haber construido.',
      },
      {
        heading: 'El Efecto Compuesto',
        type: 'pro-tip',
        content:
          'Building in public es un proceso lento que de repente se acumula. Mes 1-3: sientes que estás gritando al vacío. Bajo engagement. Pocos seguidores. Esto es normal. Sigue publicando.\n\nMes 3-6: la gente empieza a reconocer tu nombre. Recibes respuestas de personas que han estado leyendo en silencio. Los DMs inbound comienzan. "He estado siguiendo tu build log y tengo una pregunta sobre..."\n\nMes 6-12: eres la persona de referencia para tu nicho. La gente te etiqueta en conversaciones. Recibes leads inbound desde tu contenido. Tu build log está haciendo la venta sin que hagas nunca un pitch de ventas.\n\nLa clave: la consistencia supera a la intensidad. Un post por semana durante un año (52 posts) supera una ráfaga de 20 posts en un mes seguida de silencio. La audiencia construye confianza a través de exposición repetida, no de volumen.\n\nEl beneficio oculto: building in public te obliga a pensar con claridad sobre lo que estás construyendo. Explicar tu trabajo a una audiencia clarifica tu propio pensamiento. El contenido no es solo marketing - es un ciclo de retroalimentación sobre tu producto y estrategia.',
      },
    ],
  },

  {
    id: 'how-to-grow-on-reddit',
    title: 'Cómo Crecer en Reddit Sin que Te Baneen',
    subtitle: 'Estrategia karma-first, cultura de subreddits y engagement auténtico que se acumula',
    category: 'comparisons',
    description:
      'Guía práctica de crecimiento en Reddit para builders y creadores. Cómo construir karma, elegir subreddits, escribir comentarios que reciben upvotes y convertir la credibilidad en Reddit en resultados de negocio reales sin violar reglas de la comunidad.',
    keywords: [
      'cómo crecer en reddit',
      'estrategia crecimiento reddit',
      'estrategia karma reddit',
      'marketing en reddit 2026',
      'cómo conseguir upvotes reddit',
      'reddit para negocios',
      'estrategia engagement reddit',
      'reddit para B2B',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'building-in-public-as-gtm',
    ],
    sections: [
      {
        heading: 'Reddit No Es Redes Sociales',
        type: 'prose',
        content:
          'Reddit no funciona como LinkedIn o X. En esas plataformas, construyes una marca personal y transmites a seguidores. En Reddit, ganas credibilidad dentro de comunidades proporcionando valor. No hay seguidores que vean tus posts (prácticamente). Cada post y comentario tiene éxito o fracasa por sus propios méritos dentro del subreddit específico.\n\nEsto es por lo que la mayoría de las estrategias de marketing fallan en Reddit. Si abordas Reddit con mentalidad de LinkedIn - posts pulidos con un CTA - recibes downvotes y te banean. Los usuarios de Reddit tienen cero tolerancia a la autopromoción. Toda la cultura está construida alrededor de la contribución genuina.\n\nLa buena noticia: si realmente tienes experiencia y la compartes generosamente, Reddit es la plataforma de mayor confianza en internet. Un comentario en Reddit de un practicante verificado tiene más credibilidad que un post de LinkedIn de un CMO.',
      },
      {
        heading: 'La Estrategia Karma-First',
        type: 'pattern',
        content:
          'Antes de publicar cualquier cosa sobre tu trabajo, construye karma a través de contribución pura. Esto sirve dos propósitos: aprendes la cultura de la comunidad y estableces credibilidad que hace bienvenidas tus futuras contribuciones.\n\nSemana 1-2: Solo comenta. Sin posts. Encuentra 3-5 subreddits relevantes a tu experiencia. Ordena por New. Encuentra preguntas que puedas responder con profundidad genuina. Escribe comentarios de 200-500 palabras que realmente resuelvan problemas. Apunta a 5-10 comentarios por día.\n\nSemana 3-4: Continúa comentando. Empieza a notar qué estilos de comentarios reciben upvotes vs son ignorados. Cada subreddit tiene su propia voz. r/ClaudeAI recompensa la especificidad técnica. r/Entrepreneur recompensa consejos prácticos respaldados por números. r/SaaS recompensa feedback honesto de producto. Iguala la voz.\n\nMes 2: Deberías tener 500+ karma. Ahora puedes empezar a publicar posts. Pero los posts deben ser 90% valor, 10% personal. "Así es como resolví el problema X" supera a "Mira mi herramienta que resuelve X." El primero recibe upvotes. El segundo se elimina.\n\nContinuamente: mantén una proporción de 10:1. Por cada vez que menciones tu trabajo, proporciona valor 10 veces sin mencionarlo. Esta proporción te mantiene en buena posición con los moderadores y la comunidad.',
      },
      {
        heading: 'Eligiendo los Subreddits Correctos',
        type: 'pattern',
        content:
          'La selección de subreddits determina tus resultados. Organiza tus subreddits objetivo por niveles:\n\nNivel 1 - Alta relevancia, comunidad activa (publica y comenta frecuentemente): subreddits donde tu ICP exacto pasa tiempo. Para builders de IA: r/ClaudeAI, r/CursorAI, r/LocalLLaMA. Para GTM: r/sales, r/coldemail, r/SaaS. Para contenido: r/content_marketing, r/Entrepreneur.\n\nNivel 2 - Relevancia adyacente (comenta cuando sea relevante): subreddits donde tu audiencia existe pero el tema es más amplio. r/webdev, r/startups, r/SideProject, r/selfhosted.\n\nNivel 3 - Engagement ocasional (comenta solo en hilos virales): subreddits grandes donde los hilos virales ocasionalmente tocan tu experiencia. r/technology, r/artificial, r/programming.\n\nLee las reglas de cada subreddit antes de participar. Muchos tienen reglas estrictas de autopromoción (cero tolerancia), restricciones de tipo de contenido (sin posts de enlaces, solo texto) y mínimos de karma para publicar. Violar las reglas hace que tu post sea eliminado y puede resultar en un ban.\n\nEvita subreddits con menos de 5,000 miembros (demasiado pequeños para resultados significativos) o más de 5 millones de miembros (demasiado amplios, tu experiencia se pierde).',
      },
      {
        heading: 'Comentarios que Reciben Upvotes',
        type: 'formula',
        content:
          'La anatomía de un comentario de alto rendimiento en Reddit:\n\nLidera con la respuesta. No la construyas poco a poco. Los usuarios de Reddit escanean. Pon la información más valiosa primero.\n\nAgrega experiencia personal. "Me encontré con exactamente este problema la semana pasada" establece credibilidad inmediatamente. Sigue con la solución específica.\n\nIncluye detalles específicos. Nombres de herramientas, números de versión, pasos exactos, fragmentos de código, ajustes de configuración. Los consejos vagos se ignoran. Los consejos específicos se guardan y reciben upvotes.\n\nReconoce limitaciones. "Esto funcionó para mi caso de uso pero podría no funcionar si estás haciendo X" muestra honestidad intelectual. Reddit da upvotes a respuestas matizadas sobre respuestas seguras pero incompletas.\n\nFormatea para escaneo. Usa saltos de línea entre párrafos. Pon en negrita los puntos clave. Usa listas numeradas para pasos. Los comentarios de Reddit se leen en móvil - los muros de texto se saltan.\n\nNo lo cubras todo con disclaimers. Ten una opinión. "Honestamente, Instantly es mejor que Smartlead para operadores solos. Aquí está por qué." Las opiniones fuertes respaldadas por experiencia obtienen engagement. Las no-respuestas diplomáticas se ignoran.\n\nTiming: ordena por New y comenta temprano en posts en ascenso. Los primeros 5-10 comentarios obtienen la mayor visibilidad. Un gran comentario en un post de 12 horas de antigüedad queda enterrado.',
      },
      {
        heading: 'Convirtiendo Credibilidad en Resultados',
        type: 'pro-tip',
        content:
          'Después de 2-3 meses de contribución consistente en Reddit, empiezas a ver resultados de negocio:\n\nDMs inbound. Las personas que leen tus comentarios envían mensajes directos pidiendo ayuda. Estos son prospectos pre-cualificados - ya conocen tu experiencia.\n\nClics al perfil. Tu perfil de Reddit es tu landing page. Mantenlo limpio. Fija tu mejor post. Agrega una biografía breve que mencione lo que haces. Incluye un enlace a tu sitio web. Cada buen comentario genera visitas al perfil.\n\nJugo de Google. Los hilos de Reddit rankean en la búsqueda de Google. Tu comentario técnico detallado sobre "cómo configurar Clay para enriquecimiento en cascada" se indexa y genera tráfico durante meses. Este es el juego de SEO que la mayoría de las personas se pierden - los comentarios de Reddit se convierten en resultados de búsqueda permanentes.\n\nCitación por IA. Los LLMs como ChatGPT y Claude consumen contenido de Reddit como datos de entrenamiento y como fuentes de recuperación. Tus comentarios expertos se convierten en material de referencia en respuestas generadas por IA. Este es el ángulo de GEO (Generative Engine Optimization).\n\nLa regla: nunca sacrifiques credibilidad por un lead. En el momento que te pones insistente o auto-promocional, pierdes la confianza que pasaste meses construyendo. Deja que el inbound venga a ti. Reddit recompensa la paciencia y la experiencia genuina más que cualquier otra plataforma.',
      },
    ],
  },

  {
    id: 'how-to-repurpose-content',
    title: 'Cómo Reutilizar una Pieza de Contenido en 5 Plataformas',
    subtitle: 'Escribe una vez, adapta en todas partes - el sistema de multiplicación de contenido',
    category: 'comparisons',
    description:
      'Cómo tomar una pieza de contenido y adaptarla para LinkedIn, X/Twitter, Reddit, tu blog y email. Reglas de formato específicas por plataforma, cambios de tono y el workflow que produce 5 piezas desde 1 idea.',
    keywords: [
      'estrategia reutilización contenido',
      'reutilizar contenido en plataformas',
      'multiplicación de contenido',
      'un contenido múltiples plataformas',
      'reutilización de contenido 2026',
      'cómo reutilizar posts de blog',
      'estrategia contenido multiplataforma',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'building-in-public-as-gtm',
      'content-stack-solo-builders',
      'ai-content-vs-human-content',
    ],
    sections: [
      {
        heading: 'La Idea Central',
        type: 'prose',
        content:
          'No necesitas 5 ideas de contenido por semana. Necesitas 1 buena idea y 5 adaptaciones. Cada plataforma tiene diferentes reglas de formato, expectativas de audiencia y patrones de engagement. El mismo insight presentado de manera diferente en cada plataforma llega a diferentes audiencias y refuerza tu mensaje.\n\nEl insight clave: reutilizar no es copiar. Pegar el mismo texto en LinkedIn, X, Reddit, tu blog y email es perezoso y funciona mal. Cada plataforma necesita una versión diseñada para su audiencia y formato específico. La idea se mantiene igual. El empaquetado cambia.',
      },
      {
        heading: 'Paso 1: Comienza con el Post del Blog',
        type: 'code',
        content:
          'El post del blog es tu material fuente de formato largo. Escríbelo una vez con profundidad completa: 800-1500 palabras, experiencia personal, ejemplos específicos y conclusiones accionables. Esta es la versión canónica que vive permanentemente en tu sitio web.\n\nPor qué empezar con el blog: es el formato más detallado. Toda otra adaptación elimina detalles. Es más fácil comprimir que expandir. Escribir la versión completa primero asegura que tienes todo el material que necesitas para cada plataforma.\n\nBono de SEO: el post del blog rankea en Google. Los posts sociales no. Empezar con el blog significa que tu mejor contenido vive donde los motores de búsqueda pueden encontrarlo. Los posts sociales generan atención. El blog captura el tráfico de búsqueda que esos posts sociales generan.\n\nEjemplo: construiste una nueva feature esta semana. El post del blog cubre el problema, la solución, el enfoque técnico, lo que aprendiste y qué sigue. 1200 palabras. Esto se convierte en la fuente para todo lo demás.',
      },
      {
        heading: 'Paso 2: Versión LinkedIn (Insight Profesional)',
        type: 'pattern',
        content:
          'Extrae el insight clave y el ángulo personal. Elimina la profundidad técnica. Agrega enmarcado profesional.\n\nFormato: 150-250 palabras. Párrafos cortos (1-2 oraciones cada uno). Espacio en blanco entre líneas. Gancho en la primera línea. Historia personal o resultado sorprendente. Termina con una pregunta que invite comentarios.\n\nCambio de tono: LinkedIn quiere "lo que aprendí" no "cómo lo hice." El blog dice "aquí está la implementación técnica." LinkedIn dice "aquí está el insight de negocio de construir esto."\n\nEjemplo de adaptación: El blog dice "Construimos enriquecimiento de email en cascada en Clay con 3 proveedores y validación MX, logrando 82% de cobertura de email." LinkedIn dice "La mayoría de los equipos se conforman con 55% de cobertura de email de un solo proveedor. Nosotros alcanzamos 82% apilando 3 proveedores en secuencia. Ese 27% extra se traduce en 270 conversaciones cualificadas más por cada 1,000 leads. Esa es la diferencia entre una herramienta y un sistema."\n\nSin enlaces en el cuerpo del post. LinkedIn suprime posts con enlaces externos. Pon el enlace del blog en el primer comentario si quieres compartirlo.',
      },
      {
        heading: 'Paso 3: Versión X/Twitter (Opinión Afilada)',
        type: 'pattern',
        content:
          'Extrae el punto más opinionado o sorprendente. Hazlo punzante.\n\nFormato de tweet individual: una opinión afilada, menos de 280 caracteres. "El enriquecimiento de email de un solo proveedor te da 55% de cobertura. El enriquecimiento en cascada te da 82%. La mayoría de los equipos dejan el 27% de su pipeline sobre la mesa."\n\nFormato de hilo: 5-10 tweets desglosando el insight. Cada tweet debe funcionar de manera independiente. Comienza con el gancho, construye el argumento, termina con la conclusión accionable.\n\nCambio de tono: X quiere convicción. Sin matices excesivos. Sin "depende." Toma una posición. "El enriquecimiento en cascada es no negociable en 2026. Aquí está por qué:" La especificidad y la confianza es lo que gana engagement en X.\n\nInteractúa en respuestas después de publicar. El hilo funciona mejor cuando respondes a cada respuesta en la primera hora. Esto señala engagement al algoritmo.',
      },
      {
        heading: 'Pasos 4 y 5: Comentario en Reddit + Email',
        type: 'pattern',
        content:
          'Reddit: no publiques tu contenido como un post independiente de Reddit (a menos que tengas karma significativo en ese subreddit). En su lugar, encuentra hilos donde la gente está discutiendo el mismo problema que tu post de blog resuelve. Escribe un comentario detallado compartiendo tu experiencia y solución. Sin enlace al blog. Solo el insight, formateado para Reddit con saltos de línea y detalles específicos.\n\nTono de Reddit: humilde, específico, útil. "Nos encontramos con este mismo problema. Esto es lo que nos funcionó:" seguido de los detalles prácticos. Reddit recompensa la ayuda genuina, no la promoción de contenido.\n\nNewsletter por email: el post completo del blog o una versión condensada enviada a tu lista de suscriptores. El formato de email permite un enmarcado más personal - "Esta semana construí algo que me sorprendió..." Los lectores de email ya han optado por participar, así que puedes ser más directo sobre tu trabajo.\n\nTono de email: conversacional, como escribiendo a un amigo. Menos formal que LinkedIn, menos punzante que X, más personal que el blog. Incluye el CTA que no puedes poner en otro lado - "responde a este email si quieres la plantilla de Clay."\n\nEl tiempo total: 60-90 minutos para escribir el blog. 15 minutos para adaptación de LinkedIn. 10 minutos para adaptación de X. 15 minutos para comentarios en Reddit. 15 minutos para formateo de email. Menos de 2.5 horas para 5 piezas de contenido en 5 plataformas.',
      },
    ],
  },

  {
    id: 'how-to-build-voice-system',
    title: 'Cómo Construir un Sistema de Voz para Contenido con IA',
    subtitle: 'Enseña a tu IA a escribir como tú - no como todos los demás',
    category: 'comparisons',
    description:
      'Cómo construir un sistema de voz que haga que el contenido generado por IA suene como tú. Archivos de Voice DNA, filtros anti-slop, playbooks específicos por plataforma y las puertas de calidad que previenen la producción genérica de IA.',
    keywords: [
      'sistema de voz IA',
      'voz escritura IA',
      'voz contenido IA',
      'enseñar a IA tu voz',
      'personalización contenido IA',
      'estilo escritura IA',
      'voz de marca IA',
      'contenido IA anti-slop',
    ],
    difficulty: 'advanced',
    canonicalSite: 'contentos',
    related: [
      'ai-content-vs-human-content',
      'how-to-repurpose-content',
      'mcp-content-stack',
    ],
    sections: [
      {
        heading: 'Por Qué la Voz Importa para el Contenido de IA',
        type: 'prose',
        content:
          'La IA escribe con una voz predeterminada. Es competente, pulida y completamente genérica. Cada post de blog, email y publicación en redes sociales generado por IA suena igual porque los modelos optimizan para el promedio de sus datos de entrenamiento.\n\nUn sistema de voz anula el predeterminado. En lugar de producción genérica de IA, obtienes contenido que suena como una persona específica con opiniones específicas, vocabulario específico y patrones específicos. Tu audiencia no puede distinguir si lo escribiste tú o lo escribió tu IA porque la IA ha sido entrenada en tu voz.\n\nEsto no es prompt engineering. Un prompt dice "escribe en un tono casual." Un sistema de voz proporciona 50 patrones específicos, 29 anti-patrones, reglas específicas por plataforma y un proceso de puerta de calidad que detecta desviaciones. La diferencia es la brecha entre "sé casual" y una guía de estilo integral.',
      },
      {
        heading: 'Capa 1: Voice DNA Central',
        type: 'pattern',
        content:
          'La base es un archivo de Voice DNA - un documento que captura tus patrones de escritura. No descripciones abstractas ("cálido y amigable") sino patrones específicos y concretos:\n\nEstructura de oraciones: "Usa oraciones cortas. 8-12 palabras en promedio. Divide ideas complejas en múltiples declaraciones cortas. Nunca oraciones compuestas con tres o más cláusulas."\n\nPreferencias de vocabulario: "Di \'enviar\' no \'entregar.\' Di \'construir\' no \'desarrollar.\' Di \'funciona\' no \'opera.\' Di \'se rompe\' no \'encuentra errores.\'"\n\nPatrones de apertura: "Comienza con una declaración, no una pregunta. Sin preguntas retóricas. Lidera con la afirmación más específica, no el contexto más amplio."\n\nHábitos de puntuación: "Usa guiones para apartes - así. Sin punto y coma. Sin declaraciones entre paréntesis. Sin em dashes en copy orientado al cliente, usa guiones con espacios en su lugar."\n\nNivel de abstracción: "Siempre incluye un ejemplo específico dentro de 2 oraciones de cualquier afirmación. Sin declaraciones abstractas sin prueba concreta."\n\nConstruye esto analizando 20+ piezas de tu propia escritura. Encuentra los patrones. Escríbelos como reglas explícitas que la IA pueda seguir.',
      },
      {
        heading: 'Capa 2: Filtros Anti-Slop',
        type: 'formula',
        content:
          'La capa anti-slop detecta patrones de IA que no coinciden con tu voz. Cada modelo de IA tiene comportamientos predeterminados que se filtran si no se controlan:\n\nFrases prohibidas: mantén una lista de frases que nunca usas pero que la IA ama generar. "En el mundo acelerado de hoy." "Vale la pena señalar." "Al final del día." "Profundicemos." "Apalancar." "Utilizar." "Aprovechar." Cada frase prohibida es una bandera roja de que la IA ha regresado a su voz predeterminada.\n\nAnti-patrones estructurales: "Nunca empieces 3+ párrafos consecutivos con la misma palabra." "Nunca uses una lista donde un párrafo funciona mejor." "Nunca uses palabras de transición como Además, Adicionalmente, Más aún."\n\nRequisitos de sustancia: "Cada afirmación necesita al menos 2 de estos 5: ejemplo específico, detalle técnico, razonamiento mostrado, resultado concreto o lección aprendida." Esto previene que la IA haga aseveraciones vagas.\n\nLa regla de las 3 banderas: si un borrador activa 3 o más banderas anti-slop, reescríbelo desde cero. No lo parchees. Parchear crea contenido Frankenstein que se lee como mitad humano, mitad IA.\n\nMantén la lista anti-slop como un documento vivo. Cada vez que detectes un nuevo patrón de IA en tus borradores, agrégalo a la lista. Después de 3 meses, tienes un filtro completo que atrapa casi todo.',
      },
      {
        heading: 'Capa 3: Playbooks por Plataforma',
        type: 'pattern',
        content:
          'Tu voz se adapta por plataforma. Escribes diferente en LinkedIn que en Reddit. Captura esas adaptaciones en playbooks específicos por plataforma:\n\nPlaybook de LinkedIn: tono profesional, estructura insight-first, enmarcado de resultados de negocio, sin jerga sin explicación, CTA como pregunta.\n\nPlaybook de X: punzante, opinionado, convicción sobre matiz, una idea por tweet, sin lenguaje de cobertura.\n\nPlaybook de Reddit: humilde, específico, útil, consciente de la comunidad, sin enmarcado auto-promocional, profundidad técnica bienvenida.\n\nPlaybook de Blog: completo, estructurado con encabezados claros, integración de palabras clave consciente del SEO, narrativa personal tejida a través del contenido técnico.\n\nPlaybook de Email: conversacional, directo, en primera persona, incluye contexto que el lector necesita para actuar.\n\nCada playbook es un documento de una página que la IA lee antes de generar contenido para esa plataforma. La voz central se mantiene consistente. La presentación se adapta.',
      },
      {
        heading: 'Poniéndolo Todo Junto',
        type: 'pro-tip',
        content:
          'El sistema de voz completo se carga en secuencia:\n\n1. El archivo de Voice DNA central se carga primero (patrones base)\n2. Los filtros anti-slop se cargan segundo (puertas de calidad)\n3. El playbook de plataforma se carga tercero (reglas de adaptación)\n4. Se genera el contenido\n5. Se ejecuta el proceso de puerta de calidad: verificación de slop, verificación de especificidad, verificación de profundidad, verificación de voz\n\nAlmacena estos archivos en tu repo para que cada sesión de IA tenga acceso. En Claude Code, referéncialos desde tu CLAUDE.md o cárgalos como skills. En otras herramientas, inclúyelos en el system prompt o contexto del proyecto.\n\nEl efecto compuesto: después de 3 meses de usar el sistema de voz, tu contenido generado por IA es indistinguible de tu contenido escrito por humanos. Los lectores no pueden notar la diferencia. Las tasas de engagement son las mismas. Pero estás produciendo 5x el volumen al 20% de la inversión de tiempo.\n\nEl mantenimiento: revisa el sistema de voz mensualmente. Tu voz evoluciona. Nuevos patrones emergen. Los patrones antiguos se desvanecen. Actualiza el archivo de DNA para que coincida con tu voz actual, no la voz que tenías hace 6 meses.\n\nComienza simple: un archivo de Voice DNA de 50 líneas, una lista anti-slop de 30 elementos y un playbook de plataforma. Expande desde ahí a medida que notes patrones que el sistema no detecta.',
      },
    ],
  },

  {
    id: 'content-stack-solo-builders',
    title: 'El Stack Completo de Contenido para Solo Builders en 2026',
    subtitle: 'Todas las herramientas que necesitas para crear, publicar y distribuir contenido solo',
    category: 'comparisons',
    description:
      'El stack completo de tecnología de contenido para solo builders en 2026. Escritura, programación, analytics, SEO y herramientas de distribución con precios y el orden de construcción que te pone a publicar más rápido.',
    keywords: [
      'stack contenido solo builder',
      'herramientas contenido 2026',
      'herramientas creador solo',
      'stack creación contenido',
      'mejores herramientas creadores contenido 2026',
      'herramientas publicación contenido',
      'herramientas distribución contenido',
      'estrategia contenido solo builder',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'ai-content-vs-human-content',
      'how-to-build-voice-system',
    ],
    sections: [
      {
        heading: 'El Stack Mínimo Viable',
        type: 'prose',
        content:
          'Necesitas cuatro capas: crear (escribir el contenido), publicar (ponerlo en tu sitio web), distribuir (llevarlo a las plataformas sociales) y medir (saber qué está funcionando). La mayoría de los solo builders se exceden con herramientas. Se registran en 10 apps, pasan un mes configurándolas y no publican nada.\n\nLa regla: empieza con la herramienta más barata que funcione. Actualiza cuando encuentres un cuello de botella real, no cuando veas un demo atractivo. Cada herramienta que agregas es mantenimiento que cargas.',
      },
      {
        heading: 'Capa 1: Creación',
        type: 'pattern',
        content:
          'Escritura: Claude Code o ChatGPT para redacción asistida por IA, más tu editor de código para el producto final. Si tu contenido vive en archivos markdown en un repo (y debería), tu editor de código es tu CMS.\n\nDiseño: Figma (tier gratuito) para gráficos, imágenes OG y tarjetas sociales. Canva como alternativa más simple. Para generación programática de imágenes, Remotion o Satori generan imágenes desde componentes React en tiempo de build.\n\nVideo: Remotion si eres desarrollador (renderizado de video basado en React). CapCut para ediciones rápidas. Loom para grabaciones de pantalla. La mayoría de los solo builders no necesitan video - empieza con texto y agrega video cuando haya demanda.\n\nSistema de voz: tu archivo de Voice DNA + filtros anti-slop (archivos de texto en tu repo, cargados en el contexto de IA). Costo cero. Máximo impacto en la calidad del contenido.\n\nCosto total de la capa de creación: $0-20/mes. Las herramientas de IA son el único costo potencial, y Claude Pro a $20/mes cubre todo.',
      },
      {
        heading: 'Capa 2: Publicación',
        type: 'pattern',
        content:
          'Sitio web: Next.js desplegado en Vercel (el tier gratuito maneja la mayoría del tráfico de solo builders). Tu blog vive en archivos markdown. Las páginas se generan en tiempo de build. No se necesita CMS - tu repo de Git es tu CMS.\n\nAlternativa: Substack si quieres saltarte la configuración técnica por completo. Audiencia integrada, entrega de email y descubrimiento. La contrapartida: no eres dueño de la plataforma y el control de SEO es limitado.\n\nInfraestructura de SEO: next-sitemap para generación automática de sitemap. Schema markup (JSON-LD) para rich snippets. Robots.txt con allowlisting de crawlers de IA. Feeds RSS para sindicación de contenido. Google Search Console para indexación y seguimiento de rendimiento.\n\nDominio y hosting: un dominio ($12/año), DNS en Cloudflare (gratis), hosting en Vercel (tier gratuito). Total: $1/mes.\n\nLa decisión clave: ser dueño de tu publicación o alquilarla. Substack es fácil pero alquilado. Un sitio Next.js es más difícil pero propio. Si estás construyendo a largo plazo, sé dueño de tu plataforma. Los beneficios de SEO por sí solos valen el tiempo de configuración.',
      },
      {
        heading: 'Capa 3: Distribución',
        type: 'pattern',
        content:
          'LinkedIn: publica directamente desde la app. No se necesita herramienta de programación cuando publicas 3-5 veces por semana manualmente. Si quieres programación: Typefully ($12/mes) o Buffer (tier gratuito para 3 canales).\n\nX/Twitter: Typefully para programar hilos y tweets individuales. El sistema de borradores es mejor que el nativo de X para componer hilos. El tier gratuito funciona para empezar.\n\nReddit: solo manual. Sin herramientas de automatización. Reddit detecta y banea la publicación automatizada. Abre el subreddit, encuentra hilos relevantes, escribe comentarios genuinos. 15-30 minutos por día.\n\nNewsletter por email: Substack (gratis), Buttondown (tier gratuito) o Beehiiv (tier gratuito). Si tu blog es tu plataforma principal, envía un resumen semanal enlazando a nuevos posts. Mantén la lista de email activa aunque los números sean pequeños.\n\nProgramación de contenido: Typefully maneja LinkedIn y X en una herramienta. Eso cubre las dos plataformas programables. Reddit y email son manuales.\n\nCosto total de la capa de distribución: $0-12/mes.',
      },
      {
        heading: 'Capa 4: Medición',
        type: 'pattern',
        content:
          'Analytics del sitio web: PostHog (tier gratuito, 1M eventos/mes) o Plausible ($9/mes). Google Analytics funciona pero es más pesado de lo que la mayoría de los solo builders necesitan. PostHog te da seguimiento de eventos, funnels y grabaciones de sesión en una herramienta.\n\nSeguimiento de SEO: Google Search Console (gratis). Rastrea impresiones, clics, posición promedio y qué consultas generan tráfico. Revisa semanalmente. Esto te dice de qué contenido crear más.\n\nAnalytics de redes sociales: cada plataforma tiene analytics integrados. LinkedIn muestra impresiones y engagement por post. X muestra impresiones, tasa de engagement y visitas al perfil. Reddit muestra karma y vistas de comentarios.\n\nQué rastrear semanalmente: total de visitantes al sitio web, top 5 páginas por tráfico, top 5 consultas de búsqueda que generan tráfico, posts sociales con mejor rendimiento y tasa de apertura de email. Eso es todo. No midas de más.\n\nCosto total de la capa de medición: $0-9/mes.\n\nCosto del stack completo: $0-41/mes. Ese es el costo de infraestructura de contenido que compite con equipos que gastan $5,000+/mes en herramientas. La ventaja de ser un solo builder: no necesitas herramientas empresariales. Necesitas enfoque y consistencia.',
      },
    ],
  },

  {
    id: 'how-to-use-ai-content-creation',
    title: 'Cómo Usar IA para Creación de Contenido Sin Sonar Como IA',
    subtitle: 'El workflow que produce contenido auténtico a 5x la velocidad',
    category: 'comparisons',
    description:
      'Guía práctica para usar IA en la creación de contenido manteniendo la autenticidad. El método input-output, carga de voz, workflows de edición y las técnicas específicas que hacen que el contenido de IA sea indistinguible de la escritura humana.',
    keywords: [
      'creación contenido IA',
      'cómo usar IA para contenido',
      'consejos escritura IA',
      'contenido IA sin sonar como IA',
      'contenido IA auténtico',
      'workflow contenido IA',
      'workflow escritura IA 2026',
      'guía creación contenido IA',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'ai-content-vs-human-content',
      'how-to-build-voice-system',
      'content-stack-solo-builders',
      'how-to-repurpose-content',
    ],
    sections: [
      {
        heading: 'El Método Input-Output',
        type: 'prose',
        content:
          'La calidad del contenido de IA es una función de la calidad del input. Input genérico ("escribe un post de blog sobre herramientas de IA") produce output genérico. Input específico produce output específico.\n\nEl método: dale a la IA tres cosas antes de pedirle que escriba. Primero, tu experiencia - la historia, resultado o insight específico de tu trabajo real. Segundo, tu voz - los patrones, vocabulario y estilo que quieres. Tercero, el formato - la plataforma, longitud, estructura y audiencia.\n\nCon los tres inputs, la IA produce contenido que se lee como tuyo. Sin ellos, produce contenido que se lee como de todos los demás.',
      },
      {
        heading: 'Paso 1: Alimenta Tu Experiencia',
        type: 'pattern',
        content:
          'El fallo más común del contenido de IA: pedirle que escriba sobre algo que no has hecho. La IA puede investigar y sintetizar, pero no puede fabricar experiencia auténtica. La solución es proporcionar tu experiencia como input.\n\nAntes de generar contenido, escribe un brain dump en bruto. No escritura pulida - solo notas. "Esta semana probé enriquecimiento en cascada en Clay. Usé Apollo, Prospeo y Dropcontact en secuencia. Obtuve 82% de cobertura de email vs 55% de Apollo solo. Tomó 2 horas configurar. Los créditos costaron aproximadamente $1.50 por lead. El gotcha fue la validación MX - sin ella, el 8% de los emails eran dominios malos."\n\nEse brain dump son 60 palabras de experiencia cruda. La IA lo convierte en una sección de blog pulida de 500 palabras con tus números específicos, tus herramientas específicas y tu gotcha específico. No puede inventar la cifra del 82% o el insight de validación MX. Esos vienen de ti.\n\nRegla: nunca publiques contenido de IA sobre algo que no hayas hecho personalmente. Usa la IA como acelerador de escritura, no como reemplazo de escritura.',
      },
      {
        heading: 'Paso 2: Carga Tu Voz',
        type: 'pattern',
        content:
          'Antes de que la IA escriba, carga tu sistema de voz en el contexto de la conversación. En Claude Code, esto significa que el CLAUDE.md referencia tu archivo de Voice DNA, o lo cargas explícitamente al inicio de una sesión de contenido.\n\nCarga mínima viable de voz: "Escribe en oraciones cortas. Promedio 10 palabras. Sin lenguaje de cobertura. Sin frases como \'vale la pena señalar\' o \'en el panorama actual.\' Usa números específicos sobre calificadores vagos. Comienza con afirmaciones, luego pruébalas. Energía en minúsculas - sin signos de exclamación, sin hype."\n\nEso son 50 palabras de instrucción de voz que cambian dramáticamente la calidad del output. La IA deja de escribir en su voz predeterminada pulida-pero-genérica y empieza a escribir en tus patrones.\n\nPara mejores resultados: carga tu archivo completo de Voice DNA con 30+ reglas específicas. Cuantos más patrones proporciones, más cercano es el output a tu escritura natural. El punto óptimo son 50-100 reglas que cubran vocabulario, estructura de oraciones, preferencias de formato y patrones de contenido.',
      },
      {
        heading: 'Paso 3: Edita Como Humano, No Como Revisor',
        type: 'pattern',
        content:
          'La IA te da un borrador. Ahora hazlo tuyo. La pasada de edición es donde el contenido de IA se convierte en contenido auténtico.\n\nPrimera pasada - verificación de verdad: ¿cada afirmación es precisa? ¿La IA agregó detalles que no proporcionaste? La IA a veces confabula - agrega específicos plausibles pero falsos. Elimina cualquier cosa que no puedas verificar.\n\nSegunda pasada - verificación de voz: léelo en voz alta. ¿Suena como tú? Marca cada oración que suene a "la IA escribió esto" y reescríbela. Usualmente son las transiciones y las oraciones de apertura/cierre las que necesitan más toque humano.\n\nTercera pasada - agrega la textura: inyecta los detalles que solo tú conoces. La dificultad inesperada. La herramienta que casi funcionó pero tenía un bug que rompía el deal. La métrica que te sorprendió. Estas texturas son lo que hace que el contenido se sienta humano.\n\nCuarta pasada - corta la grasa: la IA escribe más de lo necesario. Explica cosas que los lectores ya saben. Agrega disclaimers que debilitan el argumento. Corta 20-30% del borrador. El contenido más conciso funciona mejor en cada plataforma.\n\nLa edición toma 15-30 minutos por pieza. La escritura tomó 3 minutos. Tiempo total: 20-35 minutos para una pieza que tomaría 90-120 minutos escribir desde cero.',
      },
      {
        heading: 'La Prueba de Autenticidad',
        type: 'pro-tip',
        content:
          'Antes de publicar, ejecuta la prueba de autenticidad. Tres preguntas:\n\n1. ¿Alguien más podría haber escrito esto? Si sí, necesita más experiencia personal. Agrega tus resultados específicos, tus herramientas específicas, tus fracasos específicos. Haz que sea imposible para alguien que no ha hecho tu trabajo producir este contenido.\n\n2. ¿Dirías esto en voz alta a un colega? Si el lenguaje se siente rígido o formal, todavía tiene residuo de IA. Reescribe las oraciones rígidas de la manera en que realmente lo explicarías en conversación.\n\n3. ¿Hace una afirmación que defenderías? Si hay una declaración sobre la que dudarías en una conversación en vivo, fortalécela con evidencia o elimínala. La IA ama hacer afirmaciones amplias. Tu contenido solo debería hacer afirmaciones que hayas ganado a través de la experiencia.\n\nSi la pieza pasa las tres, publícala. Si no, una pasada más de edición enfocándote en las preguntas que falló.\n\nEl objetivo no es ocultar que usaste IA. El objetivo es producir contenido que refleje tu experiencia real, entregado más rápido de lo que podrías escribirlo manualmente. Cuando la experiencia es real y la voz es tuya, la herramienta usada para producirlo es irrelevante.',
      },
    ],
  },
  {
    id: 'cli-ecosystem-overview',
    title: 'El Ecosistema CLI',
    subtitle: 'Por que el acceso CLI es clave y como cada herramienta GTM importante converge hacia flujos de trabajo terminal-first',
    category: 'cli-tools',
    description:
      'Panorama del ecosistema CLI para ingenieros GTM. HubSpot CLI, Salesforce CLI, Attio CLI, Vercel CLI, y por que el CLI de lenguaje natural a traves de Claude Code lo cambia todo.',
    keywords: [
      'herramientas cli para gtm',
      'hubspot cli',
      'salesforce cli',
      'vercel cli',
      'claude code cli',
      'herramientas de terminal para ventas',
      'cli de lenguaje natural',
      'cli vs gui',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-vs-mcp-tools',
      'claude-code-quickstart',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Por Que el Acceso CLI Es lo Mas Importante',
        type: 'prose',
        content:
          'Cada plataforma importante esta lanzando un CLI. HubSpot tiene hs. Salesforce tiene sf. Vercel tiene vercel. Attio esta construyendo uno. Cargo.ai expone su pipeline a traves de comandos CLI. El patron es claro: el futuro del acceso a herramientas es la terminal, no el navegador.\n\nPor que esto importa para ingenieros GTM: acceso CLI significa scriptabilidad. Cualquier cosa que puedas escribir una vez, puedes automatizarla para siempre. Un comando CLI para extraer datos de pipeline se convierte en un cron job que se ejecuta cada manana. Un comando CLI para crear un contacto se convierte en un script de importacion masiva. Un comando CLI para verificar el estado de una campana se convierte en un bot de Slack.\n\nLos MCPs nos dieron la primera ola de acceso programatico. Pero los MCPs consumen ventanas de contexto. Cada definicion de herramienta MCP consume tokens. Un MCP de HubSpot con 30 definiciones de herramientas quema contexto antes de que hagas tu primera pregunta. Un binario CLI en tu maquina cuesta cero contexto. Lo llamas cuando lo necesitas y devuelve resultados.',
      },
      {
        heading: 'El Panorama CLI Actual',
        type: 'pattern',
        content:
          'HubSpot CLI (hs): gestiona objetos CRM, lista deals, crea contactos, extrae reportes. Todavia madurando pero funcional para operaciones basicas.\n\nSalesforce CLI (sf): el CLI GTM mas maduro. Despliega metadata, consulta SOQL, gestiona organizaciones, ejecuta tests. De nivel enterprise y probado en batalla.\n\nVercel CLI (vercel): despliega sitios, gestiona variables de entorno, verifica el estado de builds, monitorea logs. Esencial para cualquiera que despliegue en Vercel.\n\nAttio CLI: en etapa temprana pero prometedor. Operaciones CRM desde la terminal. Lee y escribe registros, gestiona listas, busca contactos.\n\nClaude Code: este es el meta-CLI. Envuelve todos los demas CLI. En lugar de memorizar sf data query "SELECT Id FROM Account", le dices a Claude Code "extrae todas las cuentas creadas esta semana de Salesforce" y el escribe y ejecuta el comando sf por ti. Acceso CLI de lenguaje natural a cada herramienta que tenga un CLI.',
      },
      {
        heading: 'CLI de Lenguaje Natural a Traves de Claude Code',
        type: 'pro-tip',
        content:
          'Este es el insight que lo cambia todo. No necesitas memorizar la sintaxis CLI. Claude Code lee la documentacion, construye el comando, lo ejecuta e interpreta la salida. Tu trabajo es describir la intencion. El agente traduce la intencion a comandos.\n\n"Verifica si nuestro despliegue en Vercel tuvo exito" se convierte en vercel ls --json | jq. "Encuentra todos los contactos de HubSpot agregados ayer" se convierte en hs contacts list --created-after. "Consulta Salesforce por oportunidades abiertas de mas de 50k" se convierte en la consulta SOQL correcta canalizada a traves de sf.\n\nEl efecto compuesto: cada nuevo CLI que se lanza se vuelve instantaneamente accesible a traves de Claude Code. Sin curva de aprendizaje. Sin documentacion que leer. Describe lo que quieres, deja que el agente descifre la sintaxis. Por eso el acceso CLI importa mas que el acceso GUI. Las GUIs requieren ojos humanos y clics. Los CLIs requieren texto de entrada y texto de salida. Los agentes de IA estan construidos para texto de entrada y texto de salida.',
      },
      {
        heading: 'Configurando Tu Stack CLI',
        type: 'code',
        content:
          'Comienza con los CLIs que realmente usas. No instales todo de una vez.\n\nbrew install vercel - si despliegas en Vercel\nnpm install -g @hubspot/cli - si usas HubSpot\nnpm install -g @salesforce/cli - si usas Salesforce\npip install attio-cli - cuando este disponible\n\nCada CLI tiene un paso de autenticacion. Generalmente oauth o una API key. Ejecuta el comando de autenticacion una vez y almacena las credenciales localmente. Despues de eso, cada comando se autentica automaticamente.\n\nLa prueba: abre Claude Code y di "usa el Vercel CLI para mostrarme mis despliegues recientes." Si funciona, tu stack CLI esta conectado. Si falla, verifica que el CLI este en tu PATH y autenticado.',
      },
    ],
  },

  {
    id: 'posthog-for-gtm',
    title: 'PostHog para Ingenieros GTM',
    subtitle: 'Analitica open-source con mas precision que GA o HubSpot para seguimiento ABM',
    category: 'cli-tools',
    description:
      'Como usar PostHog para analitica GTM. Seguimiento ABM basado en eventos, creacion de dashboards con lenguaje natural a traves de PostHog MCP, analisis de embudos, y por que PostHog te da una precision que las herramientas tradicionales no pueden igualar.',
    keywords: [
      'posthog gtm',
      'seguimiento abm posthog',
      'analitica posthog',
      'posthog mcp',
      'posthog claude code',
      'analitica de producto para ventas',
      'analitica abm',
      'posthog vs google analytics',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'abm-personalization-architecture',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Por Que PostHog para GTM',
        type: 'prose',
        content:
          'Google Analytics te dice "50 personas visitaron tu pagina de precios." PostHog te dice "3 personas de Acme Corp visitaron tu landing page /for/acme, leyeron el 80% de la seccion de caso de estudio, hicieron clic en la calculadora de ROI dos veces, y se fueron sin reservar. Una regreso al dia siguiente desde un anuncio de LinkedIn."\n\nEse nivel de detalle cambia como ejecutas ABM. Dejas de adivinar que cuentas estan comprometidas y empiezas a saberlo. PostHog esta basado en eventos. Cada interaccion es un evento estructurado con propiedades. Tu defines lo que importa y PostHog lo captura con contexto completo.\n\nEl angulo open-source tambien importa. Tus datos de analitica se quedan contigo. Sin dependencia de proveedor. Auto-alojamiento si la soberania de datos es un requisito. La version cloud es gratuita hasta 1 millon de eventos por mes, lo cual cubre la mayoria de las operaciones GTM.',
      },
      {
        heading: 'Arquitectura de Eventos ABM',
        type: 'pattern',
        content:
          'Define eventos que se mapean a las etapas de tu embudo ABM:\n\nabm_page_view - alguien llega a una landing page personalizada. Propiedades: company slug, fuente de referencia, parametros UTM.\n\nabm_section_read - profundidad de scroll en secciones clave. Propiedades: nombre de seccion, tiempo dedicado, porcentaje visualizado.\n\nabm_cta_click - cualquier interaccion de llamada a la accion. Propiedades: tipo de CTA (reservar demo, descargar, contactar), ubicacion en la pagina.\n\nabm_form_submit - envios de formulario completados. Propiedades: tipo de formulario, empresa, puntuacion de lead al momento del envio.\n\nCon estos cuatro eventos, construyes un embudo de engagement ABM completo. Filtra por empresa. Filtra por periodo de tiempo. Ve exactamente que cuentas se estan calentando y cuales se enfriaron.',
      },
      {
        heading: 'Claude Code + PostHog MCP',
        type: 'pro-tip',
        content:
          'El PostHog MCP conecta Claude Code directamente a tu instancia de analitica. Esto significa consultas en lenguaje natural contra tus datos.\n\n"Muestrame que empresas visitaron nuestras landing pages ABM esta semana" - Claude consulta PostHog, agrega por company slug, devuelve una lista clasificada.\n\n"Construye un embudo desde abm_page_view a abm_cta_click a abm_form_submit" - Claude crea el embudo en PostHog y devuelve tasas de conversion en cada etapa.\n\n"Que secciones de landing page obtienen mas engagement?" - Claude consulta eventos de profundidad de scroll, agrupa por seccion, y clasifica por tiempo promedio dedicado.\n\nSin SQL. Sin constructor de dashboards. Describe la pregunta, obtiene la respuesta. Esta es la capa de analitica de lenguaje natural que hace PostHog accesible para ingenieros GTM que no son analistas de datos.',
      },
      {
        heading: 'Configuracion en 15 Minutos',
        type: 'code',
        content:
          'Paso 1: Crea una cuenta de PostHog en posthog.com. El plan gratuito cubre 1M eventos/mes.\n\nPaso 2: Agrega el snippet de PostHog a tu sitio. Para Next.js, usa el paquete posthog-js. Inicializa en tu app layout con tu API key del proyecto.\n\nPaso 3: Define eventos personalizados. En tus componentes de landing page ABM, agrega posthog.capture("abm_page_view", { company: slug, source: utm_source }). Haz lo mismo para profundidad de scroll, clics en CTA y envios de formulario.\n\nPaso 4: Conecta PostHog MCP a Claude Code. Agrega la configuracion del servidor PostHog MCP con tu API key. Prueba con "lista mis eventos recientes de PostHog."\n\nPaso 5: Construye tu primer dashboard. Dile a Claude Code "crea un dashboard de PostHog mostrando visitas a landing pages ABM por empresa este mes." El construye el dashboard a traves del MCP. Listo.',
      },
    ],
  },

  {
    id: 'claude-code-co-work',
    title: 'Sesiones de Co-Work con Claude Code',
    subtitle: 'Sesiones de carpeta compartida con flujos de trabajo, scripts y contexto compartido entre miembros del equipo',
    category: 'cli-tools',
    description:
      'Como las sesiones de co-work de Claude Code cambian la colaboracion en equipo. Contexto de carpeta compartida, playbooks activos vs documentos pasivos, y por que el repositorio se convierte en la incorporacion.',
    keywords: [
      'claude code co-work',
      'claude code equipo',
      'programacion en pareja con ia',
      'contexto compartido ia',
      'colaboracion claude code',
      'sesiones de co-work',
      'sesiones de carpeta claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'parallel-session-handoffs',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'Que Son las Sesiones de Co-Work',
        type: 'prose',
        content:
          'Una sesion de co-work es una instancia de Claude Code apuntando a una carpeta compartida. Todos en el equipo obtienen el mismo contexto: las mismas reglas CLAUDE.md, las mismas habilidades, los mismos archivos de datos, el mismo sistema de voz. No es una sala de chat. Es un entorno operativo compartido donde la IA ya ha leido tus playbooks.\n\nLa diferencia con la colaboracion tradicional: los documentos de Notion estan en una pestana del navegador que nadie tiene abierta. Una pagina de Confluence se escribe una vez y se olvida. Una carpeta de co-work esta activa. La IA la lee en cada inicio de sesion. Cada flujo de trabajo es ejecutable, no solo documentado. Cada playbook se ejecuta, no solo explica.',
      },
      {
        heading: 'Como Deberian Estar Trabajando los SDRs Ahora',
        type: 'pattern',
        content:
          'Crea una carpeta con: CLAUDE.md (reglas del equipo, voz, filtros anti-slop), scripts/ (crons de enriquecimiento, scoring de leads, automatizacion de campanas), skills/ (generacion de outreach, compilacion de investigacion, revision de pipeline), data/ (cuentas objetivo, resultados de enriquecimiento, metricas de campana).\n\nUn nuevo SDR se une. Abre Claude Code en la carpeta. El CLAUDE.md se carga automaticamente. Dice "investiga Acme Corp para outbound" y el agente ejecuta la habilidad de investigacion, extrae de Exa, enriquece a traves de Apollo, verifica en Attio el historial existente, y produce un brief de investigacion. El SDR no leyo un solo documento. La carpeta fue la incorporacion.\n\nEste es el modelo de playbook activo. Documentacion que se ejecuta. Contexto que se acumula. Cada sesion se construye sobre sesiones anteriores a traves de archivos de handoff y memoria.',
      },
      {
        heading: 'Configurando una Carpeta de Equipo',
        type: 'code',
        content:
          'Crea un repositorio. Estructuralo:\n\nCLAUDE.md - reglas del equipo, preferencias de modelo, sistema de voz\n.claude/skills/ - una habilidad por flujo de trabajo (investigacion, outreach, reportes)\nscripts/ - scripts de automatizacion que las habilidades invocan\ndata/ - archivos de datos compartidos (listas de objetivos, resultados de enriquecimiento)\ntasks/ - seguimiento de tareas y lecciones aprendidas\n\nCada miembro del equipo clona el repositorio y ejecuta Claude Code desde la raiz. El CLAUDE.md establece el contexto compartido. Las habilidades proporcionan flujos de trabajo consistentes. Los archivos de datos mantienen a todos trabajando desde la misma fuente de verdad.\n\nEl insight clave: el repositorio ES la base de conocimiento del equipo. No un wiki separado. No un espacio de trabajo en Notion. La misma carpeta que ejecuta la automatizacion tambien documenta la automatizacion. Codigo y documentacion viven juntos.',
      },
      {
        heading: 'Playbooks Activos vs Documentos Pasivos',
        type: 'pro-tip',
        content:
          'Documento pasivo: "Para investigar a un prospecto, revisa LinkedIn, mira su financiamiento reciente, revisa su stack tecnologico en BuiltWith, y resume los hallazgos en un Google Doc."\n\nPlaybook activo: un archivo de habilidad que Claude Code lee y ejecuta. Revisa LinkedIn a traves del navegador, extrae datos de financiamiento de Exa, consulta BuiltWith a traves de la API, y escribe el resumen en la carpeta de investigacion del repositorio. El mismo flujo de trabajo. Uno requiere que un humano siga pasos. El otro requiere que un humano diga "investiga esta empresa."\n\nCada documento pasivo en tu organizacion es un candidato para un playbook activo. El proceso de conversion: identifica los pasos, escribelos como una habilidad, prueba la habilidad, despliega en la carpeta compartida. La documentacion se convierte en la automatizacion.',
      },
    ],
  },

  {
    id: 'github-repo-evaluation',
    title: 'Como Evaluar Repositorios de GitHub',
    subtitle: 'Nunca instales un repositorio sin mas. Usa Claude Code para interrogar, comparar y seleccionar lo mejor.',
    category: 'cli-tools',
    description:
      'El enfoque de recursive drift para evaluar repositorios de GitHub. Como usar Claude Code para comparar repos con tu stack, identificar patrones utiles y seleccionar sin instalacion ciega.',
    keywords: [
      'evaluar repositorio github',
      'evaluacion de repositorio github',
      'revision de repo con claude code',
      'como evaluar open source',
      'comparacion de repositorios github',
      'seleccionar patrones de codigo',
      'evaluacion recursive drift',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-ecosystem-overview',
      'claude-code-quickstart',
      'context-engineering-vs-prompt-engineering',
    ],
    sections: [
      {
        heading: 'Nunca Solo Instales',
        type: 'prose',
        content:
          'Alguien comparte un enlace de GitHub. El movimiento por defecto: clonarlo, npm install, esperar que funcione. El movimiento de recursive drift: pedir a Claude Code que lo lea primero.\n\nLa mayoria de los repos que encuentras son 80% irrelevantes para tu caso de uso. Resuelven un problema mas amplio del que tienes, usan un stack diferente, o toman decisiones arquitectonicas que entran en conflicto con las tuyas. Instalar a ciegas significa heredar sus dependencias, sus patrones y su deuda tecnica.\n\nEl mejor enfoque: lee el codigo, entiende los patrones, toma lo que te sirve, deja el resto. Claude Code hace esto rapido. Apuntalo a un repo y lee todo en segundos.',
      },
      {
        heading: 'Las Tres Preguntas',
        type: 'pattern',
        content:
          'Cuando encuentras un repo, preguntale a Claude Code tres cosas:\n\n1. "Como se compara esto con lo que ya tengo?" Claude lee tanto tu codebase como el suyo. Identifica superposicion, brechas y conflictos. Quiza resolvieron un problema que tu todavia resuelves manualmente. Quiza usan una biblioteca que es mejor que la tuya. Quiza su enfoque es peor. Necesitas la comparacion antes de decidir nada.\n\n2. "Como puede ayudarme esto? Que deberia seleccionar?" No "instalar todo" sino "que patrones, funciones o enfoques especificos vale la pena adoptar?" Quiza su manejo de errores es mejor. Quiza su patron de obtencion de datos es mas limpio. Selecciona esas cosas especificas.\n\n3. "Cuales son los riesgos de adoptar esto?" Dependencias que entran en conflicto con las tuyas. Restricciones de licencia. Estado de mantenimiento - esta activamente mantenido o abandonado? Claude verifica el historial de commits, issues abiertos y versiones de dependencias.',
      },
      {
        heading: 'Aprender Leyendo Codigo',
        type: 'pro-tip',
        content:
          'El beneficio oculto de la evaluacion de repos: aprendes mas rapido leyendo codigo real que leyendo tutoriales. Un tutorial te muestra el camino feliz. Un repo de produccion te muestra los casos limite, el manejo de errores, las optimizaciones de rendimiento y las decisiones arquitectonicas.\n\nConviertelo en un habito. Cuando alguien menciona una herramienta o framework, encuentra un repo que lo use. Pide a Claude Code que te guie por las partes interesantes. Absorbes patrones sin la carga de construir un proyecto de juguete.\n\nEl efecto compuesto: despues de evaluar 20 repos, tienes una biblioteca mental de patrones. Empiezas a reconocer buena arquitectura a simple vista. Sabes que bibliotecas vale la pena adoptar porque las has visto en codigo de produccion. Leer codigo es el camino mas rapido para escribir mejor codigo.',
      },
    ],
  },

  {
    id: 'cron-jobs-for-scraping',
    title: 'Cron Jobs para Scraping de Ofertas de Empleo',
    subtitle: 'Scripts en Python como cron jobs para scraping de bolsas de trabajo y deteccion de senales',
    category: 'cli-tools',
    description:
      'Como construir cron jobs en Python que hacen scraping de bolsas de trabajo para deteccion de senales. Programacion con launchd, alimentar datos scrapeados en la segmentacion ABM, y construir un pipeline de senales de contratacion.',
    keywords: [
      'cron job scraping',
      'scraping de bolsas de trabajo',
      'python cron job',
      'launchd cron',
      'deteccion de senales abm',
      'pipeline de senales de contratacion',
      'automatizacion de scraping de empleo',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'abm-personalization-architecture',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'Por Que las Bolsas de Trabajo Son Senales',
        type: 'prose',
        content:
          'Una empresa que publica "Head of RevOps" es una senal. Estan construyendo una funcion de operaciones de ingresos. Una empresa que publica "SDR Manager" es una senal. Estan escalando outbound. Una empresa que publica "Data Engineer" con "Clay" en los requisitos es una senal. Estan construyendo infraestructura de datos GTM.\n\nLas ofertas de empleo son datos de intencion publica. La empresa le esta diciendo al mundo exactamente que estan construyendo y que habilidades necesitan. Si tu producto o servicio se alinea con lo que estan buscando, esa es una senal calida. El problema: las bolsas de trabajo tienen miles de nuevas publicaciones diariamente. El monitoreo manual no escala. Los cron jobs si.',
      },
      {
        heading: 'El Pipeline de Scraping',
        type: 'pattern',
        content:
          'Paso 1: Script en Python que consulta APIs de bolsas de trabajo o hace scraping de listados. Apunta a bolsas relevantes para tu ICP: LinkedIn Jobs API, Indeed, paginas de Greenhouse, paginas de Lever. Filtra por palabras clave que indiquen intencion de compra para tu producto.\n\nPaso 2: Analiza y normaliza los resultados. Extrae nombre de la empresa, titulo del puesto, fecha de publicacion, requisitos clave. Almacena en un formato estructurado - JSON o SQLite.\n\nPaso 3: Enriquece. Cruza nombres de empresas con tus registros existentes de Attio. Verifica si ya estan en tu pipeline. Si son nuevos, ejecuta Apollo para datos firmograficos.\n\nPaso 4: Puntua y enruta. Empresas que publican 3+ roles relevantes en 30 dias obtienen una puntuacion mas alta que publicaciones unicas. Enruta senales de alta puntuacion a tu lista de objetivos ABM.',
      },
      {
        heading: 'Programacion con launchd',
        type: 'code',
        content:
          'En macOS, cron esta deprecado a favor de launchd. Crea un archivo plist en ~/Library/LaunchAgents/ que ejecute tu script de Python en un horario.\n\nEl plist define: que script ejecutar (ProgramArguments), cuando ejecutarlo (StartCalendarInterval o StartInterval), donde registrar la salida (StandardOutPath, StandardErrorPath), y si ejecutar al cargar (RunAtLoad).\n\nUna configuracion tipica: ejecutar el scraper cada 6 horas. Eso captura nuevas publicaciones sin sobrecargar la fuente. El script escribe resultados en data/signals/job-postings.json. Un cron diario separado lee ese archivo, deduplica, enriquece nuevas entradas, y envia senales calificadas a Attio.\n\nManten el scraping y el enriquecimiento como trabajos separados. Si el scraper falla, no pierdes los resultados de enriquecimiento de ayer. Si el enriquecimiento falla, no pierdes los resultados de scraping de hoy. Los pipelines desacoplados son pipelines resilientes.',
      },
      {
        heading: 'Alimentando Senales en ABM',
        type: 'pro-tip',
        content:
          'Las ofertas de empleo sin procesar son ruido. Las ofertas de empleo enriquecidas y puntuadas son senales. El paso de enriquecimiento transforma "Acme Corp publico un puesto de Head of RevOps" en "Acme Corp (Serie B, 150 empleados, usando Salesforce y Outreach, $12M ARR) esta construyendo una funcion de RevOps. Publicaron 3 roles GTM en las ultimas 2 semanas. Sin relacion existente en Attio."\n\nEsa senal enriquecida alimenta directamente tu segmentacion ABM. Construye una landing page personalizada referenciando su desarrollo de RevOps. Redacta outreach que conecte tu solucion con su patron especifico de contratacion. La oferta de empleo te dio la apertura. El enriquecimiento te dio el contexto. El pipeline ABM convierte ambos en una conversacion.',
      },
    ],
  },

  {
    id: 'agent-building-tools',
    title: 'Herramientas para Construir y Desplegar Agentes',
    subtitle: 'Cargo.ai, LangChain, Railway, Trigger.dev - el stack de infraestructura de agentes',
    category: 'deployment-tools',
    description:
      'Panorama de las herramientas para construir y desplegar agentes de IA. Cargo.ai para orquestacion GTM, LangChain para frameworks de agentes, Railway para hosting, Trigger.dev para trabajos en segundo plano, y como los SDK kits aceleran el despliegue.',
    keywords: [
      'despliegue de agentes ia',
      'herramientas para construir agentes',
      'despliegue de langchain',
      'railway agentes ia',
      'trigger.dev agentes',
      'cargo ai gtm',
      'hosting de agentes',
      'infraestructura de agentes',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
    ],
    sections: [
      {
        heading: 'El Stack de Infraestructura de Agentes',
        type: 'prose',
        content:
          'Construir un agente es la parte facil. Hacerlo funcionar de manera confiable en produccion es la parte dificil. Cuatro herramientas cubren el stack:\n\nCargo.ai maneja la orquestacion GTM. Flujos de trabajo multi-agente para enriquecimiento, scoring y enrutamiento. Mas de 50 integraciones listas para usar. Si tu pipeline de agentes implica mover datos entre herramientas GTM, Cargo.ai proporciona la fontaneria.\n\nLangChain proporciona el framework de agentes. Chains, memoria, uso de herramientas, retrieval. Construye tu logica de agente en Python o JavaScript usando patrones probados en batalla en lugar de llamadas API crudas.\n\nRailway proporciona el hosting. Procesos de larga duracion, bases de datos, workers en segundo plano. Tu agente vive aqui y se ejecuta tanto tiempo como necesite.\n\nTrigger.dev proporciona la orquestacion. Ejecuciones programadas, triggers basados en eventos, reintentos, manejo de fallos. La capa de confiabilidad que asegura que tu agente realmente se ejecute cuando debe.',
      },
      {
        heading: 'Eligiendo la Herramienta Correcta',
        type: 'pattern',
        content:
          'Si necesitas orquestacion de datos GTM (waterfalls de enriquecimiento, enrutamiento de leads, sincronizacion CRM): comienza con Cargo.ai. Esta construido especificamente para esto y te ahorra meses de desarrollo personalizado.\n\nSi necesitas logica de agente personalizada (compilacion de investigacion, generacion de contenido, cadenas de razonamiento complejas): usa LangChain. Te da los bloques de construccion para cualquier patron de agente.\n\nSi necesitas hosting persistente (agentes siempre activos, bases de datos, APIs): usa Railway. Despliega desde un push de GitHub, escala segun sea necesario.\n\nSi necesitas programacion confiable (trabajos tipo cron con reintentos y monitoreo): usa Trigger.dev. Agrega la capa de confiabilidad que los cron jobs basicos carecen.\n\nLa mayoria de los despliegues de agentes en produccion usan 2-3 de estos juntos. Logica de agente LangChain, desplegada en Railway, orquestada por Trigger.dev. O Cargo.ai para el pipeline de datos, con agentes LangChain personalizados para los pasos de investigacion que Cargo.ai no cubre nativamente.',
      },
      {
        heading: 'SDK Kits e Inicios Rapidos',
        type: 'code',
        content:
          'Cada proveedor de hosting ofrece SDK kits que reducen el tiempo de despliegue. Railway tiene plantillas para agentes LangChain, backends FastAPI y workers cron. Trigger.dev tiene starter kits para patrones de trabajos comunes. Cargo.ai tiene plantillas de flujo de trabajo pre-construidas para enriquecimiento y enrutamiento.\n\nEl patron: elige una plantilla que coincida con tu caso de uso. Hazle fork. Personaliza la logica. Despliega. Te saltas el boilerplate (Dockerfile, gestion de procesos, health checks, logging) y te enfocas en la logica del agente que es unica para tu caso de uso.\n\nPara ingenieros GTM que no son especialistas en DevOps, los SDK kits son la diferencia entre "podria construir esto en un fin de semana" y "podria construir esto en una tarde." La infraestructura esta resuelta. Tu trabajo es la logica de negocio.',
      },
      {
        heading: 'Lista de Verificacion para Produccion',
        type: 'pro-tip',
        content:
          'Antes de desplegar un agente a produccion:\n\n1. Manejo de errores: que pasa cuando una llamada API falla? El agente deberia reintentar, registrar el fallo y continuar con el siguiente elemento. Nunca dejes que una mala respuesta API tumbe toda la ejecucion.\n\n2. Limitacion de tasa: respeta los limites de API. Agrega retrasos entre llamadas. Usa backoff exponencial en reintentos. Ser limitado por tasa y reintentar inmediatamente lo empeora.\n\n3. Observabilidad: registra cada paso. Cuando el agente se ejecuta a las 3 AM y algo sale mal, los logs son la unica forma de depurarlo. Trigger.dev te da esto gratis. En Railway, usa logging estructurado.\n\n4. Controles de costos: establece limites de gasto en API keys. Un bug en un loop puede quemar tus creditos de Apollo en minutos. Limita el gasto a nivel de API, no solo en tu codigo.\n\n5. Idempotencia: ejecutar el agente dos veces deberia producir el mismo resultado. Si enriquece un lead que ya esta enriquecido, deberia saltar, no duplicar.',
      },
    ],
  },

  {
    id: 'abm-landing-pages',
    title: 'Construyendo Landing Pages ABM con Claude Code',
    subtitle: 'La habilidad /landing-page: investigar, construir, desplegar en /for/{slug}',
    category: 'abm-pipeline',
    description:
      'Como construir landing pages ABM personalizadas con Claude Code. El flujo de trabajo de la habilidad /landing-page, personalizacion alimentada por CRM, enlaces SEO bidireccionales, y despliegue en /for/{slug}.',
    keywords: [
      'landing page abm',
      'landing page personalizada',
      'claude code landing page',
      'personalizacion abm',
      '/for/ landing page',
      'hubspot landing page ia',
      'constructor de landing page ia',
      'constructor de paginas abm',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'abm-personalization-architecture',
      'posthog-for-gtm',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'La Habilidad de Landing Page',
        type: 'prose',
        content:
          'La habilidad /landing-page hace tres cosas: investiga la empresa objetivo, construye una pagina personalizada y la despliega. El resultado es una pagina en vivo en /for/{company-slug} en thegtmos.ai.\n\nLa fase de investigacion extrae datos de Exa (inteligencia web), Apollo (firmograficos), y Attio (historial CRM existente). La fase de construccion genera un componente React con los puntos de dolor especificos de la empresa, casos de estudio relevantes, y propuestas de valor a medida. La fase de despliegue hace push a GitHub, activa un build de Vercel, y la pagina esta en vivo en menos de 2 minutos.\n\nEsto no es una plantilla con un cambio de logo. Cada pagina tiene contenido unico basado en investigacion real. El stack tecnologico de la empresa, financiamiento reciente, patrones de contratacion y panorama competitivo informan cada seccion. Un humano podria construir esta pagina en 4-6 horas. La habilidad la construye en 5 minutos.',
      },
      {
        heading: 'Personalizacion Alimentada por CRM',
        type: 'pattern',
        content:
          'La siguiente evolucion: conectar Claude Code a HubSpot o Attio para que las landing pages extraigan datos del CRM. Si ya tienes notas de deals, historial de conversaciones y datos de engagement de una cuenta, la landing page deberia reflejar ese contexto.\n\nPatrones que funcionan:\n- Cuenta con un deal abierto: la landing page enfatiza el caso de uso especifico que discutieron con tu equipo de ventas.\n- Cuenta que se enfrio: la landing page aborda las objeciones probables con pruebas actualizadas.\n- Cuenta de un evento: la landing page referencia el evento y el tema especifico que les intereso.\n- Cuenta completamente nueva: la landing page usa personalizacion a nivel de industria basada en datos firmograficos.\n\nLos datos del CRM determinan la profundidad de personalizacion. Mas datos, paginas mas especificas. Menos datos, paginas mas a nivel de industria. Ambas superan a las landing pages genericas por 3-5x en metricas de engagement.',
      },
      {
        heading: 'Valor SEO de las Paginas ABM',
        type: 'pro-tip',
        content:
          'Las landing pages ABM no son activos desechables. Generan valor SEO a traves de enlaces bidireccionales.\n\nCada pagina /for/{slug} enlaza de vuelta a tus paginas principales de producto, guias how-to, y casos de estudio. Esas paginas enlazan hacia adelante a landing pages relevantes. El grafo de enlaces internos crece con cada nueva pagina de cuenta.\n\nLas paginas tambien apuntan a keywords de cola larga de forma natural. "/for/acme" apunta a busquedas de "acme + tu categoria de producto". Cuando los empleados de Acme buscan tu producto en Google, encuentran una pagina construida especificamente para ellos. Esa pagina tiene contenido mas relevante que tu homepage generica.\n\nEl valor de backlinks se acumula. 50 paginas ABM crean 50 nuevos nodos en el grafo de tu sitio, cada uno con 5-10 enlaces internos. Eso son 250-500 nuevos enlaces internos fortaleciendo la autoridad de dominio general.',
      },
    ],
  },

  {
    id: 'abm-personalization-architecture',
    title: 'Arquitectura de Personalizacion ABM',
    subtitle: 'Personalizacion impulsada por senales desde el primer contacto hasta la conversion',
    category: 'abm-pipeline',
    description:
      'La arquitectura completa de personalizacion ABM. Deteccion de senales, RAG para due diligence, grafos de enlaces bidireccionales, y el embudo desde la senal hasta la conversion.',
    keywords: [
      'arquitectura abm',
      'personalizacion abm',
      'marketing impulsado por senales',
      'embudo abm',
      'arquitectura de account based marketing',
      'deteccion de senales abm',
      'pipeline de personalizacion',
      'embudo de conversion abm',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'abm-landing-pages',
      'posthog-for-gtm',
      'cron-jobs-for-scraping',
      'agency-evaluation-checklist',
    ],
    sections: [
      {
        heading: 'El Movimiento ABM',
        type: 'prose',
        content:
          'ABM no es una herramienta. Es una decision arquitectonica. En lugar de transmitir a todos y esperar que las personas correctas respondan, identificas cuentas especificas, las investigas a fondo, y construyes experiencias personalizadas para cada una.\n\nEl enfoque tradicional: marketing genera MQLs, ventas los califica, la mayoria son basura. El enfoque ABM: ventas y marketing acuerdan las cuentas objetivo de antemano, construyen contenido personalizado y outreach para cada una, y miden el engagement a nivel de cuenta.\n\nLa arquitectura que soporta esto tiene cuatro capas: deteccion de senales (a quien apuntar), investigacion y enriquecimiento (que decir), entrega personalizada (como decirlo), y seguimiento de engagement (funciono). Cada capa esta automatizada. Cada capa alimenta datos a la siguiente.',
      },
      {
        heading: 'Capa de Deteccion de Senales',
        type: 'pattern',
        content:
          'Las senales te dicen cuando comprometerte. Tipos de senales:\n\nSenales de contratacion: ofertas de empleo que indican presupuesto e intencion. "Contratando un RevOps Manager" significa que estan construyendo infraestructura que tu podrias soportar.\n\nSenales de financiamiento: rondas recientes significan que existe presupuesto. Las empresas Serie A estan construyendo. Las empresas Serie B estan escalando. Ambas necesitan cosas diferentes.\n\nSenales de stack tecnologico: empresas adoptando herramientas adyacentes a las tuyas son compradores naturales. Si acaban de adoptar Salesforce y tu vendes integraciones de Salesforce, el timing es correcto.\n\nSenales de engagement: visitas al sitio web, descargas de contenido, interacciones sociales. PostHog rastrea estas con precision. Una empresa visitando tu sitio 5 veces en una semana sin convertir necesita outreach personalizado, no otro email de nurture.\n\nLos cron jobs escanean senales diariamente. Scrapers de bolsas de trabajo, consultas de inteligencia web con Exa, alertas de engagement de PostHog. Senales frescas cada manana.',
      },
      {
        heading: 'RAG para Due Diligence',
        type: 'pattern',
        content:
          'Una vez que tienes una senal, necesitas contexto. RAG transforma senales crudas en investigacion accionable.\n\nEl pipeline: extrae el contenido del sitio web de la empresa (Exa), noticias recientes (Exa), ofertas de empleo (scraper), stack tecnologico (BuiltWith o similar), datos firmograficos (Apollo), y cualquier historial CRM existente (Attio). Alimenta todo en el contexto de Claude. Pide un brief de due diligence.\n\nEl resultado: un documento de investigacion estructurado con panorama de la empresa, puntos de dolor relevantes, senales de compra, objeciones potenciales, y enfoque recomendado. Este brief alimenta el constructor de landing pages personalizadas y la habilidad de generacion de outreach.\n\nSin RAG, el outreach es generico. "Note que estan creciendo y pense..." Con RAG, el outreach es especifico. "Sus 3 nuevas contrataciones de RevOps y la reciente adopcion de Salesforce sugieren que estan construyendo la infraestructura de datos para soportar sus objetivos de crecimiento Serie B. Asi es como ayudamos a una empresa similar a reducir su tiempo de construccion de pipeline en un 60%."',
      },
      {
        heading: 'El Grafo de Enlaces Bidireccional',
        type: 'formula',
        content:
          'Cada activo ABM crea conexiones:\n\nLanding page en /for/{slug} enlaza a: guias how-to relevantes, casos de estudio, paginas de producto, publicaciones de blog.\n\nGuias how-to enlazan a: landing pages relacionadas, otras guias, terminos de conocimiento.\n\nPublicaciones de blog enlazan a: landing pages de empresas mencionadas, guias how-to de herramientas discutidas, terminos de conocimiento de conceptos explicados.\n\nTerminos de conocimiento enlazan a: guias how-to, publicaciones de blog, landing pages.\n\nCada nuevo activo fortalece cada activo existente. El grafo se acumula. 50 landing pages, 30 guias how-to, 20 publicaciones de blog, y 80 terminos de conocimiento crean una red de miles de enlaces internos. Los motores de IA ven cobertura integral. Los motores de busqueda ven autoridad tematica. Los visitantes encuentran contenido relevante en cada pagina.\n\nEsto no es construccion de enlaces. Es arquitectura de contenido. Los enlaces surgen naturalmente de las relaciones de datos. Los objetos de datos TypeScript definen las conexiones. Las plantillas renderizan los enlaces. No se requiere enlazado manual.',
      },
    ],
  },

  {
    id: 'team-security-cloud-guardrails',
    title: 'Barreras de Seguridad para Equipos en la Nube',
    subtitle: 'Proteccion de ramas, gestion de secretos y control de acceso para equipos que despliegan agentes',
    category: 'security',
    description:
      'Barreras de seguridad para equipos que despliegan agentes de IA en infraestructura cloud. Operaciones locales vs cloud para operaciones sensibles, gestion de repositorios, Claude Code como capa de seguridad, y proteccion de sistemas de produccion.',
    keywords: [
      'seguridad de agentes ia',
      'barreras de seguridad cloud',
      'proteccion de ramas ia',
      'gestion de secretos ia',
      'seguridad claude code',
      'seguridad de equipo cloud',
      'seguridad de despliegue de agentes',
      'mejores practicas de seguridad ia',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'ai-security-myths',
      'constraints-and-context-engines',
      'env-files-explained',
    ],
    sections: [
      {
        heading: 'La Arquitectura de Seguridad',
        type: 'prose',
        content:
          'Los agentes de IA con acceso a sistemas de produccion necesitan barreras de proteccion. No restricciones paranoicas que los hagan inutiles, sino limites practicos que prevengan errores catastroficos.\n\nLa arquitectura tiene tres capas. Primero, que se ejecuta localmente vs que se ejecuta en la nube. Las operaciones sensibles - gestion de API keys, migraciones de base de datos, rotacion de secretos - se quedan en maquinas locales donde tienes control fisico. Las cargas de trabajo de agentes que procesan datos y generan salida se ejecutan en la nube donde escalan.\n\nSegundo, protecciones a nivel de repositorio. Las reglas de proteccion de ramas previenen que los agentes hagan push directamente a main. Las revisiones requeridas aseguran que un humano vea cada cambio antes de que llegue a produccion. Los hooks pre-push escanean secretos, API keys, y datos identificables de partners antes de que nada salga de tu maquina.\n\nTercero, barreras de ejecucion en Claude Code mismo. Las reglas del CLAUDE.md definen lo que el agente puede y no puede hacer. El agente respeta estas reglas porque se cargan en el contexto al inicio de la sesion.',
      },
      {
        heading: 'Local vs Cloud para Operaciones Sensibles',
        type: 'pattern',
        content:
          'Mantener local: archivos .env, rotacion de API keys, credenciales de base de datos, SSH keys, datos de partners, cualquier cosa que seria catastrofica si se filtra.\n\nEnviar a la nube: codigo de agentes, definiciones de flujo de trabajo, datos procesados (anonimizados), contenido generado, artefactos de despliegue.\n\nLa regla: si los datos existen en un solo lugar (tu maquina) y filtrarlos significa llamar a cada cliente, mantenlos locales. Si los datos son generados o derivados y perderlos significa re-ejecutar un script, pueden ir a la nube.\n\nPara agentes en Railway o similar: pasa secretos como variables de entorno en el dashboard del hosting. Nunca los hagas commit. Nunca los registres en logs. Nunca los incluyas en mensajes de error. El codigo del agente referencia process.env.API_KEY, no la clave real.',
      },
      {
        heading: 'Proteccion de Ramas y Revision',
        type: 'code',
        content:
          'Configuraciones de proteccion de ramas en GitHub para equipos con agentes de IA:\n\n1. Requerir revisiones de pull request antes de fusionar a main. Incluso si el agente escribio el codigo, un humano lo revisa.\n\n2. Requerir que los status checks pasen. Ejecuta tu suite de tests y escaneo de seguridad antes de cualquier merge.\n\n3. Requerir que las ramas esten actualizadas antes de fusionar. No fusiones de ramas obsoletas que crean conflictos.\n\n4. Restringir quien puede hacer push a main. Los agentes hacen push a ramas de feature. Los humanos fusionan a main.\n\nLos hooks pre-push agregan otra capa. El hook pre-push de Husky escanea cada commit buscando patrones que nunca deberian enviarse: API keys (cadenas que coinciden con patrones de claves), nombres de partners (de una lista de bloqueo local), contenidos de archivos .env, y archivos binarios grandes. El push falla si cualquier patron coincide.',
      },
      {
        heading: 'Claude Code como Capa de Seguridad',
        type: 'pro-tip',
        content:
          'Claude Code mismo aplica seguridad a traves de reglas CLAUDE.md. Esto esta subestimado.\n\nAgrega reglas como: "Nunca hagas commit de archivos .env. Nunca registres API keys en logs. Nunca incluyas nombres de partners en mensajes de commit. Siempre verifica .gitignore antes de agregar archivos. Ejecuta el escaneo de lista de bloqueo pre-push antes de cada push."\n\nEl agente sigue estas reglas porque estan en su contexto. Se convierte en un colaborador consciente de la seguridad. Cuando le dices que haga push de codigo, ejecuta el escaneo primero. Cuando le dices que agregue un archivo, verifica .gitignore primero. Cuando le dices que registre informacion de depuracion, redacta valores sensibles.\n\nEsto no es infalible. Es una capa en una estrategia de defensa en profundidad. Combinado con proteccion de ramas, hooks pre-push, y gestion de secretos, cubre los modos de fallo comunes donde los equipos accidentalmente filtran credenciales o envian datos sensibles.',
      },
    ],
  },

  {
    id: 'cli-vs-mcp-tools',
    title: 'Herramientas CLI vs Integraciones MCP',
    subtitle: 'Cuando usar acceso CLI vs MCP y por que la respuesta importa para las ventanas de contexto',
    category: 'comparisons',
    description:
      'Comparacion directa de herramientas CLI e integraciones MCP. Costo de ventana de contexto, diferencias de capacidad, que herramientas tienen CLIs vs MCPs vs ambos, y la tendencia de convergencia.',
    keywords: [
      'cli vs mcp',
      'mcp vs cli',
      'claude code cli mcp',
      'costo de ventana de contexto mcp',
      'comparacion de integracion mcp',
      'herramientas cli ia',
      'costo de servidor mcp',
      'convergencia cli mcp',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-ecosystem-overview',
      'what-are-mcps',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'La Compensacion Central',
        type: 'prose',
        content:
          'Los MCPs dan a los agentes de IA acceso directo a servicios externos. El agente llama a una herramienta, el servidor MCP maneja la solicitud API, y el resultado vuelve al contexto. Sin fricciones. Pero cada servidor MCP carga sus definiciones de herramientas en la ventana de contexto. Un MCP de HubSpot con 30 herramientas quema tokens solo por existir.\n\nLas herramientas CLI estan en tu maquina. Cero costo de contexto hasta que las usas. Cuando necesitas consultar HubSpot, Claude Code ejecuta el comando CLI hs y lee la salida. Las definiciones de herramientas no estan en el contexto - el agente construye el comando desde su conocimiento de entrenamiento.\n\nLa compensacion: los MCPs estan mas integrados pero son costosos en contexto. Los CLIs son mas ligeros pero requieren que el agente conozca la sintaxis CLI. Para operaciones simples, los CLIs ganan. Para flujos de trabajo complejos de multiples pasos donde el agente necesita descubrir herramientas disponibles, los MCPs ganan.',
      },
      {
        heading: 'Comparacion de Costo de Ventana de Contexto',
        type: 'formula',
        content:
          'Una comparacion aproximada:\n\nServidor MCP con 10 herramientas: ~2,000-4,000 tokens cargados en cada sesion. Ese es contexto que pagas uses o no esas herramientas.\n\nServidor MCP con 30 herramientas: ~8,000-12,000 tokens. Una porcion significativa de tu ventana de contexto gastada en definiciones de herramientas.\n\n5 servidores MCP simultaneamente: 20,000-50,000 tokens. Eso es 10-25% de una ventana de contexto de 200k consumida antes de que hagas una sola pregunta.\n\nEquivalente CLI: 0 tokens hasta ser invocado. Cuando Claude Code ejecuta un comando CLI, el comando y su salida entran al contexto. Una interaccion CLI tipica cuesta 200-500 tokens. Pagas por uso, no por carga.\n\nLa matematica es clara para herramientas que usas ocasionalmente. Si consultas HubSpot una vez por sesion, el CLI ahorra 3,500 tokens sobre el MCP. Si consultas HubSpot 20 veces por sesion, el MCP amortiza su costo y la ventaja de integracion gana.',
      },
      {
        heading: 'Que Herramientas Tienen Que',
        type: 'pattern',
        content:
          'Solo CLI: Vercel, Salesforce (sf), Homebrew, Git, la mayoria de herramientas Unix.\n\nSolo MCP: Slack, Attio (actualmente), PostHog, Browserbase, Substack.\n\nTanto CLI como MCP: HubSpot, GitHub (gh CLI + GitHub MCP), potencialmente Attio (CLI en desarrollo).\n\nLa tendencia: las herramientas estan lanzando ambos. El CLI para usuarios avanzados y scripts de automatizacion. El MCP para integracion con agentes de IA. Las herramientas que ofrecen ambos te dan la flexibilidad de elegir segun tu caso de uso.\n\nPara stacks GTM: la capa de enriquecimiento (Apollo, Clearbit, ZoomInfo) mayormente usa API keys directamente. La capa CRM (HubSpot, Salesforce, Attio) se esta moviendo a tanto CLI como MCP. La capa de outreach (Instantly, Lemlist, HeyReach) es mayormente MCP o solo API.',
      },
      {
        heading: 'La Convergencia',
        type: 'pro-tip',
        content:
          'La distincion entre CLI y MCP se esta disolviendo. Claude Code envuelve ambos. Cuando dices "verifica mis despliegues de Vercel," usa el CLI. Cuando dices "busca en mis canales de Slack," usa el MCP. No te importa que mecanismo usa. Te importa el resultado.\n\nEl futuro probablemente sea una capa de herramientas unificada donde Claude Code elige el mejor metodo de acceso para cada solicitud. CLI para consultas simples. MCP para interacciones complejas. Llamadas directas a la API para todo lo demas. El agente maneja el enrutamiento.\n\nPor ahora, el consejo practico: instala CLIs para herramientas que usas mucho (ahorra contexto). Configura MCPs para herramientas donde necesitas que el agente descubra capacidades (herramientas complejas con muchas operaciones). Usa ambos cuando esten disponibles y deja que Claude Code elija el correcto por solicitud.',
      },
    ],
  },

  {
    id: 'should-you-get-clay',
    title: 'Deberias Contratar Clay? Una Evaluacion Independiente de un Ingeniero Go-to-Market',
    subtitle: 'Un framework honesto para decidir si Clay es adecuado para tu stack GTM',
    category: 'tool-evaluation',
    description:
      'Evaluacion independiente de Clay para enriquecimiento y calificacion. Cuando vale la pena la inversion, cuando alternativas mas baratas funcionan, y las preguntas que un ingeniero go-to-market hace antes de recomendarlo.',
    keywords: [
      'evaluacion de enriquecimiento clay',
      'deberia usar clay',
      'alternativa a clay',
      'evaluacion de clay por ingeniero go-to-market',
      'clay vs enriquecimiento manual',
      'evaluacion de precios de clay',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'mcp-cli-litmus-test',
      'data-lake-for-gtm',
      'credit-transparency-gtm-tools',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'Que Hace Realmente Clay',
        type: 'prose',
        content:
          'Clay es una plataforma de enriquecimiento de datos que cascadea entre mas de 50 proveedores de datos para construir perfiles completos de leads. Le das un nombre de empresa o dominio, y extrae firmograficos, tecnograficos, ofertas de empleo, datos de financiamiento, informacion de contacto y mas. El enfoque de cascada significa que si el Proveedor A no tiene los datos, intenta el Proveedor B, luego el C. Obtienes mejor cobertura que cualquier proveedor individual.\n\nEl verdadero poder esta en la interfaz de tablas. Construyes flujos de trabajo visualmente - columnas de enriquecimiento alimentan formulas de calificacion, que alimentan logica de enrutamiento, que empuja a tus herramientas de outbound. Un ingeniero go-to-market usa Clay de la misma manera que un desarrollador usa una base de datos: datos estructurados de entrada, leads calificados de salida.\n\nPero ese poder tiene un costo. Los creditos de Clay se consumen por enriquecimiento, por hit de proveedor. Un solo lead puede quemar 5-15 creditos dependiendo de cuantas columnas ejecutes. A escala, esto se acumula rapido.',
      },
      {
        heading: 'Cuando Clay Vale la Pena',
        type: 'pattern',
        content:
          'Clay tiene sentido cuando tres condiciones son verdaderas. Primero, estas procesando mas de 100 leads por mes. Debajo de ese volumen, la investigacion manual o un solo proveedor de enriquecimiento es mas rapido y barato. Segundo, necesitas enriquecimiento de multiples fuentes - no solo busqueda de email sino puntuacion firmografica, senales tecnograficas, y datos de intencion combinados. Tercero, tienes a alguien que construira y mantendra las tablas. Clay no es una herramienta de configurar y olvidar. Es una plataforma que requiere un ingeniero go-to-market para operar.\n\nEl punto dulce son equipos procesando 200-2000 leads por mes con criterios complejos de ICP. Estas calificando en multiples dimensiones - tamano de empresa, stack tecnologico, etapa de financiamiento, senales de contratacion - y necesitas esas senales agregadas antes del outbound. Ahi es donde Clay ahorra horas de investigacion manual por dia.\n\nSi estas enviando emails frios a una lista comprada sin enriquecimiento mas alla de verificacion de email, Clay es excesivo. Un buscador de emails de $50/mes te lleva ahi.',
      },
      {
        heading: 'Cuando Omitir Clay',
        type: 'anti-pattern',
        content:
          'No compres Clay si no tienes a alguien que construya las tablas. Clay sin un constructor es como Salesforce sin un administrador - shelfware costoso. Este es el error numero uno que cometen las empresas. Ven el demo, se emocionan con el enriquecimiento en cascada, se registran, y luego se dan cuenta de que nadie en el equipo puede construir los flujos de trabajo.\n\nNo compres Clay si tu volumen de leads es menor de 100/mes. La tarifa de plataforma mas el consumo de creditos no se justifica a bajo volumen. Usa Apollo, Clearbit, o incluso investigacion manual en LinkedIn en su lugar.\n\nNo compres Clay si no estas midiendo el consumo de creditos. Clay quema creditos por columna de enriquecimiento, por hit de proveedor. Sin seguimiento, una sola actualizacion de tabla puede consumir todo tu presupuesto mensual de creditos. Un ingeniero go-to-market rastrea creditos por lead, por campana, y por proveedor. Si nadie esta mirando el medidor, vas a gastar de mas.',
      },
      {
        heading: 'El Framework de Evaluacion Independiente',
        type: 'pro-tip',
        content:
          'Antes de recomendar Clay a cualquier cliente, un ingeniero go-to-market hace cinco preguntas. Cuantos leads procesan mensualmente? Que enriquecimiento tienen actualmente? Quien construira y mantendra los flujos de trabajo? Cual es su presupuesto para enriquecimiento de datos? Y como es su proceso de calificacion actual?\n\nLas respuestas determinan la recomendacion. Si el volumen es bajo, omite Clay. Si ya tienen buen enriquecimiento de su CRM, agrega Clay encima solo para llenar vacios. Si nadie puede construir tablas, recomienda una agencia o compromiso de consultoria primero para construir la base, luego transferir la propiedad.\n\nEl punto de una evaluacion independiente es que la respuesta podria ser "no necesitas Clay." Una agencia que vende licencias de Clay nunca te dira eso. Un consultor ingeniero go-to-market trabajando independientemente no tiene incentivo para empujar la herramienta. La recomendacion coincide con la situacion.',
      },
    ],
  },

  {
    id: 'mcp-cli-litmus-test',
    title: 'La Prueba de Fuego MCP + CLI para Herramientas Go-to-Market',
    subtitle: 'Si tus herramientas no pueden automatizarse programaticamente, estas pagando por clics',
    category: 'tool-evaluation',
    description:
      'La prueba de fuego que cada ingeniero go-to-market aplica a las herramientas GTM: pueden automatizarse a traves de servidores MCP y acceso CLI? Un framework para evaluar la madurez de herramientas y la preparacion para automatizacion.',
    keywords: [
      'prueba de fuego servidor MCP',
      'automatizacion CLI GTM',
      'evaluacion de herramientas ingeniero go-to-market',
      'automatizacion de herramientas GTM',
      'evaluacion de servidor MCP',
      'herramientas GTM programaticas',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'credit-transparency-gtm-tools',
      'workspace-red-flag',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Por Que Importa el Acceso Programatico',
        type: 'prose',
        content:
          'Toda herramienta GTM tiene una GUI. Haz clic aqui, arrastra alli, exporta CSV. Eso es lo basico. La verdadera pregunta es si la herramienta puede operarse sin la GUI. Puede un agente llamarla? Puede un script activarla? Puede un cron job ejecutarla a las 2 AM mientras nadie esta mirando?\n\nEsta es la prueba de fuego MCP + CLI. MCP (Model Context Protocol) los servidores exponen funcionalidad de herramientas a agentes de IA. CLI (command line interface) el acceso permite que scripts y automatizacion activen operaciones. Una herramienta que tiene ambos puede integrarse en pipelines, orquestarse por agentes, y escalarse sin clics humanos.\n\nUna herramienta que solo tiene una GUI requiere un humano en el loop para cada operacion. Eso esta bien para 10 leads. Se rompe en 1000. Un ingeniero go-to-market evalua herramientas por su techo de automatizacion, no por su demo.',
      },
      {
        heading: 'La Prueba de Tres Niveles',
        type: 'pattern',
        content:
          'Nivel 1 - Acceso API. Tiene la herramienta una REST API documentada con autenticacion adecuada? Puedes hacer una solicitud curl y obtener datos estructurados de vuelta? La mayoria de las herramientas modernas pasan esto. Si no, eso es una bandera roja inmediata.\n\nNivel 2 - Herramientas CLI. Hay una interfaz de linea de comandos oficial? Puedes ejecutar operaciones desde una terminal sin abrir un navegador? Esto es mas raro. HubSpot lo tiene. Vercel lo tiene. La mayoria de herramientas de outreach no.\n\nNivel 3 - Servidor MCP. La herramienta ofrece un servidor MCP o tiene uno mantenido por la comunidad? Puede un agente de IA como Claude Code interactuar con ella nativamente? Esto es lo mas avanzado. PostHog, Attio, Slack, y GitHub tienen servidores MCP. La mayoria de herramientas GTM todavia estan solo en Nivel 1.\n\nEl ingeniero go-to-market califica cada herramienta del stack en estos tres niveles. Una herramienta en Nivel 3 es completamente automatizable. Una herramienta estancada en Nivel 1 requiere trabajo de integracion personalizado. Una herramienta sin acceso API en absoluto es un riesgo.',
      },
      {
        heading: 'Herramientas que Pasan vs. Herramientas que Fallan',
        type: 'anti-pattern',
        content:
          'Herramientas que pasan la prueba: HubSpot (API + CLI + MCP), Apollo (API + MCP), GitHub (API + CLI + MCP), Vercel (API + CLI), PostHog (API + MCP). Estas herramientas pueden integrarse completamente en pipelines automatizados.\n\nHerramientas que pasan parcialmente: Clay (API pero limitada - la mayor parte del poder esta en el constructor de tablas GUI), Instantly (API para gestion de campanas pero no para analitica), HeyReach (API para operaciones basicas, sin CLI ni MCP).\n\nHerramientas que fallan: cualquier herramienta donde la unica forma de operar es a traves de la interfaz web. Si no puedes exportar datos programaticamente, si no puedes activar campanas via API, si no puedes extraer analitica sin iniciar sesion - estas bloqueado en operaciones manuales. Eso no escala.\n\nLa nota reprobatoria no significa que la herramienta sea mala. Significa que la herramienta tiene un techo de automatizacion. Un ingeniero go-to-market incorpora ese techo en la decision del stack.',
      },
      {
        heading: 'Aplicando la Prueba a Tu Stack',
        type: 'pro-tip',
        content:
          'Ejecuta la prueba en tu stack actual ahora mismo. Lista cada herramienta. Para cada una, verifica: tiene una API? Hay un CLI? Hay un servidor MCP? Califica cada herramienta de 0-3.\n\nLuego observa el patron. Si tu herramienta de enriquecimiento puntua 3 pero tu herramienta de outreach puntua 0, tienes un cuello de botella. El pipeline es solo tan automatizado como su eslabon mas debil. Un ingeniero go-to-market identifica estos cuellos de botella y o reemplaza la herramienta, construye integraciones personalizadas para cerrar la brecha, o documenta los pasos manuales para que el equipo sepa donde se requiere intervencion humana.\n\nEl objetivo no es eliminar todo el trabajo manual. El objetivo es hacer que el trabajo manual sea una eleccion, no una restriccion. Deberias estar haciendo clic porque agrega valor, no porque la herramienta no te da otra opcion.',
      },
    ],
  },

  {
    id: 'data-lake-for-gtm',
    title: 'Que es un Data Lake para GTM? Cuando Clay No Es la Respuesta',
    subtitle: 'Almacena resultados de enriquecimiento en lugar de re-ejecutar busquedas cada campana',
    category: 'tool-evaluation',
    description:
      'Que significa un data lake en el contexto de operaciones go-to-market. Por que re-enriquecer los mismos leads desperdicia dinero, como construir conocimiento institucional, y cuando un ingeniero go-to-market recomienda un data lake sobre Clay.',
    keywords: [
      'data lake GTM',
      'data lake de enriquecimiento',
      'estrategia de datos ingeniero go-to-market',
      'clay vs data lake',
      'almacenamiento de enriquecimiento de leads',
      'arquitectura de datos GTM',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'credit-transparency-gtm-tools',
      'mcp-cli-litmus-test',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'El Problema del Re-Enriquecimiento',
        type: 'prose',
        content:
          'Cada vez que ejecutas una nueva campana, enriqueces leads. Datos de empresa, informacion de contacto, tecnograficos, senales de intencion. Si procesaste 500 leads el trimestre pasado y 200 de ellos se superponen con este trimestre, acabas de pagar para enriquecer 200 leads dos veces. Haz eso durante cuatro trimestres y habras pagado por los mismos datos cuatro veces.\n\nEste es el problema del re-enriquecimiento. La mayoria de los equipos GTM tratan el enriquecimiento como un gasto por campana en lugar de un activo que se acumula. Los datos del mes pasado se fueron - enterrados en una tabla vieja de Clay, un CSV exportado en el escritorio de alguien, o una campana que fue archivada.\n\nUn ingeniero go-to-market ve este patron en casi cada auditoria de stack. La empresa ha estado haciendo outbound durante dos anos y tiene cero conocimiento institucional sobre su mercado. Cada campana empieza desde cero. Eso no es un problema de herramientas. Es un problema de arquitectura.',
      },
      {
        heading: 'Como Luce un Data Lake GTM',
        type: 'pattern',
        content:
          'Un data lake GTM es un almacen persistente de cada resultado de enriquecimiento, cada puntuacion de calificacion, y cada senal de engagement que tu equipo haya generado. No tiene que ser sofisticado. Una base de datos bien estructurada o incluso una hoja de calculo gestionada funciona a pequena escala.\n\nLa estructura: un registro por dominio de empresa. Cada resultado de enriquecimiento se agrega a ese registro. Si enriqueciste acme.com en enero y de nuevo en marzo, ambos resultados se almacenan con marcas de tiempo. Puedes ver como la empresa cambio con el tiempo. Contrataron tres nuevos SDRs? Su stack tecnologico cambio? Su estado de financiamiento se actualizo?\n\nEl patron de consulta: antes de enriquecer un lead, verifica el data lake primero. Si la empresa fue enriquecida dentro de los ultimos 90 dias, usa los datos en cache. Solo re-enriquece si los datos estan obsoletos o faltan. Esto solo puede reducir los costos de enriquecimiento en un 40-60% para equipos con listas de objetivos superpuestas.\n\nUn ingeniero go-to-market construye esto como la base antes de conectar Clay, Apollo, o cualquier proveedor de enriquecimiento. El proveedor es el grifo. El data lake es el reservorio.',
      },
      {
        heading: 'Cuando Clay No Es la Respuesta',
        type: 'anti-pattern',
        content:
          'Clay es un motor de enriquecimiento, no un almacen de datos. Las tablas en Clay son artefactos de flujo de trabajo - existen para procesar leads a traves de un pipeline. Una vez que la campana se envia, la tabla esta terminada. La mayoria de los equipos la archivan y empiezan de nuevo.\n\nEso es Clay funcionando como fue disenado. Pero significa que Clay no es tu sistema de registro para datos de enriquecimiento. Si eliminas una tabla de Clay, esos datos se fueron. Si re-ejecutas la misma lista de leads, Clay te cobra de nuevo. No hay deduplicacion incorporada entre tablas.\n\nLa respuesta no es dejar de usar Clay. La respuesta es agregar un data lake debajo de el. Clay enriquece. El data lake almacena. La proxima vez que construyas una tabla, pre-rellena desde el data lake y solo enriquece los vacios. Tu factura de Clay baja. Tu conocimiento institucional crece. Esa es la arquitectura que un ingeniero go-to-market recomienda.',
      },
      {
        heading: 'Construyendo Tu Primer Data Lake GTM',
        type: 'pro-tip',
        content:
          'Comienza simple. Una base de datos PostgreSQL o incluso Airtable con un esquema estructurado. Tablas principales: companies (indexadas por dominio), contacts (indexados por email), enrichment_results (con marca de tiempo), engagement_signals (aperturas de email, respuestas, respuestas de LinkedIn).\n\nCada vez que una campana se ejecuta, el pipeline hace dos cosas: consulta el data lake para datos existentes, luego enriquece solo los vacios. Despues del enriquecimiento, escribe los resultados de vuelta al data lake. Con el tiempo, tu data lake se convierte en el activo mas valioso de tu stack GTM - mas valioso que cualquier herramienta individual.\n\nEl calculo del ROI es directo. Si estas gastando $2000/mes en creditos de Clay y el 40% de tus leads ya fueron enriquecidos en una campana anterior, un data lake ahorra $800/mes. En un ano eso son $9600 en ahorro de creditos solamente, mas el valor acumulado del conocimiento institucional. Esas son las matematicas que un ingeniero go-to-market muestra durante una auditoria de stack.',
      },
    ],
  },

  {
    id: 'agency-evaluation-checklist',
    title: 'Tu Agencia GTM Te Esta Haciendo Bien? Lista de Verificacion de un Ingeniero Go-to-Market',
    subtitle: 'Ocho preguntas para evaluar si tu agencia esta construyendo o solo facturando',
    category: 'tool-evaluation',
    description:
      'Una lista de verificacion independiente para evaluar agencias GTM. Lo que un ingeniero go-to-market busca durante una auditoria, banderas rojas que senalan desalineacion, y las preguntas que las agencias no quieren que hagas.',
    keywords: [
      'evaluacion de agencia GTM',
      'lista de verificacion de auditoria de agencia',
      'revision de agencia por ingeniero go-to-market',
      'mi agencia es buena',
      'agencia vs consultor GTM',
      'evaluacion de agencia de outbound',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'workspace-red-flag',
      'credit-transparency-gtm-tools',
      'should-you-get-clay',
      'abm-personalization-architecture',
    ],
    sections: [
      {
        heading: 'Por Que la Mayoria de las Relaciones con Agencias Se Estancan',
        type: 'prose',
        content:
          'La relacion con la agencia empieza fuerte. Equipo nuevo, ideas frescas de campanas, promesas de crecimiento de pipeline. Tres meses despues, las campanas estan corriendo pero los resultados se estancan. Seis meses despues, estas pagando el mismo retainer por el mismo playbook. La agencia no esta haciendo nada mal exactamente - solo estan optimizando para campanas enviadas, no pipeline generado.\n\nEsta es la desalineacion estructural. Las agencias facturan por actividad. Tu pagas por resultados. Su incentivo es mantener campanas corriendo. Tu incentivo es generar ingresos. Estas dos cosas estan correlacionadas pero no son identicas. Un ingeniero go-to-market detecta esta brecha durante la primera llamada de auditoria.',
      },
      {
        heading: 'La Lista de Verificacion de Ocho Preguntas',
        type: 'pattern',
        content:
          '1. Quien posee los logins de las herramientas? Si la agencia controla tus credenciales de Clay, Instantly, o CRM, estas atrapado. Tu deberias poseer cada login.\n\n2. Puedes ver el consumo de creditos? Pide un desglose mensual de creditos de enriquecimiento, envios de email, y solicitudes de conexion de LinkedIn. Si no pueden producirlo, no lo estan rastreando.\n\n3. Que pasa si te vas? Puedes exportar todos los flujos de trabajo, plantillas y datos? O se quedan en sus cuentas? La respuesta revela que tan portatil es tu inversion.\n\n4. Cuantos otros clientes comparten tu ingeniero GTM? Si la respuesta es 8-10, tus campanas estan recibiendo mantenimiento, no ingenieria. Un ingeniero gestionando 10 espacios de trabajo no puede optimizar ninguno de ellos.\n\n5. Estan construyendo infraestructura o ejecutando campanas? Las campanas son de una vez. La infraestructura se acumula. Pregunta que activos poseeras en 6 meses que no posees hoy.\n\n6. Pueden explicar por que se eligio cada herramienta? Si la respuesta es "usamos Clay para todos los clientes," eso es un predeterminado, no una recomendacion. Cada eleccion de herramienta deberia estar justificada por tus necesidades especificas.\n\n7. Cual es su metodologia de pruebas? A/B testing de lineas de asunto, horarios de envio, segmentos de audiencia? O ejecutando el mismo playbook cada mes?\n\n8. Estan midiendo indicadores adelantados o retrasados? Las tasas de respuesta son adelantadas. Los ingresos son retrasados. Si solo reportan metricas de vanidad (emails enviados, tasas de apertura), no estan conectados a tus resultados.',
      },
      {
        heading: 'Banderas Rojas que Senalan Problemas',
        type: 'anti-pattern',
        content:
          'La agencia no compartira los logins de herramientas. Esta es la bandera roja mas grande. Si estas pagando por herramientas a traves de la agencia y no puedes acceder a ellas directamente, tus datos y flujos de trabajo estan como rehenes.\n\nReportar solo metricas de actividad. "Enviamos 5000 emails este mes" no es un resultado. "Generamos 12 reuniones calificadas de 5000 emails" es un resultado. Si la agencia reporta volumen sin contexto de conversion, estan facturando por trabajo ocupado.\n\nPlaybook identico para todos los clientes. Tu ICP es diferente al de sus otros clientes. Tu mensajeria deberia ser diferente. Tus criterios de calificacion deberian ser diferentes. Si cada cliente recibe la misma plantilla de secuencia de 3 emails, la agencia esta operando una fabrica, no un servicio.\n\nResistencia a auditorias. Una buena agencia da la bienvenida a una evaluacion independiente porque valida su trabajo. Una agencia que resiste auditorias tiene algo que ocultar. Esa resistencia sola te dice lo que la auditoria encontraria.',
      },
      {
        heading: 'Como Luce lo Bueno',
        type: 'pro-tip',
        content:
          'Las mejores relaciones con agencias lucen como asociaciones, no como relaciones de proveedor. Tu posees todas las herramientas y logins. La agencia construye en tus cuentas. Producen reportes mensuales con consumo de creditos, tasas de conversion, y analisis de ROI. Prueban hipotesis, no solo ejecutan campanas.\n\nUn ingeniero go-to-market que audita agencias no esta tratando de reemplazarlas. A veces la conclusion de la auditoria es "tu agencia esta haciendo un trabajo excelente - aqui hay tres cosas para optimizar." Otras veces la conclusion es "necesitas reestructurar esta relacion." De cualquier manera, tienes una evaluacion independiente de alguien sin interes en el resultado.\n\nLa lista de verificacion anterior no se trata de encontrar culpas. Se trata de alinear incentivos. Cuando ambos lados se miden en los mismos resultados, la relacion funciona. Cuando los incentivos divergen, los resultados se estancan.',
      },
    ],
  },

  {
    id: 'credit-transparency-gtm-tools',
    title: 'Por Que la Transparencia de Creditos Importa en Herramientas Go-to-Market',
    subtitle: 'Si no puedes responder cuanto cuesta cada enriquecimiento, alguien mas esta decidiendo tu ROI',
    category: 'tool-evaluation',
    description:
      'Por que la transparencia de creditos es un requisito no negociable para herramientas GTM. Como un ingeniero go-to-market rastrea el consumo de creditos, los costos ocultos que la mayoria de los equipos pierden, y frameworks para rendicion de cuentas del presupuesto.',
    keywords: [
      'transparencia de creditos GTM',
      'seguimiento de creditos clay',
      'gestion de costos ingeniero go-to-market',
      'monitoreo de creditos de enriquecimiento',
      'seguimiento de ROI de herramientas GTM',
      'auditoria de consumo de creditos',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'data-lake-for-gtm',
      'agency-evaluation-checklist',
      'credit-management',
    ],
    sections: [
      {
        heading: 'El Costo Oculto de los Creditos Opacos',
        type: 'prose',
        content:
          'La mayoria de las herramientas GTM usan precios basados en creditos. Clay cobra por enriquecimiento. Apollo cobra por busqueda de contacto. Instantly cobra por email enviado. Los creditos son el combustible. Pero la mayoria de los equipos no tienen idea de cuanto combustible estan quemando por lead, por campana, o por dolar de pipeline generado.\n\nEsta opacidad es costosa. Una sola tabla de Clay con 10 columnas de enriquecimiento procesando 500 leads puede quemar 5000-7500 creditos en una ejecucion. Si tu plan incluye 10000 creditos por mes, eso es la mitad de tu presupuesto en una campana. Sin seguimiento, no lo sabes hasta que llegas a tu limite y los enriquecimientos se detienen a mitad del pipeline.\n\nUn ingeniero go-to-market trata el seguimiento de creditos de la misma manera que un CFO trata el seguimiento de gastos. Cada credito gastado deberia ser atribuible a una campana, un segmento de leads, o una prueba. Si no puedes rastrear el gasto, no puedes optimizarlo.',
      },
      {
        heading: 'Como Luce la Transparencia de Creditos',
        type: 'pattern',
        content:
          'Como minimo, deberias saber cuatro cosas en todo momento. Creditos consumidos en este ciclo de facturacion. Creditos consumidos por campana. Promedio de creditos por lead (creditos totales divididos por leads totales procesados). Costo por reunion calificada (gasto total en creditos dividido por reuniones reservadas).\n\nLos dos primeros estan disponibles en la mayoria de los dashboards de herramientas. Los dos segundos requieren que conectes datos de creditos con resultados de pipeline. Esa conexion es donde la mayoria de los equipos se quedan cortos. Pueden decirte cuantos creditos quemo Clay el mes pasado pero no que produjeron esos creditos.\n\nUn ingeniero go-to-market construye una capa de seguimiento simple: una hoja de calculo o base de datos que registra el consumo de creditos por campana junto con los resultados de pipeline. La Campana A uso 2000 creditos y genero 8 reuniones. La Campana B uso 3000 creditos y genero 2 reuniones. Ahora sabes en cual campana duplicar esfuerzos y cual eliminar. Eso es transparencia de creditos impulsando decisiones.',
      },
      {
        heading: 'Herramientas que Ocultan el Medidor',
        type: 'anti-pattern',
        content:
          'Algunas herramientas hacen que el seguimiento de creditos sea intencionalmente dificil. Los creditos se consumen en segundo plano sin desglose por accion. El dashboard muestra consumo total pero no uso por flujo de trabajo o por columna. No hay exportacion ni endpoint de API para datos de auditoria de creditos.\n\nEsto no es accidental. Los sistemas de creditos opacos benefician al proveedor. No puedes optimizar lo que no puedes medir. Consumes mas creditos de los necesarios. Actualizas tu plan cuando llegas a los limites en lugar de investigar por que el consumo se disparo.\n\nLa bandera roja: si una herramienta no puede decirte exactamente cuantos creditos consumio un flujo de trabajo especifico, el modelo de precios esta disenado para oscurecer, no para informar. Un ingeniero go-to-market recomendara herramientas con reportes de creditos transparentes y auditables sobre herramientas con mayores funcionalidades pero precios opacos.',
      },
      {
        heading: 'Construyendo Rendicion de Cuentas de Creditos',
        type: 'pro-tip',
        content:
          'Paso uno: exporta datos de consumo de creditos semanalmente. La mayoria de las herramientas proporcionan esto a traves de su dashboard o API. Si no lo hacen, eso es una bandera roja que vale la pena evaluar.\n\nPaso dos: etiqueta cada campana con un identificador unico. Cuando procesas leads a traves de Clay o Apollo, la etiqueta de campana viaja con el consumo de creditos.\n\nPaso tres: calcula el costo por lead calificado para cada campana. Creditos totales usados multiplicados por tu costo por credito, dividido por leads calificados generados. Este numero te dice si la campana es economicamente viable.\n\nPaso cuatro: establece presupuestos de creditos por campana antes del lanzamiento. Si estimas 500 leads a 10 creditos cada uno, presupuesta 5000 creditos. Si la campana excede el presupuesto, pausa e investiga antes de continuar.\n\nEste framework toma 30 minutos por semana para mantener. Ahorra miles por trimestre. Un ingeniero go-to-market implementa esto en la primera semana de cualquier compromiso porque es la base para cada decision de optimizacion que sigue.',
      },
    ],
  },

  {
    id: 'sdrs-learning-ai-tools',
    title: 'Los SDRs Deberian Estar Aprendiendo Herramientas de IA: La Perspectiva de un Ingeniero Go-to-Market',
    subtitle: 'El rol del SDR esta evolucionando - y los que construyan habilidades ahora lideraran la proxima era',
    category: 'tool-evaluation',
    description:
      'Por que los SDRs deberian estar aprendiendo herramientas de IA ahora. El rol de ingeniero go-to-market evoluciono desde fundamentos de SDR. Como empezar a construir habilidades tecnicas sin convertirse en desarrollador.',
    keywords: [
      'SDR herramientas ia',
      'carrera de ingeniero go-to-market',
      'SDR aprendiendo automatizacion',
      'SDR a ingeniero GTM',
      'herramientas de ia para desarrollo de ventas',
      'evolucion de carrera SDR',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'mcp-cli-litmus-test',
      'agency-evaluation-checklist',
      'workspace-red-flag',
      'should-you-get-clay',
    ],
    sections: [
      {
        heading: 'El Rol del SDR Esta Cambiando',
        type: 'prose',
        content:
          'El modelo tradicional de SDR - 200 llamadas en frio al dia, plantillas de email de copiar y pegar, outreach manual en LinkedIn - se esta automatizando. No eliminando, sino transformando. Las herramientas que solian requerir un equipo de SDRs ahora pueden ser orquestadas por una persona con el stack correcto.\n\nEsto no es una amenaza para los SDRs. Es una oportunidad. Los SDRs que aprendan a operar estas herramientas se convierten en los ingenieros go-to-market que las empresas necesitan desesperadamente. El SDR que puede configurar una tabla de enriquecimiento en Clay, configurar una campana en Instantly, y analizar tasas de respuesta en PostHog es mas valioso que cinco SDRs haciendo outreach manual.\n\nLo se porque fui un SDR. Envie los emails. Hice las llamadas. Aprendi que el trabajo era repetitivo y las herramientas eran primitivas. Asi que empece a automatizar. Primero con formulas de hoja de calculo. Luego con scripts basicos. Luego con pipelines completos. La experiencia SDR me dio el conocimiento del dominio. Las herramientas me dieron apalancamiento.',
      },
      {
        heading: 'Por Donde Empezar',
        type: 'pattern',
        content:
          'No necesitas aprender programacion. Necesitas aprender orquestacion de herramientas. Empieza con estas tres habilidades.\n\nPrimero, aprende Clay. Construye una tabla de enriquecimiento desde cero. Trae una lista de 50 empresas, agrega columnas de enriquecimiento, escribe una formula de calificacion, y exporta los leads calificados. Esto toma una tarde y te ensena mas sobre enriquecimiento de datos que seis meses de investigacion manual.\n\nSegundo, aprende ingenieria de prompts. No para chatbots - para flujos de trabajo de datos. Escribe un prompt de investigacion en Clay que genere icebreakers personalizados a partir de datos de empresa. Escribe un prompt que extraiga puntos de dolor de ofertas de empleo. Estos prompts son el puente entre datos crudos y copy de outbound.\n\nTercero, aprende analitica. Configura un dashboard de PostHog que rastree tasas de respuesta, tasas de rebote, y conversion por campana. Entender lo que los numeros significan es mas importante que generar los numeros. Un SDR que puede explicar por que la Campana A supero a la Campana B esta operando a nivel de ingeniero go-to-market.',
      },
      {
        heading: 'Que No Hacer',
        type: 'anti-pattern',
        content:
          'No intentes convertirte en ingeniero de software. El objetivo no es escribir scripts en Python o desplegar infraestructura. El objetivo es operar herramientas que ya existen. Las abstracciones estan construidas. Necesitas usarlas, no reconstruirlas.\n\nNo automatices antes de entender el proceso manual. Automatizar outbound malo mas rapido solo produce outbound malo mas rapido. Domina el oficio primero - que hace un buen email, que senala un lead calificado, cuando hacer seguimiento vs. cuando dejarlo ir. Luego automatiza las partes que son repetitivas.\n\nNo esperes a que tu empresa te capacite. La mayoria de las empresas todavia estan descubriendo su estrategia de IA. Los SDRs que aprenden independientemente - en su propio tiempo, con herramientas de plan gratuito - seran los que las empresas contraten para liderar la transicion. Cuando tu gerente pregunte quien entiende Clay, quieres ser la persona que levante la mano.',
      },
      {
        heading: 'La Trayectoria Profesional',
        type: 'pro-tip',
        content:
          'La escalera profesional de SDR a ingeniero go-to-market no esta bien definida todavia porque el rol es nuevo. Pero el patron es claro. Los SDRs que aprenden herramientas de IA se convierten en la persona del equipo que construye los flujos de trabajo. Esa persona se convierte en el lider de facto de operaciones GTM. Ese lider o crece hacia un rol de ingeniero GTM internamente o se independiza como consultor.\n\nEl camino independiente es particularmente interesante. Un consultor independiente de ingeniero go-to-market trae el conocimiento de dominio del SDR (que funciona en outbound) mas las habilidades tecnicas (como construir y automatizar) mas la independencia (sin lealtad a proveedores). Esa combinacion es rara y valiosa.\n\nLos SDRs que lean esto y empiecen a aprender hoy tendran una ventaja de 12-18 meses sobre sus companeros. Las herramientas estan disponibles. La documentacion es publica. La unica barrera es la iniciativa.',
      },
    ],
  },

  {
    id: 'workspace-red-flag',
    title: '9-10 Espacios de Trabajo Es una Bandera Roja: Lo que los Ingenieros Go-to-Market Saben',
    subtitle: 'Cuando tu ingeniero GTM gestiona demasiados clientes, nadie recibe ingenieria',
    category: 'tool-evaluation',
    description:
      'Por que 9-10 espacios de trabajo de clientes por ingeniero go-to-market es una bandera roja. La diferencia entre ingenieria y mantenimiento, que pierdes a escala, y como los consultores independientes abordan la capacidad de manera diferente.',
    keywords: [
      'carga de trabajo de ingeniero GTM',
      'bandera roja de capacidad de agencia',
      'consultor ingeniero go-to-market',
      'limite de espacios de trabajo agencia GTM',
      'calidad de agencia de outbound',
      'agotamiento de ingeniero GTM',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'agency-evaluation-checklist',
      'sdrs-learning-ai-tools',
      'mcp-cli-litmus-test',
    ],
    sections: [
      {
        heading: 'Las Matematicas No Funcionan',
        type: 'prose',
        content:
          'Un ingeniero go-to-market en una agencia gestionando 9-10 espacios de trabajo de clientes tiene aproximadamente 4 horas por semana por cliente. Eso son 40 horas divididas entre 10 clientes. En realidad, es menos - reuniones, sincronizaciones internas, reportes, y cambio de contexto consumen otro 20-30% del tiempo.\n\nCuatro horas por semana es suficiente para mantener campanas existentes. Revisar los dashboards. Cambiar una linea de asunto. Responder a mensajes de "se ve bien, programemos una llamada". Pero no es suficiente para hacer ingenieria. Ingenieria significa construir nuevos flujos de trabajo de enriquecimiento, probar hipotesis de calificacion, analizar patrones de respuesta, optimizar tiempos de envio, e iterar en criterios de ICP.\n\nEl resultado es predecible. Las campanas se estancan en el mes 3 porque nadie tiene tiempo para optimizarlas. La agencia reporta metricas de actividad (emails enviados, tasas de apertura) porque las metricas de resultados (reuniones calificadas, pipeline generado) requieren analisis mas profundo que 4 horas por semana no soportan.',
      },
      {
        heading: 'Ingenieria vs. Mantenimiento',
        type: 'pattern',
        content:
          'Mantenimiento es revisar dashboards, pausar campanas con bajo rendimiento, y lanzar la siguiente campana desde la misma plantilla. Es necesario pero no se acumula. El mes 6 luce como el mes 1 con diferentes listas de leads.\n\nIngenieria es analizar por que la Campana A genero 3x las reuniones de la Campana B, aislar la variable (fue el segmento ICP? el angulo del mensaje? la cadencia de envio?), y construir ese insight en cada campana futura. Ingenieria significa que el sistema se vuelve mas inteligente con el tiempo.\n\nCon 3-4 clientes, un ingeniero go-to-market tiene suficiente tiempo para hacer ambas cosas. Mantener las campanas en ejecucion e ingeniar mejoras. Con 9-10 clientes, solo hay tiempo para mantenimiento. La agencia factura la misma tarifa sin importar.\n\nEsto no es una critica a los ingenieros. Estan haciendo lo mejor que pueden con la capacidad que tienen. Es una critica al modelo. La agencia optimiza para ingresos por ingeniero (mas clientes = mas ingresos). El cliente necesita profundidad por compromiso (menos clientes = mejores resultados).',
      },
      {
        heading: 'Como Detectar la Bandera Roja',
        type: 'anti-pattern',
        content:
          'Preguntale a tu agencia: cuantos clientes gestiona mi ingeniero go-to-market? Si esquivan la pregunta o dicen "tenemos un modelo de equipo," presiona mas. Alguien es responsable de tus campanas. De cuantas otras campanas son responsables?\n\nOtras senales: tus campanas no han sido actualizadas significativamente en semanas. Los reportes son plantilla - mismas metricas, mismo formato, mismos insights cada mes. Cuando pides un nuevo tipo de campana, el tiempo de entrega es semanas, no dias. Tu ingeniero go-to-market no puede recordar detalles especificos sobre tu ICP sin revisar notas.\n\nEstas no son senales de un mal ingeniero. Son senales de uno sobrecargado. La restriccion de capacidad se manifiesta como trabajo generico, iteracion lenta, y rendimiento a nivel de meseta. Si estas pagando tarifas premium por output a nivel de mantenimiento, la proporcion de espacios de trabajo probablemente sea la razon.',
      },
      {
        heading: 'La Alternativa Independiente',
        type: 'pro-tip',
        content:
          'Un consultor independiente de ingeniero go-to-market tipicamente trabaja con 2-4 clientes maximo. Esa es una restriccion de capacidad deliberada. Menos clientes significa compromiso mas profundo. Cada cliente recibe 10-15 horas por semana de atencion de ingenieria, no 4 horas de mantenimiento.\n\nLa compensacion es el costo. Un consultor independiente cobra mas por hora de lo que una agencia asigna por cliente. Pero el output-por-dolar es mayor porque el trabajo se acumula. El mes 3 no es una repeticion del mes 1 - se construye sobre tres meses de optimizacion iterativa.\n\nLa otra ventaja es la propiedad. Un consultor independiente construye en tus cuentas, documenta todo, y transfiere la propiedad. Cuando el compromiso termina, tienes infraestructura que funciona independientemente. No empiezas desde cero. La pregunta que debes hacerte: quieres 4 horas de mantenimiento por semana de un recurso compartido, o 10-15 horas de ingenieria de uno dedicado? La respuesta depende de tus objetivos de pipeline y presupuesto, pero al menos ahora sabes que la compensacion existe.',
      },
    ],
  },

  {
    id: 'autonomous-agent-loops',
    title: 'Loops de Agentes Autonomos: El Patron Autoresearch',
    subtitle:
      'Como el repositorio autoresearch de Karpathy revela la arquitectura detras de agentes de IA que se auto-mejoran',
    category: 'parallel-agents',
    description:
      'Los loops de agentes autonomos permiten que los agentes de IA ejecuten experimentos, evaluen resultados e iteren sin intervencion humana. El patron detras del autoresearch de Karpathy se aplica mucho mas alla de la investigacion de ML - a pipelines de contenido, automatizacion GTM, y cualquier dominio con una metrica de exito clara.',
    keywords: [
      'loops de agentes autonomos',
      'karpathy autoresearch',
      'agentes de ia que se auto-mejoran',
      'arquitectura de agentes ia',
      'loops de retroalimentacion de agentes',
      'investigacion autonoma ia',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'claude-code-quickstart',
      'parallel-agent-orchestration',
    ],
    sections: [
      {
        heading: 'Que Es Autoresearch',
        type: 'prose',
        content:
          'En marzo de 2026, Andrej Karpathy lanzo <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener">autoresearch</a> (<a href="https://x.com/karpathy/status/2030371219518931079" target="_blank" rel="noopener">anuncio en X</a>). Tres archivos. Una GPU. Un agente de IA que modifica codigo de entrenamiento, ejecuta un experimento de 5 minutos, evalua si el resultado mejoro, mantiene o descarta el cambio, y repite. Alrededor de 12 experimentos por hora, aproximadamente 100 durante la noche, con cero intervencion humana.\n\nEl repositorio en si es un demo - un modelo GPT pequeno entrenando en una sola GPU NVIDIA. Pero el patron que demuestra es la verdadera contribucion. Loops de agentes autonomos con una metrica clara, un espacio de accion restringido, e iteracion indefinida.',
      },
      {
        heading: 'La Arquitectura de Tres Archivos',
        type: 'pattern',
        content:
          'El sistema completo son tres archivos. prepare.py esta bloqueado - utilidades para carga de datos y evaluacion que el agente no puede tocar. train.py es el unico archivo que el agente modifica - contiene el modelo, el optimizador, y el loop de entrenamiento. program.md es donde los humanos escriben instrucciones para el agente.\n\nEse ultimo archivo es el cambio de paradigma. No programas Python. Programas un archivo markdown que le dice al agente que explorar. El agente escribe el Python. Karpathy lo llama "programar el program.md." El humano proporciona estrategia. El agente proporciona ejecucion. El loop proporciona acumulacion.',
      },
      {
        heading: 'El Patron Aplicado a GTM',
        type: 'pattern',
        content:
          'El loop de autoresearch tiene cuatro pasos: modificar, probar, evaluar, mantener-o-descartar. Este patron se aplica a cualquier dominio donde puedas definir una metrica de exito clara y darle a un agente un espacio de accion restringido.\n\nPipelines de contenido: leer el output anterior, generar nuevo contenido, validar contra reglas de calidad, puntuar el output, reintentar si esta por debajo del umbral. El output se convierte en input para el siguiente ciclo. La consistencia de voz mejora con cada iteracion porque el agente estudia lo que ya produjo.\n\nCampanas de email: generar una variante, enviar a un segmento de prueba, medir tasa de respuesta, mantener o descartar la variante. La campana se optimiza sola con el tiempo.\n\nFlujos de trabajo de enriquecimiento: ejecutar una secuencia de enriquecimiento, puntuar la calidad de datos, marcar vacios, modificar la secuencia, ejecutar de nuevo. Cada pasada llena huecos que la pasada anterior no encontro.\n\nEl principio es el mismo en todas partes: define la metrica, restringe el espacio de accion, deja que el loop se ejecute.',
      },
      {
        heading: 'La Restriccion Es la Caracteristica',
        type: 'pro-tip',
        content:
          'Autoresearch funciona porque el espacio del problema es deliberadamente estrecho. Un archivo que el agente puede editar. Un numero para optimizar. Experimentos de cinco minutos. Si le das a un agente alcance ilimitado, deambula. Si le das un archivo y un numero, optimiza.\n\nEsta es la leccion mas transferible. Al disenar flujos de trabajo de agentes autonomos, la tentacion es dar al agente maxima flexibilidad. Lo opuesto produce mejores resultados. Estrecha el espacio de accion. Elige una metrica. Establece un presupuesto de tiempo por iteracion. Deja que el loop se acumule.\n\nEl sistema de Karpathy alcanzo mas de 10,000 generaciones porque cada generacion es barata, rapida, y claramente evaluada. Un agente que intenta optimizar todo a la vez alcanza cero generaciones porque nunca termina un solo experimento.',
      },
      {
        heading: 'Como Construir Tu Propio Loop',
        type: 'code',
        content:
          'La receta son cuatro componentes:\n\n1. Espacio de accion - que puede modificar el agente? Mantenlo lo mas estrecho posible. Un archivo. Una plantilla. Un bloque de configuracion.\n\n2. Metrica de evaluacion - como sabes si el cambio ayudo? Debe ser numerico y automatizado. Loss de validacion, puntuacion anti-slop, tasa de respuesta, porcentaje de completitud de datos. Si un humano tiene que juzgar, el loop no puede ejecutarse autonomamente.\n\n3. Presupuesto de tiempo - cuanto dura cada experimento? Suficientemente corto para iterar rapido (Karpathy usa 5 minutos). Suficientemente largo para producir una senal significativa.\n\n4. Memoria - que lleva el agente entre iteraciones? El output de la iteracion N se convierte en contexto para la iteracion N+1. Esta es la propiedad recursiva que hace que el loop se acumule en lugar de repetirse.\n\nNo necesitas un H100 o un framework personalizado. Una sesion de Claude Code con un archivo de instrucciones markdown, un script para ejecutar, y una funcion de puntuacion es suficiente para ejecutar este patron en una sola maquina.',
      },
    ],
  },
]
