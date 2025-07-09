import type { CodeChallenge } from "../types/game";

export const codeChallenges: Record<number, CodeChallenge> = {
  2: {
    title: "Dream Sequence Matrix",
    description:
      "El dormitorio guarda un patrón de sueños en una matriz. Encuentra la secuencia Fibonacci oculta en las diagonales y descifra el código de acceso.",
    language: "python",
    initialCode: `import numpy as np

dream_matrix = np.array([
    [1, 1, 2, 3],
    [5, 8, 13, 21],
    [34, 55, 89, 144],
    [233, 377, 610, 987]
])

def solve_dream_matrix():
    # tu código aquí
    return f"dream_sequence_{code}"
`,
    solution: `def solve_dream_matrix():
    secondary_diagonal = np.diag(np.fliplr(dream_matrix))
    code = np.sum(secondary_diagonal)
    return f"dream_sequence_{code}"
`,
    hints: [
      "Analiza la matriz y sus diagonales",
      "Busca patrones matemáticos",
      "El resultado es la suma de la diagonal secundaria",
    ],
    validation: (code: string) => {
      // Verificar que use las funciones correctas
      const hasCorrectFunctions =
        code.includes("np.diag") && code.includes("np.fliplr");

      // Verificar que devuelva el resultado correcto
      const hasCorrectResult =
        code.includes("dream_sequence_304") ||
        code.includes("dream_sequence_{code}");

      // Verificar que tenga la lógica básica
      const hasBasicLogic =
        code.includes("solve_dream_matrix") || code.includes("return");

      return hasCorrectFunctions && hasCorrectResult && hasBasicLogic;
    },
  },

  9: {
    title: "Suma secreta",
    description:
      "Tienes un array de números. Si logras sumar todos correctamente, obtendrás la ubicación secreta.",
    language: "javascript",
    initialCode: `// Suma secreta
// Suma todos los números del array y retorna el resultado

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function encontrarUbicacion() {
    // Tu código aquí


    return ''
}

// Ejecuta tu función
const resultado = encontrarUbicacion();
console.log("Resultado:", resultado);`,
    solution: `function encontrarUbicacion() {
    const suma = numeros.reduce((acc, n) => acc + n, 0);
    return suma;
}`,
    hints: [
      "Recorre el array y suma todos los valores.",
      "Puedes usar un bucle o un método de array.",
      "El resultado correcto te dará la ubicación secreta.",
      "La suma de 1 a 9 es 45.",
    ],
    validation: (code: string) => {
      return (
        code.includes("numeros") &&
        (code.includes("reduce") ||
          code.includes("for") ||
          code.includes("while"))
      );
    },
  },
};
