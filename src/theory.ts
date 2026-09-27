export type TheorySection = {
  title: string;
  lead: string;
  paragraphs: string[];
  bullets?: string[];
  formula?: {
    expression: string;
    meaning: string;
  };
};

export type TheoryModule = {
  week: number;
  title: string;
  readingTime: number;
  summary: string;
  essential: string;
  objectives: string[];
  sections: TheorySection[];
  concepts: { term: string; definition: string }[];
  visual: "decision" | "peas" | "data" | "metrics" | "evaluation" | "deployment" | "drift";
};

export const theoryModules: TheoryModule[] = [
  {
    week: 1,
    title: "Introducción",
    readingTime: 14,
    summary: "La inteligencia artificial transforma datos en estimaciones, pero una organización todavía debe convertir esas estimaciones en acciones responsables.",
    essential: "Una buena predicción no garantiza una buena decisión. La decisión también depende de objetivos, restricciones, costos y consecuencias.",
    objectives: [
      "Diferenciar IA, aprendizaje automático y decisión.",
      "Reconocer aprendizaje supervisado y no supervisado.",
      "Explicar overfitting, underfitting y generalización.",
    ],
    sections: [
      {
        title: "De los datos a la acción",
        lead: "El modelo ocupa una parte del sistema, no el sistema completo.",
        paragraphs: [
          "Un modelo aprende patrones a partir de datos históricos y produce una salida: una clase, un valor o una probabilidad. Esa salida describe lo que el sistema estima que ocurre o podría ocurrir.",
          "La capa de decisión toma esa estimación y la combina con reglas, recursos disponibles, objetivos y límites éticos. En fraude, por ejemplo, el modelo calcula riesgo; la organización decide si aprueba, bloquea o solicita una verificación adicional.",
        ],
        formula: {
          expression: "acción* = arg maxₐ  Utilidad(a | predicción, costos, restricciones)",
          meaning: "La mejor acción es la que maximiza la utilidad esperada dentro de las restricciones, no necesariamente la que sigue ciegamente el score.",
        },
      },
      {
        title: "Tipos de aprendizaje",
        lead: "El tipo de problema y la información disponible determinan el enfoque.",
        paragraphs: [
          "En aprendizaje supervisado cada ejemplo posee una etiqueta. Clasificación predice categorías discretas, mientras regresión estima valores continuos. En aprendizaje no supervisado no hay etiqueta objetivo: el sistema busca estructura, grupos o representaciones más compactas.",
        ],
        bullets: [
          "Clasificación: fraude/no fraude, spam/no spam.",
          "Regresión: demanda, precio o tiempo esperado.",
          "Clustering: segmentos de clientes sin etiquetas previas.",
          "Reducción dimensional: condensar información conservando patrones relevantes.",
        ],
      },
      {
        title: "Generalización y responsabilidad",
        lead: "El objetivo no es memorizar el entrenamiento, sino funcionar en casos nuevos.",
        paragraphs: [
          "Overfitting aparece cuando el modelo aprende incluso el ruido del conjunto de entrenamiento. Underfitting aparece cuando el modelo es demasiado simple para aprender la estructura relevante. La evaluación con datos no vistos permite estimar la generalización.",
          "La confiabilidad también exige equidad, transparencia, supervisión humana y responsables definidos. Los sesgos pueden provenir de los datos, del modelo o de la manera en que las personas interpretan su salida.",
        ],
      },
    ],
    concepts: [
      { term: "Predicción", definition: "Estimación producida por el modelo sobre un resultado." },
      { term: "Decisión", definition: "Selección de una acción considerando predicción, objetivos y restricciones." },
      { term: "Generalización", definition: "Capacidad de funcionar correctamente sobre datos no vistos." },
      { term: "Overfitting", definition: "Buen desempeño en entrenamiento y degradación en datos nuevos." },
    ],
    visual: "decision",
  },
  {
    week: 2,
    title: "Fundamentos",
    readingTime: 16,
    summary: "Los fundamentos ofrecen un lenguaje común para describir agentes, entornos y decisiones antes de elegir algoritmos.",
    essential: "PEAS obliga a definir qué significa rendir bien, dónde opera el agente, cómo actúa y qué puede observar.",
    objectives: [
      "Describir un agente inteligente mediante PEAS.",
      "Distinguir actuar humanamente de actuar racionalmente.",
      "Ubicar decisiones dentro del ciclo de vida de IA.",
    ],
    sections: [
      {
        title: "Agentes que perciben y actúan",
        lead: "Un agente conecta observaciones del entorno con acciones orientadas a una meta.",
        paragraphs: [
          "Los sensores informan al agente sobre el estado del entorno. Su mecanismo interno interpreta esa información, selecciona una acción y utiliza actuadores para modificar el entorno.",
          "Un agente racional no necesita imitar a una persona. Debe elegir la acción con mejor resultado esperado según lo que conoce, las restricciones y su medida de desempeño.",
        ],
        formula: {
          expression: "a* = arg maxₐ  E[Performance | percepción, a]",
          meaning: "El agente racional elige la acción con mayor desempeño esperado dada su percepción actual.",
        },
      },
      {
        title: "El modelo PEAS",
        lead: "Una especificación PEAS evita construir un modelo desconectado del sistema real.",
        paragraphs: [
          "Performance define el éxito; Environment delimita el mundo relevante; Actuators enumera las acciones posibles; Sensors establece qué información está disponible. Para un taxi autónomo, seguridad y rapidez son desempeño; carreteras y peatones son entorno; volante y freno son actuadores; cámaras y GPS son sensores.",
        ],
        bullets: [
          "Performance: métricas y objetivos que pueden entrar en conflicto.",
          "Environment: condiciones estables, dinámicas, observables o inciertas.",
          "Actuators: acciones permitidas y su nivel de autonomía.",
          "Sensors: cobertura, ruido, retrasos y datos ausentes.",
        ],
      },
      {
        title: "Confianza y ciclo de vida",
        lead: "La confianza apropiada se calibra con evidencia y contexto.",
        paragraphs: [
          "Over-reliance significa aceptar la salida sin cuestionarla. Under-reliance significa ignorar una recomendación útil. Appropriate reliance busca que la confianza humana se corresponda con la capacidad real del sistema.",
          "El ciclo de vida organiza decisiones de iniciación, entrenamiento, estimación, validación y despliegue. Cada etapa tiene riesgos propios y produce evidencia para la siguiente.",
        ],
      },
    ],
    concepts: [
      { term: "Agente", definition: "Entidad que percibe un entorno y actúa para alcanzar metas." },
      { term: "PEAS", definition: "Performance, Environment, Actuators y Sensors." },
      { term: "Racionalidad", definition: "Elección de la mejor acción esperada con la información disponible." },
      { term: "Appropriate reliance", definition: "Confianza humana calibrada a la fiabilidad y contexto del sistema." },
    ],
    visual: "peas",
  },
  {
    week: 3,
    title: "Iniciación",
    readingTime: 20,
    summary: "La iniciación traduce un problema real a un objetivo medible y construye la base de datos que determinará el techo del modelo.",
    essential: "El orden correcto es Problema → Datos → Features. Elegir primero el modelo suele optimizar la pregunta equivocada.",
    objectives: [
      "Traducir objetivos de negocio a tareas de ML.",
      "Evaluar calidad, distribución y representatividad.",
      "Aplicar muestreo, preprocesamiento e ingeniería de atributos.",
    ],
    sections: [
      {
        title: "Formular antes de modelar",
        lead: "Un objetivo vago debe convertirse en una variable y un horizonte medibles.",
        paragraphs: [
          "Reducir abandono no es todavía una tarea de aprendizaje automático. Puede formularse como predecir la probabilidad de que un cliente abandone durante los próximos 30 días. La formulación especifica población, variable objetivo, horizonte y uso de la salida.",
          "Los criterios de éxito del negocio y las métricas del modelo deben conectarse, pero no son idénticos. Mejorar recall puede detectar más clientes en riesgo; la intervención de retención determina si eso reduce realmente el abandono.",
        ],
      },
      {
        title: "Muestreo y distribución",
        lead: "Una muestra útil representa la población sobre la que se tomarán decisiones.",
        paragraphs: [
          "El muestreo aleatorio simple da la misma probabilidad a cada observación. El sistemático toma cada k-ésimo elemento después de un inicio aleatorio. El estratificado conserva proporciones de grupos importantes. El muestreo por clusters selecciona grupos completos.",
          "El análisis exploratorio examina tendencia central, dispersión, asimetría, relaciones y outliers. La media y la desviación estándar son sensibles a valores extremos; la mediana y el rango intercuartílico son más robustos.",
        ],
        formula: {
          expression: "IQR = Q₃ − Q₁     |     z = (x − μ) / σ",
          meaning: "IQR resume la dispersión central de forma robusta; el z-score expresa cuántas desviaciones estándar separan un valor de la media.",
        },
      },
      {
        title: "Calidad y preparación",
        lead: "Un modelo no puede reparar información ausente, contradictoria o mal representada.",
        paragraphs: [
          "La calidad se evalúa con seis criterios: completitud, unicidad, actualidad, validez, exactitud y consistencia. Cada uno describe una falla distinta y requiere una acción diferente.",
          "El preprocesamiento transforma datos sin cambiar el significado del problema. La ingeniería de atributos incorpora conocimiento del dominio: ventanas temporales, ratios, codificación categórica o componentes principales.",
        ],
        bullets: [
          "Ajusta imputación, normalización y encoding únicamente con train.",
          "One-hot crea una columna por categoría; dummy encoding utiliza n−1.",
          "PCA concentra variación en componentes no correlacionados.",
          "Documenta toda transformación para reproducirla en producción.",
        ],
      },
    ],
    concepts: [
      { term: "Tidy data", definition: "Una fila por observación y una columna por variable." },
      { term: "Representatividad", definition: "Correspondencia entre la muestra y la población objetivo." },
      { term: "Validez", definition: "Cumplimiento de reglas de formato y dominio." },
      { term: "Exactitud", definition: "Correspondencia del dato con la realidad." },
    ],
    visual: "data",
  },
  {
    week: 4,
    title: "Modelado",
    readingTime: 22,
    summary: "Modelar es elegir una familia de hipótesis y una métrica coherente con el costo de los errores del problema.",
    essential: "Precision y recall responden preguntas distintas. La métrica correcta depende de si duele más un falso positivo o un falso negativo.",
    objectives: [
      "Comparar modelos de regresión, clasificación y ensamble.",
      "Calcular métricas desde una matriz de confusión.",
      "Elegir métricas según el contexto operativo.",
    ],
    sections: [
      {
        title: "Familias de modelos",
        lead: "No existe un algoritmo universalmente mejor.",
        paragraphs: [
          "Regresión lineal modela una combinación ponderada de atributos. Ridge añade penalización L2 para reducir coeficientes; Lasso utiliza L1 y puede llevar algunos coeficientes a cero. En clasificación, regresión logística estima probabilidades, SVM maximiza margen, KNN usa vecinos y los árboles dividen por reglas.",
          "Los ensambles combinan errores diferentes. Bagging entrena en paralelo y reduce varianza; boosting entrena secuencialmente para reducir bias; stacking aprende una combinación mediante un meta-modelo.",
        ],
        formula: {
          expression: "ŷ = θ₀ + θ₁x₁ + … + θₙxₙ     |     σ(z) = 1 / (1 + e⁻ᶻ)",
          meaning: "La regresión lineal produce un valor continuo; la función sigmoide convierte un score lineal en probabilidad para clasificación logística.",
        },
      },
      {
        title: "Matriz de confusión",
        lead: "Toda métrica de clasificación nace de cuatro conteos.",
        paragraphs: [
          "TP y TN son aciertos positivos y negativos. FP es una falsa alarma; FN es un positivo real que el modelo dejó escapar. Accuracy resume todos los aciertos, pero puede ser engañosa cuando una clase domina.",
        ],
        formula: {
          expression: "Precision = TP/(TP+FP)     Recall = TP/(TP+FN)",
          meaning: "Precision mide la confiabilidad de las predicciones positivas; recall mide la cobertura de los positivos reales.",
        },
      },
      {
        title: "Combinar y comparar métricas",
        lead: "Una sola cifra rara vez explica todo el comportamiento del sistema.",
        paragraphs: [
          "F1 utiliza la media armónica para exigir que precision y recall sean simultáneamente altos. Fβ permite ponderarlos: β mayor que uno prioriza recall y β menor que uno prioriza precision. ROC analiza TPR frente a FPR al variar el umbral; AUC resume esa curva.",
          "En regresión, MAE conserva las unidades y es más robusta a outliers. MSE penaliza con fuerza errores grandes. R² mide proporción de variabilidad explicada, pero no expresa directamente cuánto se equivoca el modelo.",
        ],
        formula: {
          expression: "Fβ = (1+β²) · (Precision·Recall)/(β²·Precision+Recall)",
          meaning: "β = 1 equilibra; β > 1 aumenta el peso de recall; β < 1 aumenta el peso de precision.",
        },
      },
    ],
    concepts: [
      { term: "Precision", definition: "Proporción correcta entre los casos predichos como positivos." },
      { term: "Recall", definition: "Proporción de positivos reales que el modelo detecta." },
      { term: "Regularización", definition: "Penalización que limita complejidad para mejorar generalización." },
      { term: "Ensamble", definition: "Combinación de varios modelos para aprovechar fortalezas diferentes." },
    ],
    visual: "metrics",
  },
  {
    week: 5,
    title: "Evaluación",
    readingTime: 23,
    summary: "Evaluar es diseñar una prueba honesta del comportamiento futuro del modelo, sin contaminarla con información privilegiada.",
    essential: "La brecha train-test diagnostica varianza; error alto en ambos conjuntos diagnostica bias. Un resultado extraordinario obliga a auditar leakage.",
    objectives: [
      "Tratar desbalance sin contaminar el conjunto de prueba.",
      "Comparar holdout, k-fold y validación anidada.",
      "Detectar leakage y diagnosticar bias-varianza.",
    ],
    sections: [
      {
        title: "Desbalance de clases",
        lead: "Accuracy alta puede ocultar que el modelo ignora la clase importante.",
        paragraphs: [
          "Si solo 0.5% de transacciones son fraude, aprobar todo produce 99.5% de accuracy y cero capacidad de detección. La evaluación debe observar recall, precision, matriz de confusión, PR-AUC y costo esperado.",
          "Las estrategias incluyen más datos minoritarios, pesos de clase, undersampling, oversampling y SMOTE. Cualquier remuestreo se realiza solo dentro del entrenamiento, nunca antes de separar test.",
        ],
      },
      {
        title: "Validación",
        lead: "El conjunto de prueba representa una evaluación final, no un recurso de entrenamiento.",
        paragraphs: [
          "Holdout es rápido, pero depende de una única partición. K-fold rota el fold de validación y reporta media y desviación. Stratified k-fold conserva proporciones de clase. Nested CV usa un bucle interno para seleccionar hiperparámetros y otro externo para estimar desempeño sin sesgo optimista.",
        ],
        formula: {
          expression: "CV score = (1/k) Σᵢ metricᵢ     estabilidad ≈ desviación(metric₁…metricₖ)",
          meaning: "La media estima rendimiento y la dispersión indica cuánto depende el resultado de la partición.",
        },
      },
      {
        title: "Leakage, bias y varianza",
        lead: "Una evaluación contaminada responde una pregunta más fácil que la producción.",
        paragraphs: [
          "Train-test leakage ocurre cuando el test influye en transformaciones o entrenamiento. Feature leakage usa una variable que revela el objetivo. Time leakage incorpora el futuro. Group leakage coloca la misma entidad en train y test.",
          "Alto bias produce error alto tanto en train como test. Alta varianza produce train muy bueno y test claramente peor. El objetivo práctico es una complejidad que minimice el error de validación.",
        ],
        bullets: [
          "Divide antes de ajustar scaler, imputación, encoding o selección de features.",
          "Usa splits temporales cuando el futuro no estaría disponible.",
          "Usa GroupKFold cuando una entidad genera múltiples observaciones.",
          "Compara modelos con los mismos folds y reporta media ± desviación.",
        ],
      },
    ],
    concepts: [
      { term: "Data leakage", definition: "Información no disponible en producción que contamina el entrenamiento o evaluación." },
      { term: "Bias", definition: "Error sistemático por una hipótesis demasiado simple." },
      { term: "Varianza", definition: "Sensibilidad excesiva a cambios en los datos de entrenamiento." },
      { term: "Nested CV", definition: "Validación con bucle interno de selección y externo de evaluación." },
    ],
    visual: "evaluation",
  },
  {
    week: 6,
    title: "Despliegue",
    readingTime: 18,
    summary: "Un modelo produce valor cuando se integra de manera reproducible, observable y segura dentro de un sistema real.",
    essential: "MLOps existe porque datos, código y modelo evolucionan juntos: cambiar una parte puede alterar todo el comportamiento.",
    objectives: [
      "Comparar arquitecturas e infraestructuras de despliegue.",
      "Explicar CI, CD, CT y monitoreo continuo.",
      "Comprender trazabilidad, versionado y rollback.",
    ],
    sections: [
      {
        title: "Del experimento a producción",
        lead: "El artefacto final incluye más que los pesos del modelo.",
        paragraphs: [
          "El pipeline de preprocesamiento, la versión de datos, las dependencias, hiperparámetros y métricas de referencia deben acompañar al modelo. La API recibe entradas, ejecuta exactamente las transformaciones de entrenamiento y devuelve una predicción con trazabilidad.",
          "La inferencia puede ejecutarse por lotes, en tiempo real o en el edge. La elección depende de latencia, volumen, conectividad, costo y riesgo de la decisión.",
        ],
      },
      {
        title: "Arquitectura e infraestructura",
        lead: "Más abstracción reduce operación propia, pero también control y personalización.",
        paragraphs: [
          "Una arquitectura monolítica simplifica el inicio; microservicios aíslan componentes y facilitan escalado independiente, aunque aumentan complejidad operativa. Contenedores encapsulan aplicación y dependencias con menos peso que una máquina virtual completa.",
        ],
        bullets: [
          "On-premise: máximo control y privacidad, alto mantenimiento.",
          "IaaS: infraestructura flexible con administración técnica propia.",
          "PaaS/FaaS: despliegue rápido y escalado gestionado con límites operativos.",
          "SaaS: máxima abstracción y dependencia del proveedor.",
        ],
      },
      {
        title: "MLOps y reproducibilidad",
        lead: "La confiabilidad se construye con procesos repetibles y observables.",
        paragraphs: [
          "CI valida código, datos, esquemas y modelos. CD automatiza empaquetado y despliegue. CT entrena nuevas versiones con nuevos datos. El monitoreo continuo observa calidad, latencia, errores y drift.",
          "Versionar datos, código, configuración, entorno y modelo permite reproducir resultados y ejecutar rollback. MLflow registra runs, parámetros, métricas, modelos y artefactos para comparar evidencia.",
        ],
        formula: {
          expression: "experimento reproducible = datosᵥ + códigoᵥ + entornoᵥ + parámetros + seed",
          meaning: "La misma combinación versionada debe reconstruir el resultado o explicar claramente cualquier diferencia.",
        },
      },
    ],
    concepts: [
      { term: "Artefacto", definition: "Resultado versionable: datos, modelo, código, gráfico o entorno." },
      { term: "Trazabilidad", definition: "Capacidad de identificar qué combinación produjo cada resultado." },
      { term: "Rollback", definition: "Retorno seguro a una versión previa del sistema." },
      { term: "CT", definition: "Entrenamiento continuo y evaluación de nuevas versiones del modelo." },
    ],
    visual: "deployment",
  },
  {
    week: 7,
    title: "Concept Drift",
    readingTime: 18,
    summary: "Los patrones aprendidos envejecen porque los usuarios, mercados, sensores y adversarios cambian con el tiempo.",
    essential: "Drift virtual cambia P(X); drift real cambia P(y|X). Detectarlos requiere señales y estrategias de monitoreo diferentes.",
    objectives: [
      "Diferenciar drift real, virtual, repentino y gradual.",
      "Comparar adaptación y reentrenamiento.",
      "Explicar ADWIN y detección basada en error o distribución.",
    ],
    sections: [
      {
        title: "Cuando cambia la realidad",
        lead: "La validez de un modelo es temporal, no permanente.",
        paragraphs: [
          "El concepto puede representarse como la distribución conjunta P(X,y). Existe drift cuando esa distribución cambia entre dos momentos. En drift virtual cambia la distribución de entradas P(X), pero se conserva la relación con la etiqueta. En drift real cambia P(y|X), por lo que las reglas aprendidas dejan de ser válidas.",
        ],
        formula: {
          expression: "Pₜ₀(X,y) ≠ Pₜ₁(X,y)     |     real: Pₜ₀(y|X) ≠ Pₜ₁(y|X)",
          meaning: "El drift real modifica directamente la relación predictiva; normalmente exige etiquetas para confirmarlo.",
        },
      },
      {
        title: "Formas y desafíos",
        lead: "No todo cambio es drift y no todo drift ocurre con la misma velocidad.",
        paragraphs: [
          "Un cambio puede ser repentino, gradual, lento o recurrente. Los patrones estacionales pueden volver; un outlier aislado no debería disparar reentrenamiento. El desafío es detectar pronto sin confundir ruido con una transformación real.",
        ],
        bullets: [
          "Drift repentino: salto claro entre distribuciones.",
          "Drift gradual: dos conceptos coexisten durante una transición.",
          "Drift lento: el cambio se mezcla con el ruido natural.",
          "Concepto recurrente: un patrón anterior vuelve, como la estacionalidad.",
        ],
      },
      {
        title: "Detectar y adaptar",
        lead: "El monitoreo debe terminar en una política de acción.",
        paragraphs: [
          "Los detectores basados en distribución comparan datos nuevos y antiguos mediante estadísticas o distancias. Los basados en desempeño observan cambios en la tasa de error, pero necesitan etiquetas reales.",
          "ADWIN mantiene una ventana adaptable y compara subventanas. Si sus medias difieren más que un umbral basado en Hoeffding, descarta datos antiguos. Después de detectar, el sistema puede adaptar incrementalmente, reentrenar desde cero o cambiar el peso de modelos en un ensamble dinámico.",
        ],
        formula: {
          expression: "si |μ(W₀) − μ(W₁)| > εcut  ⇒  drift; descartar W₀",
          meaning: "ADWIN reduce su ventana cuando la evidencia estadística indica que los datos antiguos ya no representan el presente.",
        },
      },
    ],
    concepts: [
      { term: "Drift real", definition: "Cambio en P(y|X), la relación entre variables y etiqueta." },
      { term: "Drift virtual", definition: "Cambio en P(X) sin cambiar la relación predictiva." },
      { term: "ADWIN", definition: "Detector que adapta una ventana comparando medias de subventanas." },
      { term: "Aprendizaje adaptativo", definition: "Actualización del modelo ante nueva evidencia en un flujo." },
    ],
    visual: "drift",
  },
];
