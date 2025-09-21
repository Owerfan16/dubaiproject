"use client";
import Image from "next/image";
import { useState } from "react";

interface FormData {
  propertyType: string[];
  district: string[];
  rooms: string[];
  timeline: string;
  budget: string;
  contactMethod: string[];
  phone: string;
  email: string;
}

export default function Home() {
  const [step, setStep] = useState(0); // 0 = главная страница, 1-6 = этапы формы, 7 = финальная страница
  const [formData, setFormData] = useState<FormData>({
    propertyType: [],
    district: [],
    rooms: [],
    timeline: "",
    budget: "", //
    contactMethod: [],
    phone: "", //
    email: "", //
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const startForm = () => setStep(1);

  const nextStep = () => {
    // Очищаем предыдущее сообщение
    setValidationMessage("");

    // Проверяем валидацию для текущего этапа и показываем сообщение
    if (!canProceed(step)) {
      let message = "";
      switch (step) {
        case 1:
          message = "Пожалуйста, выберите тип недвижимости";
          break;
        case 2:
          message = "Пожалуйста, выберите район";
          break;
        case 3:
          message = "Пожалуйста, выберите количество комнат";
          break;
        case 4:
          message = "Пожалуйста, выберите время покупки";
          break;
        case 5:
          message = "Пожалуйста, выберите бюджет";
          break;
        case 6:
          if (formData.contactMethod.length === 0) {
            message = "Пожалуйста, выберите способ связи";
          } else if (formData.phone.trim() === "") {
            message = "Пожалуйста, введите номер телефона";
          } else {
            message = "Пожалуйста, заполните все поля";
          }
          break;
        case 7:
          message = ""; // Финальная страница - ошибок нет
          break;
        default:
          message = "Пожалуйста, заполните все обязательные поля";
      }
      setValidationMessage(message);
      return; // Не переходим к следующему этапу
    }

    // Если валидация пройдена, переходим к следующему этапу
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setValidationMessage(""); // Очищаем сообщение при возврате
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Обработчик изменений в форме (для множественного выбора)
  const handleCheckboxChange = (stepName: keyof FormData, value: string) => {
    setValidationMessage(""); // Очищаем сообщение об ошибке
    setFormData((prev) => {
      const currentValues = prev[stepName] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item: string) => item !== value)
        : [...currentValues, value];

      return { ...prev, [stepName]: newValues };
    });
  };

  // Обработчик для одиночного выбора (radio buttons)
  const handleRadioChange = (stepName: keyof FormData, value: string) => {
    setValidationMessage(""); // Очищаем сообщение об ошибке
    setFormData((prev) => ({
      ...prev,
      [stepName]: value,
    }));
  };

  // Функция проверки, можно ли перейти к следующему этапу
  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1: // Тип недвижимости
        return formData.propertyType.length > 0;
      case 2: // Район
        return formData.district.length > 0;
      case 3: // Количество комнат
        return formData.rooms.length > 0;
      case 4: // Время покупки
        return formData.timeline !== "";
      case 5: // Бюджет
        return formData.budget !== "";
      case 6: // Способ связи и телефон
        return (
          formData.contactMethod.length > 0 && formData.phone.trim() !== ""
        );
      case 7: // Финальная страница (благодарность)
        return true; // Всегда можно перейти к финальной странице
      default:
        return false;
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Очищаем предыдущее сообщение
    setValidationMessage("");

    // Проверяем валидацию перед отправкой
    if (!canProceed(6)) {
      let message = "";
      if (formData.contactMethod.length === 0) {
        message = "Пожалуйста, выберите способ связи";
      } else if (formData.phone.trim() === "") {
        message = "Пожалуйста, введите номер телефона";
      } else {
        message = "Пожалуйста, заполните все поля";
      }
      setValidationMessage(message);
      return; // Не отправляем форму
    }

    setIsSubmitting(true);

    try {
      // Отправляем данные в API route
      const response = await fetch("/api/amo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Переход на шаг успешной отправки
        setStep(7);
      } else {
        console.error("Ошибка отправки формы");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white font-sans relative bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/back.avif')" }}
    >
      {/* Главная страница */}
      {step === 0 && (
        <section
          className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/main_bg.jpg')" }}
        >
          <div className="text-center space-y-4 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8">
              Элитные квартиры и виллы в Дубае
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-cassandra">
              от 200 000 $
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Индивидуальный подбор объектов с учетом бюджета и предпочтений
            </p>
            <button
              onClick={startForm}
              className="inline-flex items-center bg-lime-400 text-black font-semibold rounded-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 mt-4 sm:mt-6 hover:opacity-70 text-sm sm:text-base"
            >
              <p className="pr-2">Начать подбор</p>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(24 0) scale(-1 1)">
                  <path
                    d="M19 12H5M12 19L5 12L12 5"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          </div>
          {/* Footer */}
          <footer className="absolute bottom-0 w-full text-sm p-4 flex justify-between gap-6">
            <a
              href="/docs/politics.pdf"
              target="_blank"
              className="border-b border-white hover:border-transparent"
            >
              Политика конфиденциальности
            </a>
            <div>
              Адрес: WIZI PROPERTIES L.L.C Dubai Media City
              <br />
              Al Salam Tower, The 26th Floor, Office 2608
              <br />
              Телефон:{" "}
              <a href="tel:+971504648630" className="underline">
                +971 50 464-8630
              </a>
            </div>
          </footer>
        </section>
      )}

      {/* Steps Section */}
      {step > 0 && (
        <section
          id="steps"
          className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-8"
          style={{ backgroundImage: "url('/steps_bg.jpg')" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-3xl space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-6 md:px-8"
          >
            {/* Step 1 - Тип недвижимости */}
            {step === 1 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black">
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  Выберите нужный тип недвижимости
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    "Все варианты",
                    "Квартира",
                    "Апартаменты",
                    "Пентхаус",
                    "Вилла",
                    "Таунхаус",
                  ].map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.propertyType.includes(type)}
                        onChange={() =>
                          handleCheckboxChange("propertyType", type)
                        }
                        className="w-5 h-5 accent-lime-400"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="bg-gray-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 flex items-center text-sm sm:text-base"
                  >
                    <p className="pr-2">Далее</p>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(24 0) scale(-1 1)">
                        <path
                          d="M19 12H5M12 19L5 12L12 5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 - Район */}
            {step === 2 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black">
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  Какой район предпочитаете?
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    "Любой/другое",
                    "Dubai Marina",
                    "Dubai Hills",
                    "Palm Jumeirah",
                    "Bluewaters",
                    "Jumeirah Village Circle (JVC)",
                    "Jumeirah Beach Residence (JBR)",
                    "Business Bay",
                    "Downtown",
                    "Damac lagoons",
                    "Emirates hills",
                    "Damac hills",
                    "Saadiyat Lagoons",
                  ].map((district) => (
                    <label
                      key={district}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.district.includes(district)}
                        onChange={() =>
                          handleCheckboxChange("district", district)
                        }
                        className="w-5 h-5 accent-lime-400"
                      />
                      <span>{district}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 flex items-center text-sm sm:text-base"
                  >
                    <p className="pr-2">Далее</p>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(24 0) scale(-1 1)">
                        <path
                          d="M19 12H5M12 19L5 12L12 5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 - Количество комнат */}
            {step === 3 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black">
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  Сколько комнат вам необходимо?
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    "Студия",
                    "1 комната",
                    "2 комнаты",
                    "3 комнаты",
                    "4 комнаты и более",
                  ].map((room) => (
                    <label
                      key={room}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.rooms.includes(room)}
                        onChange={() => handleCheckboxChange("rooms", room)}
                        className="w-5 h-5 accent-lime-400"
                      />
                      <span>{room}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 flex items-center text-sm sm:text-base"
                  >
                    <p className="pr-2">Далее</p>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(24 0) scale(-1 1)">
                        <path
                          d="M19 12H5M12 19L5 12L12 5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 - Время покупки */}
            {step === 4 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black">
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  Когда планируете покупку?
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    "В ближайшее время",
                    "В течение месяца",
                    "До трех месяцев",
                    "В течение полугода",
                    "В течение года, не спешу",
                  ].map((time) => (
                    <label
                      key={time}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="timeline"
                        value={time}
                        checked={formData.timeline === time}
                        onChange={() => handleRadioChange("timeline", time)}
                        className="w-5 h-5 rounded-full border-2 border-lime-500 appearance-none checked:border-lime-500 checked:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{time}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 flex items-center text-sm sm:text-base"
                  >
                    <p className="pr-2">Далее</p>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(24 0) scale(-1 1)">
                        <path
                          d="M19 12H5M12 19L5 12L12 5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 - Бюджет */}
            {step === 5 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black">
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  В пределах какого бюджета рассматриваете покупку
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    "200 000 - 350 000 $",
                    "350 000 - 550 000 $",
                    "550 000 - 700 000 $",
                    "700 000 - 1 300 000 $",
                    "Более 1 300 000 $",
                  ].map((budget) => (
                    <label
                      key={budget}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={formData.budget === budget}
                        onChange={() => handleRadioChange("budget", budget)}
                        className="w-5 h-5 rounded-full border-2 border-lime-500 appearance-none checked:border-lime-500 checked:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{budget}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 flex items-center text-sm sm:text-base"
                  >
                    <p className="pr-2">Далее</p>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(24 0) scale(-1 1)">
                        <path
                          d="M19 12H5M12 19L5 12L12 5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 6 - Способ связи и телефон */}
            {step === 6 && (
              <div
                className={`bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black form-smooth-transition ${
                  formData.contactMethod.includes("Email")
                    ? "transform scale-105"
                    : "transform scale-100"
                }`}
              >
                <div className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                  Как вам удобнее получить подборку?
                </div>
                {validationMessage && (
                  <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                    {validationMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {["WhatsApp", "Telegram", "Email"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.contactMethod.includes(method)}
                        onChange={() =>
                          handleCheckboxChange("contactMethod", method)
                        }
                        className="w-5 h-5 accent-lime-400"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-center text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4">
                    Введите ваш номер телефона
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setValidationMessage(""); // Очищаем сообщение об ошибке
                      setFormData({ ...formData, phone: e.target.value });
                    }}
                    placeholder="+ 7 XXX XXX XX XX"
                    className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-black text-sm sm:text-base"
                    required
                  />
                  {validationMessage &&
                    validationMessage.includes("телефон") && (
                      <div className="text-center text-red-500 font-semibold bg-red-100 rounded-lg p-2 sm:p-3 mt-2 sm:mt-3 text-sm sm:text-base">
                        {validationMessage}
                      </div>
                    )}
                </div>

                {/* Поле для email - появляется при выборе Email */}
                <div
                  className={`mt-6 form-smooth-transition overflow-hidden ${
                    formData.contactMethod.includes("Email")
                      ? "max-h-96 opacity-100 transform translate-y-0"
                      : "max-h-0 opacity-0 transform -translate-y-4"
                  }`}
                >
                  <div className="form-smooth-transition mb-6">
                    <label className="block text-center text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4">
                      Введите ваш email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setValidationMessage(""); // Очищаем сообщение об ошибке
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      placeholder="example@email.com"
                      className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-black text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4 transition-all duration-500 ease-in-out">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-400 rounded-full w-[48px] h-[48px] flex items-center justify-center hover:opacity-70 transition-all duration-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-lime-400 text-black font-semibold rounded-full px-3 lg:px-8 py-3 hover:opacity-70 flex items-center disabled:opacity-50 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      "Отправка..."
                    ) : (
                      <>
                        <p className="pr-2">Отправить</p>
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g transform="translate(24 0) scale(-1 1)">
                            <path
                              d="M19 12H5M12 19L5 12L12 5"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 7 - Благодарность после отправки */}
            {step === 7 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col space-y-4 sm:space-y-6 text-black text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  Спасибо за вашу заявку!
                </h2>
                <p className="text-sm sm:text-base md:text-lg">
                  Мы свяжемся с вами в ближайшее время для подбора оптимальных
                  вариантов.
                </p>
                <div className="flex items-center gap-4 justify-center">
                  <p>Свяжитесь с нами сейчас:</p>
                  <div className="flex gap-3">
                    <a
                      href=""
                      className="bg-lime-400 w-10 h-10 text-black rounded-full hover:opacity-70 flex items-center justify-center"
                    >
                      <svg
                        width="18"
                        height="18"
                        className="w-20"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.7491 4.31514L6.53067 8.85807C6.14422 9.27424 6.24184 9.94112 6.73136 10.2291L12.2067 13.4499C12.7475 13.768 13.4388 13.4408 13.5356 12.8209L15.3125 1.44882C15.4194 0.764646 14.7376 0.226389 14.0969 0.489223L0.641034 6.00958C-0.14426 6.33175 -0.0743669 7.46618 0.744536 7.68952L2.75349 8.23742C2.98261 8.2999 3.22721 8.26811 3.43273 8.14912L10.5297 4.04032C10.7064 3.93803 10.888 4.16554 10.7491 4.31514Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                    <a
                      href=""
                      className="bg-lime-400 w-10 h-10 text-black rounded-full hover:opacity-70 flex items-center justify-center"
                    >
                      <svg
                        className="ml-[1px]"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.1681 14.3842C18.0951 14.2644 17.9025 14.1929 17.6147 14.0495C17.3257 13.9066 15.9051 13.2124 15.6408 13.1175C15.3763 13.0222 15.1823 12.9741 14.991 13.2606C14.7985 13.5471 14.2448 14.1929 14.0757 14.3842C13.9077 14.5757 13.7397 14.599 13.4508 14.4558C13.1612 14.3129 12.2305 14.0091 11.1277 13.0341C10.2695 12.2735 9.68995 11.3362 9.52067 11.0495C9.35288 10.7632 9.50397 10.6082 9.64707 10.4653C9.77746 10.3362 9.93621 10.1306 10.0807 9.9637C10.2254 9.79572 10.2733 9.67586 10.3696 9.48458C10.4659 9.29304 10.418 9.12638 10.345 8.98302C10.2733 8.8401 9.69544 7.4298 9.45422 6.85544C9.21501 6.28289 8.97405 6.30421 8.8047 6.30421C8.63672 6.30421 8.32496 6.35413 8.32496 6.35413C8.32496 6.35413 7.74599 6.42581 7.48172 6.71252C7.21738 6.9988 6.47138 7.69276 6.47138 9.10176C6.47138 10.5119 7.50547 11.8751 7.64969 12.0651C7.79436 12.2568 9.64707 15.2448 12.5834 16.3921C15.5197 17.5392 15.5197 17.1565 16.0494 17.1081C16.5779 17.0615 17.7578 16.4154 17.9986 15.7461C18.2398 15.0768 18.2398 14.5027 18.1681 14.3842ZM12.2188 1.86218C6.75522 1.86218 2.31276 6.2708 2.31276 11.6915C2.31276 13.8411 3.01308 15.8334 4.19932 17.4546L2.96229 21.1042L6.76843 19.8949C8.332 20.9208 10.2056 21.5199 12.2188 21.5199C17.6798 21.5199 22.1238 17.1107 22.1238 11.6915C22.1238 6.2708 17.6798 1.86218 12.2188 1.86218ZM24 11.6915C24 18.1472 18.7253 23.3819 12.2188 23.3819C10.1524 23.3819 8.21102 22.854 6.52348 21.9272L0 24L2.12627 17.7281C1.05329 15.9662 0.436299 13.8998 0.436299 11.6915C0.436299 5.23453 5.71096 0 12.2188 0C18.7253 0 24 5.23453 24 11.6915Z"
                          fill="#FEFEFE"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="bg-lime-400 text-black font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 hover:opacity-70 mx-auto text-sm sm:text-base"
                >
                  Вернуться на главную
                </button>
              </div>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
