# 🚀 Настройка интеграции с amoCRM

## ✅ Интеграция настроена и готова к работе!

### 📋 Что было сделано:

1. **Настроены все поля amoCRM** с правильными ID
2. **Создан API endpoint** `/api/amo` для отправки данных
3. **Добавлено логирование** для отладки
4. **Настроена обработка ошибок**

### 🔧 Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# amoCRM Configuration
AMOCRM_DOMAIN=gproleague
AMOCRM_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImEwYTEwYmQwMzk5ZWFiYmRmNDVjZmEzZmNlZjYzNmQ1MGI5MTNhOGE4YmYyMmI1MWI0NTU0NDNhODQ1MWQ1ZTg0N2U0ZDE4NDRkYThkOThiIn0.eyJhdWQiOiIwMTY2ZmVmMy03MDEzLTRmZjQtOTZiOC1kYmRiMzZkYWMwOWUiLCJqdGkiOiJhMGExMGJkMDM5OWVhYmJkZjQ1Y2ZhM2ZjZWY2MzZkNTBiOTEzYThhOGJmMjJiNTFiNDU1NDQzYTg0NTFkNWU4NDdlNGQxODQ0ZGE4ZDk4YiIsImlhdCI6MTc1ODQzMzc1NywibmJmIjoxNzU4NDMzNzU3LCJleHAiOjE4OTM0NTYwMDAsInN1YiI6IjEyOTg2NDM4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyNjY1MjU0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiZmE0ODc0MGEtYTNkOS00NTc3LTlkZWQtNmZjYTMyOGM5Mjk4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.Y48tD1Q1h8ExG-XCiexY_bsI0PQvHDafSmDNfysgfesISeDI-JJBbtkoL3rkBcpXS1XoTQb-CNRXN_pslloYYB7zdC6_3z8OVv2THq0GANut8O98mbh-phz8B1eBRtrcLTz6wiIBevbhkTQsH9Fnsg_2TZSlUW6ZT-BK-OVUQCW91yvbkaNSll_n439GtEXlkIa5yoyxkFXfO3c5U1kXfvadujw4oLre-hBw9qVufjU0oxOrsqF5WI159ClDKpHB44aCGekZ5do4aGVzPTuuVVc8byPhdV0tqEKaCx2PX8h50UyCJNr-KP36JlGcxfEFZuCVrMVfR2qIYEnz6ZQy3w
AMOCRM_PIPELINE_ID=10110086

# Field IDs
AMOCRM_FIELD_PROPERTY_TYPE=1273979
AMOCRM_FIELD_DISTRICT=1273981
AMOCRM_FIELD_ROOMS=1273983
AMOCRM_FIELD_TIMELINE=1273985
AMOCRM_FIELD_BUDGET=1274035
AMOCRM_FIELD_CONTACT_METHOD=1274037
AMOCRM_FIELD_PHONE=1274039
AMOCRM_FIELD_EMAIL=1274041
```

### 🎯 Маппинг полей:

| Поле формы        | ID поля amoCRM | Тип          |
| ----------------- | -------------- | ------------ |
| Тип недвижимости  | 1273979        | Мультисписок |
| Район             | 1273981        | Мультисписок |
| Количество комнат | 1273983        | Мультисписок |
| Время покупки     | 1273985        | Мультисписок |
| Бюджет            | 1274035        | Мультисписок |
| Способ связи      | 1274037        | Мультисписок |
| Телефон           | 1274039        | Текст        |
| Email             | 1274041        | Текст        |

### 🚀 Как протестировать:

1. **Запустите проект:** `npm run dev`
2. **Заполните форму** на сайте
3. **Проверьте консоль** браузера на ошибки
4. **Проверьте amoCRM** - должна появиться новая сделка
5. **Проверьте логи** в терминале

### 📊 Что сохраняется в amoCRM:

- ✅ **Все выбранные варианты** на каждом этапе
- ✅ **Телефон и email** пользователя
- ✅ **Детальное примечание** с полной информацией
- ✅ **Автоматическое создание сделки** в воронке

### 🔍 Отладка:

Если что-то не работает, проверьте:

1. **Консоль браузера** - ошибки JavaScript
2. **Терминал** - логи сервера
3. **amoCRM** - появилась ли сделка
4. **Токен** - не истек ли доступ

### 🎉 Готово!

Интеграция полностью настроена и готова к работе! 🚀



