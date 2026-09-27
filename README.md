# study-environment

Un ambiente de estudio interactivo para preparar cursos con mucho material teórico: flashcards de recall activo, quizzes estilo examen, mini-juegos de práctica y seguimiento de progreso por semana y tema.

Todo el progreso se guarda localmente en el navegador (localStorage): sin cuentas, sin backend, sin servidores.

## Funcionalidades

- **Seguimiento de progreso** por semana y tema, con dominio estimado según lo que realmente demuestras saber.
- **Flashcards** con autoevaluación de recall (sabía / no sabía).
- **Quizzes** de opción múltiple con retroalimentación que explica por qué la respuesta correcta lo es y por qué el distractor es tentador.
- **Mini-juegos de práctica** para consolidar conceptos aplicados.
- **Interfaz responsiva** para escritorio y móvil, con soporte de teclado, foco visible y modo de movimiento reducido.

## Tecnologías

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev) como bundler/dev server
- [Bun](https://bun.sh) como gestor de paquetes (también funciona con npm/pnpm)
- [Phosphor Icons](https://phosphoricons.com)

## Cómo correrlo

Con Bun:

```bash
bun install
bun run dev      # servidor de desarrollo
bun run build    # build de producción
bun run preview  # servir el build
```

Con npm:

```bash
npm install
npm run dev
```

## Estructura del código

```
src/
├── main.tsx     # punto de entrada
├── App.tsx      # UI y lógica de vistas (progreso, flashcards, quiz, juegos)
├── data.ts      # contenidos de estudio: semanas, temas, flashcards, preguntas
├── theory.ts    # resúmenes teóricos por semana
└── styles.css   # estilos
```

Para adaptarlo a otro curso solo hay que editar `src/data.ts` y `src/theory.ts`: el resto de la app es independiente del contenido.

## Licencia

MIT
