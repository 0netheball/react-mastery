# Интернет-магазин компьютерной техники

SaaS-система для продажи компьютерных комплектующих и периферии.

## Стек технологий

**Backend:** Node.js, Express, Sequelize (SQLite)  
**Frontend:** React 19, TypeScript, Vite, React Router  
**Тестирование:** Vitest, React Testing Library

## Установка и запуск

### Требования
- Node.js 18+

### Backend

```bash
cd backend
npm install
npm run dev
```

Сервер запускается на `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Фронтенд запускается на `http://localhost:5173` (прокси на backend для `/api` и `/images`).

## Переменные окружения

| Переменная | Описание | Значение по умолчанию |
|---|---|---|
| `PORT` | Порт сервера | `3000` |
| `DB_TYPE` | Тип БД (`sqlite`, `mysql`, `postgres`) | `sqlite` |
| `RDS_HOSTNAME` | Хост RDS (для продакшена) | — |

## Структура репозитория

```
├── backend/            # Express-сервер
│   ├── defaultData/    # Начальные данные (продукты, корзина, заказы)
│   ├── images/         # Статические изображения (товары, иконки)
│   ├── models/         # Sequelize-модели
│   ├── routes/         # API-роутеры
│   ├── server.js       # Точка входа
│   └── documentation.md # Документация API
│
├── frontend/           # React-приложение
│   ├── src/
│   │   ├── components/ # Общие компоненты (Header, NotFoundPage)
│   │   ├── pages/      # Страницы (Home, Checkout, Orders, Tracking)
│   │   └── utils/      # Утилиты (форматирование валюты)
│   └── vite.config.ts  # Конфигурация Vite
│
└── README.md
```

## API

Полная документация API — `backend/documentation.md`.

Основные эндпоинты:
- `GET /api/products` — список товаров (с опциональным поиском)
- `GET /api/cart-items?expand=product` — корзина
- `POST /api/orders` — оформление заказа
- `GET /api/orders` — история заказов

## Развёртывание

```bash
cd frontend
npm run build         # сборка → backend/dist/
cd ../backend
npm start             # сервер на :3000 отдаёт и API, и фронтенд
```
