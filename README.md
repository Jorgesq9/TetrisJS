# TetrisJS 🎮

TetrisJS es una versión web del clásico juego Tetris, desarrollado con HTML, CSS y JavaScript. Está optimizado para su despliegue en un servidor con Nginx y accesible desde un dominio personalizado.

## 🚀 Demo

Puedes jugar al Tetris en: [tetris.jorgeesquivafullstack.es](http://tetris.jorgeesquivafullstack.es)

## 📜 Características

- 🎨 Interfaz moderna y minimalista
- 🎮 Jugabilidad fluida con controles intuitivos
- 🌐 Desplegado en un servidor VPS con Nginx

## 🛠 Tecnologías utilizadas

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
- **Empaquetador:** Vite
- **Servidor web:** Nginx

## 📂 Estructura del proyecto

```
TetrisJS/
│── dist/               # Archivos generados para producción
│── src/                # Código fuente del juego
│── public/             # Recursos estáticos
│── index.html          # Archivo principal
│── package.json        # Dependencias y scripts
│── vite.config.js      # Configuración de Vite
└── README.md           # Documentación del proyecto
```

## 🚀 Instalación y configuración

### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/Jorgesq9/TetrisJS.git
cd TetrisJS
```

### 2️⃣ Instalar dependencias
```sh
npm install
```

### 3️⃣ Ejecutar en modo desarrollo
```sh
npm run dev
```

### 4️⃣ Construir para producción
```sh
npm run build
```

Esto generará la carpeta `dist/`, lista para ser servida con Nginx.

## 🌍 Despliegue Actual

El juego está alojado en un servidor casero utilizando cloudflared (Cloudflare Tunnel), lo que permite exponerlo al público sin abrir puertos ni usar una IP pública.

```nginx
server {
    listen 80;
    server_name tetris.jorgeesquivafullstack.es;
    
    root /ruta/al/proyecto/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

3. Reiniciar Nginx:
```sh
sudo systemctl restart nginx
```

## 📜 Licencia
Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor
**Jorge Esquiva**
- 🌐 [Portfolio](https://jorgeesquivafullstack.es)
- 🐙 [GitHub](https://github.com/Jorgesq9)

---

¡Gracias por jugar TetrisJS! 🎉

