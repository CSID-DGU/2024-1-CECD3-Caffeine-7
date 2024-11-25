# -2024-1-CECD3-Caffeine-7

## 사전 요구사항

- Node.js (v16.20.1 이상)
- MongoDB (v6.0 이상)
- npm (Node Package Manager)

## 1. MongoDB 설치 및 실행

1. MongoDB 설치
    - [MongoDB 공식 웹사이트](https://www.mongodb.com/try/download/community)에서 MongoDB Community Server 다운로드 및 설치
    - 설치 과정에서 "MongoDB Compass" (GUI 도구) 함께 설치 권장
2. MongoDB 서비스 실행
    
    ```bash
    # Windows의 경우 MongoDB 서비스가 자동으로 실행됨
    # macOS/Linux의 경우:
    mongod --dbpath /data/db
    
    ```
    

## 2. 프로젝트 설정

1. 프로젝트 디렉토리 생성 및 초기화
    
    ```bash
    mkdir sorting-system
    cd sorting-system
    npm init -y
    
    ```
    
2. 프로젝트 구조 생성
    
    ```bash
    mkdir -p src/{client,server,uploads}
    mkdir -p src/server/{models,routes}
    
    ```
    
3. 필요한 npm 패키지 설치
    
    ```bash
    # 서버 측 의존성
    npm install express mongoose cors multer
    
    # 클라이언트 측 의존성
    npm install react react-dom recharts @radix-ui/react-tabs lucide-react
    
    # 개발 의존성
    npm install --save-dev nodemon
    
    ```
## 애플리케이션 실행

1. MongoDB 실행 상태 확인
2. 애플리케이션 실행
    
    ```bash
    # 개발 모드
    npm run dev
    
    # 프로덕션 모드
    npm start
    
    ```
    
3. 브라우저에서 접속
    - [http://localhost:5000](http://localhost:5000/) 접속하여 메인 페이지 확인
    - http://localhost:5000/analysis 접속하여 분석 페이지 확인
