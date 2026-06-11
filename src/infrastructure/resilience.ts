/**
 * Envuelve una promesa para reintentarla de manera exponencial si falla.
 * @param fn Función asíncrona a ejecutar.
 * @param retries Cantidad de reintentos permitidos.
 * @param delay Tiempo de espera inicial en milisegundos.
 */

export async function withExponentialBackoff<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> {
    try{
        return await fn();
    }catch(error){
        if (retries <= 0) {
            throw error;
        }

        console.warn(
      `[Resilience] Operación fallida. Reintentando en ${delay}ms... Quedan ${retries} intentos.`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    return withExponentialBackoff(fn, retries - 1, delay * 2);
    }
}