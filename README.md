# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

## Llenar la base de datos con información de pruebas
Llamara:
```
http://localhost:3000/api/seed
```