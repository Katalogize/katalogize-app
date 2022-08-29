FROM node:18-alpine
WORKDIR /katalogize-app
COPY package*.json /katalogize-app/
RUN npm install
COPY . /katalogize-app/
EXPOSE 3000
CMD ["npm", "start"]

# docker build -t katalogize/katalogize-app
# docker run -p 3000:3000 katalogize/katalogize-app