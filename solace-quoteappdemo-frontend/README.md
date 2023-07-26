# Solace-QuoteAppDemo-Frontend

A refresh project for frontend of "DemoStockExchange"

## Frontend (Angular)
Remember to modify parameters in:
__src/environments/environment.ts__

Then:

```shell
docker-compose up --build
```

## How to use
- Requirements
  - Solace PubSub+ Broker
  - Rest-Backend

- After the container is brought up, open URL with your browser (this is also mobile-phone friendly):
```
http://YOUR_MACHINE_IP:7888/?userLevel=level1
```

User level can be:
- level1
- level2
- level3
- level4

- Click the blue button to connect to Solace.

- Click symbol name to subscribe the symbol.

- After MES (MatchEngineSimulator) is running, you should be able to receive published market data.

## For developers
```shell
# Initalize Angular
```