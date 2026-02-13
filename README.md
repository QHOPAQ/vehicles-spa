# 🚗 Vehicles SPA

Single Page Application для управления списком автомобилей.

Приложение получает данные через REST API, позволяет выполнять CRUD-операции, сортировку и отображает автомобили на карте по координатам.

---

## 🔍 Demo функциональность

* 📋 Просмотр списка автомобилей
* 🔄 Сортировка по `year` и `price`
* ➕ Создание автомобиля
* ✏️ Редактирование (поля `name` и `price`)
* 🗑 Удаление автомобиля
* 🗺 Отображение автомобилей на карте
* 🌙 Light / Dark theme

---

## 🌐 API

```
GET https://task.tspb.su/test-task/vehicles
```

Пример ответа:

```json
[
  {
    "id": 1,
    "name": "Toyota",
    "model": "Camry",
    "year": 2021,
    "color": "red",
    "price": 21000,
    "latitude": 55.753332,
    "longitude": 37.621676
  }
]
```

> Если API не поддерживает изменение данных (POST/PUT/DELETE), приложение использует локальный fallback через `localStorage` с наложением изменений поверх серверных данных.

---

# 🏗 Архитектура

Проект построен с разделением слоёв:

* **UI слой** — React + MUI
* **State слой** — Zustand
* **API слой** — Axios
* **Бизнес-логика** — utils (сортировка, фильтрация)
* **Конфигурация** — Vite + Docker + Nginx

---

## 📂 Структура проекта

```
vehicles-spa/
│
├── src/
│   │
│   ├── api/                 # Работа с REST API
│   │   ├── client.ts        # Axios instance
│   │   └── vehiclesApi.ts   # CRUD операции
│   │
│   ├── components/          # UI компоненты
│   │   ├── layout/
│   │   ├── VehiclesTable.tsx
│   │   ├── VehiclesToolbar.tsx
│   │   ├── CreateVehicleDialog.tsx
│   │   ├── EditVehicleDialog.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── VehiclesMap.tsx
│   │
│   ├── store/
│   │   └── vehiclesStore.ts # Zustand store
│   │
│   ├── types/
│   │   └── vehicle.ts
│   │
│   ├── utils/
│   │   ├── sort.ts
│   │   ├── filter.ts
│   │   └── toasts.ts
│   │
│   ├── config.ts
│   ├── App.tsx
│   └── main.tsx
│
├── config/                  # Vite / Nginx конфиги
├── docker/                  # Dockerfile + compose└── README.md
```

---

# 🧠 Архитектурные решения

## State Management — Zustand

Выбран Zustand, так как:

* минимальный boilerplate
* простая интеграция
* удобен для средних SPA
* не перегружает архитектуру (в отличие от Redux)

Store отвечает за:

* загрузку данных
* хранение списка
* применение локальных изменений
* синхронизацию UI

---

## Локальный fallback (Patch-механизм)

Поскольку API предоставляет только GET, CRUD реализован следующим образом:

* Серверные данные загружаются через GET
* Локальные изменения сохраняются в `localStorage`
* При инициализации данные сервера объединяются с локальными патчами

Это позволяет:

* сохранить полноценный CRUD
* не зависеть от ограничений API
* демонстрировать полноценную бизнес-логику

---

## Карта

Используется **Leaflet**.

Функциональность:

* отображение маркеров
* автоматическое масштабирование под список автомобилей
* синхронизация со store

---

## UI

* React
* TypeScript
* MUI (Material UI)
* React Router

Принципы:

* Разделение контейнеров и презентационных компонентов
* Диалоги вынесены в отдельные компоненты
* Бизнес-логика вынесена в utils

---

# ⚙️ Запуск проекта

## 📦 Установка

```bash
npm install
```

Создайте локальный файл окружения (если нужно):

```bash
cp .env.example .env
```

## 🚀 Development

```bash
npm run dev
```

Открыть:

```
http://localhost:5173
```

---

## 🏗 Production build

```bash
npm run build
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

---

# 🌙 Theme

Поддерживается:

* Light mode
* Dark mode

Настройка сохраняется в `localStorage`.

---

# 🛠 Технологии

* React
* TypeScript
* Zustand
* Axios
* React Router
* MUI
* Leaflet
* Vite
* Docker
* Nginx

---

# 🎯 Что демонстрирует проект

* Архитектурное разделение слоёв
* Работа с REST API
* Управление состоянием
* CRUD-логика
* Обработка ошибок (ErrorBoundary)
* Работа с картой
* TypeScript в SPA

---
