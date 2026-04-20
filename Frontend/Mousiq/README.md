# Getting Started

## 1. Install dependencies

```
npm install
```

## 2. Run frontend

```
npm run dev
```

**Available at:**
- Frontend: http://localhost:5173


## To enable Stripe payment confirmation, log in to Stripe and run

```
stripe listen --events payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:8080/api/payments/webhook/stripe
```