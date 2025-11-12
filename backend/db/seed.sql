-- Este script inserta datos de ejemplo en la tabla de productos.
-- Asegúrate de que la tabla 'products' exista antes de ejecutarlo.

-- Borrar datos existentes para evitar duplicados al re-ejecutar
DELETE FROM products;

-- Insertar nuevos productos con imágenes
INSERT INTO products (name, description, price, category, unit, image_url, stock) VALUES
('Lámina de Acero Galvanizado', 'Lámina de 2.44m x 1.22m, calibre 24. Ideal para cubiertas y cerramientos.', 85000.00, 'Galvanizado', 'unidad', 'images/Canal CPS (Viga U).jpeg', 150),
('Perfil de Acero Estructural (Viga IPR)', 'Viga IPR de 6 pulgadas, 12 metros de largo. Alta resistencia para construcción.', 750000.00, 'Acero al carbono', 'unidad', 'images/Viga de Acero IPR.jpeg', 40),
('Tubo de Acero Inoxidable', 'Tubo redondo de 1 pulgada de diámetro, acabado pulido. Ideal para barandillas.', 120000.00, 'Inoxidable', 'metro', 'images/Perfil Monten (Polin).jpeg', 300),
('Lámina de Acero Cold Rolled', 'Lámina de 2.44m x 1.22m, calibre 20. Superficie lisa para gabinetes y automoción.', 95000.00, 'Cold Rolled', 'unidad', 'images/Viga IPS.jpg', 200),
('Lámina de Acero Perforada', 'Lámina con perforaciones redondas de 5mm. Usada en fachadas y filtros.', 110000.00, 'Perforada', 'unidad', 'images/Canal CPS (Viga U).jpeg', 80),
('Ángulo de Acero', 'Ángulo de 2x2 pulgadas, 6 metros de largo. Para estructuras metálicas ligeras.', 65000.00, 'Acero al carbono', 'unidad', 'images/Angulo de Acero Estructural.jpeg', 500),
('Platina de Acero', 'Platina de 3 pulgadas de ancho, 1/4 de espesor. Múltiples usos en herrería.', 45000.00, 'Acero al carbono', 'unidad', 'images/Viga IPS.jpg', 400),
('Malla Electrosoldada', 'Rollo de 2.5m x 40m. Ideal para refuerzo de concreto en placas y pisos.', 350000.00, 'Especiales', 'rollo', 'images/Perfil Monten (Polin).jpeg', 60);

-- Mensaje de confirmación
-- \echo 'Datos de ejemplo para productos insertados correctamente.'
