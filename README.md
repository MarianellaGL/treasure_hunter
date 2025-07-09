# 🎯 Treasure Hunter v2.0 - Escape Room Hacker

Una aplicación web interactiva para crear una búsqueda del tesoro con temática de escape room hacker. Perfecta para sorprender a tu pareja con un regalo de cumpleaños único.

## 🚀 Características

- **Interfaz de Hacker**: Diseño inspirado en películas de hackers con terminal, efectos visuales y animaciones.
- **10 Pistas Legendarias**: Cada pista tiene diferentes niveles de dificultad; algunas requieren resolver retos de código real (Python o JavaScript).
- **Minijuegos de Hacking**:
  - **Retos de Código**: Ejecuta y valida código Python (con Pyodide) y JavaScript directamente en el navegador.
  - **Enigmas Especiales**: Pistas tipo "special" que requieren respuestas secretas.
- **Seguimiento de Progreso**: Visualización del avance en tiempo real, persistente aunque recargues la página.
- **Terminal Interactiva**: Muestra mensajes, feedback y estado del juego.
- **Pantalla Final Personalizada**: Mensaje oculto en binario y animación especial al completar todas las pistas.
- **Diseño Responsivo**: Funciona en desktop y móvil.

## 🎮 Cómo Jugar

1. **Inicio**: Presiona "HACKEA LA MATRIX" para comenzar la misión.
2. **Resuelve Pistas**: Lee la pista, busca la ubicación y resuelve el enigma o reto de código.
3. **Valida tu Respuesta**: Ingresa la respuesta o ejecuta el código según el tipo de pista.
4. **Progreso y Feedback**: El sistema guarda tu avance y te muestra mensajes desafiantes tras cada pista.
5. **Pantalla Final**: Al completar todas las pistas, disfruta de la animación y el mensaje secreto.

## 🗺️ Ubicaciones de las Pistas (Ejemplo)

1. Pista Comodín
2. Dormitorio
3. Baño
4. Patio
5. Cocina
6. Escritorio
7. Living
8. Living (zona descanso)
9. Garage (reto de código JS)
10. Ropero (pista final)

## 🔧 Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd treasure-hunter

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Personalización

Para personalizar las pistas, edita el array `clues` en `src/utils/clues.ts`.  
Para modificar los retos de código, edita `src/utils/codeChallenges.ts`.

## 🎨 Tecnologías Utilizadas

- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand** (estado global)
- **Pyodide** (ejecución de Python en el navegador)
- **Monaco Editor** (editor de código)
- **Animaciones CSS**

## 🛠️ Desarrollo y Debug

- El progreso se guarda automáticamente en el navegador.
- Si necesitas reiniciar el juego, usa la función de limpiar datos en la Home.
- Para pruebas, puedes agregar botones temporales en HomePage.

## 📝 Licencia

Este proyecto es de uso personal y educativo.  
¡Disfruta creando aventuras únicas para tus seres queridos!

---

**¡Que la fuerza del hacking esté contigo!** 💻✨
