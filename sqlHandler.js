var sql = require('mssql/msnodesqlv8');

var config = {
  connectionString: 'Driver=SQL Server;Server=MARIANOPC\\SQLEXPRESS;Database=gomeria;Trusted_Connection=true;'
};

const executeSQLQuery = async (query) => {
    try {
        await sql.connect(config);
        const result = await new sql.Request().query(query);
        console.log(result)
        return result.recordset; // Retorna los resultados de la consulta
    } catch (err) {
        console.error('Error al ejecutar consulta SQL:', err);
        throw err;
    } finally {
        await sql.close();
    }
};

module.exports = { executeSQLQuery }; //exporta la funcion
