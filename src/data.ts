export type Week = {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  concepts: string[];
  priority: string;
  examWeight: "Alta" | "Media";
  minutes: number;
};

export type Flashcard = {
  id: string;
  week: number;
  term: string;
  answer: string;
  cue: string;
};

export type QuizQuestion = {
  id: string;
  source: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  options: string[];
  correct: number[];
  explanation: string;
};

export const weeks: Week[] = [
  {
    id: 1,
    title: "Introducción",
    shortTitle: "Introducción",
    description: "De los datos a la acción: qué predice la IA, quién decide y quién asume el riesgo.",
    concepts: ["Tipos de aprendizaje", "Predicción vs. decisión", "Overfitting y underfitting", "Ética y responsabilidad"],
    priority: "Domina la cadena Datos → Predicción → Decisión → Riesgo.",
    examWeight: "Alta",
    minutes: 35,
  },
  {
    id: 2,
    title: "Fundamentos",
    shortTitle: "Fundamentos",
    description: "Agentes, PEAS, confianza apropiada y decisiones a lo largo del ciclo de vida.",
    concepts: ["Modelo PEAS", "Agentes racionales", "Appropriate reliance", "Ciclo de vida de IA"],
    priority: "Usa PEAS como plantilla para describir cualquier sistema de IA.",
    examWeight: "Media",
    minutes: 40,
  },
  {
    id: 3,
    title: "Iniciación",
    shortTitle: "Datos",
    description: "Formular el problema, recolectar, muestrear y preparar datos que sí representen la realidad.",
    concepts: ["Problema → Datos → Features", "Muestreo", "6 criterios de calidad", "Data-Centric AI"],
    priority: "Memoriza los 6 criterios de calidad y distingue los tipos de muestreo.",
    examWeight: "Alta",
    minutes: 50,
  },
  {
    id: 4,
    title: "Modelado",
    shortTitle: "Modelado",
    description: "Seleccionar modelos y métricas según el costo real de falsos positivos y negativos.",
    concepts: ["Precision y recall", "Fβ-score", "ROC-AUC", "Bagging, boosting y stacking"],
    priority: "Elige la métrica preguntando primero qué error cuesta más.",
    examWeight: "Alta",
    minutes: 55,
  },
  {
    id: 5,
    title: "Evaluación",
    shortTitle: "Evaluación",
    description: "Comprobar generalización sin leakage, tratar desbalance y diagnosticar bias-varianza.",
    concepts: ["Data leakage", "K-fold estratificado", "SMOTE y pesos", "Bias-varianza"],
    priority: "Detecta leakage y diagnostica bias/varianza desde resultados train-test.",
    examWeight: "Alta",
    minutes: 60,
  },
  {
    id: 6,
    title: "Despliegue",
    shortTitle: "Despliegue",
    description: "Llevar el modelo a producción con decisiones explícitas de arquitectura y MLOps.",
    concepts: ["APIs y microservicios", "On-premise a SaaS", "Contenedores", "Principios MLOps"],
    priority: "Relaciona cada opción de despliegue con control, costo, latencia y privacidad.",
    examWeight: "Alta",
    minutes: 50,
  },
  {
    id: 7,
    title: "Concept Drift",
    shortTitle: "Drift",
    description: "Detectar cuándo la realidad cambió y decidir si adaptar o reentrenar el modelo.",
    concepts: ["Drift real vs. virtual", "Patrones temporales", "ADWIN", "Adaptar vs. reentrenar"],
    priority: "Distingue P(X) de P(y|X) y conecta monitoreo continuo con reentrenamiento.",
    examWeight: "Alta",
    minutes: 45,
  },
];

export const flashcards: Flashcard[] = [
  { id: "f01", week: 1, term: "Predicción ≠ decisión", answer: "Una predicción estima qué ocurrirá. Una decisión selecciona qué acción tomar integrando objetivos, costos, restricciones y responsables.", cue: "Piensa en fraude: score frente a bloquear, revisar o permitir." },
  { id: "f02", week: 1, term: "Overfitting", answer: "El modelo aprende demasiado el entrenamiento, incluido su ruido: rinde muy bien en train pero generaliza mal en datos nuevos.", cue: "Complejidad excesiva, alta varianza." },
  { id: "f03", week: 1, term: "Underfitting", answer: "El modelo es demasiado simple para capturar la estructura de los datos y falla tanto en entrenamiento como en prueba.", cue: "Baja complejidad, alto bias." },
  { id: "f04", week: 2, term: "PEAS", answer: "Performance, Environment, Actuators y Sensors: define qué optimiza un agente, dónde opera, cómo actúa y cómo percibe.", cue: "Taxi autónomo: seguridad, carretera, volante, cámaras." },
  { id: "f05", week: 2, term: "Appropriate reliance", answer: "Confianza calibrada según la fiabilidad del sistema y el contexto; evita tanto la confianza ciega como el rechazo injustificado.", cue: "La confianza también se diseña." },
  { id: "f06", week: 2, term: "Agente racional", answer: "Entidad que percibe su entorno y actúa autónomamente para alcanzar el mejor resultado esperado según su información y objetivos.", cue: "Actuar racionalmente, no necesariamente imitar a un humano." },
  { id: "f07", week: 3, term: "Orden de iniciación", answer: "Problema → Datos → Features. Primero se define el objetivo medible, luego se consiguen datos relevantes y recién después se construyen atributos.", cue: "Nunca empieces eligiendo el modelo." },
  { id: "f08", week: 3, term: "Seis criterios de calidad", answer: "Completitud, unicidad, actualidad, validez, exactitud y consistencia.", cue: "Faltantes, duplicados, vigencia, formato, realidad y coherencia." },
  { id: "f09", week: 3, term: "Muestreo estratificado", answer: "Divide la población en estratos y muestrea dentro de cada uno para mantener la representación de categorías relevantes.", cue: "Útil con clases o grupos desbalanceados." },
  { id: "f10", week: 3, term: "Data-Centric AI", answer: "Enfoque que prioriza el diseño, calidad e ingeniería sistemática de los datos por encima de cambiar repetidamente el modelo.", cue: "Mejores datos antes que modelos más complejos." },
  { id: "f11", week: 4, term: "Precision", answer: "TP/(TP+FP). De todo lo predicho como positivo, cuánto era realmente positivo. Se prioriza cuando los falsos positivos son costosos.", cue: "¿Puedo confiar en una alerta positiva?" },
  { id: "f12", week: 4, term: "Recall", answer: "TP/(TP+FN). De todos los positivos reales, cuántos encontró el modelo. Se prioriza cuando dejar escapar un positivo es costoso.", cue: "Diagnóstico, fraude, incendios." },
  { id: "f13", week: 4, term: "Fβ-score", answer: "Media armónica ponderada de precision y recall. β > 1 prioriza recall; β < 1 prioriza precision; β = 1 los equilibra.", cue: "F2 mira más al recall; F0.5 a precision." },
  { id: "f14", week: 4, term: "Bagging vs. boosting", answer: "Bagging entrena modelos en paralelo y reduce varianza; boosting entrena secuencialmente corrigiendo errores y reduce bias.", cue: "Random Forest vs. XGBoost." },
  { id: "f15", week: 5, term: "Data leakage", answer: "Información no disponible al predecir se filtra al entrenamiento, infla las métricas e invalida la evaluación real.", cue: "Resultados demasiado buenos para ser verdad." },
  { id: "f16", week: 5, term: "Tipos de leakage", answer: "Train-test, feature, time y group leakage.", cue: "Test filtrado, target proxy, futuro y misma entidad." },
  { id: "f17", week: 5, term: "K-fold estratificado", answer: "Validación cruzada que mantiene la proporción de cada clase en todos los folds; permite estimar rendimiento con menor dependencia de una sola división.", cue: "Usa los mismos folds al comparar modelos." },
  { id: "f18", week: 5, term: "SMOTE", answer: "Genera ejemplos sintéticos de la clase minoritaria interpolando entre vecinos cercanos. Solo se aplica al conjunto de entrenamiento.", cue: "Nunca sintetices el test." },
  { id: "f19", week: 6, term: "MLOps", answer: "Prácticas para desarrollar, desplegar y mantener sistemas ML de forma reproducible, trazable, automatizada y monitoreada.", cue: "Datos + código + modelo cambian juntos." },
  { id: "f20", week: 6, term: "Versionar todo", answer: "Versionar datos, código, modelos, entornos y documentación permite reproducibilidad, trazabilidad y colaboración.", cue: "Un resultado irreproducible no es evidencia." },
  { id: "f21", week: 6, term: "On-premise vs. SaaS", answer: "On-premise ofrece máximo control y privacidad con mayor costo; SaaS máxima abstracción y rapidez con menor personalización y dependencia del proveedor.", cue: "Control frente a abstracción." },
  { id: "f22", week: 7, term: "Concept drift", answer: "Cambio en P(X,y) a través del tiempo que vuelve menos válidos los patrones aprendidos y degrada las predicciones.", cue: "La realidad cambia, por eso el modelo envejece." },
  { id: "f23", week: 7, term: "Drift real vs. virtual", answer: "Real: cambia P(y|X), la relación entrada-etiqueta. Virtual: cambia P(X), pero la relación con y se mantiene.", cue: "Real requiere observar etiquetas; virtual se ve en inputs." },
  { id: "f24", week: 7, term: "ADWIN", answer: "Ventana deslizante adaptativa que compara subventanas; si sus medias difieren suficientemente, detecta cambio y descarta datos antiguos.", cue: "Umbral basado en la cota de Hoeffding." },
];

export const quizQuestions: QuizQuestion[] = [
  { id: "q01", source: "Parcial 2025-2", topic: "Predicción vs. decisión", difficulty: 2, prompt: "Un modelo estima 95% de probabilidad de fraude. ¿Cuál opción corresponde a una decisión?", options: ["Calcular la probabilidad", "Bloquear, revisar o permitir según umbrales", "Medir el costo computacional", "Calcular el recall"], correct: [1], explanation: "El score es una predicción. Elegir y ejecutar una acción según riesgo, costo y restricciones pertenece a la capa de decisión." },
  { id: "q02", source: "Parcial 2025-2", topic: "Accuracy", difficulty: 1, prompt: "Hay 1,000 enfermos y 9,000 sanos. El modelo acierta 1,000 enfermos y 8,000 sanos. ¿Cuál es su accuracy?", options: ["70%", "80%", "90%", "95%"], correct: [2], explanation: "Accuracy = (TP + TN) / total = (1,000 + 8,000) / 10,000 = 90%." },
  { id: "q03", source: "Parcial 2025-2", topic: "Desbalance", difficulty: 2, prompt: "¿Qué riesgo existe al entrenar con clases muy desbalanceadas?", options: ["El modelo predice al azar", "No puede calcular precision", "No existe impacto", "Prioriza la clase mayoritaria"], correct: [3], explanation: "Un modelo puede maximizar accuracy ignorando la clase rara, aunque esa clase represente los casos críticos." },
  { id: "q04", source: "Parcial 2025-2", topic: "F-score", difficulty: 3, prompt: "¿Qué prioriza el F2-score?", options: ["Equilibrio exacto", "Precision", "Recall", "MSE"], correct: [2], explanation: "Cuando β > 1, Fβ da más peso al recall. En F2, el recall recibe un peso cuadrático mayor." },
  { id: "q05", source: "Parcial 2026-1", topic: "Formulación", difficulty: 2, prompt: "Selecciona las buenas traducciones de negocio a ML.", options: ["Mejorar ventas → clasificar clientes con alta probabilidad de compra", "Reducir abandono → predecir probabilidad de churn", "Automatizar todo → eliminar restricciones", "Estimar demanda → regresión de unidades esperadas"], correct: [0, 1, 3], explanation: "Una buena formulación convierte un objetivo en una tarea medible con variable objetivo; no elimina restricciones ni usa IA sin criterio." },
  { id: "q06", source: "Parcial 2026-1", topic: "Underfitting", difficulty: 3, prompt: "¿Qué propiedades describen el underfitting?", options: ["Alto bias", "Baja complejidad", "Error alto en entrenamiento", "Alta varianza"], correct: [0, 1, 2], explanation: "El subajuste aparece cuando el modelo es demasiado simple: alto bias y rendimiento pobre incluso sobre train. Alta varianza corresponde a overfitting." },
  { id: "q07", source: "Parcial 2026-1", topic: "F-score", difficulty: 3, prompt: "Si quieres priorizar precision sobre recall, ¿qué F-score es razonable?", options: ["F0.5", "F2", "F10", "F1"], correct: [0], explanation: "β < 1 prioriza precision; β = 1 equilibra; β > 1 prioriza recall." },
  { id: "q08", source: "Parcial 2026-1", topic: "Concept drift", difficulty: 3, prompt: "¿Cuál describe un drift real?", options: ["Cambia P(X), pero no P(y|X)", "Cambia la relación P(y|X)", "Aparece un único outlier", "Solo cambia la latencia"], correct: [1], explanation: "El drift real cambia la relación entre entradas y etiqueta. Si solo cambia P(X), hablamos de drift virtual." },
  { id: "q09", source: "Patrón de parcial", topic: "Data leakage", difficulty: 4, prompt: "¿Qué acciones previenen data leakage?", options: ["Ajustar el scaler con todo el dataset", "Separar train/test antes de transformar", "Usar split temporal cuando corresponde", "Mantener la misma persona en train y test"], correct: [1, 2], explanation: "Los transformadores aprenden solo de train. Los problemas temporales requieren splits cronológicos y las entidades deben separarse por grupos." },
  { id: "q10", source: "Caso integrador 2026-1", topic: "Fraude", difficulty: 5, prompt: "Con 0.5% de fraude, ¿por qué 95% de accuracy no es un umbral suficiente?", options: ["Porque accuracy siempre es cero", "Porque aprobar todo logra cerca de 99.5% sin detectar fraude", "Porque precision no existe", "Porque todos los modelos deben usar F1"], correct: [1], explanation: "El clasificador trivial supera 95% ignorando por completo el fraude. Se necesitan recall, precision, PR-AUC y costos operativos." },
  { id: "q11", source: "Parcial 2025-2", topic: "Validación", difficulty: 4, prompt: "¿Qué diferencia a la validación cruzada anidada?", options: ["Usa un único holdout", "El bucle interno ajusta y el externo evalúa", "Solo sirve para series temporales", "No permite hiperparámetros"], correct: [1], explanation: "Nested CV separa la selección de hiperparámetros de la evaluación externa, reduciendo el sesgo optimista." },
  { id: "q12", source: "Parcial 2026-1", topic: "Despliegue", difficulty: 2, prompt: "¿Cuáles son decisiones previas al despliegue?", options: ["Monolito o microservicios", "Infraestructura y encapsulamiento", "Monitoreo y logging", "Ignorar la latencia"], correct: [0, 1, 2], explanation: "Arquitectura, infraestructura, encapsulamiento, autonomía y observabilidad son decisiones explícitas. La latencia nunca se ignora." },
];

export const metricRounds = [
  { scenario: "En diagnóstico médico, dejar escapar una enfermedad es el error más grave.", answer: "Recall", options: ["Precision", "Recall", "Accuracy", "MAE"], why: "Priorizar recall reduce falsos negativos." },
  { scenario: "Un filtro de spam no debe enviar correos legítimos a la carpeta de spam.", answer: "Precision", options: ["Precision", "Recall", "R²", "MSE"], why: "Importa evitar falsos positivos." },
  { scenario: "Las clases están desbalanceadas y quieres tratar ambas por igual.", answer: "Balanced accuracy", options: ["Accuracy", "Balanced accuracy", "MAE", "AUC solamente"], why: "Promedia el rendimiento por clase y evita que domine la mayoritaria." },
  { scenario: "En regresión quieres penalizar especialmente los errores grandes.", answer: "MSE", options: ["MAE", "MSE", "Recall", "F1"], why: "Elevar el error al cuadrado amplifica errores grandes." },
  { scenario: "Quieres equilibrar precision y recall en un único valor.", answer: "F1", options: ["F1", "R²", "Accuracy", "sMAPE"], why: "F1 es la media armónica de precision y recall." },
];

export const diagnosisRounds = [
  { train: "97%", test: "51%", answer: "Alta varianza", options: ["Alto bias", "Alta varianza", "Balanceado"], why: "La gran brecha train-test indica overfitting." },
  { train: "43%", test: "41%", answer: "Alto bias", options: ["Alto bias", "Alta varianza", "Balanceado"], why: "Ambos rendimientos son bajos: el modelo no aprende ni el entrenamiento." },
  { train: "95%", test: "93%", answer: "Balanceado", options: ["Alto bias", "Alta varianza", "Balanceado"], why: "Rendimiento alto y brecha pequeña: buena generalización." },
  { train: "99%", test: "98%", answer: "Balanceado", options: ["Alto bias", "Alta varianza", "Balanceado"], why: "Los resultados muestran alto rendimiento y una brecha pequeña. Aun así, cualquier modelo debe pasar una auditoría de leakage independiente." },
];

export const pipelineOrder = ["Definir el problema", "Recolectar y preparar datos", "Entrenar el modelo", "Evaluar en datos no vistos", "Desplegar", "Monitorear y adaptar"];
