import { useState } from 'react';
import { faq, features, nav, plans, regions } from './content';

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`logo ${inverse ? 'logo--inverse' : ''}`} href="#top" aria-label="SipVPN, на главную">
      <span className="logo-mark" aria-hidden="true" />
      <span>SipVPN</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <a className="skip-link" href="#top">К содержанию</a>
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
    <div className="route-graphic" aria-label={`Маршрут: ${region.place}, ${region.node}, SIP-провайдер`}>
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
          <span className="ui-label">Конфигуратор подключения</span>
          <h2>Маршрут звонка</h2>
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
      <div className="relay-order">
        <div className="relay-choice">
          <span>Вы выбрали</span>
          <strong>{region.label} → {region.node}</strong>
        </div>
        <div className="relay-actions">
          <a className="button button--dark" href="#pricing">Попробовать бесплатно</a>
          <a className="text-link" href="#how">Как это работает</a>
        </div>
        <span className="relay-note">14 дней бесплатно · карта не нужна · настройка за 5 минут</span>
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
    <>
      <section className="hero">
        <div className="hero-copy" data-enter>
          <h1>Звонки в Россию<br />из любой страны</h1>
          <p>SipVPN даёт российский IP-выход для SIP-телефонии и CRM, когда вы работаете за рубежом.</p>
        </div>
        <div className="hero-stage" aria-label="Интерактивный маршрут SipVPN">
          <RelayPanel />
        </div>
      </section>

      <section className="statement" aria-label="Как работает маршрут">
        <span>Один маршрут</span>
        <p>SIP-клиент подключается к российскому relay, а тот направляет звонок оператору.</p>
      </section>
    </>
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
        <div className="section-heading"><h2>Подключение за пять минут</h2><p>Три действия, и SIP снова работает за границей.</p></div>
        <div className="how-list">
          {rows.map((row, index) => (
            <article className="how-row" key={row.title}>
              <div className="how-copy"><span className="step-number">0{index + 1}</span><h3>{row.title}</h3><p>{row.text}</p></div>
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
        <div className="section-heading"><h2>Стабильная SIP-связь</h2><p>Не универсальный VPN, а маршрут, собранный вокруг голосового трафика.</p></div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className={`feature-cell feature-cell--${index + 1}`} key={feature.title}>
              <div className="feature-copy"><h3>{feature.title}</h3><p>{feature.text}</p></div>
              <MiniFragment kind={feature.kind} />
            </article>
          ))}
        </div>
      </div>
      <div className="compatibility" aria-label="Совместимость">
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
        <div className="security-copy">
          <h2>Голос защищён</h2>
          <p>Трафик защищён шифрованием и изолирован в выделенном контуре. Маршрут контролируется от клиента до российского relay.</p>
          <a className="button button--light" href="#faq">Вопросы о безопасности</a>
        </div>
        <div className="security-console" data-ui>
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
        <div className="section-heading pricing-heading">
          <h2>Тарифы SipVPN</h2>
          <p>Выберите объём работы сейчас. Тариф можно изменить или отменить позже.</p>
        </div>
        <div className="plan-deck" role="tablist" aria-label="Тарифы SipVPN">
          {plans.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls="selected-plan"
              className={`plan-option plan-option--${index + 1} ${selected === index ? 'is-active' : ''}`}
              onClick={() => setSelected(index)}
            >
              <span className="plan-option-top"><span>0{index + 1}</span><i /></span>
              <strong>{item.name}</strong>
              <span className="plan-option-price">{item.price}<small>{item.period}</small></span>
              <span className="plan-option-copy">{item.summary}</span>
            </button>
          ))}
        </div>
        <div className="plan-stage" id="selected-plan" role="tabpanel" aria-live="polite">
          <div className="plan-stage-name"><span>Вы выбрали</span><strong>{plan.name}</strong></div>
          <div className="plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
          <p>{plan.summary}</p>
          <a className="button" href="#contact">{plan.button}</a>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="faq section" id="faq">
      <div className="section-shell faq-layout">
        <h2>Частые вопросы</h2>
        <div className="faq-list">
          {faq.map((item, index) => (
            <details key={item.q} name="faq" open={index === 0}>
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
  return (
    <section className="closing section" id="contact">
      <div className="section-shell closing-inner">
        <div className="closing-copy">
          <h2>Попробуйте SipVPN</h2>
          <p>14 дней бесплатно. Карта не нужна. Настройка занимает около пяти минут.</p>
          <div className="closing-actions">
            <a className="button button--dark" href="#pricing">Попробовать бесплатно</a>
            <a className="text-link" href="#how">Как это работает</a>
          </div>
        </div>
        <div className="closing-route" data-ui role="img" aria-label="Маршрут SipVPN от SIP-клиента через российский relay к оператору">
          <div className="closing-route-head"><span>Подключение SipVPN</span><span className="status"><i /> Готово</span></div>
          <div className="closing-route-path" aria-hidden="true">
            <span><i />SIP-клиент</span><b /><span className="is-active"><i />RU relay</span><b /><span><i />Оператор</span>
          </div>
          <div className="closing-route-foot"><span>SRTP / DTLS</span><strong>Настройка за 5 минут</strong></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand"><Logo inverse /><p>Российский SIP relay для связи из любой страны.</p></div>
          <a className="footer-action" href="#pricing"><span>Попробовать бесплатно</span><b aria-hidden="true">↗</b></a>
        </div>
        <div className="footer-directory">
          <span>© 2026 SipVPN</span>
          <div className="footer-nav">{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <a href="#top">Наверх ↑</a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">SipVPN</div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <HowItWorks />
        <Features />
        <Security />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
