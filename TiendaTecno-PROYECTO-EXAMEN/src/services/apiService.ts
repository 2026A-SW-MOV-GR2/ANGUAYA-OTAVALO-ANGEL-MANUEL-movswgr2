// URL base de la API de pruebas
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Tipo de dato que devuelve la API
export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

// Función para obtener un post por ID (GET)
export const obtenerPost = async (id: number): Promise<Post> => {
  try {
    console.log(`[INFO] GET /posts/${id}`);
    const response = await fetch(`${BASE_URL}/posts/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`[INFO] GET exitoso, post recibido:`, data);
    return data;
  } catch (error) {
    console.error(`[ERROR] Fallo en GET:`, error);
    throw error;
  }
};

// Función para actualizar un post (PUT)
export const actualizarPost = async (
  id: number,
  title: string,
  body: string
): Promise<Post> => {
  try {
    console.log(`[INFO] PUT /posts/${id}`);
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, title, body, userId: 1 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`[INFO] PUT exitoso, respuesta:`, data);
    return data;
  } catch (error) {
    console.error(`[ERROR] Fallo en PUT:`, error);
    throw error;
  }
};
