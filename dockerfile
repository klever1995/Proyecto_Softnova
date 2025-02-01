# Usar Python como base
FROM python:3.10

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo el archivo de requisitos primero (esto ayuda a evitar la reinstalación de dependencias innecesarias)
COPY requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos del backend al contenedor
COPY . .

# Exponer el puerto en el que corre Flask
EXPOSE 5000

# Comando para ejecutar el backend
CMD ["flask", "run", "--host=0.0.0.0"]

