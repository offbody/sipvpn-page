import { FormEvent, useEffect, useMemo, useState } from 'react';
import { faq, features, nav, plans, regions } from './content';

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`logo ${inverse ? 'logo--inverse' : ''}`} href="#top" aria-label="SipVPN — на главную">
      <span className="logo-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span>SipVPN</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <Logo />
      <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Основная навигация">
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="button button--dark header-cta" href="#pricing">Попробовать бесплатно</a>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}

function RouteGraphic({ regionIndex }: { regionIndex: number }) {
  const region = regions[regionIndex];
  return (
    <div className="route-graphic" aria-label={`Маршрут ${region.place} — ${region.node} — SIP-провайдер`}>
      <div className="route-line" aria-hidden="true">
        <span className="route-dot route-dot--one" />
        <span className="route-dot route-dot--two" />
      </div>
      <div className="route-stop">
        <span className="route-pin" aria-hidden="true" />
        <strong>{region.place}</strong>
        <small>Ваш SIP-клиент</small>
      </div>
      <div className="route-stop route-stop--active">
        <span className="route-signal" aria-hidden="true"><i /><i /><i /></span>
        <strong>{region.node}</strong>
        <small>SipVPN relay</small>
      </div>
      <div className="route-stop">
        <span className="route-phone" aria-hidden="true" />
        <strong>Россия</strong>
        <small>SIP-провайдер</small>
      </div>
    </div>
  );
}

function RelayPanel() {
  const [regionIndex, setRegionIndex] = useState(0);
  const region = regions[regionIndex];

  return (
    <div className="relay-panel" data-ui>
      <div className="relay-head">
        <div>
          <span className="ui-label">Маршрут звонка</span>
          <h2>Подключение защищено</h2>
        </div>
        <span className="status"><i /> В сети</span>
      </div>
      <RouteGraphic regionIndex={regionIndex} />
      <div className="region-selector" role="group" aria-label="Выберите регион">
        {regions.map((item, index) => (
          <button
            key={item.id}
            className={index === regionIndex ? 'is-active' : ''}
            type="button"
            onClick={() => setRegionIndex(index)}
            aria-pressed={index === regionIndex}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="relay-metrics">
        <div><span>Ожидаемая задержка</span><strong>{region.latency}</strong></div>
        <div><span>Протокол</span><strong>SRTP / DTLS</strong></div>
        <div><span>Российский IP</span><strong>Активен</strong></div>
      </div>
    </div>
  );
}

function MiniFragment({ kind }: { kind: (typeof features)[number]['kind'] }) {
  if (kind === 'quality') {
    return (
      <div className="fragment quality-fragment" data-ui>
        <div className="quality-top"><span>Качество голоса</span><strong>Стабильно</strong></div>
        <div className="quality-bars" aria-hidden="true">{[62, 74, 66, 81, 78, 90, 84, 96, 88, 92, 94, 91].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        <div className="quality-values"><span>Потери <b>0,2%</b></span><span>Джиттер <b>18 мс</b></span></div>
      </div>
    );
  }

  if (kind === 'apps') {
    return (
      <div className="fragment apps-fragment" data-ui>
        {['Zoiper', 'MicroSIP', 'Grandstream', 'WebRTC'].map((name, index) => (
          <div key={name} className={index === 0 ? 'selected' : ''}><span className="app-badge">{name.slice(0, 1)}</span><b>{name}</b><small>{index === 0 ? 'Подключено' : 'Совместимо'}</small></div>
        ))}
      </div>
    );
  }

  if (kind === 'security') {
    return (
      <div className="fragment security-fragment" data-ui>
        <div className="shield" aria-hidden="true"><span /></div>
        <div><span>Шифрование потока</span><strong>SRTP / DTLS-SRTP</strong></div>
        <div><span>Контур</span><strong>Изолирован</strong></div>
      </div>
    );
  }

  if (kind === 'team') {
    return (
      <div className="fragment team-fragment" data-ui>
        <div className="team-row team-row--head"><span>Аккаунт</span><span>Роль</span><span>Статус</span></div>
        {[
          ['103 · Отдел продаж', 'Менеджер', 'В сети'],
          ['117 · Поддержка', 'Оператор', 'В сети'],
          ['204 · Бухгалтерия', 'Участник', 'Пауза'],
        ].map((row) => <div className="team-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
      </div>
    );
  }

  if (kind === 'webrtc') {
    return (
      <div className="fragment webrtc-fragment" data-ui>
        <div className="call-person"><span>АК</span><div><strong>Анна К.</strong><small>Входящий звонок</small></div></div>
        <div className="call-time">00:42</div>
        <div className="call-controls"><button aria-label="Отключить микрофон">Микрофон</button><button className="hang" aria-label="Завершить звонок">Завершить</button></div>
      </div>
    );
  }

  return (
    <div className="fragment compact-route" data-ui>
      <span>За рубежом</span><i /><strong>RU relay</strong><i /><span>SIP</span>
    </div>
  );
}

function Hero() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <h1>Звонки в Россию<br />из любой страны</h1>
          <p>SipVPN даёт российский IP-выход для SIP-телефонии и CRM, когда вы работаете за рубежом.</p>
          <div className="hero-actions">
            <a className="button button--dark" href="#pricing">Попробовать бесплатно</a>
            <a className="text-link" href="#how">Как это работает</a>
          </div>
          <span className="hero-note">14 дней бесплатно · карта не нужна · настройка за 5 минут</span>
        </div>
        <div className="hero-stage" aria-label="Интерактивный маршрут SipVPN">
          <RelayPanel />
        </div>
      </section>

      <section className="statement reveal" aria-label="Как работает маршрут">
        <p>Ваш привычный SIP-клиент подключается к российскому relay, а дальше звонок идёт к оператору по корректному маршруту.</p>
      </section>
    </main>
  );
}

function HowItWorks() {
  const rows = [
    {
      title: 'Добавьте SIP-аккаунт',
      text: 'Укажите данные вашего провайдера в кабинете SipVPN.',
      fragment: <div className="setup-card" data-ui><label>Адрес сервера<input value="sip.provider.ru" readOnly /></label><label>Логин<input value="74951234567" readOnly /></label><button type="button">Сохранить аккаунт</button></div>,
    },
    {
      title: 'Получите ключ relay',
      text: 'Сервис подготовит адрес узла и параметры подключения.',
      fragment: <div className="key-card" data-ui><span>Ключ подключения</span><strong>ru-mow-7F3A-82C1</strong><button type="button" onClick={() => navigator.clipboard?.writeText('ru-mow-7F3A-82C1')}>Копировать</button></div>,
    },
    {
      title: 'Звоните как обычно',
      text: 'Софтфон регистрируется через российский IP. Номер, приложение и рабочий сценарий не меняются.',
      fragment: <div className="ready-card" data-ui><div className="ready-signal"><i /><i /><i /></div><div><strong>Готово к звонкам</strong><span>Zoiper · Москва relay · 168 мс</span></div><span className="status"><i /> В сети</span></div>,
    },
  ];

  return (
    <section className="how section" id="how">
      <div className="section-shell">
        <div className="section-heading reveal"><h2>Подключение за пять минут</h2><p>Три действия — и SIP снова работает за границей.</p></div>
        <div className="how-list">
          {rows.map((row) => (
            <article className="how-row reveal" key={row.title}>
              <div><h3>{row.title}</h3><p>{row.text}</p></div>
              {row.fragment}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="features section" id="features">
      <div className="section-shell">
        <div className="section-heading reveal"><h2>Стабильная SIP-связь</h2></div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className={`feature-cell feature-cell--${index + 1} reveal`} key={feature.title}>
              <div className="feature-copy"><h3>{feature.title}</h3><p>{feature.text}</p></div>
              <MiniFragment kind={feature.kind} />
            </article>
          ))}
        </div>
      </div>
      <div className="compatibility reveal" aria-label="Совместимость">
        <span>Работает с</span>
        {['МТС', 'Билайн', 'TTK', 'Квантум', 'Яндекс', 'Zvonok', 'Asterisk'].map((name) => <strong key={name}>{name}</strong>)}
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="security section" id="security">
      <div className="security-inner section-shell">
        <div className="security-copy reveal">
          <h2>Голос защищён</h2>
          <p>Трафик защищён шифрованием и изолирован в выделенном контуре. Маршрут контролируется от клиента до российского relay.</p>
          <a className="button button--light" href="#faq">Вопросы о безопасности</a>
        </div>
        <div className="security-console reveal" data-ui>
          <div className="console-head"><span>Защита соединения</span><span className="status status--light"><i /> Активна</span></div>
          {[
            ['Голосовой поток', 'SRTP'],
            ['Сигнализация', 'TLS'],
            ['WebRTC', 'DTLS-SRTP'],
            ['Контур relay', 'Изолирован'],
          ].map(([label, value]) => <div className="console-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          <div className="console-route"><span>Клиент</span><i /><span>RU relay</span><i /><span>Оператор</span></div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [selected, setSelected] = useState(1);
  const plan = plans[selected];

  return (
    <section className="pricing section" id="pricing">
      <div className="section-shell pricing-layout">
        <div className="plan-list reveal" role="tablist" aria-label="Тарифы SipVPN">
          <h2 className="sr-only">Тарифы</h2>
          {plans.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={selected === index}
              className={selected === index ? 'is-active' : ''}
              onClick={() => setSelected(index)}
            >
              <i />{item.name}
            </button>
          ))}
        </div>
        <div className="plan-stage reveal" role="tabpanel">
          <div className="plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
          <p>{plan.summary}</p>
          <a className="button button--dark" href="#contact">{plan.button}</a>
          <span>Тариф можно изменить или отменить в любой момент.</span>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="faq section" id="faq">
      <div className="section-shell faq-layout">
        <h2 className="reveal">Частые вопросы</h2>
        <div className="faq-list">
          {faq.map((item, index) => (
            <details className="reveal" key={item.q} name="faq" open={index === 0}>
              <summary><span>{item.q}</span><i aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="closing section" id="contact">
      <div className="section-shell closing-inner reveal">
        <h2>Попробуйте SipVPN</h2>
        <p>14 дней бесплатно. Карта не нужна. Настройка занимает около пяти минут.</p>
        <form onSubmit={onSubmit} className="signup-form">
          <label htmlFor="signup-email">Рабочая почта</label>
          <div>
            <input id="signup-email" name="email" type="email" placeholder="name@company.com" required />
            <button type="submit">Запросить доступ</button>
          </div>
          <span aria-live="polite">{submitted ? 'Форма готова. Подключите её к вашей CRM перед запуском.' : 'Мы пришлём инструкцию по подключению.'}</span>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand"><Logo inverse /><p>Российский SIP relay для связи из любой страны.</p><span>© 2026 SipVPN</span></div>
        <div className="footer-nav"><strong>Продукт</strong>{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
        <div className="footer-note"><strong>Поддержка</strong><a href="#contact">Подключение</a><a href="#faq">Помощь</a><a href="#security">Безопасность</a></div>
        <a className="footer-action" href="#pricing"><span>Начать звонить</span><b aria-hidden="true">↗</b></a>
        <div className="footer-wordmark" aria-hidden="true">SipVPN</div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const sections = useMemo(() => [
    <Hero key="hero" />,
    <HowItWorks key="how" />,
    <Features key="features" />,
    <Security key="security" />,
    <Pricing key="pricing" />,
    <Faq key="faq" />,
    <Closing key="closing" />,
  ], []);

  return (
    <>
      <Header />
      {sections}
      <Footer />
    </>
  );
}
