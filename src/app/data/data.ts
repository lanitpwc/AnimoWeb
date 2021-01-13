/**
 * Rango de edades
 */
/**
 * Las edades, areas y cargos, son parametrizables y dependen de la empresa
 */
export const Ages = [
    { value: 'menor igual a 20', text: '-20' },
    { value: 'entre 21 y 25', text: '21-25' },
    { value: 'entre 26 y 30', text: '26-30' },
    { value: 'entre 31 y 35', text: '31-35' },
    { value: 'entre 36 y 40', text: '36-40' },
    { value: 'entre 41 y 45', text: '41-45' },
    { value: 'superior igual 46', text: '46+' },
];

export const Areas = [
    { 
        id: '001',
        text: 'Administración',
        subarea: [
            {
                id: 1,
                text: 'Administración A'
            },
            {
                id: 2,
                text: 'Administración B'
            },
            {
                id: 3,
                text: 'Administración C'
            }
        ]
    },
    {
        id: '002',
        text: 'Design',
        subarea: [
            {
                id: 1,
                text: 'Design A'
            },
            {
                id: 2,
                text: 'Design B'
            },
            {
                id: 3,
                text: 'Design C'
            }
        ]
    },
    {
        id: '003',
        text: 'Marketing',
        subarea: [
            {
                id: 1,
                text: 'Marketing A'
            },
            {
                id: 2,
                text: 'Marketing B'
            },
            {
                id: 3,
                text: 'Marketing C'
            }
        ]
    },
    {
        id: '004',
        text: 'Tech',
        subarea: [
            {
                id: 1,
                text: 'Tech A'
            },
            {
                id: 2,
                text: 'Tech B'
            },
            {
                id: 3,
                text: 'Tech C'
            }
        ]
    },
];

// export const Cargos = [
//     { text: 'Analista' },
//     { text: 'Director' },
//     { text: 'Obrero' },
//     { text: 'Tecnico' },
// ]

export const Sexos = [
    { text: 'Masculino', value: 'M'},
    { text: 'Femenino', value: 'F' }
]


/**
 * Datos de Opciones disponibles provinientes de la hoja de calculo
 */
export const Edades = ['18-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '>50']

export const Empresas = [
    { name: 'pwc'},
    { name: 'pappcorn'},
    { name: 'ecopetrol'}
]

export const Cargos = [
    { name: 'Consultor' },
    { name: 'Gerente' },
    { name: 'Analista' },
    { name: 'Aprendiz' },
    { name: 'Asistente' },
    { name: 'Asociado' },
    { name: 'Auxiliar' },
    { name: 'Coordinador' },
    { name: 'Director' },
    { name: 'Jefe' },
    { name: 'Practicante' },
    { name: 'Procesador de textos' },
    { name: 'Recepcionista' },
    { name: 'Secretaria' },
    { name: 'Traductor' },
    { name: 'Mensajero' },
    { name: 'Servicios generales' },
    { name: 'Socio' },
    { name: 'Associate partner' }
]

export const Ciudades = [
    {
        name: 'Barranquilla',
        sedes: [
            { name: 'Barranquilla' }
        ]
    },
    {
        name: 'Cali',
        sedes: [
            { name: 'Cali' }
        ]
    },
    {
        name: 'Cartagena',
        sedes: [
            { name: 'Cartagena' }
        ]
    },
    {
        name: 'Medellín',
        sedes: [
            { name: 'Medellín' }
        ]
    },
    {
        name: 'Bogotá',
        sedes: [
            { name: 'Calle 100' },
            { name: 'Calle 156' },
            { name: 'Calle 94' },
            { name: 'Carrera 109 con Calle 100' },
            { name: 'Dorado Plaza' },
            { name: 'Ed. Tequendama' }
        ]
    }
]

export const LOS_SUBLOS_BUSSINESS_UNITS = [
    {
        name: 'Administración',
        sublos: [
            {
                name: 'Finanzas',
                business_units: [
                    { name: 'Contabilidad' },
                    { name: 'Finanzas' },
                    { name: 'Tesoreria' },
                    { name: 'Estadistica' },
                    { name: 'Analisis y Presupuestos' },
                ]
            },
            {
                name: 'GTS',
                business_units: [
                    { name: 'GTS' }
                ]
            },
            {
                name: 'Human Capital',
                business_units: [
                    { name: 'HR' },
                    { name: 'L&E' }
                ]
            },
            {
                name: 'Other Infrastructure',
                business_units: [
                    { name: 'Administración' },
                    { name: 'B&C' },
                    { name: 'C&M' },
                    { name: 'CDD' },
                    { name: 'OGC' },
                    { name: 'QMS' },
                    { name: 'Responsabilidad Social Corporativa' }
                ]
            },
        ]
    },
    {
        name: 'Advisory',
        sublos: [
            {
                name: 'AESCC',
                business_units: [
                    { name: 'AESCC' }
                ]
            },
            {
                name: 'Analytics',
                business_units: [
                    { name: 'Analytics' }
                ]
            },
            {
                name: 'CP&I',
                business_units: [
                    { name: 'CP&I' }
                ]
            },
            {
                name: 'Deals',
                business_units: [
                    { name: 'Deals' }
                ]
            },
            {
                name: 'FS',
                business_units: [
                    { name: 'FS' }
                ]
            },
            {
                name: 'GAF',
                business_units: [
                    { name: 'GAF' }
                ]
            },
            {
                name: 'Health',
                business_units: [
                    { name: 'Health' }
                ]
            },
            {
                name: 'Knowledge Solutions',
                business_units: [
                    { name: 'Knowledge Solutions' }
                ]
            },
            {
                name: 'MC',
                business_units: [
                    { name: 'MS' },
                    { name: 'PI' },
                    { name: 'SCM' },
                    { name: 'M&G' },
                    { name: 'ST&' }
                ]
            },
            {
                name: 'Outsourcing',
                business_units: [
                    { name: 'MBO-BOOKEEPING-FAS' },
                    { name: 'MBO-BOOKEEPING-HRO' },
                    { name: 'MBO-BOOKEEPING-AFS' },
                    { name: 'MBO-BOOKEEPING-IOS' },
                    { name: 'MBO-BOOKEEPING-SOF' }
                ]
            },
            {
                name: 'P&O',
                business_units: [
                    { name: 'P&O' }
                ]
            },
            {
                name: 'RAS',
                business_units: [
                    { name: 'RAS' }
                ]
            },
            {
                name: 'RCS',
                business_units: [
                    { name: 'CIS' },
                    { name: 'ITS' },
                    { name: 'ITS Consulting' },
                    { name: 'RS' },
                    { name: 'ERP' },
                    { name: 'Forensics' },
                    { name: 'Sostenibilidad' }
                ]
            },
            {
                name: 'TC',
                business_units: [
                    { name: 'ECA' },
                    { name: 'BTO' },
                    { name: 'CS&P' },
                    { name: 'IT Strategy' },
                    { name: 'PAS' },
                    { name: 'SAP' }
                ]
            }
        ]
    },
    {
        name: 'Assurance',
        sublos: [
            {
                name: 'Assurance',
                business_units: [
                    { name: 'Assurance' },
                    { name: 'SAT' },
                    { name: 'Expanded Assurance' },
                    { name: 'FSIP' },
                    { name: 'Capital Markets' }
                ]
            }
        ]
    },
    {
        name: 'TLS',
        sublos: [
            {
                name: 'Consulting',
                business_units: [
                    { name: 'Consulting' },
                    { name: 'Compliance' },
                    { name: 'Precios de Transferencia' },
                    { name: 'TCO' }
                ]
            },
            {
                name: 'Legal',
                business_units: [
                    { name: 'CIAC' },
                    { name: 'Legal' }
                ]
            },
            {
                name: 'Support Attest',
                business_units: [
                    { name: 'Support Attest' }
                ]
            }
        ]
    }
]