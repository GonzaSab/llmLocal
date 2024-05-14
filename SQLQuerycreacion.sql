create database gomeria
use gomeria
CREATE TABLE NeumaticosAutos (neumatico_id INT PRIMARY KEY identity(1,1),medida VARCHAR(50),marca VARCHAR(50));

select * from NeumaticosAutos where medida = '482/26/46' AND marca = 'Pirelli'

delete from NeumaticosAutos where marca is null

DECLARE @i INT = 1;
DECLARE @marca VARCHAR(50);

WHILE @i <= 10 -- Cambia 10 al número deseado de filas
BEGIN
    SET @marca = CASE FLOOR(RAND() * 4)
                    WHEN 0 THEN 'Yokohama'
                    WHEN 1 THEN 'Bridgestone'
                    WHEN 2 THEN 'Pirelli'
                    WHEN 3 THEN 'Fate'
                END;

    INSERT INTO NeumaticosAutos (medida, marca)
    VALUES (CONCAT(FLOOR(RAND() * (999 - 100 + 1) + 100), '/', FLOOR(RAND() * (99 - 10 + 1) + 10), '/', FLOOR(RAND() * (99 - 10 + 1) + 10)), @marca);

    SET @i = @i + 1;
END;

