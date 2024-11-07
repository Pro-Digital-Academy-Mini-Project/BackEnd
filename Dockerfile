# 1. Node.js 이미지를 기반으로 설정
FROM node:18

RUN apt-get update && apt-get install -y build-essential

# 2. 작업 디렉토리 생성
WORKDIR /usr/src/app

# 3. package.json 및 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 애플리케이션 소스 코드 복사
COPY . .

# 6. 애플리케이션이 사용할 포트 설정
EXPOSE 3000

# 7. 애플리케이션 시작 명령어
CMD ["npm", "run", "start"]