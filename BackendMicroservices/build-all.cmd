cd common
call mvn package -DskipTests

cd ../infrastructure/api-gateway
call mvn package -DskipTests

cd ../config-server
call mvn package -DskipTests

cd ../eureka-server
call mvn package -DskipTests

cd ../../services/auth-user-service
call mvn package -DskipTests

cd ../cart-service
call mvn package -DskipTests

cd ../order-service
call mvn package -DskipTests

cd ../payment-service
call mvn package -DskipTests

cd ../product-service
call mvn package -DskipTests