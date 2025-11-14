const PRESENTATIONS =
{
    "1763040287197":
    {
  "metadata": {
    "id": 1763040287197,
    "subject": "Cálculo Integral",
    "teacher": "Ing. Mario Ibarra",
    "logo": "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg",
    "unit": "Unidad 1. La integral indefinida y definida",
    "topics": [
      "Sumatoria sucesivas y notación sigma. Sumatoria de Riemann",
      "Integral indefinida: definición y determinación",
      "Primer Teorema fundamental del Cálculo",
      "Fórmulas básicas de integración",
      "Propiedades de Linealidad de la Integral Indefinida",
      "Integral definida: Conceptos y Propiedades",
      "Segundo Teorema fundamental del Cálculo: Regla de Barrow o Regla de Newton - Leibniz"
    ],
    "slidesCount": 42,
    "style": "text"
  },
  "slides": [
    {
      "title": "Cálculo Integral",
      "content": "Unidad: La integral indefinida y definida\nProfesor: Ing. Mario Ibarra",
      "images": [
        "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg"
      ]
    },
    {
      "title": "Introducción a la Sumatoria",
      "content": "La notación sigma (Σ) permite expresar sumas extensas de manera compacta. Se utiliza para representar la suma de términos definidos por una fórmula, con límites inferior y superior.",
      "images": [
        "https://i.ytimg.com/vi/mZS5urQTdzI/maxresdefault.jpg"
      ],
      "imagesPosition": "left"
    },
    {
      "title": "Propiedades de la Notación Sigma",
      "content": "Propiedades clave: linealidad, separación de sumas y extracción de constantes. Ejemplo: ∑(a_i + b_i) = ∑a_i + ∑b_i.",
      "videos": [
        "https://www.youtube.com/embed/CCDCqkrVDfY"
      ]
    },
    {
      "title": "Sumas de Riemann",
      "content": "Las sumas de Riemann aproximan el área bajo una curva mediante la suma de áreas de rectángulos. Son la base conceptual para definir la integral definida.",
      "images": [
        "https://i.pinimg.com/originals/2a/5c/9d/2a5c9d9060c8a99f134857c0dea8c3a7.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico de Sumatoria",
      "content": "Ejemplo: ∑_{i=1}^n i = n(n+1)/2. Esta fórmula permite calcular rápidamente la suma de los primeros n números naturales.",
      "videos": [
        "https://www.youtube.com/embed/d0dtFg5z7d4"
      ]
    },
    {
      "title": "Aplicaciones de la Sumatoria",
      "content": "Se utiliza en cálculo integral, estadística y física para representar series, acumulación y aproximaciones numéricas.",
      "images": [
        "https://i.ytimg.com/vi/hRmpV16Zcio/maxresdefault.jpg"
      ]
    },
    {
      "title": "Definición de Integral Indefinida",
      "content": "La integral indefinida es el conjunto de todas las funciones primitivas de una función dada. Se expresa como ∫f(x)dx = F(x) + C.",
      "images": [
        "https://matematix.org/wp-content/uploads/integral-indefinida-definicion-y-propiedades-esenciales.jpg"
      ]
    },
    {
      "title": "Propósito y Aplicación",
      "content": "Permite reconstruir la función original a partir de su derivada. Es fundamental en problemas de movimiento, acumulación y áreas.",
      "videos": [
        "https://www.youtube.com/embed/UTELlQivogs"
      ]
    },
    {
      "title": "Ejemplo básico",
      "content": "Ejemplo: ∫x^2 dx = (x^3)/3 + C. Se aplica la regla de la potencia sumando 1 al exponente y dividiendo por el nuevo exponente.",
      "images": [
        "https://image.slidesharecdn.com/integralindefinida-100905075806-phpapp02/95/integral-indefinida-21-728.jpg"
      ]
    },
    {
      "title": "Métodos de Integración",
      "content": "Métodos comunes: integración directa, por sustitución y por partes. Cada uno se aplica según la complejidad del integrando.",
      "videos": [
        "https://www.youtube.com/embed/y-OvAVeRDWE"
      ]
    },
    {
      "title": "Constante de Integración",
      "content": "La constante C refleja que existen infinitas primitivas para una misma función. Es esencial incluirla en toda integral indefinida.",
      "images": [
        "https://i.ytimg.com/vi/iXuiosBuKfA/maxresdefault.jpg"
      ]
    },
    {
      "title": "Concepto del Primer Teorema",
      "content": "Establece que derivar una integral devuelve la función original. Conecta derivación e integración como procesos inversos.",
      "images": [
        "https://cotidianidades.online/wp-content/uploads/fundamental-calculo.jpg"
      ]
    },
    {
      "title": "Interpretación Geométrica",
      "content": "La integral acumulada representa el área bajo la curva. Su derivada indica la tasa de cambio instantánea.",
      "videos": [
        "https://www.youtube.com/embed/SCKpUCax5ss"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Si F(x) = ∫_a^x f(t) dt, entonces F'(x) = f(x). Esto permite calcular derivadas de integrales sin resolver la integral completa.",
      "images": [
        "https://www.funciones.xyz/wp-content/uploads/2023/10/teorema-fundamental-del-calculo.png"
      ]
    },
    {
      "title": "Regla de la Potencia",
      "content": "∫x^n dx = x^(n+1)/(n+1) + C, para n ≠ -1. Es la fórmula más usada en integrales polinómicas.",
      "images": [
        "https://cursoparalaunam.com/wp-content/uploads/2022/01/tablas-de-formulas-de-integracion.jpg"
      ]
    },
    {
      "title": "Integrales Trigonométricas",
      "content": "Ejemplo: ∫sin(x) dx = -cos(x) + C; ∫cos(x) dx = sin(x) + C.",
      "videos": [
        "https://www.youtube.com/embed/5vJThQmWWdM"
      ]
    },
    {
      "title": "Integrales Exponenciales",
      "content": "Ejemplo: ∫e^x dx = e^x + C. Fundamental en problemas de crecimiento y decaimiento."
    },
    {
      "title": "Linealidad",
      "content": "∫[f(x)+g(x)]dx = ∫f(x)dx + ∫g(x)dx. Permite separar sumas y restas dentro de la integral.",
      "images": [
        "https://dicciomat.com/wp-content/uploads/2024/06/propiedades-de-las-integrales-indefinidas.png"
      ]
    },
    {
      "title": "Extracción de Constantes",
      "content": "∫k·f(x)dx = k∫f(x)dx. Las constantes pueden salir del signo de integración.",
      "videos": [
        "https://www.youtube.com/embed/CO5SLSY__Nk"
      ]
    },
    {
      "title": "Definición",
      "content": "La integral definida calcula el área bajo la curva entre dos puntos. Se expresa como ∫_a^b f(x)dx.",
      "images": [
        "https://www.funciones.xyz/wp-content/uploads/2023/10/integrales-definidas.png"
      ]
    },
    {
      "title": "Propiedades",
      "content": "Propiedades: aditividad, cambio de límites, y cancelación de constantes.",
      "videos": [
        "https://www.youtube.com/embed/CFYo6UWYxec"
      ]
    },
    {
      "title": "Segundo Teorema Fundamental",
      "content": "Permite calcular integrales definidas evaluando una antiderivada en los extremos: ∫_a^b f(x)dx = F(b) - F(a).",
      "images": [
        "https://matematix.org/wp-content/uploads/aportaciones-de-newton-y-leibniz-al-calculo-diferencial.jpg"
      ]
    },
    {
      "title": "Aplicación Práctica",
      "content": "Ejemplo: ∫_1^3 x^2 dx = [(x^3)/3]_1^3 = 9 - 1/3 = 26/3.",
      "videos": [
        "https://www.youtube.com/embed/ADz9g4eNp-A"
      ]
    }
  ]
},
"1763136172240": {
  "metadata": {
    "id": 1763136172240,
    "subject": "Cálculo Integral",
    "teacher": "Ing. Mario Ibarra",
    "logo": "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg",
    "unit": "Unidad 2. Métodos y Aplicaciones de la Integración",
    "topics": [
      "Método de Integración por Sustitución",
      "Método de Integración por Partes",
      "Integración de Funciones Trigonométricas: Casos 1, 2, 3, 4 y 5",
      "Integración por Fracciones Parciales"
    ],
    "slidesCount": 26,
    "style": "text"
  },
  "slides": [
    {
      "title": "Cálculo Integral",
      "content": "Unidad 2: Métodos y Aplicaciones de la Integración\nProfesor: Ing. Mario Ibarra",
      "images": [
        "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg"
      ]
    },
    {
      "title": "Método de Integración por Sustitución",
      "content": "Este método consiste en realizar un cambio de variable para simplificar el integrando. Se aplica cuando la integral contiene una función compuesta y su derivada.",
      "images": [
        "https://i.ytimg.com/vi/YrxsRJFifi8/maxresdefault.jpg"
      ],
      "imagesPosition": "left"
    },
    {
      "title": "Pasos del Método",
      "content": "1. Identificar la expresión a sustituir.\n2. Definir u = g(x) y calcular du.\n3. Sustituir en la integral.\n4. Integrar en términos de u.\n5. Volver a la variable original.",
      "videos": [
        "https://www.youtube.com/embed/UZyG4jCBMgU"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "∫(2x)/(x²+1) dx. Sustitución: u = x²+1, du = 2x dx. Resultado: ∫1/u du = ln|u| + C = ln|x²+1| + C.",
      "images": [
        "https://i.ytimg.com/vi/5dREssqdlBM/maxresdefault.jpg"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se utiliza en integrales con raíces, logaritmos y funciones trigonométricas. Facilita la resolución de integrales complejas.",
      "videos": [
        "https://www.youtube.com/embed/me4h_Ye3o3Y"
      ]
    },
    {
      "title": "Método de Integración por Partes",
      "content": "Basado en la fórmula: ∫u dv = u·v − ∫v du. Se aplica cuando el integrando es un producto de funciones.",
      "images": [
        "https://www.funciones.xyz/wp-content/uploads/2023/10/integracion-por-partes.png"
      ]
    },
    {
      "title": "Selección de u y dv",
      "content": "Se recomienda usar la regla LIATE: Logarítmica, Inversa, Algebraica, Trigonométrica, Exponencial.",
      "videos": [
        "https://www.youtube.com/embed/93kW5colCAU"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "∫x·e^x dx. Tomamos u = x, dv = e^x dx. Resultado: x·e^x − ∫e^x dx = e^x(x − 1) + C.",
      "images": [
        "https://image.slidesharecdn.com/trabajointegralesindefinidas-210419125539/85/Integrales-definidas-y-metodo-de-integracion-por-partes-1-638.jpg"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se usa en integrales con logaritmos, funciones trigonométricas y productos algebraicos.",
      "videos": [
        "https://www.youtube.com/embed/DY_b0sAfuf4"
      ]
    },
    {
      "title": "Integración de Funciones Trigonométricas",
      "content": "Se aplican identidades trigonométricas y sustituciones para simplificar integrales de sen(x), cos(x), tan(x), sec(x), etc.",
      "images": [
        "https://portalacademico.cch.unam.mx/sites/default/files/cal2oa1p07e01.jpg"
      ]
    },
    {
      "title": "Caso 1: Potencias Impares",
      "content": "Ejemplo: ∫sen³(x) dx. Se separa un sen(x) y se usa la identidad sen²(x)=1−cos²(x). Sustitución u=cos(x).",
      "videos": [
        "https://www.youtube.com/embed/4Qz8_6geT6Y"
      ]
    },
    {
      "title": "Caso 2: Potencias Pares",
      "content": "Ejemplo: ∫cos²(x) dx. Se usa la identidad cos²(x)=(1+cos(2x))/2.",
      "images": [
        "https://d20ohkaloyme4g.cloudfront.net/img/document_thumbnails/9ea7022ac7858d460e4e5119aa72b534/thumb_1200_1696.png"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se emplea en física, ingeniería y problemas periódicos.",
      "videos": [
        "https://www.youtube.com/embed/mF1yMwEXgu8"
      ]
    },
    {
      "title": "Integración por Fracciones Parciales",
      "content": "Método para integrar funciones racionales descomponiendo el integrando en fracciones simples."
    },
    {
      "title": "Casos principales",
      "content": "1. Factores lineales distintos.\n2. Factores lineales repetidos.\n3. Factores cuadráticos irreducibles.",
      "videos": [
        "https://www.youtube.com/embed/6pFmUh41jsQ"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "∫(3x+5)/((x−2)(x+1)) dx. Se descompone en A/(x−2)+B/(x+1).",
      "images": [
        "https://i.ytimg.com/vi/GJ5e9lnGx-w/maxresdefault.jpg"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se usa en integrales racionales complejas y en problemas de ingeniería.",
      "videos": [
        "https://www.youtube.com/embed/uwDKdolLkns"
      ]
    }
  ]
},
"1763137039402": {
  "metadata": {
    "id": 1763137039402,
    "subject": "Cálculo Integral",
    "teacher": "Ing. Mario Ibarra",
    "logo": "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg",
    "unit": "Unidad 3. Aplicaciones de la Integral Definida",
    "topics": [
      "Integrales múltiples: doble y triple integral",
      "Áreas de regiones planas",
      "Área entre curvas, tomando diferencial en X y en Y",
      "Integrales Impropias",
      "Longitud de Arco en los casos: y=f(x); x=f(y)"
    ],
    "slidesCount": 33,
    "style": "text"
  },
  "slides": [
    {
      "title": "Cálculo Integral",
      "content": "Unidad 3: Aplicaciones de la Integral Definida\nProfesor: Ing. Mario Ibarra",
      "images": [
        "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg"
      ]
    },
    {
      "title": "Integrales Múltiples",
      "content": "Las integrales dobles y triples permiten calcular áreas y volúmenes en regiones bidimensionales y tridimensionales. Se expresan como ∬_R f(x,y)dA y ∭_V f(x,y,z)dV.",
      "images": [
        "https://thumbnails.genially.com/5c811af27185540fe7ab9495/screenshots/52c94f16-8185-467e-9cfe-fc02dcef0b0b.jpg"
      ]
    },
    {
      "title": "Integral Doble",
      "content": "Se utiliza para calcular áreas y volúmenes en el plano. Ejemplo: ∬_R f(x,y)dA donde R es la región en el plano xy.",
      "videos": [
        "https://www.youtube.com/embed/aWFBjPrC45c"
      ]
    },
    {
      "title": "Integral Triple",
      "content": "Permite calcular volúmenes en el espacio tridimensional. Ejemplo: ∭_V f(x,y,z)dV.",
      "images": [
        "https://i.ytimg.com/vi/8ofsZmo4aV4/maxresdefault.jpg"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se emplea en física, ingeniería y cálculo de masa, centroide y flujo.",
      "videos": [
        "https://www.youtube.com/embed/rBU-xQGYMX0"
      ]
    },
    {
      "title": "Áreas de Regiones Planas",
      "content": "El área de una región plana se calcula mediante una integral definida: A = ∫_a^b f(x) dx o A = ∫_c^d g(y) dy.",
      "images": [
        "https://i.ytimg.com/vi/KyhjD9QuuMM/maxresdefault.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Área bajo la curva y = x² entre x=0 y x=2: A = ∫_0^2 x² dx = [x³/3]_0^2 = 8/3.",
      "videos": [
        "https://www.youtube.com/embed/U1vJ73VFz1E"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se utiliza en diseño, ingeniería y cálculo de superficies.",
      "images": [
        "https://i.ytimg.com/vi/mwkSO52HRFo/maxresdefault.jpg"
      ]
    },
    {
      "title": "Área entre Curvas",
      "content": "Se calcula como la diferencia de integrales: A = ∫_a^b [f(x) − g(x)] dx. También puede hacerse en términos de y.",
      "images": [
        "https://image.slidesharecdn.com/iii3-integral-definida-rea-entre-curvas583/95/iii3-integral-definida-rea-entre-curvas-6-728.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Área entre y=x² y y=x: A = ∫_0^1 (x − x²) dx = [x²/2 − x³/3]_0^1 = 1/6.",
      "videos": [
        "https://www.youtube.com/embed/hZ1n4-Cpn74"
      ]
    },
    {
      "title": "Integrales Impropias",
      "content": "Son integrales con límites infinitos o integrandos no acotados. Se evalúan como límites: ∫_a^∞ f(x) dx = lim_{t→∞} ∫_a^t f(x) dx.",
      "images": [
        "https://newalltradingeng.com/wp-content/uploads/2024/06/integrales-impropias.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "∫_1^∞ 1/x² dx = lim_{t→∞} [−1/x]_1^t = 1.",
      "videos": [
        "https://www.youtube.com/embed/ZLncfIgnqTE"
      ]
    },
    {
      "title": "Aplicaciones",
      "content": "Se usan en probabilidad, física y series infinitas.",
      "images": [
        "https://www.editorialpencil.es/wp-content/uploads/2024/07/ejercicios-de-integrales-impropias-metodos-y-ejemplos-practicos.webp"
      ]
    },
    {
      "title": "Longitud de Arco",
      "content": "Para y=f(x): L = ∫_a^b √(1+(dy/dx)²) dx. Para x=f(y): L = ∫_c^d √(1+(dx/dy)²) dy.",
      "images": [
        "https://3.bp.blogspot.com/-fMSO-J48bFM/XKjisF1ml3I/AAAAAAAAFgk/izLrkFrvUy0RbJRKo9BW0YisDWFmZtuKQCLcBGAs/s1600/LONGITUD%2BDE%2BARCO%2BPOR%2BINTEGRALES%2BEJERCICIOS%2BY%2BPROBLEMAS%2BRESUELTOS%2BPDF.gif"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Longitud de y=x² en [0,1]: L = ∫_0^1 √(1+(2x)²) dx.",
      "videos": [
        "https://www.youtube.com/embed/Zy1nJo13KXA"
      ]
    },
    {
      "title": "Referencias",
      "content": "Stewart, J. (2016). *Cálculo de varias variables*. Cengage Learning.\nLarson, R., & Edwards, B. (2014). *Cálculo integral*. McGraw-Hill.\nThomas, G. B., Weir, M. D., & Hass, J. (2018). *Thomas' Calculus*. Pearson.\nKhan Academy. (s.f.). *Integrales definidas y sus aplicaciones*. Recuperado de https://es.khanacademy.org"
    }
  ]
},
  "1763140191114": {
  "metadata": {
    "id": 1763140191114,
    "subject": "Cálculo Integral",
    "teacher": "Ing. Mario Ibarra",
    "logo": "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg",
    "unit": "Unidad 4. Series Infinitas",
    "topics": [
      "Sucesión vs Serie Infinitas",
      "Sucesión y Acotamiento",
      "Sumas Parciales de una Serie",
      "Convergencia de una Serie Infinita. Criterio general",
      "Serie geométrica. Definición. Convergencia",
      "Series alternadas. Definición. Convergencia",
      "Convergencia de Series Infinitas en términos positivos: criterio de la raíz y la razón",
      "Convergencia de series infinitas en términos positivos: criterio de la integral",
      "Convergencia de series infinitas en términos positivos: criterio de la comparación"
    ],
    "slidesCount": 52,
    "style": "text"
  },
  "slides": [
    {
      "title": "Cálculo Integral",
      "content": "Unidad 4: Series Infinitas\nProfesor: Ing. Mario Ibarra",
      "images": [
        "https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg"
      ]
    },
    {
      "title": "Sucesión vs Serie Infinitas",
      "content": "Una sucesión es una lista ordenada de números que sigue una regla. Una serie infinita es la suma de los términos de una sucesión infinita. Ejemplo: sucesión {1, 1/2, 1/4,...}; serie: 1 + 1/2 + 1/4 + ...",
      "images": [
        "https://i.ytimg.com/vi/38DztrGgxSY/maxresdefault.jpg"
      ]
    },
    {
      "title": "Definición y diferencias",
      "content": "Sucesión: función f: N → R. Serie: suma de términos de una sucesión. Si la suma tiende a un número finito, la serie es convergente; si no, es divergente.",
      "videos": [
        "https://www.youtube.com/embed/e33wxsXq61w"
      ]
    },
    {
      "title": "Sucesión y Acotamiento",
      "content": "Una sucesión está acotada si existe un número M tal que |a_n| ≤ M para todo n. Puede ser acotada superior e inferiormente."
    },
    {
      "title": "Ejemplo práctico",
      "content": "La sucesión a_n = 1/n está acotada entre 0 y 1. Su límite es 0, por lo que es convergente.",
      "videos": [
        "https://www.youtube.com/embed/9HnlJnafuhs"
      ]
    },
    {
      "title": "Sumas Parciales de una Serie",
      "content": "La suma parcial S_n = a_1 + a_2 + ... + a_n. Si lim S_n existe y es finito, la serie converge.",
      "images": [
        "https://image.slideserve.com/1355604/sucesi-n-de-sumas-parciales-l.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Para la serie 1 + 1/2 + 1/4 + ..., S_n = 1 - (1/2)^n / (1 - 1/2). Lim S_n = 2.",
      "videos": [
        "https://www.youtube.com/embed/CnDXwHG0_bI"
      ]
    },
    {
      "title": "Convergencia de una Serie Infinita",
      "content": "Una serie converge si la sucesión de sumas parciales tiene límite finito. Criterio general: si a_n → 0, la serie puede converger; si no, diverge.",
      "images": [
        "https://image.slidesharecdn.com/seriesinfinitas-110710145930-phpapp02/95/series-infinitas-16-728.jpg"
      ]
    },
    {
      "title": "Video explicativo",
      "content": "Ejemplo de convergencia y divergencia en series infinitas.",
      "videos": [
        "https://www.youtube.com/embed/TLctTDYS9SI"
      ]
    },
    {
      "title": "Serie Geométrica",
      "content": "Serie geométrica: ∑ ar^n. Converge si |r| < 1, suma = a / (1 - r). Diverge si |r| ≥ 1.",
      "images": [
        "https://materialeseducativos.org/wp-content/uploads/Serie-Geométrica-para-Primer-Grado-de-Secundaria-768x564.jpg"
      ]
    },
    {
      "title": "Ejemplo práctico",
      "content": "Serie: 1 + 1/2 + 1/4 + ... converge a 2.",
      "videos": [
        "https://www.youtube.com/embed/jx60FBxd44Q"
      ]
    },
    {
      "title": "Series Alternadas",
      "content": "Una serie alternada cambia de signo en cada término. Ejemplo: ∑ (-1)^n / n. Converge si los términos decrecen y tienden a 0 (criterio de Leibniz).",
      "images": [
        "https://matematicasimplificada.com/wp-content/uploads/2024/03/Series-Alternadas.jpg"
      ]
    },
    {
      "title": "Video explicativo",
      "content": "Convergencia de series alternadas y criterio de Leibniz.",
      "videos": [
        "https://www.youtube.com/embed/iYI7KXXbKlE"
      ]
    },
    {
      "title": "Criterio de la Razón y la Raíz",
      "content": "Razón: L = lim |a_(n+1)/a_n|. Si L < 1, converge; si L > 1, diverge. Raíz: L = lim √|a_n|. Igual criterio.",
      "images": [
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzHGh9CjW0iLaVOEDSS5LL-OW_yKwq08QVWPoJ6A3CiJnKDU-3jGR901S_XvVxYpab7mOugbO-SeK5S6LxnAbmtkV9O11k3Doe0X486JMPyLw6XzoZLHsxddvAyQK-xWvvJFTZ929HQDjO/s1600/3.png"
      ]
    },
    {
      "title": "Video explicativo",
      "content": "Aplicación del criterio de la razón y la raíz.",
      "videos": [
        "https://www.youtube.com/embed/sibHivkDiNQ"
      ]
    },
    {
      "title": "Criterio de la Integral",
      "content": "Si f(x) es positiva, continua y decreciente en [1,∞), la serie ∑ f(n) converge si ∫_1^∞ f(x) dx converge.",
      "images": [
        "https://i.ytimg.com/vi/M5I_Q75zM3c/maxresdefault.jpg"
      ]
    },
    {
      "title": "Video explicativo",
      "content": "Ejemplo práctico del criterio de la integral.",
      "videos": [
        "https://www.youtube.com/embed/M5I_Q75zM3c"
      ]
    },
    {
      "title": "Criterio de la Comparación",
      "content": "Si 0 ≤ a_n ≤ b_n y ∑ b_n converge, entonces ∑ a_n converge. Si ∑ a_n diverge, entonces ∑ b_n diverge."
    },
    {
      "title": "Video explicativo",
      "content": "Ejemplo práctico del criterio de comparación.",
      "videos": [
        "https://www.youtube.com/embed/u7RT5xXT5WQ"
      ]
    },
    {
      "title": "Referencias",
      "content": "Stewart, J. (2016). *Cálculo de varias variables*. Cengage Learning.\nLarson, R., & Edwards, B. (2014). *Cálculo integral*. McGraw-Hill.\nThomas, G. B., Weir, M. D., & Hass, J. (2018). *Thomas' Calculus*. Pearson.\nKhan Academy. (s.f.). *Series infinitas y criterios de convergencia*. Recuperado de https://es.khanacademy.org"
    }
  ]
}
}
export default PRESENTATIONS;