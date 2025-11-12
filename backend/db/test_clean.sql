-- Borra datos existentes para evitar duplicados si se ejecuta varias veces
TRUNCATE TABLE inventory_movements, order_items, payments, orders, products, users RESTART IDENTITY;

-- Insertar un usuario administrador de ejemplo
-- Contrasena para 'admin' es 'adminpass'
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@acero.com', '$2b$10$J.x/f..jA/y.F.d/f.eW.u4.m/f.eW.u4.m/f.eW.u4.m/f.eW.u', 'Administrador del Sistema', 'admin');

-- Insertar un usuario cliente de ejemplo
-- Contrasena para 'cliente1' es 'clientepass'
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('cliente1', 'cliente1@example.com', '$2b$10$V.g/f..jA/y.F.d/f.eW.u4.m/f.eW.u4.m/f.eW.u4.m/f.eW.u', 'Juan Perez', 'customer');


-- Insertar Productos de Acero y Construccion
INSERT INTO products (name, description, price, sku, category, unit, image_url) VALUES
-- Perfiles Estructurales
('Lamina de Acero al Carbono', 'Lamina de 2mm de espesor, ideal para estructuras metalicas y construccion. Medidas: 1.2m x 2.4m.', 150.00, 'LAC-001', 'Laminas y Placas', 'unidad', 'img/productos/lamina-carbono.jpg'),
('Viga de Acero IPR', 'Viga estructural IPR de 6 pulgadas. Alta resistencia para soportar grandes cargas. Longitud: 6m.', 450.50, 'VAI-001', 'Perfiles Estructurales', 'unidad', 'img/productos/viga-ipr.jpg'),
('Angulo de Acero Estructural', 'Angulo de lados iguales de 3x3 pulgadas y 1/4 de espesor. Longitud: 6m.', 120.25, 'AAE-001', 'Perfiles Estructurales', 'unidad', 'img/productos/angulo-acero.jpg'),
('Perfil Monten (Polin)', 'Perfil Monten de 4 pulgadas, calibre 14. Utilizado comunmente para techados y estructuras ligeras.', 95.50, 'PMP-001', 'Perfiles Estructurales', 'unidad', 'img/productos/perfil-monten.jpg'),
('Canal CPS (Viga U)', 'Canal estructural en forma de U, de 4 pulgadas. Ideal para marcos y soportes. Longitud: 6m.', 180.00, 'CPS-001', 'Perfiles Estructurales', 'unidad', 'img/productos/placeholder.jpg'),
('Viga IPS', 'Viga de acero estructural tipo IPS de 5 pulgadas. Usada en construccion de edificios y puentes. Longitud: 6m.', 390.00, 'VIS-001', 'Perfiles Estructurales', 'unidad', 'img/productos/placeholder.jpg'),
('Perfil HSS', 'Perfil tubular estructural (Hollow Structural Section) cuadrado de 4x4 pulgadas, calibre 11. Longitud: 6m.', 250.80, 'HSS-001', 'Perfiles Estructurales', 'unidad', 'img/productos/placeholder.jpg'),

-- Laminas y Placas
('Placa de Acero Antidesgaste', 'Placa de alta dureza (AR400) de 1/2 pulgada de espesor. Perfecta para maquinaria pesada.', 820.00, 'PAA-001', 'Laminas y Placas', 'unidad', 'img/productos/placa-antidesgaste.jpg'),
('Lamina Galvanizada', 'Lamina recubierta de zinc para proteccion contra la corrosion. Calibre 26. Medidas: 0.91m x 3.05m.', 89.99, 'LAG-001', 'Laminas y Placas', 'unidad', 'img/productos/placeholder.jpg'),
('Lamina Antiderrapante', 'Lamina con patron de diamante para pisos y escaleras. Espesor 3mm. Medidas: 1.22m x 2.44m.', 210.00, 'LAD-001', 'Laminas y Placas', 'unidad', 'img/productos/placeholder.jpg'),
('Lamina de Acero Inoxidable 304', 'Lamina de acero inoxidable tipo 304, acabado P3. Espesor 1.5mm. Medidas: 1.22m x 2.44m.', 450.00, 'LAI-304', 'Laminas y Placas', 'unidad', 'img/productos/placeholder.jpg'),
('Lamina Pintro', 'Lamina de acero galvanizada y pintada, color blanco. Calibre 26. Ideal para techos y fachadas.', 110.50, 'LAP-001', 'Laminas y Placas', 'unidad', 'img/productos/placeholder.jpg'),

-- Tuberia
('Tubo de Acero Inoxidable', 'Tubo redondo de 1.5 pulgadas de diametro. Acabado pulido, resistente a la corrosion.', 85.75, 'TAI-001', 'Tuberia', 'm', 'img/productos/tubo-inoxidable.jpg'),
('Tubo Cedula 40', 'Tubo de acero al carbono sin costura, Cedula 40, de 2 pulgadas de diametro. Longitud: 6.4m.', 190.00, 'TAC-040', 'Tuberia', 'unidad', 'img/productos/placeholder.jpg'),
('Tubo Cuadrado (PTR)', 'Perfil Tubular Rectangular (PTR) de 2x2 pulgadas, calibre 14. Longitud: 6m.', 130.00, 'PTR-001', 'Tuberia', 'unidad', 'img/productos/placeholder.jpg'),
('Tubo Galvanizado', 'Tubo de acero con recubrimiento galvanizado para agua potable. Diametro 1 pulgada. Longitud: 6.4m.', 98.00, 'TAG-001', 'Tuberia', 'unidad', 'img/productos/placeholder.jpg'),
('Tubo para Andamio', 'Tubo de acero de alta resistencia para construccion de andamios. Diametro 1 1/2 pulgadas.', 155.00, 'TUA-001', 'Tuberia', 'unidad', 'img/productos/placeholder.jpg'),

-- Varillas y Mallas
('Varilla Corrugada G-42', 'Varilla de acero para refuerzo de concreto, grado 42. Diametro 3/8 pulgadas. Tramo de 12m.', 45.00, 'VAR-38', 'Varillas y Mallas', 'unidad', 'img/productos/placeholder.jpg'),
('Varilla Corrugada G-60', 'Varilla de acero de alta resistencia, grado 60. Diametro 1/2 pulgada. Tramo de 12m.', 78.50, 'VAR-12', 'Varillas y Mallas', 'unidad', 'img/productos/placeholder.jpg'),
('Malla Electrosoldada 6x6-10/10', 'Malla para refuerzo de concreto en pisos y losas. Rollo de 100m2.', 950.00, 'MAL-1010', 'Varillas y Mallas', 'rollo', 'img/productos/placeholder.jpg'),
('Castillo Electrosoldado', 'Armadura prefabricada para castillos y columnas de 15x15 cm. Tramo de 6m.', 115.00, 'CAS-1515', 'Varillas y Mallas', 'unidad', 'img/productos/placeholder.jpg'),
('Alambre Recocido', 'Alambre de acero suave para amarres en construccion. Calibre 16.', 35.00, 'ALR-16', 'Varillas y Mallas', 'kg', 'img/productos/placeholder.jpg'),
('Alambre de Puas', 'Alambre con puas para cercos perimetrales. Rollo de 300m.', 420.00, 'ALP-300', 'Varillas y Mallas', 'rollo', 'img/productos/placeholder.jpg'),
('Alambron', 'Rollo de alambron de 1/4 de pulgada para construccion.', 1200.00, 'ALN-14', 'Varillas y Mallas', 'rollo', 'img/productos/placeholder.jpg'),

-- Tornilleria y Fijaciones
('Tornillo Autoperforante', 'Tornillo cabeza hexagonal con punta de broca. Medida 1/4" x 1". Caja con 100 pzs.', 85.00, 'TOR-AP-141', 'Tornilleria y Fijaciones', 'caja', 'img/productos/placeholder.jpg'),
('Anclaje de Expansion', 'Anclaje tipo cuna de 3/8" x 3". Para fijacion en concreto.', 12.50, 'ANC-EX-383', 'Tornilleria y Fijaciones', 'unidad', 'img/productos/placeholder.jpg'),
('Varilla Roscada', 'Varilla de acero completamente roscada de 1/2 pulgada. Longitud: 1m.', 35.00, 'VRD-121', 'Tornilleria y Fijaciones', 'unidad', 'img/productos/placeholder.jpg'),
('Tuerca Hexagonal', 'Tuerca estandar de 1/2 pulgada, grado 2. Caja con 100 pzs.', 60.00, 'TUE-HX-12', 'Tornilleria y Fijaciones', 'caja', 'img/productos/placeholder.jpg'),
('Pija para Tablaroca', 'Pija de punta fina para fijacion de paneles de yeso. Medida #6 x 1 1/8". Caja con 100 pzs.', 45.00, 'PIJ-TR-6118', 'Tornilleria y Fijaciones', 'caja', 'img/productos/placeholder.jpg'),
('Clavo para Concreto', 'Clavo de acero templado de 2 pulgadas. Caja de 1kg.', 55.00, 'CLA-CN-2', 'Tornilleria y Fijaciones', 'caja', 'img/productos/placeholder.jpg'),

-- Cementos y Agregados
('Cemento Gris Portland', 'Bulto de cemento gris tipo CPC 30R. Contenido 50 kg.', 250.00, 'CEM-G-50', 'Cementos y Agregados', 'bulto', 'img/productos/placeholder.jpg'),
('Mortero', 'Bulto de mortero para junteo y aplanado. Contenido 50 kg.', 220.00, 'MOR-50', 'Cementos y Agregados', 'bulto', 'img/productos/placeholder.jpg'),
('Yeso', 'Bulto de yeso para construccion. Contenido 40 kg.', 150.00, 'YES-40', 'Cementos y Agregados', 'bulto', 'img/productos/placeholder.jpg'),
('Arena', 'Metro cubico de arena para construccion.', 400.00, 'AGR-AR', 'Cementos y Agregados', 'm3', 'img/productos/placeholder.jpg'),
('Grava', 'Metro cubico de grava de 3/4 de pulgada.', 450.00, 'AGR-GR', 'Cementos y Agregados', 'm3', 'img/productos/placeholder.jpg'),
('Cal Hidratada', 'Bulto de cal para construccion. Contenido 25 kg.', 90.00, 'CAL-25', 'Cementos y Agregados', 'bulto', 'img/productos/placeholder.jpg'),

-- Herramientas
('Disco de Corte para Metal', 'Disco abrasivo de 4 1/2 pulgadas para corte de metal.', 25.00, 'HER-DC-45', 'Herramientas', 'unidad', 'img/productos/placeholder.jpg'),
('Electrodo para Soldar 6013', 'Electrodo para soldadura de acero al carbono, 1/8". Caja de 1kg.', 95.00, 'HER-EL-6013', 'Herramientas', 'caja', 'img/productos/placeholder.jpg'),
('Cinta Metrica 8m', 'Cinta metrica de acero, con carcasa de alta resistencia. Longitud 8m.', 180.00, 'HER-CM-8', 'Herramientas', 'unidad', 'img/productos/placeholder.jpg'),
('Pala Cuadrada', 'Pala de acero con mango de madera. Ideal para mover materiales.', 250.00, 'HER-PC', 'Herramientas', 'unidad', 'img/productos/placeholder.jpg'),
('Carretilla 5.5 ft3', 'Carretilla de obra con llanta neumatica y capacidad de 5.5 pies cubicos.', 1200.00, 'HER-CA', 'Herramientas', 'unidad', 'img/productos/placeholder.jpg'),
('Nivel de Gota 24"', 'Nivel de aluminio de 24 pulgadas con 3 gotas.', 350.00, 'HER-NV-24', 'Herramientas', 'unidad', 'img/productos/placeholder.jpg'),

-- Seguridad Industrial
('Guantes de Carnaza', 'Par de guantes de carnaza para proteccion en trabajos pesados.', 65.00, 'SEG-GC', 'Seguridad Industrial', 'par', 'img/productos/placeholder.jpg'),
('Lentes de Seguridad', 'Lentes de policarbonato con proteccion UV y anti-rayaduras.', 45.00, 'SEG-LS', 'Seguridad Industrial', 'unidad', 'img/productos/placeholder.jpg'),
('Casco de Seguridad', 'Casco de proteccion color blanco, con ajuste de matraca.', 150.00, 'SEG-CS', 'Seguridad Industrial', 'unidad', 'img/productos/placeholder.jpg'),
('Arnes de Seguridad', 'Arnes de cuerpo completo con 1 anillo en D. Para trabajos en altura.', 950.00, 'SEG-AS', 'Seguridad Industrial', 'unidad', 'img/productos/placeholder.jpg'),
('Botas de Seguridad', 'Botas con casquillo de acero, dielectricas. Talla 27 MX.', 850.00, 'SEG-BS-27', 'Seguridad Industrial', 'par', 'img/productos/placeholder.jpg'),
('Chaleco de Seguridad', 'Chaleco tipo brigadista color naranja con reflejantes.', 120.00, 'SEG-CH', 'Seguridad Industrial', 'unidad', 'img/productos/placeholder.jpg'),

-- Adicionales
('Panel de Yeso (Tablaroca)', 'Panel de yeso estandar de 1/2 pulgada. Medidas: 1.22m x 2.44m.', 160.00, 'DIV-PY-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Aislante Termico', 'Rollo de aislante de fibra de vidrio. R-11. Cubre 13 m2.', 750.00, 'AIS-FV-11', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Impermeabilizante Acrilico', 'Cubeta de impermeabilizante elastomerico rojo, 5 anos. 19 L.', 980.00, 'IMP-AC-5R', 'Adicionales', 'cubeta', 'img/productos/placeholder.jpg'),
('Sellador de Poliuretano', 'Cartucho de sellador elastico de poliuretano para juntas. Color gris. 300 ml.', 130.00, 'SEL-PU-G', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Panel W', 'Panel estructural de poliestireno y malla de acero. Para muros y losas.', 450.00, 'PAN-W', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Escalera de Tijera', 'Escalera de aluminio tipo tijera, 6 escalones.', 1500.00, 'ESC-T-6', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Cimbra Metalica', 'Panel para cimbra metalica modular. Medidas: 50cm x 100cm.', 800.00, 'CIM-M-50100', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Puntal Metalico', 'Puntal telescopico de acero, ajustable de 3 a 5 metros.', 600.00, 'PUN-M-35', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Reja de Acero', 'Panel de reja de acero tipo europeo, 2.5m de ancho x 2m de alto.', 1300.00, 'REJ-E-2520', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Poste para Reja', 'Poste de acero para instalacion de reja europea, 2.5m de alto.', 350.00, 'POS-R-25', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Malla Ciclonica', 'Rollo de malla ciclonica galvanizada, 2m de alto x 20m de largo.', 1800.00, 'MAL-C-220', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Cinta para Juntas', 'Cinta de papel para tratamiento de juntas en paneles de yeso. Rollo de 76m.', 40.00, 'DIV-CJ-76', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Compuesto para Juntas', 'Caja de compuesto para juntas (Redimix). 21.8 kg.', 350.00, 'DIV-RJ-22', 'Adicionales', 'caja', 'img/productos/placeholder.jpg'),
('Tornillo Estructural A325', 'Tornillo de alta resistencia A325 de 3/4" x 2".', 25.00, 'TOR-A325-342', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Placa de Conexion', 'Placa de acero de 1/2" para conexiones estructurales. Medidas: 20cm x 20cm.', 90.00, 'PLC-12-2020', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Grout sin Contraccion', 'Saco de Grout (mortero sin contraccion) para anclajes y bases. 25 kg.', 450.00, 'GRO-25', 'Adicionales', 'saco', 'img/productos/placeholder.jpg'),
('Adhesivo Epoxico', 'Adhesivo de dos componentes para anclaje de varillas en concreto.', 600.00, 'ADH-EP', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Membrana de Curado', 'Cubeta de membrana de curado para concreto. 19 L.', 700.00, 'CUR-19', 'Adicionales', 'cubeta', 'img/productos/placeholder.jpg'),
('Sonotubo', 'Tubo de carton para cimbra de columnas circulares. Diametro 30cm, altura 3m.', 320.00, 'SON-303', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Geomembrana', 'Rollo de geomembrana de polietileno de alta densidad para impermeabilizacion.', 2500.00, 'GEO-HDPE', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Geotextil', 'Rollo de geotextil no tejido para separacion de suelos y drenaje.', 1800.00, 'GEO-NT', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Tubo de PVC Sanitario', 'Tubo de PVC para drenaje sanitario, 4 pulgadas de diametro. Tramo de 6m.', 280.00, 'PVC-S-4', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Tubo de PVC Hidraulico', 'Tubo de PVC para conduccion de agua a presion, 1/2 pulgada. Tramo de 6m.', 90.00, 'PVC-H-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Registro Sanitario', 'Registro prefabricado de polietileno para drenaje.', 850.00, 'REG-S', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Bomba de Agua 1/2 HP', 'Bomba centrifuga para agua, 1/2 HP.', 1600.00, 'BOM-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Tinaco 1100 L', 'Tinaco de polietileno para almacenamiento de agua, 1100 litros.', 2200.00, 'TIN-1100', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Calentador de Agua', 'Calentador de paso (boiler) para 1 servicio.', 2500.00, 'CAL-1S', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Mezcladora para Fregadero', 'Llave mezcladora para cocina, acabado cromo.', 900.00, 'MEZ-C', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('WC Ecologico', 'Inodoro de bajo consumo de agua.', 1800.00, 'WC-ECO', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Pintura Vinilica Blanca', 'Cubeta de pintura vinil-acrilica color blanco. 19 L.', 850.00, 'PIN-V-B19', 'Adicionales', 'cubeta', 'img/productos/placeholder.jpg'),
('Esmalte Anticorrosivo', 'Litro de esmalte alquidalico para proteccion de metales. Color gris.', 150.00, 'PIN-E-G1', 'Adicionales', 'litro', 'img/productos/placeholder.jpg'),
('Brocha 4 pulgadas', 'Brocha de cerdas naturales para aplicacion de pintura.', 80.00, 'HER-B-4', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Rodillo para Pintar 9"', 'Rodillo de felpa para superficies lisas.', 120.00, 'HER-R-9', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Thinner Estandar', 'Litro de solvente (thinner) para diluir pintura.', 60.00, 'SOL-T-1', 'Adicionales', 'litro', 'img/productos/placeholder.jpg'),
('Estopa', 'Bolsa de estopa para limpieza. 1 kg.', 70.00, 'LIM-ES-1', 'Adicionales', 'bolsa', 'img/productos/placeholder.jpg'),
('Lija para Metal Grano 80', 'Pliego de lija de agua para metal, grano 80.', 15.00, 'LIJ-M-80', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Lija para Madera Grano 120', 'Pliego de lija para madera, grano 120.', 12.00, 'LIJ-W-120', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Pegamento para PVC', 'Lata de pegamento para tuberia de PVC. 240 ml.', 95.00, 'PEG-PVC-240', 'Adicionales', 'lata', 'img/productos/placeholder.jpg'),
('Cinta de Teflon', 'Cinta selladora para roscas (teflon). Rollo de 1/2 pulgada.', 10.00, 'CIN-TF-12', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Silicona Transparente', 'Cartucho de sellador de silicona de uso general. Transparente. 280 ml.', 85.00, 'SEL-S-T', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Pistola para Calafatear', 'Pistola de esqueleto para aplicar cartuchos de silicona.', 120.00, 'HER-PCAL', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Flexometro 5m', 'Flexometro profesional con carcasa de goma. 5m.', 150.00, 'HER-FX-5', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Martillo de Una 16 oz', 'Martillo de carpintero con una curva. 16 oz.', 220.00, 'HER-MU-16', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Pinzas de Electricista 9"', 'Pinzas de corte y sujecion para electricista. 9 pulgadas.', 250.00, 'HER-PE-9', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Pinzas de Presion 10"', 'Pinzas de presion con mordaza curva. 10 pulgadas.', 180.00, 'HER-PP-10', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Juego de Desarmadores', 'Juego de 6 desarmadores (3 planos, 3 de cruz).', 320.00, 'HER-JD-6', 'Adicionales', 'juego', 'img/productos/placeholder.jpg'),
('Arco para Segueta', 'Arco de solera para segueta de 12 pulgadas.', 150.00, 'HER-AS-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Segueta Bimetalica', 'Hoja de segueta bimetalica de 12", 24 TPI.', 20.00, 'HER-SB-24', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Taladro Rotomartillo 1/2"', 'Taladro percutor de 1/2 pulgada, 600W.', 1400.00, 'HER-TR-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Esmeriladora Angular 4 1/2"', 'Esmeriladora (pulidora) de 4 1/2 pulgadas, 800W.', 1100.00, 'HER-EA-45', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Planta de Soldar 180A', 'Maquina de soldar por arco electrico, 180 Amperes.', 3500.00, 'HER-PS-180', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Careta para Soldar', 'Careta electronica (fotosensible) para soldar.', 750.00, 'SEG-CSOL', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Extension Electrica Uso Rudo', 'Extension de 15 metros, calibre 12.', 450.00, 'ELE-EXT-15', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Foco LED 15W', 'Foco de alta eficiencia, luz blanca. 15W.', 60.00, 'ELE-FL-15', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Apagador Sencillo', 'Placa con apagador sencillo, color blanco.', 45.00, 'ELE-AS-1', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Contacto Duplex', 'Placa con contacto doble polarizado, color blanco.', 50.00, 'ELE-CD-1', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Caja de Registro (Chalupa)', 'Caja de registro metalica para instalaciones electricas.', 15.00, 'ELE-CR-1', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Poliducto Naranja 1/2"', 'Rollo de poliducto flexible para cableado electrico. 50m.', 250.00, 'ELE-PN-12', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Cable THW Calibre 12', 'Rollo de cable de cobre, calibre 12. 100m. Color negro.', 1200.00, 'ELE-CA-12N', 'Adicionales', 'rollo', 'img/productos/placeholder.jpg'),
('Cinta de Aislar', 'Cinta aislante de PVC. Color negro.', 15.00, 'ELE-CIA-N', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Panel de Carga (Centro de Carga)', 'Centro de carga para 2 pastillas (interruptores).', 220.00, 'ELE-CC-2', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Interruptor Termomagnetico 20A', 'Pastilla termomagnetica de 1 polo, 20 Amperes.', 95.00, 'ELE-IT-20', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Varilla de Tierra (Copperweld)', 'Varilla para sistema de tierras, 1.5m.', 180.00, 'ELE-VT-15', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Conector para Varilla de Tierra', 'Conector mecanico para cable y varilla de tierra.', 35.00, 'ELE-CVT', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Soplete de Gas', 'Soplete con encendido electronico para plomeria.', 450.00, 'HER-SG', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Tanque de Gas Portatil', 'Lata de gas butano/propano para soplete.', 85.00, 'GAS-BP', 'Adicionales', 'lata', 'img/productos/placeholder.jpg'),
('Cortador de Tubo de Cobre', 'Herramienta para cortar tubo de cobre de hasta 1 pulgada.', 220.00, 'HER-CTC', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Llave Stilson 12"', 'Llave para tubo (Stilson) de 12 pulgadas.', 350.00, 'HER-LS-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Cadenas de Acero 1/4"', 'Cadena de eslabones de acero galvanizado. Se vende por metro.', 45.00, 'CAD-14', 'Adicionales', 'm', 'img/productos/placeholder.jpg'),
('Grillete 1/2"', 'Grillete de acero para izaje, capacidad 2 toneladas.', 90.00, 'GRI-12', 'Adicionales', 'unidad', 'img/productos/placeholder.jpg'),
('Cable de Acero 1/4"', 'Cable de acero galvanizado, 7x19. Se vende por metro.', 30.00, 'CAB-14', 'Adicionales', 'm', 'img/productos/placeholder.jpg'),
('Abrazadera para Cable', 'Juego de 2 abrazaderas (perros) para cable de 1/4".', 25.00, 'ABR-14', 'Adicionales', 'juego', 'img/productos/placeholder.jpg');

-- Anadir stock inicial para cada producto
-- Se asume que los productos se insertaron en el orden anterior.
-- Esta parte es mas compleja de hacer generica sin saber los UUIDs,
-- por lo que se hace una subconsulta para obtener el ID por SKU.

INSERT INTO inventory_movements (product_id, quantity, type, notes)
SELECT id, 100, 'initial', 'Stock inicial de almacen' FROM products WHERE sku IN (
    'LAC-001', 'VAI-001', 'AAE-001', 'PMP-001', 'CPS-001', 'VIS-001', 'HSS-001', 'PAA-001', 'LAG-001', 'LAD-001',
    'LAI-304', 'LAP-001', 'TAI-001', 'TAC-040', 'PTR-001', 'TAG-001', 'TUA-001', 'VAR-38', 'VAR-12', 'MAL-1010',
    'CAS-1515', 'ALR-16', 'ALP-300', 'ALN-14', 'TOR-AP-141', 'ANC-EX-383', 'VRD-121', 'TUE-HX-12', 'PIJ-TR-6118',
    'CLA-CN-2', 'CEM-G-50', 'MOR-50', 'YES-40', 'AGR-AR', 'AGR-GR', 'CAL-25', 'HER-DC-45', 'HER-EL-6013', 'HER-CM-8',
    'HER-PC', 'HER-CA', 'HER-NV-24', 'SEG-GC', 'SEG-LS', 'SEG-CS', 'SEG-AS', 'SEG-BS-27', 'SEG-CH', 'DIV-PY-12',
    'AIS-FV-11', 'IMP-AC-5R', 'SEL-PU-G', 'PAN-W', 'ESC-T-6', 'CIM-M-50100', 'PUN-M-35', 'REJ-E-2520', 'POS-R-25',
    'MAL-C-220', 'DIV-CJ-76', 'DIV-RJ-22', 'TOR-A325-342', 'PLC-12-2020', 'GRO-25', 'ADH-EP', 'CUR-19', 'SON-303',
    'GEO-HDPE', 'GEO-NT', 'PVC-S-4', 'PVC-H-12', 'REG-S', 'BOM-12', 'TIN-1100', 'CAL-1S', 'MEZ-C', 'WC-ECO',
    'PIN-V-B19', 'PIN-E-G1', 'HER-B-4', 'HER-R-9', 'SOL-T-1', 'LIM-ES-1', 'LIJ-M-80', 'LIJ-W-120', 'PEG-PVC-240',
    'CIN-TF-12', 'SEL-S-T', 'HER-PCAL', 'HER-FX-5', 'HER-MU-16', 'HER-PE-9', 'HER-PP-10', 'HER-JD-6', 'HER-AS-12',
    'HER-SB-24', 'HER-TR-12', 'HER-EA-45', 'HER-PS-180', 'SEG-CSOL', 'ELE-EXT-15', 'ELE-FL-15', 'ELE-AS-1',
    'ELE-CD-1', 'ELE-CR-1', 'ELE-PN-12', 'ELE-CA-12N', 'ELE-CIA-N', 'ELE-CC-2', 'ELE-IT-20', 'ELE-VT-15',
    'ELE-CVT', 'HER-SG', 'GAS-BP', 'HER-CTC', 'HER-LS-12', 'CAD-14', 'GRI-12', 'CAB-14', 'ABR-14'
);


-- Mensaje de finalizacion
\echo 'Datos de prueba insertados correctamente.'
