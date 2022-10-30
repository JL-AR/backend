db.estados.insertMany([{
    "codigo": "PENDIENTE",
    "nombre": "Pendiente.",
    "descripcion": "Solicitud enviada y pendiente de revision."
},{
    "codigo": "EN REVISION",
    "nombre": "En Revision",
    "descripcion": "Solicitud en revision."
},{
    "codigo": "PRE-APROBADO",
    "nombre": "Solicitud Pre Aprobada",
    "descripcion": "Solicitud pre aprobada y en espera de documentacion."
},{
    "codigo": "ENVIADO A REDES EXTERNAS",
    "nombre": "Enviada a redes externas",
    "descripcion": "Solicitud enviada a redes externas para consultar por conexion."
},{
    "codigo": "DEVUELTO A INSTALACIONES INTERNAS.",
    "nombre": "Devuelta a instalaciones internas",
    "descripcion": "Solicitud devuelta a instalaciones internas para continuar procedimiento."
},{
    "codigo": "APROBADO",
    "nombre": "Aprobado",
    "descripcion": "Solicitud aprobada."
},{
    "codigo": "PENDIENTE DE EJECUCION",
    "nombre": "Pendiente de ejecucion.",
    "descripcion": "Solicitud con trabajo pendiente de ejecucion."
},{
    "codigo": "FINALIZADO",
    "nombre": "Finalizado",
    "descripcion": "Solicitud con trabajo finalizado."
},{
    "codigo": "DESESTIMADO",
    "nombre": "Desestimado",
    "descripcion": "Solicitud desastimada o cancelada."
}])