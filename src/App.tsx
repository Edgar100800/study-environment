import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Brain,
  CardsThree,
  ChartBar,
  Check,
  CheckCircle,
  CircleNotch,
  Clock,
  Fire,
  GameController,
  House,
  ListChecks,
  MapTrifold,
  Moon,
  Play,
  Repeat,
  Sun,
  Target,
  TrendUp,
  Trophy,
  X,
} from "@phosphor-icons/react";
import {
  diagnosisRounds,
  flashcards,
  metricRounds,
  pipelineOrder,
  quizQuestions,
  weeks,
  type QuizQuestion,
} from "./data";
import { theoryModules, type TheoryModule } from "./theory";

type View = "inicio" | "ruta" | "contenido" | "tarjetas" | "practica";
type PracticeMode = "simulador" | "metricas" | "diagnostico" | "pipeline";
type CardRating = "reforzar" | "dominado";

type Progress = {
  completedWeeks: number[];
  cardRatings: Record<string, CardRating>;
  xp: number;
  sessions: number;
  bestQuiz: number;
  answeredQuestions: string[];
  lastStudyDate: string | null;
};

const initialProgress: Progress = {
  completedWeeks: [],
  cardRatings: {},
  xp: 0,
  sessions: 0,
  bestQuiz: 0,
  answeredQuestions: [],
  lastStudyDate: null,
};

const navItems: { id: View; label: string; icon: typeof House }[] = [
  { id: "inicio", label: "Inicio", icon: House },
  { id: "ruta", label: "Ruta", icon: MapTrifold },
  { id: "tarjetas", label: "Tarjetas", icon: CardsThree },
  { id: "practica", label: "Práctica", icon: GameController },
];

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem("planifica-progress");
    return saved ? { ...initialProgress, ...JSON.parse(saved) } : initialProgress;
  } catch {
    return initialProgress;
  }
}

function App() {
  const [view, setView] = useState<View>("inicio");
  const [cardWeekFocus, setCardWeekFocus] = useState<number | "all">("all");
  const [contentWeek, setContentWeek] = useState(1);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("planifica-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("planifica-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("planifica-theme", theme);
  }, [theme]);

  const cardMastery = Object.values(progress.cardRatings).filter((rating) => rating === "dominado").length;
  const overallProgress = Math.round(
    ((progress.completedWeeks.length / weeks.length) * 0.55 + (cardMastery / flashcards.length) * 0.45) * 100,
  );
  const nextWeek = weeks.find((week) => !progress.completedWeeks.includes(week.id)) ?? weeks[6];

  const award = (amount: number, updates: Partial<Progress> = {}) => {
    setProgress((current) => ({
      ...current,
      ...updates,
      xp: current.xp + amount,
      lastStudyDate: new Date().toISOString().slice(0, 10),
    }));
  };

  const toggleWeek = (weekId: number) => {
    setProgress((current) => {
      const completed = current.completedWeeks.includes(weekId);
      return {
        ...current,
        completedWeeks: completed
          ? current.completedWeeks.filter((id) => id !== weekId)
          : [...current.completedWeeks, weekId],
        xp: Math.max(0, current.xp + (completed ? -20 : 20)),
        lastStudyDate: new Date().toISOString().slice(0, 10),
      };
    });
  };

  const rateCard = (cardId: string, rating: CardRating) => {
    setProgress((current) => {
      const wasMastered = current.cardRatings[cardId] === "dominado";
      const becomesMastered = rating === "dominado";
      return {
        ...current,
        cardRatings: { ...current.cardRatings, [cardId]: rating },
        xp: Math.max(0, current.xp + (becomesMastered && !wasMastered ? 5 : 0)),
        lastStudyDate: new Date().toISOString().slice(0, 10),
      };
    });
  };

  const openContent = (weekId: number) => {
    setContentWeek(weekId);
    setView("contenido");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
            <button className="brand" onClick={() => setView("inicio")} aria-label="Ir al inicio">
          <span className="brand-mark">P</span>
          <span>
            <strong>Planifica</strong>
            <small>Study Lab</small>
          </span>
        </button>

        <nav className="side-nav" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id || (view === "contenido" && item.id === "ruta");
            return (
              <button
                key={item.id}
                className={active ? "nav-item active" : "nav-item"}
                onClick={() => {
                  if (item.id === "tarjetas") setCardWeekFocus("all");
                  setView(item.id);
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-progress">
          <div className="sidebar-progress-label">
            <span>Progreso total</span>
            <strong>{overallProgress}%</strong>
          </div>
          <div className="progress-track" role="progressbar" aria-label="Progreso total" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallProgress}>
            <span style={{ width: `${overallProgress}%` }} />
          </div>
          <small>{progress.completedWeeks.length} de 7 semanas revisadas</small>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          <span>{theme === "light" ? "Modo oscuro" : "Modo claro"}</span>
        </button>
      </aside>

      <main className="main-content">
        {view === "inicio" && (
          <Dashboard
            progress={progress}
            overallProgress={overallProgress}
            nextWeek={nextWeek}
            onNavigate={setView}
            onTrainWeek={(weekId) => {
              setCardWeekFocus(weekId);
              setView("tarjetas");
            }}
            onOpenContent={openContent}
            onCompleteWeek={toggleWeek}
          />
        )}
        {view === "ruta" && <CourseRoute progress={progress} onToggleWeek={toggleWeek} onOpenContent={openContent} />}
        {view === "contenido" && (
          <ContentReader
            weekId={contentWeek}
            progress={progress}
            onSelectWeek={setContentWeek}
            onToggleWeek={toggleWeek}
            onBack={() => setView("ruta")}
          />
        )}
        {view === "tarjetas" && (
          <FlashcardDeck key={cardWeekFocus} initialWeek={cardWeekFocus} ratings={progress.cardRatings} onRate={rateCard} />
        )}
        {view === "practica" && (
          <PracticeArena
            progress={progress}
            onAward={award}
            onProgressChange={setProgress}
          />
        )}
      </main>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id || (view === "contenido" && item.id === "ruta");
          return (
            <button
              key={item.id}
              className={active ? "active" : ""}
              onClick={() => {
                if (item.id === "tarjetas") setCardWeekFocus("all");
                setView(item.id);
              }}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} weight={active ? "fill" : "regular"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Dashboard({
  progress,
  overallProgress,
  nextWeek,
  onNavigate,
  onTrainWeek,
  onOpenContent,
  onCompleteWeek,
}: {
  progress: Progress;
  overallProgress: number;
  nextWeek: (typeof weeks)[number];
  onNavigate: (view: View) => void;
  onTrainWeek: (weekId: number) => void;
  onOpenContent: (weekId: number) => void;
  onCompleteWeek: (weekId: number) => void;
}) {
  const mastered = Object.values(progress.cardRatings).filter((rating) => rating === "dominado").length;
  const weekCards = flashcards.filter((card) => card.week === nextWeek.id);
  const weekMastered = weekCards.filter((card) => progress.cardRatings[card.id] === "dominado").length;

  return (
    <div className="page dashboard-page">
      <header className="page-header dashboard-header">
        <div>
          <h1>Tu siguiente sesión</h1>
          <p>Una ruta corta basada en tu avance. Primero recuerda, luego comprueba y finalmente aplica.</p>
        </div>
        <div className="level-chip" aria-label={`${progress.xp} puntos de estudio`}>
          <Trophy size={18} weight="fill" />
          <span>{progress.xp} XP</span>
        </div>
      </header>

      <section className="training-hero">
        <div className="training-copy">
          <div className="session-meta">
            <span>Semana {nextWeek.id}</span>
            <span><Clock size={16} /> {nextWeek.minutes} min</span>
            <span>{nextWeek.examWeight} recurrencia</span>
          </div>
          <h2>{nextWeek.title}</h2>
          <p>{nextWeek.priority}</p>
          <div className="session-actions">
            <button className="button primary" onClick={() => onTrainWeek(nextWeek.id)}>
              <Play size={18} weight="fill" /> Entrenar ahora
            </button>
            <button className="button secondary" onClick={() => onOpenContent(nextWeek.id)}>
              Ver contenido <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="training-plan" aria-label="Plan de la sesión">
          <div className="plan-row done">
            <span className="plan-index"><Check size={16} /></span>
            <div><strong>Activar</strong><small>Lee el objetivo de la semana</small></div>
            <span>3 min</span>
          </div>
          <div className="plan-row current">
            <span className="plan-index">2</span>
            <div><strong>Recuperar</strong><small>{weekCards.length} tarjetas, {weekMastered} dominadas</small></div>
            <span>12 min</span>
          </div>
          <div className="plan-row">
            <span className="plan-index">3</span>
            <div><strong>Comprobar</strong><small>Preguntas estilo parcial</small></div>
            <span>15 min</span>
          </div>
          <div className="plan-row">
            <span className="plan-index">4</span>
            <div><strong>Aplicar</strong><small>Diagnóstico de un caso</small></div>
            <span>10 min</span>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Resumen de avance">
        <div>
          <span className="stat-icon"><TrendUp size={21} /></span>
          <p><strong>{overallProgress}%</strong><span>dominio general</span></p>
        </div>
        <div>
          <span className="stat-icon"><Brain size={21} /></span>
          <p><strong>{mastered}/{flashcards.length}</strong><span>conceptos dominados</span></p>
        </div>
        <div>
          <span className="stat-icon"><Target size={21} /></span>
          <p><strong>{progress.bestQuiz}%</strong><span>mejor simulacro</span></p>
        </div>
        <div>
          <span className="stat-icon"><Fire size={21} /></span>
          <p><strong>{progress.sessions}</strong><span>retos completados</span></p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="mastery-panel">
          <div className="section-heading">
            <div>
              <h2>Mapa de dominio</h2>
              <p>Avanza por evidencia, no solo por lectura.</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("ruta")}>Ver ruta <ArrowRight size={16} /></button>
          </div>
          <div className="week-bars">
            {weeks.map((week) => {
              const cards = flashcards.filter((card) => card.week === week.id);
              const known = cards.filter((card) => progress.cardRatings[card.id] === "dominado").length;
              const mastery = Math.round(
                (progress.completedWeeks.includes(week.id) ? 45 : 0) + (cards.length ? known / cards.length : 0) * 55,
              );
              return (
                <button key={week.id} className="week-bar-row" onClick={() => onNavigate("ruta")}>
                  <span className="week-number">S{week.id}</span>
                  <span className="week-bar-copy"><strong>{week.shortTitle}</strong><small>{mastery}%</small></span>
                  <span className="week-bar-track" role="progressbar" aria-label={`Dominio de ${week.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={mastery}><span style={{ width: `${mastery}%` }} /></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="exam-focus-panel">
          <div className="section-heading">
            <div>
              <h2>Foco de parcial</h2>
              <p>Patrones recurrentes en 2025-2 y 2026-1.</p>
            </div>
          </div>
          <ol className="focus-list">
            <li><span>01</span><div><strong>Métricas y costo de error</strong><small>Precision, recall y Fβ</small></div><b>Recurrente</b></li>
            <li><span>02</span><div><strong>Data leakage</strong><small>Tipos, consecuencias y prevención</small></div><b>Recurrente</b></li>
            <li><span>03</span><div><strong>Bias y varianza</strong><small>Diagnóstico desde train/test</small></div><b>Recurrente</b></li>
            <li><span>04</span><div><strong>Despliegue y MLOps</strong><small>Decisiones antes de producción</small></div><b>Alta carga</b></li>
          </ol>
          <button className="button primary full" onClick={() => onNavigate("practica")}>
            Iniciar simulacro <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {!progress.completedWeeks.includes(nextWeek.id) && (
        <section className="quick-complete">
          <div><CheckCircle size={24} /><span><strong>¿Ya revisaste la clase?</strong><small>Marca la semana como leída; el dominio se completa con práctica.</small></span></div>
          <button className="button secondary" onClick={() => onCompleteWeek(nextWeek.id)}>Marcar revisada</button>
        </section>
      )}
    </div>
  );
}

function CourseRoute({ progress, onToggleWeek, onOpenContent }: { progress: Progress; onToggleWeek: (id: number) => void; onOpenContent: (id: number) => void }) {
  const [expanded, setExpanded] = useState<number>(
    weeks.find((week) => !progress.completedWeeks.includes(week.id))?.id ?? 7,
  );

  return (
    <div className="page route-page">
      <header className="page-header">
        <div>
          <h1>Ruta del curso</h1>
          <p>Siete semanas conectadas por un mismo ciclo: formular, construir, evaluar, desplegar y mantener.</p>
        </div>
        <div className="route-summary">
          <strong>{progress.completedWeeks.length}/7</strong>
          <span>semanas revisadas</span>
        </div>
      </header>

      <div className="course-route">
        {weeks.map((week) => {
          const isComplete = progress.completedWeeks.includes(week.id);
          const isExpanded = expanded === week.id;
          const cards = flashcards.filter((card) => card.week === week.id);
          const mastered = cards.filter((card) => progress.cardRatings[card.id] === "dominado").length;
          return (
            <article key={week.id} className={`route-week ${isComplete ? "complete" : ""} ${isExpanded ? "expanded" : ""}`}>
              <button className="route-week-main" onClick={() => setExpanded(isExpanded ? 0 : week.id)} aria-expanded={isExpanded}>
                <span className="route-node">{isComplete ? <Check size={18} weight="bold" /> : week.id}</span>
                <span className="route-week-copy">
                  <small>Semana {week.id} · {week.minutes} min</small>
                  <strong>{week.title}</strong>
                  <span>{week.description}</span>
                </span>
                <span className="route-status">
                  <b>{mastered}/{cards.length}</b>
                  <small>tarjetas</small>
                </span>
                <ArrowRight className="route-arrow" size={20} />
              </button>
              {isExpanded && (
                <div className="route-details">
                  <div>
                    <h3>Conceptos que debes dominar</h3>
                    <ul>{week.concepts.map((concept) => <li key={concept}><CheckCircle size={17} /> {concept}</li>)}</ul>
                  </div>
                  <div className="priority-note">
                    <Target size={21} />
                    <span><strong>Prioridad</strong><p>{week.priority}</p></span>
                  </div>
                  <div className="route-actions">
                    <button className="button primary" onClick={() => onOpenContent(week.id)}>
                      <BookOpenText size={18} /> Leer teoría
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => onToggleWeek(week.id)}
                    >
                      {isComplete ? "Marcar pendiente" : "Marcar revisada"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ContentReader({
  weekId,
  progress,
  onSelectWeek,
  onToggleWeek,
  onBack,
}: {
  weekId: number;
  progress: Progress;
  onSelectWeek: (id: number) => void;
  onToggleWeek: (id: number) => void;
  onBack: () => void;
}) {
  const module = theoryModules.find((item) => item.week === weekId) ?? theoryModules[0];
  const isComplete = progress.completedWeeks.includes(module.week);
  const selectWeek = (id: number) => {
    onSelectWeek(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page theory-page">
      <button className="reader-back" onClick={onBack}><ArrowLeft size={17} /> Volver a la ruta</button>
      <header className="reader-header">
        <div className="reader-kicker"><BookOpenText size={17} /> Lectura guiada · Módulo {module.week} de 7</div>
        <h1>{module.title}</h1>
        <p>{module.summary}</p>
        <div className="reader-meta">
          <span><Clock size={16} /> {module.readingTime} min de lectura</span>
          <span>{module.sections.length} bloques de teoría</span>
          <span>{module.concepts.length} conceptos clave</span>
        </div>
      </header>

      <div className="reader-layout">
        <aside className="module-index" aria-label="Módulos del curso">
          <span className="index-label">Contenido</span>
          <div>
            {theoryModules.map((item) => {
              const done = progress.completedWeeks.includes(item.week);
              return (
                <button
                  key={item.week}
                  className={item.week === module.week ? "active" : ""}
                  onClick={() => selectWeek(item.week)}
                  aria-current={item.week === module.week ? "page" : undefined}
                >
                  <span>{done ? <Check size={14} weight="bold" /> : item.week}</span>
                  <b>{item.title}</b>
                </button>
              );
            })}
          </div>
          <div className="reading-tip">
            <Brain size={21} />
            <p><strong>Lectura activa</strong>Detente después de cada bloque e intenta explicarlo sin mirar.</p>
          </div>
        </aside>

        <article className="theory-article">
          <section className="essential-note">
            <small>Idea esencial</small>
            <p>{module.essential}</p>
          </section>

          <section className="learning-objectives">
            <div className="article-eyebrow">Al terminar podrás</div>
            <ul>{module.objectives.map((objective) => <li key={objective}><CheckCircle size={18} /> {objective}</li>)}</ul>
          </section>

          <TheoryVisual module={module} />

          {module.sections.map((section, index) => (
            <section className="theory-section" key={section.title}>
              <div className="section-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="theory-section-body">
                <h2>{section.title}</h2>
                <p className="section-lead">{section.lead}</p>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul className="theory-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.formula && (
                  <div className="formula-card">
                    <span>Fórmula</span>
                    <code>{section.formula.expression}</code>
                    <p>{section.formula.meaning}</p>
                  </div>
                )}
              </div>
            </section>
          ))}

          <section className="concept-summary">
            <div className="article-eyebrow">Síntesis del módulo</div>
            <h2>Conceptos para recordar</h2>
            <div className="concept-grid">
              {module.concepts.map((concept) => (
                <div key={concept.term}><strong>{concept.term}</strong><p>{concept.definition}</p></div>
              ))}
            </div>
          </section>

          <div className="reader-complete">
            <div><CheckCircle size={24} /><span><strong>¿Terminaste la lectura?</strong><small>Marca el módulo y continúa con recuperación activa.</small></span></div>
            <button className={isComplete ? "button secondary" : "button primary"} onClick={() => onToggleWeek(module.week)}>
              {isComplete ? "Marcar como pendiente" : "Marcar como leído"}
            </button>
          </div>

          <nav className="reader-pagination" aria-label="Navegación entre módulos">
            <button onClick={() => selectWeek(module.week - 1)} disabled={module.week === 1}>
              <ArrowLeft size={18} /><span><small>Anterior</small><strong>{theoryModules[module.week - 2]?.title ?? ""}</strong></span>
            </button>
            <button onClick={() => selectWeek(module.week + 1)} disabled={module.week === 7}>
              <span><small>Siguiente</small><strong>{theoryModules[module.week]?.title ?? ""}</strong></span><ArrowRight size={18} />
            </button>
          </nav>
        </article>
      </div>
    </div>
  );
}

function TheoryVisual({ module }: { module: TheoryModule }) {
  if (module.visual === "decision") return (
    <figure className="theory-visual">
      <figcaption><span>Modelo mental</span><strong>De los datos a una consecuencia</strong></figcaption>
      <div className="decision-flow">
        {["Datos", "Predicción", "Decisión", "Consecuencia"].map((item, index) => (
          <div key={item}><span>{index + 1}</span><strong>{item}</strong>{index < 3 && <ArrowRight size={19} />}</div>
        ))}
      </div>
      <p>La responsabilidad no termina cuando el modelo entrega una predicción: continúa hasta observar el efecto de la decisión.</p>
    </figure>
  );

  if (module.visual === "peas") return (
    <figure className="theory-visual">
      <figcaption><span>Mapa PEAS</span><strong>Especificación de un agente</strong></figcaption>
      <div className="peas-map">
        <div><small>P</small><strong>Performance</strong><span>¿Qué significa hacerlo bien?</span></div>
        <div><small>E</small><strong>Environment</strong><span>¿Dónde opera?</span></div>
        <div className="agent-core"><Brain size={28} /><strong>Agente</strong></div>
        <div><small>A</small><strong>Actuators</strong><span>¿Cómo puede actuar?</span></div>
        <div><small>S</small><strong>Sensors</strong><span>¿Qué puede observar?</span></div>
      </div>
    </figure>
  );

  if (module.visual === "data") return (
    <figure className="theory-visual">
      <figcaption><span>Pipeline de iniciación</span><strong>El modelo viene después</strong></figcaption>
      <div className="data-pipeline">
        <div><b>01</b><strong>Problema</strong><span>Objetivo + población + horizonte</span></div><ArrowRight size={20} />
        <div><b>02</b><strong>Datos</strong><span>Muestra representativa y válida</span></div><ArrowRight size={20} />
        <div><b>03</b><strong>Features</strong><span>Señales disponibles al decidir</span></div>
      </div>
      <div className="quality-strip">{["Completitud", "Unicidad", "Actualidad", "Validez", "Exactitud", "Consistencia"].map((item) => <span key={item}>{item}</span>)}</div>
    </figure>
  );

  if (module.visual === "metrics") return (
    <figure className="theory-visual">
      <figcaption><span>Matriz de confusión</span><strong>Cuatro resultados, métricas diferentes</strong></figcaption>
      <div className="confusion-wrap">
        <div className="matrix-axis top">Real</div><div className="matrix-axis side">Predicción</div>
        <div className="confusion-matrix">
          <div className="matrix-head" /><div className="matrix-head">Positivo</div><div className="matrix-head">Negativo</div>
          <div className="matrix-head">Positiva</div><div className="matrix-cell good"><b>TP</b><span>Acierto positivo</span></div><div className="matrix-cell bad"><b>FP</b><span>Falsa alarma</span></div>
          <div className="matrix-head">Negativa</div><div className="matrix-cell bad"><b>FN</b><span>Positivo perdido</span></div><div className="matrix-cell good"><b>TN</b><span>Acierto negativo</span></div>
        </div>
      </div>
    </figure>
  );

  if (module.visual === "evaluation") return (
    <figure className="theory-visual">
      <figcaption><span>Diagnóstico train-test</span><strong>Lee el patrón, no solo el número</strong></figcaption>
      <div className="evaluation-bars">
        <div><strong>Underfitting</strong><span><i style={{ height: "62%" }} />Train 62%</span><span><i style={{ height: "59%" }} />Test 59%</span><small>Bias alto</small></div>
        <div className="balanced"><strong>Balance</strong><span><i style={{ height: "86%" }} />Train 86%</span><span><i style={{ height: "84%" }} />Test 84%</span><small>Generaliza</small></div>
        <div><strong>Overfitting</strong><span><i style={{ height: "99%" }} />Train 99%</span><span><i style={{ height: "73%" }} />Test 73%</span><small>Varianza alta</small></div>
      </div>
    </figure>
  );

  if (module.visual === "deployment") return (
    <figure className="theory-visual">
      <figcaption><span>Arquitectura de producción</span><strong>Cada capa necesita trazabilidad</strong></figcaption>
      <div className="deployment-stack">
        <div><span>Entrada</span><strong>Datos + validación de esquema</strong></div>
        <div><span>Servicio</span><strong>API + pipeline de transformación</strong></div>
        <div><span>Modelo</span><strong>Artefacto versionado + inferencia</strong></div>
        <div><span>Operación</span><strong>Monitoreo + logs + rollback</strong></div>
      </div>
    </figure>
  );

  return (
    <figure className="theory-visual">
      <figcaption><span>Mapa de drift</span><strong>Qué cambia determina qué debes vigilar</strong></figcaption>
      <div className="drift-map">
        <div><span className="distribution old"><i /><i /><i /><i /></span><strong>Referencia t₀</strong><small>Pₜ₀(X, y)</small></div>
        <ArrowRight size={24} />
        <div><span className="distribution new"><i /><i /><i /><i /></span><strong>Presente t₁</strong><small>Pₜ₁(X, y)</small></div>
        <div className="drift-question"><b>¿Cambió P(X)?</b><span>Drift virtual</span><b>¿Cambió P(y|X)?</b><span>Drift real</span></div>
      </div>
    </figure>
  );
}

function FlashcardDeck({ initialWeek, ratings, onRate }: { initialWeek: number | "all"; ratings: Record<string, CardRating>; onRate: (id: string, rating: CardRating) => void }) {
  const [weekFilter, setWeekFilter] = useState<number | "all">(initialWeek);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cards = useMemo(
    () => flashcards.filter((card) => weekFilter === "all" || card.week === weekFilter),
    [weekFilter],
  );
  const card = cards[index % cards.length];
  const mastered = cards.filter((item) => ratings[item.id] === "dominado").length;

  const changeFilter = (filter: number | "all") => {
    setWeekFilter(filter);
    setIndex(0);
    setRevealed(false);
  };

  const next = () => {
    setIndex((current) => (current + 1) % cards.length);
    setRevealed(false);
  };

  const previous = () => {
    setIndex((current) => (current - 1 + cards.length) % cards.length);
    setRevealed(false);
  };

  const rate = (rating: CardRating) => {
    onRate(card.id, rating);
    next();
  };

  return (
    <div className="page flashcards-page">
      <header className="page-header">
        <div>
          <h1>Tarjetas de recuperación</h1>
          <p>Intenta responder antes de revelar. Evalúa con honestidad: recordar con esfuerzo fortalece la memoria.</p>
        </div>
        <div className="deck-stat"><strong>{mastered}/{cards.length}</strong><span>dominadas</span></div>
      </header>

      <div className="filter-row" role="group" aria-label="Filtrar tarjetas por semana">
        <button className={weekFilter === "all" ? "active" : ""} onClick={() => changeFilter("all")}>Todas</button>
        {weeks.map((week) => (
          <button key={week.id} className={weekFilter === week.id ? "active" : ""} onClick={() => changeFilter(week.id)}>S{week.id}</button>
        ))}
      </div>

      <section className="deck-layout">
        <div className="deck-sidebar">
          <div className="deck-progress-copy"><span>Tarjeta {index + 1} de {cards.length}</span><strong>{Math.round(((index + 1) / cards.length) * 100)}%</strong></div>
          <div className="progress-track" role="progressbar" aria-label="Avance en el mazo" aria-valuemin={1} aria-valuemax={cards.length} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / cards.length) * 100}%` }} /></div>
          <div className="deck-key">
            <p><span className="key-dot mastered" />Dominado <b>{mastered}</b></p>
            <p><span className="key-dot review" />Por reforzar <b>{cards.filter((item) => ratings[item.id] === "reforzar").length}</b></p>
            <p><span className="key-dot new" />Sin revisar <b>{cards.filter((item) => !ratings[item.id]).length}</b></p>
          </div>
          <div className="memory-rule">
            <Brain size={23} />
            <p><strong>Regla de memoria</strong>Explica el concepto en voz alta antes de dar vuelta la tarjeta.</p>
          </div>
        </div>

        <div className="card-stage">
          <button className={`flashcard ${revealed ? "revealed" : ""}`} onClick={() => setRevealed(true)} aria-live="polite">
            <span className="flashcard-top"><b>Semana {card.week}</b><small>{ratings[card.id] ? (ratings[card.id] === "dominado" ? "Dominado" : "Reforzar") : "Nueva"}</small></span>
            {!revealed ? (
              <span className="flashcard-front">
                <small>Define con tus propias palabras</small>
                <strong>{card.term}</strong>
                <span>Presiona para revelar</span>
              </span>
            ) : (
              <span className="flashcard-back">
                <small>Respuesta clave</small>
                <strong>{card.answer}</strong>
                <span><Target size={18} /> {card.cue}</span>
              </span>
            )}
          </button>

          <div className="deck-controls">
            <button className="icon-button" onClick={previous} aria-label="Tarjeta anterior"><ArrowLeft size={21} /></button>
            {revealed ? (
              <div className="rating-actions">
                <button className="button reinforce" onClick={() => rate("reforzar")}><Repeat size={18} /> Reforzar</button>
                <button className="button mastered" onClick={() => rate("dominado")}><Check size={18} weight="bold" /> Lo sabía</button>
              </div>
            ) : (
              <button className="button primary" onClick={() => setRevealed(true)}>Mostrar respuesta</button>
            )}
            <button className="icon-button" onClick={next} aria-label="Siguiente tarjeta"><ArrowRight size={21} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PracticeArena({
  progress,
  onAward,
  onProgressChange,
}: {
  progress: Progress;
  onAward: (amount: number, updates?: Partial<Progress>) => void;
  onProgressChange: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  const [mode, setMode] = useState<PracticeMode>("simulador");
  const modes: { id: PracticeMode; label: string; icon: typeof Target; description: string }[] = [
    { id: "simulador", label: "Simulador", icon: ListChecks, description: "Preguntas del parcial" },
    { id: "metricas", label: "Métrica correcta", icon: ChartBar, description: "Decide por costo de error" },
    { id: "diagnostico", label: "Bias o varianza", icon: TrendUp, description: "Lee train vs. test" },
    { id: "pipeline", label: "Ordena el ciclo", icon: MapTrifold, description: "Reconstruye el proceso" },
  ];

  return (
    <div className="page practice-page">
      <header className="page-header">
        <div>
          <h1>Arena de práctica</h1>
          <p>Entrena el criterio que exige el examen: reconocer, justificar y conectar decisiones.</p>
        </div>
        <div className="level-chip"><Trophy size={18} weight="fill" /><span>Mejor: {progress.bestQuiz}%</span></div>
      </header>

      <div className="practice-tabs" role="group" aria-label="Modos de práctica">
        {modes.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>
              <Icon size={22} weight={mode === item.id ? "fill" : "regular"} />
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
            </button>
          );
        })}
      </div>

      <section className="practice-surface">
        {mode === "simulador" && (
          <QuizSimulator progress={progress} onProgressChange={onProgressChange} />
        )}
        {mode === "metricas" && (
          <ChoiceGame
            title="Elige la métrica"
            instruction="Lee el costo del error y elige la métrica que mejor representa el objetivo."
            rounds={metricRounds}
            onComplete={() => onAward(25, { sessions: progress.sessions + 1 })}
          />
        )}
        {mode === "diagnostico" && (
          <DiagnosisGame onComplete={() => onAward(25, { sessions: progress.sessions + 1 })} />
        )}
        {mode === "pipeline" && (
          <PipelineGame onComplete={() => onAward(30, { sessions: progress.sessions + 1 })} />
        )}
      </section>
    </div>
  );
}

function QuizSimulator({
  progress,
  onProgressChange,
}: {
  progress: Progress;
  onProgressChange: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const questions = quizQuestions.slice(0, 10);
  const question = questions[index];

  const reset = () => {
    setStarted(true);
    setIndex(0);
    setSelected([]);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="quiz-intro">
        <div className="quiz-intro-copy">
          <span className="practice-icon"><ListChecks size={30} /></span>
          <h2>Simulacro adaptado al parcial</h2>
          <p>Diez preguntas tomadas y adaptadas del análisis 2025-2 y 2026-1, con preguntas de una y varias respuestas correctas.</p>
          <button className="button primary" onClick={reset}><Play size={18} weight="fill" /> Comenzar simulacro</button>
        </div>
        <div className="quiz-intro-facts">
          <div><strong>10</strong><span>preguntas</span></div>
          <div><strong>15</strong><span>minutos sugeridos</span></div>
          <div><strong>70%</strong><span>meta mínima</span></div>
          <p><Target size={18} /> Recibirás la explicación después de cada respuesta.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-result">
        <span className={`result-seal ${percent >= 70 ? "passed" : ""}`}><Trophy size={42} weight="fill" /></span>
        <h2>{percent >= 80 ? "Criterio sólido" : percent >= 70 ? "Buen avance" : "Hay una base que reforzar"}</h2>
        <p>Obtuviste <strong>{score} de {questions.length}</strong> respuestas correctas.</p>
        <div className="result-score"><strong>{percent}%</strong><span>resultado final</span></div>
        <div className="result-actions">
          <button className="button primary" onClick={reset}><Repeat size={18} /> Reintentar</button>
          <button className="button secondary" onClick={() => setStarted(false)}>Volver al resumen</button>
        </div>
      </div>
    );
  }

  const isCorrect = sameAnswers(selected, question.correct);
  const toggleOption = (optionIndex: number) => {
    if (checked) return;
    if (question.correct.length === 1) setSelected([optionIndex]);
    else setSelected((current) => current.includes(optionIndex) ? current.filter((item) => item !== optionIndex) : [...current, optionIndex]);
  };

  const submit = () => {
    if (!selected.length) return;
    setChecked(true);
    if (isCorrect) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      const finalScore = score + (isCorrect && !checked ? 1 : 0);
      const percent = Math.round((finalScore / questions.length) * 100);
      onProgressChange((current) => ({
        ...current,
        bestQuiz: Math.max(current.bestQuiz, percent),
        sessions: current.sessions + 1,
        xp: current.xp + 40,
        answeredQuestions: Array.from(new Set([...current.answeredQuestions, ...questions.map((item) => item.id)])),
        lastStudyDate: new Date().toISOString().slice(0, 10),
      }));
      setFinished(true);
      return;
    }
    setIndex(nextIndex);
    setSelected([]);
    setChecked(false);
  };

  return (
    <div className="quiz-shell">
      <div className="quiz-topline">
        <div><span>Pregunta {index + 1} de {questions.length}</span><strong>{score} correctas</strong></div>
        <div className="quiz-progress" role="progressbar" aria-label="Progreso del simulacro" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      </div>
      <QuestionCard
        question={question}
        selected={selected}
        checked={checked}
        onToggle={toggleOption}
      />
      {checked && (
        <div className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status">
          {isCorrect ? <CheckCircle size={24} weight="fill" /> : <X size={24} weight="bold" />}
          <div><strong>{isCorrect ? "Respuesta correcta" : "Revisa el criterio"}</strong><p>{question.explanation}</p></div>
        </div>
      )}
      <div className="quiz-actions">
        {!checked ? (
          <button className="button primary" onClick={submit} disabled={!selected.length}>Comprobar respuesta</button>
        ) : (
          <button className="button primary" onClick={nextQuestion}>{index === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta"} <ArrowRight size={18} /></button>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  checked,
  onToggle,
}: {
  question: QuizQuestion;
  selected: number[];
  checked: boolean;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="question-card">
      <div className="question-meta">
        <span>{question.source}</span>
        <span>{question.topic}</span>
        <span>Dificultad {question.difficulty}/5</span>
      </div>
      <h2>{question.prompt}</h2>
      {question.correct.length > 1 && <p className="multi-hint">Selecciona todas las respuestas correctas.</p>}
      <div className="quiz-options">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected.includes(optionIndex);
          const isAnswer = question.correct.includes(optionIndex);
          const state = checked ? (isAnswer ? "correct" : isSelected ? "incorrect" : "") : isSelected ? "selected" : "";
          return (
            <button key={option} className={`quiz-option ${state}`} onClick={() => onToggle(optionIndex)} disabled={checked}>
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              <strong>{option}</strong>
              {checked && isAnswer && <Check size={18} weight="bold" />}
              {checked && isSelected && !isAnswer && <X size={18} weight="bold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceGame({
  title,
  instruction,
  rounds,
  onComplete,
}: {
  title: string;
  instruction: string;
  rounds: { scenario: string; answer: string; options: string[]; why: string }[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const round = rounds[index];

  const choose = (option: string) => {
    if (choice) return;
    setChoice(option);
    if (option === round.answer) setScore((current) => current + 1);
  };

  const next = () => {
    if (index === rounds.length - 1) {
      setDone(true);
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
    setChoice(null);
  };

  const reset = () => {
    setIndex(0);
    setChoice(null);
    setScore(0);
    setDone(false);
  };

  if (done) return <GameResult score={score} total={rounds.length} onReset={reset} />;

  return (
    <div className="mini-game">
      <div className="game-heading"><span className="practice-icon"><ChartBar size={28} /></span><div><h2>{title}</h2><p>{instruction}</p></div></div>
      <div className="game-scoreline"><span>Ronda {index + 1}/{rounds.length}</span><strong>{score} puntos</strong></div>
      <div className="scenario-card"><small>Escenario</small><p>{round.scenario}</p></div>
      <div className="game-options">
        {round.options.map((option) => (
          <button
            key={option}
            onClick={() => choose(option)}
            className={choice ? (option === round.answer ? "correct" : choice === option ? "incorrect" : "") : ""}
          >
            {option}
            {choice && option === round.answer && <Check size={18} weight="bold" />}
            {choice === option && option !== round.answer && <X size={18} weight="bold" />}
          </button>
        ))}
      </div>
      {choice && <div className="game-feedback"><strong>{choice === round.answer ? "Correcto" : `La respuesta es ${round.answer}`}</strong><p>{round.why}</p><button className="button primary" onClick={next}>{index === rounds.length - 1 ? "Ver resultado" : "Siguiente"} <ArrowRight size={17} /></button></div>}
    </div>
  );
}

function DiagnosisGame({ onComplete }: { onComplete: () => void }) {
  const rounds = diagnosisRounds.map((round) => ({
    scenario: `Rendimiento de entrenamiento: ${round.train}. Rendimiento de prueba: ${round.test}.`,
    answer: round.answer,
    options: round.options,
    why: round.why,
  }));
  return <ChoiceGame title="Diagnóstico relámpago" instruction="Interpreta la brecha entre entrenamiento y prueba." rounds={rounds} onComplete={onComplete} />;
}

function PipelineGame({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const shuffled = useMemo(() => [pipelineOrder[2], pipelineOrder[0], pipelineOrder[5], pipelineOrder[3], pipelineOrder[1], pipelineOrder[4]], []);
  const isCorrect = selected.every((item, index) => item === pipelineOrder[index]);

  const selectStep = (step: string) => {
    if (checked || selected.includes(step)) return;
    setSelected((current) => [...current, step]);
  };

  const undo = () => {
    if (checked) return;
    setSelected((current) => current.slice(0, -1));
  };

  const check = () => {
    if (selected.length !== pipelineOrder.length) return;
    setChecked(true);
    if (isCorrect && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const reset = () => {
    setSelected([]);
    setChecked(false);
  };

  return (
    <div className="mini-game pipeline-game">
      <div className="game-heading"><span className="practice-icon"><MapTrifold size={28} /></span><div><h2>Reconstruye el ciclo</h2><p>Selecciona las etapas en el orden lógico de un proyecto de IA.</p></div></div>
      <div className="pipeline-workspace">
        <div>
          <h3>Etapas disponibles</h3>
          <div className="pipeline-options">
            {shuffled.map((step) => <button key={step} disabled={selected.includes(step) || checked} onClick={() => selectStep(step)}>{step}<ArrowRight size={16} /></button>)}
          </div>
        </div>
        <div>
          <h3>Tu secuencia</h3>
          <ol className="pipeline-sequence">
            {pipelineOrder.map((_, index) => {
              const step = selected[index];
              const status = checked && step ? (step === pipelineOrder[index] ? "correct" : "incorrect") : "";
              return <li key={index} className={status}><span>{index + 1}</span><strong>{step ?? "Selecciona una etapa"}</strong>{status === "correct" && <Check size={17} />}{status === "incorrect" && <X size={17} />}</li>;
            })}
          </ol>
        </div>
      </div>
      {checked && <div className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`}><div><strong>{isCorrect ? "Ciclo correcto" : "El orden aún no representa el flujo completo"}</strong><p>{isCorrect ? "El monitoreo devuelve información al inicio y convierte el ciclo en un proceso continuo." : "Vuelve a pensar qué debe existir antes de entrenar y qué ocurre después de desplegar."}</p></div></div>}
      <div className="pipeline-actions">
        <button className="button secondary" onClick={checked ? reset : undo} disabled={!selected.length}>{checked ? "Reintentar" : "Deshacer"}</button>
        <button className="button primary" onClick={check} disabled={selected.length !== pipelineOrder.length || checked}>Comprobar orden</button>
      </div>
    </div>
  );
}

function GameResult({ score, total, onReset }: { score: number; total: number; onReset: () => void }) {
  const percent = Math.round((score / total) * 100);
  return (
    <div className="game-result">
      <span className={`result-seal ${percent >= 70 ? "passed" : ""}`}><Trophy size={40} weight="fill" /></span>
      <h2>{percent === 100 ? "Ronda perfecta" : percent >= 70 ? "Buen criterio" : "Conviene repetir"}</h2>
      <p>Resolviste correctamente {score} de {total} escenarios.</p>
      <strong className="game-result-number">{percent}%</strong>
      <button className="button primary" onClick={onReset}><Repeat size={18} /> Jugar de nuevo</button>
    </div>
  );
}

function sameAnswers(left: number[], right: number[]) {
  return left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index]);
}

export default App;
