const base_url = "http://localhost:1234/v1";
const api_key = "not-needed"; // Not needed for the local mock server

// Función para realizar la solicitud al modelo de lenguaje y devolver la respuesta sin modificar
const postCompletion = async (messages) => {
  try {
    const response = await fetch(`${base_url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: "local-model", // Este campo no se está utilizando actualmente
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const completion = await response.json();
    const answer = completion.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error('ErrorGS:', error);
  }
};

// Función para realizar la solicitud al modelo de lenguaje y devolver la respuesta como una consulta SQL
const postCompletionWithSQL = async (messages) => {
  try {
    const response = await fetch(`${base_url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: "local-model", // Este campo no se está utilizando actualmente
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const completion = await response.json();
    const answer = completion.choices[0].message.content;

    // Aquí se invoca la función para generar la consulta SQL
    const sqlQuery = generateSQLQuery(answer);
    console.log("Generated SQL query:", sqlQuery);

    return sqlQuery;
  } catch (error) {
    console.error('ErrorGS:', error);
  }
};

// Función para generar la consulta SQL a partir de la cadena de respuesta
const generateSQLQuery = (inputString) => {
  // Separar el string de entrada por líneas
  const lines = inputString.split('\n');
  
  // Inicializar las variables para medida y marca
  let medida = null;
  let marca = null;

  // Iterar sobre cada línea del string de entrada
  for (const line of lines) {
    // Buscar las líneas que contienen información sobre medida y marca
    if (line.includes('medida')) {
      const medidaMatch = line.match(/'([^']+)'/);
      if (medidaMatch) {
        medida = medidaMatch[1]; // Extraer el valor de medida
      }
    } else if (line.includes('marca')) {
      const marcaMatch = line.match(/'([^']+)'/);
      if (marcaMatch) {
        marca = marcaMatch[1]; // Extraer el valor de marca
      }
    }
  }

  // Construir la consulta SQL
  let query = 'SELECT * FROM NeumaticosAutos\n';
  query += 'WHERE ';

  // Añadir la condición para medida
  if (medida) {
    query += `medida LIKE '%${medida}%'`;
  } else {
    query += '1=1'; // Si no se proporciona medida, no se aplica ningún filtro
  }

  // Añadir la condición para marca si está presente
  if (marca) {
    query += ` AND marca IS NOT NULL`;
  }

  return query;
};

module.exports = { postCompletion, postCompletionWithSQL };
