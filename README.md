# Laboratorio BI — Ruta de Fundamentos de Datos

GitHub Pages con la guía y roadmap del track de datos: de Excel a SQL, de SQL a Python, de Python a arquitectura de datos y ML.

Sitio publicado: https://haroldsthid.github.io/DataFoundations-Roadmap/

## Qué contiene

- **Ruta sugerida** — los 6 módulos macro del programa, con estado (activo / próximo) y link al repo de cada módulo.
- **Hitos clave** — sesiones y entregables del programa.
- **Repos del track** — cards con link a cada repo publicado; se agregan a medida que arrancan los próximos módulos.
- **Recursos mapeados** — herramientas de poblamiento de datos, diseño ERM, y certificaciones cloud.
- **Videos de referencia** — placeholder, se completa con contenido del programa.
- **Playground SQL** — SQLite corriendo en el navegador vía [sql.js](https://sql.js.org) (WebAssembly, sin backend), con un esquema `clientes/productos/ventas` precargado para practicar queries.

## Cómo actualizar

Archivos planos, sin build step:

- `index.html` — contenido y estructura.
- `styles.css` — estilos (dark/light automático según el sistema).
- `app.js` — lógica del playground SQL.

Para sumar un nuevo repo del track: agregar una card en la sección `#repos` de `index.html` y actualizar el estado del módulo correspondiente en `#ruta`.

## Cómo correrlo local

Cualquier servidor estático sirve, por ejemplo:

```bash
python -m http.server 8000
```
