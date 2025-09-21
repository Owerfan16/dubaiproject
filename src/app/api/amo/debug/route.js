import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Данные для подключения к amoCRM
    const DOMAIN = process.env.AMOCRM_DOMAIN || "gproleague";
    const ACCESS_TOKEN =
      process.env.AMOCRM_ACCESS_TOKEN ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImEwYTEwYmQwMzk5ZWFiYmRmNDVjZmEzZmNlZjYzNmQ1MGI5MTNhOGE4YmYyMmI1MWI0NTU0NDNhODQ1MWQ1ZTg0N2U0ZDE4NDRkYThkOThiIn0.eyJhdWQiOiIwMTY2ZmVmMy03MDEzLTRmZjQtOTZiOC1kYmRiMzZkYWMwOWUiLCJqdGkiOiJhMGExMGJkMDM5OWVhYmJkZjQ1Y2ZhM2ZjZWY2MzZkNTBiOTEzYThhOGJmMjJiNTFiNDU1NDQzYTg0NTFkNWU4NDdlNGQxODQ0ZGE4ZDk4YiIsImlhdCI6MTc1ODQzMzc1NywibmJmIjoxNzU4NDMzNzU3LCJleHAiOjE4OTM0NTYwMDAsInN1YiI6IjEyOTg2NDM4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyNjY1MjU0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiZmE0ODc0MGEtYTNkOS00NTc3LTlkZWQtNmZjYTMyOGM5Mjk4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.Y48tD1Q1h8ExG-XCiexY_bsI0PQvHDafSmDNfysgfesISeDI-JJBbtkoL3rkBcpXS1XoTQb-CNRXN_pslloYYB7zdC6_3z8OVv2THq0GANut8O98mbh-phz8B1eBRtrcLTz6wiIBevbhkTQsH9Fnsg_2TZSlUW6ZT-BK-OVUQCW91yvbkaNSll_n439GtEXlkIa5yoyxkFXfO3c5U1kXfvadujw4oLre-hBw9qVufjU0oxOrsqF5WI159ClDKpHB44aCGekZ5do4aGVzPTuuVVc8byPhdV0tqEKaCx2PX8h50UyCJNr-KP36JlGcxfEFZuCVrMVfR2qIYEnz6ZQy3w";

    console.log("🔍 Расширенная диагностика amoCRM...");
    console.log("Домен:", DOMAIN);
    console.log(
      "Токен (первые 50 символов):",
      ACCESS_TOKEN.substring(0, 50) + "..."
    );

    // Проверяем доступность API
    const testResponse = await fetch(
      `https://${DOMAIN}.amocrm.ru/api/v4/account`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      return NextResponse.json({
        success: false,
        error: `Ошибка подключения к amoCRM: ${testResponse.status}`,
        details: errorText,
      });
    }

    const accountData = await testResponse.json();
    console.log("✅ Подключение к amoCRM успешно");

    // Получаем информацию о воронках
    const pipelinesResponse = await fetch(
      `https://${DOMAIN}.amocrm.ru/api/v4/leads/pipelines`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    let pipelinesData = null;
    if (pipelinesResponse.ok) {
      pipelinesData = await pipelinesResponse.json();
      console.log("✅ Воронки получены");
    } else {
      console.log("❌ Ошибка получения воронок");
    }

    // Пробуем разные способы получения полей
    const fieldMethods = [
      {
        name: "Стандартный запрос",
        url: `https://${DOMAIN}.amocrm.ru/api/v4/leads/custom_fields`,
      },
      {
        name: "С параметром with=values",
        url: `https://${DOMAIN}.amocrm.ru/api/v4/leads/custom_fields?with=values`,
      },
      {
        name: "С параметром with=enums",
        url: `https://${DOMAIN}.amocrm.ru/api/v4/leads/custom_fields?with=enums`,
      },
      {
        name: "С параметром with=values,enums",
        url: `https://${DOMAIN}.amocrm.ru/api/v4/leads/custom_fields?with=values,enums`,
      },
      {
        name: "Все поля сделок",
        url: `https://${DOMAIN}.amocrm.ru/api/v4/leads/custom_fields?limit=250`,
      },
    ];

    const fieldResults = {};

    for (const method of fieldMethods) {
      try {
        console.log(`🔍 Пробуем: ${method.name}`);
        const response = await fetch(method.url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          fieldResults[method.name] = {
            success: true,
            count: data._embedded?.custom_fields?.length || 0,
            fields:
              data._embedded?.custom_fields?.map((f) => ({
                id: f.id,
                name: f.name,
                type: f.type,
                code: f.code,
                enums: f.enums || null,
              })) || [],
          };
          console.log(
            `✅ ${method.name}: найдено ${
              fieldResults[method.name].count
            } полей`
          );
        } else {
          const errorText = await response.text();
          fieldResults[method.name] = {
            success: false,
            error: `${response.status}: ${errorText}`,
          };
          console.log(`❌ ${method.name}: ${response.status}`);
        }
      } catch (error) {
        fieldResults[method.name] = {
          success: false,
          error: error.message,
        };
        console.log(`❌ ${method.name}: ${error.message}`);
      }
    }

    // Проверяем конкретные поля во всех методах
    const ourFieldIds = [
      1273979, 1273981, 1273983, 1273985, 1274035, 1274037, 1274039, 1274041,
    ];

    const fieldAnalysis = {};
    ourFieldIds.forEach((fieldId) => {
      fieldAnalysis[fieldId] = {
        found: false,
        foundIn: [],
        details: null,
      };
    });

    // Анализируем результаты всех методов
    Object.entries(fieldResults).forEach(([methodName, result]) => {
      if (result.success && result.fields) {
        result.fields.forEach((field) => {
          if (ourFieldIds.includes(field.id)) {
            fieldAnalysis[field.id].found = true;
            fieldAnalysis[field.id].foundIn.push(methodName);
            fieldAnalysis[field.id].details = field;
          }
        });
      }
    });

    // Получаем лучший результат (с наибольшим количеством полей)
    const bestMethod = Object.entries(fieldResults)
      .filter(([_, result]) => result.success)
      .sort(([_, a], [__, b]) => b.count - a.count)[0];

    return NextResponse.json({
      success: true,
      account: {
        id: accountData.id,
        name: accountData.name,
        domain: accountData.domain,
      },
      pipelines: pipelinesData
        ? pipelinesData._embedded.pipelines.map((p) => ({
            id: p.id,
            name: p.name,
            statuses: p._embedded.statuses.map((s) => ({
              id: s.id,
              name: s.name,
            })),
          }))
        : null,
      fieldMethods: fieldResults,
      bestMethod: bestMethod
        ? {
            name: bestMethod[0],
            data: bestMethod[1],
          }
        : null,
      fieldAnalysis: fieldAnalysis,
      ourFieldIds: ourFieldIds,
      summary: {
        totalMethods: fieldMethods.length,
        successfulMethods: Object.values(fieldResults).filter((r) => r.success)
          .length,
        foundFields: Object.values(fieldAnalysis).filter((f) => f.found).length,
        missingFields: ourFieldIds.filter((id) => !fieldAnalysis[id].found),
      },
    });
  } catch (error) {
    console.error("Ошибка диагностики:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
