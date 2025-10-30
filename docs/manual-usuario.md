# Manual de usuario (actualizado)

## Catálogo: visualización de imágenes

- Las imágenes de productos y categorías se cargan desde el servidor backend.
- Si una imagen está ausente o falla la carga, se mostrará un placeholder (icono genérico) automáticamente.
- La aplicación soporta rutas relativas (por ejemplo, `/uploads/...`) y absolutas (`http://...`).

## Creación de categorías

1. En el panel de administración, abre "Categorías" (`/categorias`).
2. Completa el formulario:
   - Nombre (obligatorio).
   - Descripción (opcional).
   - Imagen representativa (opcional). Dimensiones mínimas recomendadas: 400x300 px. Formatos aceptados: JPG, PNG, WEBP.
3. Pulsa "Crear". La nueva categoría se mostrará en el listado.

## Validación de precios (productos)

- El precio debe ser un número positivo con un mínimo de 0.01.
- Validaciones en frontend y backend:
  - El campo de precio en el formulario exige `min=0.01` y `step=0.01`.
  - El backend rechaza precios inválidos y muestra el mensaje: "El precio debe ser un número positivo (mínimo 0.01)".

## Responsividad

- Las vistas de administración y catálogo se adaptan automáticamente a móviles, tablet y escritorio.

## Notas

- Si las imágenes no se muestran, verifica que el backend esté activo y que `API_URL/NEXT_PUBLIC_API_URL` apunten al servidor correcto.
- Las imágenes se guardan en `public/uploads/products` y `public/uploads/categories`.

