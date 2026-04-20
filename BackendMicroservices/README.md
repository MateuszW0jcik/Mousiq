# Getting Started

## 1. Build application

```
./build-all.cmd
```

## 2. Run microservices

```
docker-compose up -d
```

**Available at:**
- API Gateway: http://localhost:8080
- Documentation: http://localhost:8080/swagger-ui.html
- Eureka: http://localhost:8761
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000


## Stopping

```
docker-compose down
```